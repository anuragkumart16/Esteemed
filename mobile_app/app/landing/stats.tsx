import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { LineChart, ContributionGraph } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { getUrgeLogs, getRelapseLogs, getStreakStartDate, UrgeLog, RelapseLog } from '../utils/storage';

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
    backgroundGradientFrom: "#000",
    backgroundGradientTo: "#000",
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
};

export default function Stats() {
    const router = useRouter();
    const [currentStreak, setCurrentStreak] = useState(0);
    const [urgesWon, setUrgesWon] = useState(0);
    const [streakBroken, setStreakBroken] = useState(0);

    // Graph Data State
    const [progressData, setProgressData] = useState<any>(null);
    const [streakData, setStreakData] = useState<any[]>([]);
    const [relapseData, setRelapseData] = useState<any>(null);
    const [urgesHeatmapData, setUrgesHeatmapData] = useState<any[]>([]);
    const [groupedReasons, setGroupedReasons] = useState<any[]>([]);
    const [activeSlide, setActiveSlide] = useState(0);

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const loadData = async () => {
        try {
            const urgeLogs = await getUrgeLogs();
            const relapseLogs = await getRelapseLogs();
            const streakStart = await getStreakStartDate();

            // 1. Summary Stats
            setUrgesWon(urgeLogs.length);
            setStreakBroken(relapseLogs.length);

            if (streakStart) {
                const now = Date.now();
                const diff = now - streakStart;
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                setCurrentStreak(days);
            } else {
                setCurrentStreak(0);
            }

            // 2. Progress Graph (Last 7 Days)
            processProgressData(urgeLogs);

            // 3. Streak Heatmap (Last 90 Days)
            processStreakData(urgeLogs);

            // 4. Relapse Graph (Last 7 Days)
            processRelapseData(relapseLogs);

            // 5. Urges Heatmap (Time vs Day)
            processUrgesHeatmap(urgeLogs);

            // 6. Top Triggers
            processTopTriggers(urgeLogs);

        } catch (error) {
            console.error("Error loading stats data:", error);
        }
    };

    const processProgressData = (logs: UrgeLog[]) => {
        const last7Days = [];
        const dataPoints = [];
        const now = new Date();

        for (let i = 6; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

            last7Days.push(dayName);

            const count = logs.filter(log => log.date.startsWith(dateStr)).length;
            dataPoints.push(count);
        }

        setProgressData({
            labels: last7Days,
            datasets: [
                {
                    data: dataPoints,
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    strokeWidth: 2
                }
            ],
            legend: ["Urges Resisted"]
        });
    };

    const processStreakData = (logs: UrgeLog[]) => {
        // Group logs by date
        const counts: { [key: string]: number } = {};
        logs.forEach(log => {
            const dateStr = log.date.split('T')[0];
            counts[dateStr] = (counts[dateStr] || 0) + 1;
        });

        const data = Object.keys(counts).map(date => ({
            date,
            count: counts[date]
        }));

        setStreakData(data);
    };

    const processRelapseData = (logs: RelapseLog[]) => {
        const last7Days = [];
        const dataPoints = [];
        const now = new Date();

        for (let i = 6; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

            last7Days.push(dayName);

            const count = logs.filter(log => log.date.startsWith(dateStr)).length;
            dataPoints.push(count);
        }

        setRelapseData({
            labels: last7Days,
            datasets: [
                {
                    data: dataPoints,
                    color: (opacity = 1) => `rgba(255, 99, 71, ${opacity})`, // Reddish color for relapses
                    strokeWidth: 2
                }
            ],
            legend: ["Streak Restarts"]
        });
    };

    const processUrgesHeatmap = (logs: UrgeLog[]) => {
        const heatmap: { [key: string]: number } = {};

        logs.forEach(log => {
            const date = new Date(log.date);
            const day = date.getDay() === 0 ? 6 : date.getDay() - 1; // Mon=0, Sun=6
            const hour = date.getHours();

            let timeIndex = 0; // Morning (6-12)
            if (hour >= 12 && hour < 17) timeIndex = 1; // Afternoon (12-17)
            else if (hour >= 17 && hour < 22) timeIndex = 2; // Evening (17-22)
            else if (hour >= 22 || hour < 6) timeIndex = 3; // Night (22-6)

            const key = `${day}-${timeIndex}`;
            heatmap[key] = (heatmap[key] || 0) + 1;
        });

        const maxCount = Math.max(...Object.values(heatmap), 1);

        const data = Object.keys(heatmap).map(key => {
            const [day, time] = key.split('-').map(Number);
            return {
                day,
                time,
                intensity: heatmap[key] / maxCount
            };
        });

        setUrgesHeatmapData(data);
    };

    const processTopTriggers = (logs: UrgeLog[]) => {
        const triggerCounts: { [key: string]: number } = {};
        logs.forEach(log => {
            // Simple grouping by exact trigger text for now
            // In a real app, you might want NLP or predefined categories
            const trigger = log.trigger.trim();
            if (trigger) {
                triggerCounts[trigger] = (triggerCounts[trigger] || 0) + 1;
            }
        });

        const sortedTriggers = Object.entries(triggerCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 4)
            .map(([category, count]) => ({
                category,
                count,
                examples: [] // No examples for raw triggers
            }));

        setGroupedReasons(sortedTriggers);
    };

    const renderUrgesHeatmap = () => {
        const days = ["M", "T", "W", "T", "F", "S", "S"];
        const times = ["Morn", "Aft", "Eve", "Night"];

        return (
            <View style={styles.heatmapContainer}>
                <View style={styles.heatmapHeaderRow}>
                    <View style={styles.heatmapLabelCell} />
                    {days.map((day, index) => (
                        <View key={index} style={styles.heatmapHeaderCell}>
                            <Text style={styles.heatmapHeaderText}>{day}</Text>
                        </View>
                    ))}
                </View>
                {times.map((time, timeIndex) => (
                    <View key={timeIndex} style={styles.heatmapRow}>
                        <View style={styles.heatmapLabelCell}>
                            <Text style={styles.heatmapLabelText}>{time}</Text>
                        </View>
                        {days.map((_, dayIndex) => {
                            const dataPoint = urgesHeatmapData.find(d => d.day === dayIndex && d.time === timeIndex);
                            const intensity = dataPoint ? dataPoint.intensity : 0;
                            const opacity = intensity > 0 ? 0.2 + (intensity * 0.8) : 0.1;

                            return (
                                <View
                                    key={dayIndex}
                                    style={[
                                        styles.heatmapCell,
                                        { backgroundColor: `rgba(255, 255, 255, ${opacity})` }
                                    ]}
                                />
                            );
                        })}
                    </View>
                ))}
            </View>
        );
    };

    const onScroll = (event: any) => {
        const slideSize = event.nativeEvent.layoutMeasurement.width;
        const index = event.nativeEvent.contentOffset.x / slideSize;
        const roundIndex = Math.round(index);
        setActiveSlide(roundIndex);
    };

    const renderPagination = () => {
        return (
            <View style={styles.paginationContainer}>
                {[0, 1, 2, 3].map((_, i) => (
                    <View
                        key={i}
                        style={[
                            styles.paginationDot,
                            { opacity: i === activeSlide ? 1 : 0.3 }
                        ]}
                    />
                ))}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <Text style={styles.headerTitle}>Your Progress</Text>

                <View style={styles.summaryContainer}>
                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryValue}>{currentStreak}</Text>
                        <Text style={styles.summaryLabel}>Current Streak</Text>
                    </View>
                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryValue}>{urgesWon}</Text>
                        <Text style={styles.summaryLabel}>Urges Won</Text>
                    </View>
                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryValue}>{streakBroken}</Text>
                        <Text style={styles.summaryLabel}>Streak Broken</Text>
                    </View>
                </View>

                <View style={styles.carouselContainer}>
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={onScroll}
                        scrollEventThrottle={16}
                    >
                         {/* Slide 2: Streak Restarts */}
                        <View style={styles.slide}>
                            <Text style={styles.sectionTitle}>Streak Restarts</Text>
                            {relapseData ? (
                                <LineChart
                                    data={relapseData}
                                    width={screenWidth - 40}
                                    height={220}
                                    chartConfig={{
                                        ...chartConfig,
                                        color: (opacity = 1) => `rgba(255, 99, 71, ${opacity})`,
                                    }}
                                    bezier
                                    style={styles.chart}
                                />
                            ) : (
                                <Text style={styles.noDataText}>No data yet</Text>
                            )}
                        </View>

                        {/* Slide 1: Weekly Progress */}
                        <View style={styles.slide}>
                            <Text style={styles.sectionTitle}>Weekly Progress</Text>
                            {progressData ? (
                                <LineChart
                                    data={progressData}
                                    width={screenWidth - 40}
                                    height={220}
                                    chartConfig={{
                                        ...chartConfig,
                                        color: (opacity = 1) => `rgba(71, 200, 71, ${opacity})`,
                                    }}
                                    bezier
                                    style={styles.chart}
                                />
                            ) : (
                                <Text style={styles.noDataText}>No data yet</Text>
                            )}
                        </View>

                       

                        {/* Slide 3: Streak Heatmap */}
                        <View style={styles.slide}>
                            <Text style={styles.sectionTitle}>Streak Heatmap</Text>
                            <ContributionGraph
                                values={streakData}
                                endDate={new Date()}
                                numDays={90}
                                width={screenWidth - 40}
                                height={220}
                                chartConfig={chartConfig}
                                style={styles.chart}
                                tooltipDataAttrs={() => ({})}
                            />
                        </View>

                        {/* Slide 4: Urges Heatmap */}
                        <View style={styles.slide}>
                            <Text style={styles.sectionTitle}>Urges Heatmap</Text>
                            <Text style={styles.subTitle}>Time of Day vs. Day of Week</Text>
                            {renderUrgesHeatmap()}
                        </View>
                    </ScrollView>
                    {renderPagination()}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Top Triggers</Text>
                    {groupedReasons.length > 0 ? groupedReasons.map((reason, index) => (
                        <View key={index} style={styles.reasonCard}>
                            <View style={styles.reasonHeader}>
                                <Text style={styles.reasonCategory}>{reason.category}</Text>
                                <Text style={styles.reasonCount}>{reason.count}</Text>
                            </View>
                            {/* <Text style={styles.reasonExamples}>{reason.examples.join(", ")}</Text> */}
                            <View style={styles.progressBarBackground}>
                                <View style={[styles.progressBarFill, { width: `${(reason.count / Math.max(...groupedReasons.map(r => r.count))) * 100}%` }]} />
                            </View>
                        </View>
                    )) : (
                        <Text style={styles.noDataText}>No triggers logged yet</Text>
                    )}
                </View>

                <TouchableOpacity
                    style={styles.analyseButton}
                    onPress={() => router.push('/landing/buddy')}
                >
                    <Text style={styles.analyseButtonText}>Analyse with buddy</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.analyseButton, styles.historyButton]}
                    onPress={() => router.push('/history')}
                >
                    <Text style={styles.historyButtonText}>View History</Text>
                </TouchableOpacity>

                <View style={styles.spacer} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#000',
    },
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    contentContainer: {
        padding: 20,
        paddingBottom: 100,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 30,
    },
    summaryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    summaryCard: {
        flex: 1,
        backgroundColor: '#111',
        borderRadius: 16,
        padding: 15,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    summaryValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    summaryLabel: {
        fontSize: 12,
        color: '#999',
        textAlign: 'center',
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 15,
    },
    subTitle: {
        fontSize: 14,
        color: '#999',
        marginBottom: 10,
    },
    chart: {
        borderRadius: 16,
        marginVertical: 8,
    },
    heatmapContainer: {
        backgroundColor: '#111',
        borderRadius: 16,
        padding: 15,
    },
    heatmapHeaderRow: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    heatmapRow: {
        flexDirection: 'row',
        marginBottom: 5,
        alignItems: 'center',
    },
    heatmapLabelCell: {
        width: 40,
        marginRight: 5,
        justifyContent: 'center',
    },
    heatmapHeaderCell: {
        flex: 1,
        alignItems: 'center',
    },
    heatmapCell: {
        flex: 1,
        aspectRatio: 1,
        margin: 2,
        borderRadius: 4,
    },
    heatmapHeaderText: {
        color: '#999',
        fontSize: 12,
        fontWeight: 'bold',
    },
    heatmapLabelText: {
        color: '#999',
        fontSize: 12,
    },
    reasonCard: {
        backgroundColor: '#111',
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
    },
    reasonHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    reasonCategory: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    reasonCount: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    reasonExamples: {
        color: '#999',
        fontSize: 12,
        marginBottom: 10,
    },
    progressBarBackground: {
        height: 6,
        backgroundColor: '#333',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#fff',
        borderRadius: 3,
    },
    analyseButton: {
        backgroundColor: '#fff',
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    historyButton: {
        marginTop: 0,
        backgroundColor: '#222',
    },
    analyseButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    historyButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    spacer: {
        height: 50,
    },
    noDataText: {
        color: '#666',
        fontSize: 16,
        textAlign: 'center',
        marginVertical: 20,
    },
    carouselContainer: {
        marginBottom: 30,
    },
    slide: {
        width: screenWidth - 40,
        marginRight: 0, // No margin right as we are paging
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#fff',
        marginHorizontal: 4,
    },
});
