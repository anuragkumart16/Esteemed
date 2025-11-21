import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

export default function Buddy() {
    const router = useRouter();
    const [inputText, setInputText] = useState('');

    // Mock Data with historical messages
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'old_1',
            text: "I almost gave in yesterday.",
            sender: 'user',
            timestamp: new Date(Date.now() - 86400000 * 2), // 2 days ago
        },
        {
            id: 'old_2',
            text: "That's okay. What matters is that you're here now. What triggered it?",
            sender: 'ai',
            timestamp: new Date(Date.now() - 86400000 * 2 + 60000), // 2 days ago + 1 min
        },
        {
            id: 'yesterday_1',
            text: "Feeling much better today!",
            sender: 'user',
            timestamp: new Date(Date.now() - 86400000), // Yesterday
        },
        {
            id: '1',
            text: "Hey there! I'm here to help you navigate your urges. How are you feeling right now?",
            sender: 'ai',
            timestamp: new Date(),
        },
    ]);

    const sendMessage = () => {
        if (!inputText.trim()) return;

        const newUserMessage: Message = {
            id: Date.now().toString(),
            text: inputText,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, newUserMessage]);
        setInputText('');

        // Mock AI Response
        setTimeout(() => {
            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: "I hear you. It's great that you're acknowledging how you feel. Remember, this urge is temporary. What can we do to distract you for the next 10 minutes?",
                sender: 'ai',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiResponse]);
        }, 1000);
    };

    const formatDateHeader = (date: Date) => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        if (messageDate.getTime() === today.getTime()) {
            return 'Today';
        } else if (messageDate.getTime() === yesterday.getTime()) {
            return 'Yesterday';
        } else {
            return messageDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
        }
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    const renderMessage = ({ item, index }: { item: Message; index: number }) => {
        const isUser = item.sender === 'user';
        const showDateHeader = index === 0 ||
            formatDateHeader(messages[index - 1].timestamp) !== formatDateHeader(item.timestamp);

        return (
            <View>
                {showDateHeader && (
                    <View style={styles.dateHeaderContainer}>
                        <Text style={styles.dateHeaderText}>{formatDateHeader(item.timestamp)}</Text>
                    </View>
                )}
                <View style={[styles.messageWrapper, isUser ? styles.userMessageWrapper : styles.aiMessageWrapper]}>
                    <View style={[styles.messageContainer, isUser ? styles.userMessage : styles.aiMessage]}>
                        <Text style={[styles.messageText, isUser ? styles.userMessageText : styles.aiMessageText]}>
                            {item.text}
                        </Text>
                        <Text style={[styles.timestamp, isUser ? styles.userTimestamp : styles.aiTimestamp]}>
                            {formatTime(item.timestamp)}
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push('/landing')} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Buddy</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Chat Area */}
            {/* Chat Content */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <FlatList
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.chatContent}
                    style={styles.chatList}
                />

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type a message..."
                        placeholderTextColor="#666"
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                        <Ionicons name="send" size={20} color="#000" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
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
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#111',
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    chatList: {
        flex: 1,
    },
    chatContent: {
        padding: 20,
    },
    dateHeaderContainer: {
        alignItems: 'center',
        marginVertical: 15,
    },
    dateHeaderText: {
        color: '#666',
        fontSize: 12,
        fontWeight: '500',
        backgroundColor: '#111',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
        overflow: 'hidden',
    },
    messageWrapper: {
        marginBottom: 5,
        width: '100%',
    },
    userMessageWrapper: {
        alignItems: 'flex-end',
    },
    aiMessageWrapper: {
        alignItems: 'flex-start',
    },
    messageContainer: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 20,
    },
    userMessage: {
        backgroundColor: '#0f172a',
        borderBottomRightRadius: 5,
    },
    aiMessage: {
        backgroundColor: '#222',
        borderBottomLeftRadius: 5,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 22,
        marginBottom: 4,
    },
    userMessageText: {
        color: '#fff',
    },
    aiMessageText: {
        color: '#fff',
    },
    timestamp: {
        fontSize: 10,
        alignSelf: 'flex-end',
    },
    userTimestamp: {
        color: 'rgba(255, 255, 255, 0.5)',
    },
    aiTimestamp: {
        color: 'rgba(255, 255, 255, 0.5)',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: '#111',
        backgroundColor: '#000',
        gap: 10,
    },
    input: {
        flex: 1,
        backgroundColor: '#111',
        borderRadius: 25,
        paddingHorizontal: 20,
        paddingVertical: 12,
        color: '#fff',
        fontSize: 16,
        maxHeight: 100,
    },
    sendButton: {
        backgroundColor: '#fff',
        width: 45,
        height: 45,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
