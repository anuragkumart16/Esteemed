import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useRouter } from 'expo-router';

interface Message {
    id: string;
    text: string;
    senderId: string;
    senderName: string;
    timestamp: Date;
    avatarColor?: string;
}

const MOCK_USERS = [
    { id: 'user1', name: 'Alice', color: '#FF6B6B' },
    { id: 'user2', name: 'Bob', color: '#4ECDC4' },
    { id: 'user3', name: 'Charlie', color: '#45B7D1' },
    { id: 'user4', name: 'David', color: '#96CEB4' },
];

export default function Community() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [inputText, setInputText] = useState('');

    // Mock Data with group chat messages
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Has anyone else felt the urge strong today?",
            senderId: 'user1',
            senderName: 'Alice',
            timestamp: new Date(Date.now() - 3600000), // 1 hour ago
            avatarColor: '#FF6B6B'
        },
        {
            id: '2',
            text: "Yeah, mornings are always tough for me. Stay strong!",
            senderId: 'user2',
            senderName: 'Bob',
            timestamp: new Date(Date.now() - 3500000),
            avatarColor: '#4ECDC4'
        },
        {
            id: '3',
            text: "I went for a run instead, really helped clear my mind.",
            senderId: 'user3',
            senderName: 'Charlie',
            timestamp: new Date(Date.now() - 3400000),
            avatarColor: '#45B7D1'
        },
        {
            id: '4',
            text: "That's a great idea. I might try meditation.",
            senderId: 'user1',
            senderName: 'Alice',
            timestamp: new Date(Date.now() - 3300000),
            avatarColor: '#FF6B6B'
        },
    ]);

    const sendMessage = () => {
        if (!inputText.trim()) return;

        const newUserMessage: Message = {
            id: Date.now().toString(),
            text: inputText,
            senderId: 'me',
            senderName: 'Me',
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, newUserMessage]);
        setInputText('');

        // Simulate random reply from others
        setTimeout(() => {
            const randomUser = MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];
            const reply: Message = {
                id: (Date.now() + 1).toString(),
                text: "We are in this together! 💪",
                senderId: randomUser.id,
                senderName: randomUser.name,
                timestamp: new Date(),
                avatarColor: randomUser.color
            };
            setMessages((prev) => [...prev, reply]);
        }, 2000);
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    const renderMessage = ({ item }: { item: Message }) => {
        const isMe = item.senderId === 'me';

        return (
            <View style={[styles.messageWrapper, isMe ? styles.myMessageWrapper : styles.otherMessageWrapper]}>
                {!isMe && (
                    <View style={[styles.avatar, { backgroundColor: item.avatarColor || '#ccc' }]}>
                        <Text style={styles.avatarText}>{item.senderName[0]}</Text>
                    </View>
                )}
                <View style={[styles.messageContainer, isMe ? styles.myMessage : styles.otherMessage]}>
                    {!isMe && <Text style={styles.senderName}>{item.senderName}</Text>}
                    <Text style={[styles.messageText, isMe ? styles.myMessageText : styles.otherMessageText]}>
                        {item.text}
                    </Text>
                    <Text style={[styles.timestamp, isMe ? styles.myTimestamp : styles.otherTimestamp]}>
                        {formatTime(item.timestamp)}
                    </Text>
                </View>
            </View>
        );
    };

    if (!isLoggedIn) {
        return (
            <SafeAreaView style={styles.loginContainer}>
                <View style={styles.loginCard}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="people" size={60} color="#000" />
                    </View>
                    <Text style={styles.loginTitle}>Join the Community</Text>
                    <Text style={styles.loginSubtitle}>Connect with others on the same journey. Share your progress and get support.</Text>
                    <TouchableOpacity style={styles.loginButton} onPress={() => setIsLoggedIn(true)}>
                        <Text style={styles.loginButtonText}>Login to Join</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push('/landing')} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Community Chat</Text>
                <View style={styles.onlineIndicator}>
                    <View style={styles.greenDot} />
                    <Text style={styles.onlineText}>{MOCK_USERS.length + 12} online</Text>
                </View>
            </View>

            {/* Chat Content */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
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
    loginContainer: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        padding: 20,
    },
    loginCard: {
        backgroundColor: '#111',
        borderRadius: 30,
        padding: 30,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#222',
    },
    iconContainer: {
        width: 100,
        height: 100,
        backgroundColor: '#fff',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    loginTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    loginSubtitle: {
        color: '#999',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 24,
    },
    loginButton: {
        backgroundColor: '#fff',
        paddingVertical: 16,
        paddingHorizontal: 40,
        borderRadius: 30,
        width: '100%',
    },
    loginButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#111',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    backButton: {
        padding: 5,
    },
    onlineIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#111',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
    },
    greenDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#4ECDC4',
        marginRight: 6,
    },
    onlineText: {
        color: '#999',
        fontSize: 12,
        fontWeight: '500',
    },
    chatList: {
        flex: 1,
    },
    chatContent: {
        padding: 20,
        paddingBottom: 100,
    },
    messageWrapper: {
        marginBottom: 15,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    myMessageWrapper: {
        justifyContent: 'flex-end',
    },
    otherMessageWrapper: {
        justifyContent: 'flex-start',
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        marginBottom: 4,
    },
    avatarText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    messageContainer: {
        maxWidth: '75%',
        padding: 12,
        borderRadius: 20,
    },
    myMessage: {
        backgroundColor: '#0f172a',
        borderBottomRightRadius: 5,
    },
    otherMessage: {
        backgroundColor: '#222',
        borderBottomLeftRadius: 5,
    },
    senderName: {
        color: '#999',
        fontSize: 12,
        marginBottom: 4,
        fontWeight: '500',
    },
    messageText: {
        fontSize: 16,
        lineHeight: 22,
        marginBottom: 4,
    },
    myMessageText: {
        color: '#fff',
    },
    otherMessageText: {
        color: '#fff',
    },
    timestamp: {
        fontSize: 10,
        alignSelf: 'flex-end',
    },
    myTimestamp: {
        color: 'rgba(255, 255, 255, 0.5)',
    },
    otherTimestamp: {
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
