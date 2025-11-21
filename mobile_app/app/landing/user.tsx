import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import {
    getUserEmail,
    getUserJoinDate,
    saveUserCredentials,
    verifyPassword,
    changePassword,
    logout,
    deleteAllData
} from '../utils/storage';

export default function User() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [joinDate, setJoinDate] = useState('');

    // Login Modal State
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // Change Password Modal State
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        checkLoginStatus();
    }, []);

    const checkLoginStatus = async () => {
        const email = await getUserEmail();
        if (email) {
            setIsLoggedIn(true);
            setUserEmail(email);
            const date = await getUserJoinDate();
            if (date) {
                setJoinDate(new Date(date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }));
            }
        }
    };

    const handleLogin = async () => {
        if (!loginEmail.trim() || !loginPassword.trim()) {
            Alert.alert('Error', 'Please enter both email and password');
            return;
        }

        await saveUserCredentials(loginEmail, loginPassword);
        setIsLoggedIn(true);
        setUserEmail(loginEmail);
        const date = await getUserJoinDate();
        if (date) {
            setJoinDate(new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }));
        }
        setShowLoginModal(false);
        setLoginEmail('');
        setLoginPassword('');
    };

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'New passwords do not match');
            return;
        }

        const isValid = await verifyPassword(currentPassword);
        if (!isValid) {
            Alert.alert('Error', 'Current password is incorrect');
            return;
        }

        await changePassword(newPassword);
        Alert.alert('Success', 'Password changed successfully');
        setShowPasswordModal(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    const handleLogout = async () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                        setIsLoggedIn(false);
                        setUserEmail('');
                        setJoinDate('');
                    }
                }
            ]
        );
    };

    const handleDeleteAllData = () => {
        Alert.alert(
            'Delete All Data',
            'This will permanently delete all your data including streaks, urge logs, and account information. This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        await deleteAllData();
                        setIsLoggedIn(false);
                        setUserEmail('');
                        setJoinDate('');
                        Alert.alert('Success', 'All data has been deleted');
                    }
                }
            ]
        );
    };

    if (!isLoggedIn) {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerText}>Account</Text>
                    </View>

                    {/* Login Prompt */}
                    <View style={styles.loginPromptCard}>
                        <Ionicons name="person-circle-outline" size={80} color="#999" />
                        <Text style={styles.loginPromptTitle}>Not Logged In</Text>
                        <Text style={styles.loginPromptSubtitle}>Login to view your account details and sync your progress</Text>
                        <TouchableOpacity style={styles.loginButton} onPress={() => setShowLoginModal(true)}>
                            <Text style={styles.loginButtonText}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                {/* Login Modal */}
                <Modal
                    visible={showLoginModal}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setShowLoginModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Login</Text>

                            <Text style={styles.inputLabel}>Email</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your email"
                                placeholderTextColor="#666"
                                value={loginEmail}
                                onChangeText={setLoginEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />

                            <Text style={styles.inputLabel}>Password</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your password"
                                placeholderTextColor="#666"
                                value={loginPassword}
                                onChangeText={setLoginPassword}
                                secureTextEntry
                            />

                            <View style={styles.modalActions}>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setShowLoginModal(false)}
                                >
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.modalButton, styles.saveButton]}
                                    onPress={handleLogin}
                                >
                                    <Text style={styles.saveButtonText}>Login</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerText}>Account</Text>
                </View>

                {/* Account Info Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account Information</Text>
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <Ionicons name="mail" size={20} color="#999" />
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoLabel}>Email</Text>
                                <Text style={styles.infoValue}>{userEmail}</Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.infoRow}>
                            <Ionicons name="calendar" size={20} color="#999" />
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoLabel}>Joined</Text>
                                <Text style={styles.infoValue}>{joinDate}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Settings Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Settings</Text>
                    <View style={styles.settingsCard}>
                        <TouchableOpacity
                            style={styles.settingItem}
                            onPress={() => setShowPasswordModal(true)}
                        >
                            <View style={styles.settingLeft}>
                                <Ionicons name="key" size={22} color="#fff" />
                                <Text style={styles.settingText}>Change Password</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={22} color="#666" />
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
                            <View style={styles.settingLeft}>
                                <Ionicons name="log-out" size={22} color="#fff" />
                                <Text style={styles.settingText}>Logout</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={22} color="#666" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Danger Zone */}
                <View style={styles.section}>
                    <Text style={styles.dangerTitle}>Danger Zone</Text>
                    <TouchableOpacity style={styles.dangerButton} onPress={handleDeleteAllData}>
                        <Ionicons name="trash" size={20} color="#000" />
                        <Text style={styles.dangerButtonText}>Delete All Data</Text>
                    </TouchableOpacity>
                    <Text style={styles.dangerSubtext}>This will permanently delete all your data</Text>
                </View>
            </ScrollView>

            {/* Change Password Modal */}
            <Modal
                visible={showPasswordModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowPasswordModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Change Password</Text>

                        <Text style={styles.inputLabel}>Current Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter current password"
                            placeholderTextColor="#666"
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                            secureTextEntry
                        />

                        <Text style={styles.inputLabel}>New Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter new password"
                            placeholderTextColor="#666"
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry
                        />

                        <Text style={styles.inputLabel}>Confirm New Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm new password"
                            placeholderTextColor="#666"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setShowPasswordModal(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={handleChangePassword}
                            >
                                <Text style={styles.saveButtonText}>Change</Text>
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
        paddingBottom: 100,
    },
    header: {
        backgroundColor: '#fff',
        borderRadius: 30,
        paddingVertical: 15,
        alignItems: 'center',
        marginBottom: 20,
    },
    headerText: {
        color: '#000',
        fontSize: 18,
        fontWeight: '600',
    },
    // Not Logged In State
    loginPromptCard: {
        backgroundColor: '#fff',
        borderRadius: 30,
        padding: 40,
        alignItems: 'center',
    },
    loginPromptTitle: {
        color: '#000',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    loginPromptSubtitle: {
        color: '#666',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 20,
    },
    loginButton: {
        backgroundColor: '#0f172a',
        borderRadius: 20,
        paddingVertical: 15,
        paddingHorizontal: 40,
        width: '100%',
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    // Logged In State
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
        marginLeft: 5,
    },
    infoCard: {
        backgroundColor: '#111',
        borderRadius: 16,
        padding: 20,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    infoTextContainer: {
        marginLeft: 15,
        flex: 1,
    },
    infoLabel: {
        color: '#999',
        fontSize: 12,
        marginBottom: 4,
    },
    infoValue: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    settingsCard: {
        backgroundColor: '#111',
        borderRadius: 16,
        padding: 20,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 15,
    },
    divider: {
        height: 1,
        backgroundColor: '#222',
        marginVertical: 8,
    },
    // Danger Zone
    dangerTitle: {
        color: '#ff3b30',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
        marginLeft: 5,
    },
    dangerButton: {
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingVertical: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 8,
    },
    dangerButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
    },
    dangerSubtext: {
        color: '#666',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 5,
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
