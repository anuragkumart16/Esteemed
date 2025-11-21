import { WebView } from 'react-native-webview';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

export default function Index() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    try {
      const hasOnboarded = await AsyncStorage.getItem('hasOnboarded');
      if (hasOnboarded === 'true') {
        router.replace('/landing');
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMessage = async (event: any) => {
    if (event.nativeEvent.data === 'onboarding_complete') {
      try {
        await AsyncStorage.setItem('hasOnboarded', 'true');
        router.replace('/landing');
      } catch (error) {
        console.error('Error saving onboarding status:', error);
      }
    }
  };

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{ uri: 'https://esteemed-ruddy.vercel.app' }}
        onMessage={handleMessage}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
