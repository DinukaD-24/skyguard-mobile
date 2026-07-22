import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import Button from '@/components/Button';
import Input from '@/components/Input';
import ErrorBanner from '@/components/ErrorBanner';
import { authService } from '@/services/auth';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await authService.register(name.trim(), email.trim(), password);
      router.replace('/(tabs)');
    } catch (err: any) {
      const errMsg = err.response?.data?.error || 'Registration failed. Please try again.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="justify-center flex-1 px-6 bg-white">
      <Text className="mb-1 text-3xl font-bold text-blue-600">Create Account</Text>
      <Text className="mb-8 text-gray-500">Join SkyGuard today</Text>

      {error ? <ErrorBanner message={error} onDismiss={() => setError('')} /> : null}

      <Input
        label="Full Name"
        placeholder="John Doe"
        value={name}
        onChangeText={setName}
        error={error && !name ? 'Name is required' : undefined}
      />
      <Input
        label="Email"
        placeholder="you@example.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        error={error && !email ? 'Email is required' : undefined}
      />
      <Input
        label="Password"
        placeholder="••••••••"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        error={error && !password ? 'Password is required' : undefined}
      />

      <Button
        title="Register"
        onPress={handleRegister}
        loading={loading}
        style={{ marginTop: 8, marginBottom: 16 }}
      />

      <Text className="text-center text-blue-600" onPress={() => router.back()}>
        Already have an account? Login
      </Text>
    </View>
  );
}
