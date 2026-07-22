import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { authService } from '@/services/auth';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      // Allow the splash view to render for 1.5 seconds
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      try {
        const authenticated = await authService.isAuthenticated();
        if (authenticated) {
          router.replace('/(tabs)');
        } else {
          router.replace('/login');
        }
      } catch {
        router.replace('/login');
      }
    };

    checkAuth();
  }, []);

  return (
    <View className="items-center justify-center flex-1 bg-blue-600">
      <Text className="text-3xl font-bold text-white">SkyGuard</Text>
      <Text className="mt-2 text-sm text-white">AI Weather & Disaster Alerts</Text>
    </View>
  );
}
