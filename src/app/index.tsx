import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/login');
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="items-center justify-center flex-1 bg-blue-600">
      <Text className="text-3xl font-bold text-white">SkyGuard</Text>
      <Text className="mt-2 text-sm text-white">AI Weather & Disaster Alerts</Text>
    </View>
  );
}