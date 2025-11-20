import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function User() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>You are not logged in. <Text style={styles.loginText}>Login</Text></Text>
            </View>

            <View style={styles.contentCard} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        padding: 20,
    },
    header: {
        backgroundColor: '#fff',
        borderRadius: 30,
        paddingVertical: 15,
        paddingHorizontal: 20,
        alignItems: 'center',
        marginBottom: 20,
    },
    headerText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '500',
    },
    loginText: {
        color: '#007AFF',
        fontWeight: '600',
    },
    contentCard: {
        backgroundColor: '#fff',
        borderRadius: 30,
        height: 150,
        width: '100%',
    },
});
