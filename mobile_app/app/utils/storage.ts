import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UrgeLog {
    id: string;
    date: string;
    trigger: string;
    victory: string;
}

export interface RelapseLog {
    id: string;
    date: string;
    reason?: string;
}

const KEYS = {
    URGE_LOG: 'urgeLog',
    RELAPSE_LOG: 'relapseLog',
    STREAK_START_DATE: 'streakStartDate',
    USER_EMAIL: 'userEmail',
    USER_PASSWORD: 'userPassword',
    USER_JOIN_DATE: 'userJoinDate',
};

export const getUrgeLogs = async (): Promise<UrgeLog[]> => {
    try {
        const logs = await AsyncStorage.getItem(KEYS.URGE_LOG);
        return logs ? JSON.parse(logs) : [];
    } catch (error) {
        console.error('Error getting urge logs:', error);
        return [];
    }
};

export const saveUrgeLog = async (log: UrgeLog): Promise<void> => {
    try {
        const logs = await getUrgeLogs();
        logs.push(log);
        await AsyncStorage.setItem(KEYS.URGE_LOG, JSON.stringify(logs));
    } catch (error) {
        console.error('Error saving urge log:', error);
    }
};

export const getRelapseLogs = async (): Promise<RelapseLog[]> => {
    try {
        const logs = await AsyncStorage.getItem(KEYS.RELAPSE_LOG);
        return logs ? JSON.parse(logs) : [];
    } catch (error) {
        console.error('Error getting relapse logs:', error);
        return [];
    }
};

export const saveRelapseLog = async (reason?: string): Promise<void> => {
    try {
        const logs = await getRelapseLogs();
        const newLog: RelapseLog = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            reason: reason || 'No reason provided',
        };
        logs.push(newLog);
        await AsyncStorage.setItem(KEYS.RELAPSE_LOG, JSON.stringify(logs));
    } catch (error) {
        console.error('Error saving relapse log:', error);
    }
};

export const getStreakStartDate = async (): Promise<number | null> => {
    try {
        const date = await AsyncStorage.getItem(KEYS.STREAK_START_DATE);
        return date ? parseInt(date) : null;
    } catch (error) {
        console.error('Error getting streak start date:', error);
        return null;
    }
};

export const setStreakStartDate = async (date: number): Promise<void> => {
    try {
        await AsyncStorage.setItem(KEYS.STREAK_START_DATE, date.toString());
    } catch (error) {
        console.error('Error setting streak start date:', error);
    }
};

export const clearStreak = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem(KEYS.STREAK_START_DATE);
    } catch (error) {
        console.error('Error clearing streak:', error);
    }
};

// User Authentication Functions
export const saveUserCredentials = async (email: string, password: string): Promise<void> => {
    try {
        await AsyncStorage.setItem(KEYS.USER_EMAIL, email);
        await AsyncStorage.setItem(KEYS.USER_PASSWORD, password);
        await AsyncStorage.setItem(KEYS.USER_JOIN_DATE, new Date().toISOString());
    } catch (error) {
        console.error('Error saving user credentials:', error);
    }
};

export const getUserEmail = async (): Promise<string | null> => {
    try {
        return await AsyncStorage.getItem(KEYS.USER_EMAIL);
    } catch (error) {
        console.error('Error getting user email:', error);
        return null;
    }
};

export const getUserJoinDate = async (): Promise<string | null> => {
    try {
        return await AsyncStorage.getItem(KEYS.USER_JOIN_DATE);
    } catch (error) {
        console.error('Error getting user join date:', error);
        return null;
    }
};

export const verifyPassword = async (password: string): Promise<boolean> => {
    try {
        const storedPassword = await AsyncStorage.getItem(KEYS.USER_PASSWORD);
        return storedPassword === password;
    } catch (error) {
        console.error('Error verifying password:', error);
        return false;
    }
};

export const changePassword = async (newPassword: string): Promise<void> => {
    try {
        await AsyncStorage.setItem(KEYS.USER_PASSWORD, newPassword);
    } catch (error) {
        console.error('Error changing password:', error);
    }
};

export const logout = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem(KEYS.USER_EMAIL);
        await AsyncStorage.removeItem(KEYS.USER_PASSWORD);
        await AsyncStorage.removeItem(KEYS.USER_JOIN_DATE);
    } catch (error) {
        console.error('Error logging out:', error);
    }
};

export const deleteAllData = async (): Promise<void> => {
    try {
        await AsyncStorage.clear();
    } catch (error) {
        console.error('Error deleting all data:', error);
    }
};
