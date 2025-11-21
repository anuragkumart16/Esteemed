import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LandingLayout() {
    const insets = useSafeAreaInsets();
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#fff',
                    borderTopWidth: 0,
                    height: 60 + (insets.bottom > 0 ? insets.bottom : 20),
                    paddingBottom: insets.bottom > 0 ? insets.bottom : 20,
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
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={size} color={color} />
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
                name="community"
                options={{
                    title: 'Community',
                    tabBarStyle: { display: 'none' },
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="people" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="buddy"
                options={{
                    title: 'Buddy',
                    tabBarStyle: { display: 'none' },
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="heart" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({});
