import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import { useState, useEffect } from 'react';
import {
    getStreakStartDate,
    setStreakStartDate,
    clearStreak,
    getUrgeLogs,
    saveUrgeLog,
    saveRelapseLog
} from '../utils/storage';

export default function Landing() {
    const [startDate, setStartDate] = useState<number | null>(null);
    const [elapsedTime, setElapsedTime] = useState({ days: 0, hours: 0, minutes: 0 });
    const [markedDates, setMarkedDates] = useState<any>({});

    // Urge Modal State
    const [showUrgeModal, setShowUrgeModal] = useState(false);
    const [urgeTrigger, setUrgeTrigger] = useState('');
    const [urgeVictory, setUrgeVictory] = useState('');
    const [urgesWon, setUrgesWon] = useState(0);

    // Reset Modal State
    const [showResetModal, setShowResetModal] = useState(false);

    useEffect(() => {
        checkStreak();
        loadUrges();
        const interval = setInterval(updateTimer, 60000); // Update every minute
        return () => clearInterval(interval);
    }, [startDate]);

    const checkStreak = async () => {
        try {
            const start = await getStreakStartDate();
            if (start) {
                setStartDate(start);
                updateTimer(start);
                updateCalendar(start);
            }
        } catch (error) {
            console.error('Error loading streak:', error);
        }
    };

    const loadUrges = async () => {
        try {
            const logs = await getUrgeLogs();
            setUrgesWon(logs.length);
        } catch (error) {
            console.error('Error loading urges:', error);
        }
    };

    const startStreak = async () => {
        const now = Date.now();
        try {
            await setStreakStartDate(now);
            setStartDate(now);
            updateTimer(now);
            updateCalendar(now);
        } catch (error) {
            console.error('Error starting streak:', error);
        }
    };

    const resetStreak = async () => {
        try {
            await saveRelapseLog(); // Log the relapse before clearing
            await clearStreak();
            setStartDate(null);
            setElapsedTime({ days: 0, hours: 0, minutes: 0 });
            setMarkedDates({});
        } catch (error) {
            console.error('Error resetting streak:', error);
        }
    };

    const logUrge = async () => {
        if (!urgeTrigger.trim() || !urgeVictory.trim()) return;

        const newUrge = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            trigger: urgeTrigger,
            victory: urgeVictory,
        };

        try {
            await saveUrgeLog(newUrge);
            const logs = await getUrgeLogs();
            setUrgesWon(logs.length);

            // Reset and close
            setUrgeTrigger('');
            setUrgeVictory('');
            setShowUrgeModal(false);
        } catch (error) {
            console.error('Error logging urge:', error);
        }
    };

    const updateTimer = (start = startDate) => {
        if (!start) return;

        const now = Date.now();
        const diff = now - start;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        setElapsedTime({ days, hours, minutes });
    };

    const updateCalendar = (start: number) => {
        const dates: any = {};
        const startDateObj = new Date(start);
        const now = new Date();

        // Loop from start date to today
        for (let d = new Date(startDateObj); d <= now; d.setDate(d.getDate() + 1)) {
            const dateString = d.toISOString().split('T')[0];
            dates[dateString] = { selected: true, selectedColor: '#fff' };
        }
        setMarkedDates(dates);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerText}>you are goated!</Text>
                </View>

                {/* Streak Status & Urges Won */}
                <View style={styles.streakStatus}>
                    <Text style={styles.streakStatusText}>
                        {startDate ? 'Keep going!' : 'No active streak'}
                    </Text>
                    {urgesWon > 0 && (
                        <Text style={styles.streakStatusText}>
                            Urges Won: {urgesWon}
                        </Text>
                    )}
                </View>

                {/* Timer or Start Button */}
                {startDate ? (
                    <View style={styles.timerContainer}>
                        <View style={styles.timerItem}>
                            <Text style={styles.timerValue}>
                                {elapsedTime.days.toString().padStart(2, '0')}
                            </Text>
                            <Text style={styles.timerLabel}>Days</Text>
                        </View>
                        <View style={styles.timerItem}>
                            <Text style={styles.timerValue}>
                                {elapsedTime.hours.toString().padStart(2, '0')}
                            </Text>
                            <Text style={styles.timerLabel}>Hours</Text>
                        </View>
                        <View style={styles.timerItem}>
                            <Text style={styles.timerValue}>
                                {elapsedTime.minutes.toString().padStart(2, '0')}
                            </Text>
                            <Text style={styles.timerLabel}>Minutes</Text>
                        </View>
                    </View>
                ) : (
                    <TouchableOpacity style={styles.startContainer} onPress={startStreak}>
                        <Text style={styles.startText}>Start Streak</Text>
                    </TouchableOpacity>
                )}

                {/* Calendar */}
                <View style={styles.calendarContainer}>
                    <Calendar
                        theme={{
                            backgroundColor: '#111',
                            calendarBackground: '#111',
                            textSectionTitleColor: '#fff',
                            selectedDayBackgroundColor: '#fff',
                            selectedDayTextColor: '#000',
                            todayTextColor: '#fff',
                            dayTextColor: '#fff',
                            textDisabledColor: '#333',
                            dotColor: '#fff',
                            selectedDotColor: '#000',
                            arrowColor: '#fff',
                            monthTextColor: '#fff',
                            indicatorColor: '#fff',
                            textDayFontWeight: '500',
                            textMonthFontWeight: 'bold',
                            textDayHeaderFontWeight: '500',
                            textDayFontSize: 14,
                            textMonthFontSize: 20,
                            textDayHeaderFontSize: 14,
                        }}
                        markedDates={markedDates}
                    />
                </View>

                {/* Action Buttons */}
                <View style={styles.actionsContainer}>
                    <TouchableOpacity style={styles.actionButton} onPress={() => setShowResetModal(true)}>
                        <Text style={styles.actionButtonText}>I gave in!</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => setShowUrgeModal(true)}
                    >
                        <Text style={styles.actionButtonText}>I had an urge!</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Urge Modal */}
            <Modal
                visible={showUrgeModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowUrgeModal(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalOverlay}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Urge Conquered?</Text>

                        <Text style={styles.inputLabel}>What triggered it?</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g., Boredom, Stress..."
                            placeholderTextColor="#666"
                            value={urgeTrigger}
                            onChangeText={setUrgeTrigger}
                            multiline
                        />

                        <Text style={styles.inputLabel}>How did you win?</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g., Went for a walk, Meditated..."
                            placeholderTextColor="#666"
                            value={urgeVictory}
                            onChangeText={setUrgeVictory}
                            multiline
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setShowUrgeModal(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={logUrge}
                            >
                                <Text style={styles.saveButtonText}>Log Victory</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* Reset Confirmation Modal */}
            <Modal
                visible={showResetModal}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setShowResetModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>End Streak?</Text>
                        <Text style={styles.modalMessage}>Are you sure you want to end your current streak?</Text>

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setShowResetModal(false)}
                            >
                                <Text style={styles.cancelButtonText}>No</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={() => {
                                    resetStreak();
                                    setShowResetModal(false);
                                }}
                            >
                                <Text style={styles.saveButtonText}>Yes</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100, // Space for tab bar
    },
    header: {
        backgroundColor: '#fff',
        borderRadius: 30,
        paddingVertical: 15,
        alignItems: 'center',
        marginBottom: 10,
    },
    headerText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#000',
    },
    streakStatus: {
        backgroundColor: '#111',
        padding: 10,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    streakStatusText: {
        color: '#fff',
        fontSize: 14,
    },
    timerContainer: {
        backgroundColor: '#fff',
        borderRadius: 30,
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 20,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    startContainer: {
        backgroundColor: '#fff',
        borderRadius: 30,
        paddingVertical: 30,
        alignItems: 'center',
        marginBottom: 20,
    },
    startText: {
        fontSize: 24,
        // fontWeight: 'bold',
        color: '#000',
    },
    timerItem: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    timerValue: {
        fontSize: 48,
        fontWeight: '300', // Thin font like in design
        color: '#000',
    },
    timerLabel: {
        fontSize: 12,
        color: '#000',
        marginLeft: 5,
    },
    calendarContainer: {
        backgroundColor: '#111',
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#333',
    },
    actionsContainer: {
        backgroundColor: '#fff',
        borderRadius: 30,
        padding: 20,
        gap: 15,
    },
    actionButton: {
        backgroundColor: '#0f172a', // Dark blue/black
        borderRadius: 20,
        paddingVertical: 15,
        alignItems: 'center',
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#111',
        borderRadius: 30,
        padding: 20,
        borderWidth: 1,
        borderColor: '#333',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalMessage: {
        fontSize: 16,
        color: '#ccc',
        marginBottom: 20,
        textAlign: 'center',
    },
    inputLabel: {
        color: '#ccc',
        fontSize: 14,
        marginBottom: 8,
        marginLeft: 5,
    },
    input: {
        backgroundColor: '#222',
        borderRadius: 15,
        padding: 15,
        color: '#fff',
        fontSize: 16,
        marginBottom: 20,
        minHeight: 80,
        textAlignVertical: 'top',
    },
    modalActions: {
        flexDirection: 'row',
        gap: 15,
        marginTop: 10,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 15,
        borderRadius: 20,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#333',
    },
    saveButton: {
        backgroundColor: '#fff',
    },
    cancelButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    saveButtonText: {
        color: '#000',
        fontWeight: 'bold',
    },
});
