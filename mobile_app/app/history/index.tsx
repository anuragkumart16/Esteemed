import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { getRelapseLogs, RelapseLog } from '../utils/storage';
import { Ionicons } from '@expo/vector-icons';

export default function History() {
    const router = useRouter();
    const [logs, setLogs] = useState<RelapseLog[]>([]);

    useEffect(() => {
        loadLogs();
    }, []);

    const loadLogs = async () => {
        const data = await getRelapseLogs();
        // Sort by date descending (newest first)
        const sorted = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setLogs(sorted);
    };

    const renderItem = ({ item }: { item: RelapseLog }) => {
        const date = new Date(item.date).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        return (
            <View style={styles.card}>
                <Text style={styles.date}>{date}</Text>
                <Text style={styles.reason}>{item.reason || 'No reason provided'}</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Relapse History</Text>
            </View>

            <FlatList
                data={logs}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No history recorded yet.</Text>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#222',
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    listContent: {
        padding: 20,
    },
    card: {
        backgroundColor: '#111',
        borderRadius: 15,
        padding: 20,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#222',
    },
    date: {
        color: '#666',
        fontSize: 12,
        marginBottom: 8,
        fontWeight: '600',
    },
    reason: {
        color: '#fff',
        fontSize: 16,
        lineHeight: 24,
    },
    emptyText: {
        color: '#666',
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
    },
});
