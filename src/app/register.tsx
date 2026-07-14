import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import Button from '@/components/Button';
import Input from '@/components/Input';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View className="justify-center flex-1 px-6 bg-white">
      <Text className="mb-1 text-3xl font-bold text-blue-600">Create Account</Text>
      <Text className="mb-8 text-gray-500">Join SkyGuard today</Text>

      <Input label="Full Name" placeholder="John Doe" value={name} onChangeText={setName} />
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
        title="Register"
        onPress={() => router.replace('/(tabs)')}
        style={{ marginTop: 8, marginBottom: 16 }}
      />

      <Text className="text-center text-blue-600" onPress={() => router.back()}>
        Already have an account? Login
      </Text>
    </View>
  );
}