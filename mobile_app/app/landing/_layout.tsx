import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';

export default function LandingLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#fff',
                    borderTopWidth: 0,
                    height: 80,
                    paddingBottom: 20,
                    paddingTop: 10,
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30,
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    elevation: 0,
                    shadowOpacity: 0,
                },
                tabBarActiveTintColor: '#000',
                tabBarInactiveTintColor: '#999',
                tabBarShowLabel: true,
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                },
            }}
        >
            <Tabs.Screen
                name="stats"
                options={{
                    title: 'Stats',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="stats-chart" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size, focused }) => (
                        <View style={[styles.homeIconContainer, focused && styles.homeIconFocused]}>
                            <Ionicons name="home" size={24} color={focused ? '#fff' : '#000'} />
                        </View>
                    ),
                    tabBarLabel: 'Home',
                }}
            />
            <Tabs.Screen
                name="user"
                options={{
                    title: 'User',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="buddy"
                options={{
                    title: 'Buddy',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="heart" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    homeIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e0e0e0',
    },
    homeIconFocused: {
        backgroundColor: '#000',
    },
});
