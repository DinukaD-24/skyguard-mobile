import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import Button from '@/components/Button';
import Input from '@/components/Input';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View className="justify-center flex-1 px-6 bg-white">
      <Text className="mb-1 text-3xl font-bold text-blue-600">Welcome Back</Text>
      <Text className="mb-8 text-gray-500">Login to SkyGuard</Text>

      <Input
        label="Email"
        placeholder="you@example.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Input
        label="Password"
        placeholder="••••••••"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button
        title="Login"
        onPress={() => router.replace('/(tabs)')}
        style={{ marginTop: 8, marginBottom: 16 }}
      />

      <Text className="text-center text-blue-600" onPress={() => router.push('/register')}>
        Don't have an account? Register
      </Text>
    </View>
  );
}