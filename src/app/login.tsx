import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import Button from '@/components/Button';
import Input from '@/components/Input';
import ErrorBanner from '@/components/ErrorBanner';
import { authService } from '@/services/auth';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await authService.login(email.trim(), password);
      router.replace('/(tabs)');
    } catch (err: any) {
      const errMsg = err.response?.data?.error || 'Failed to login. Please check your credentials.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="justify-center flex-1 px-6 bg-white">
      <Text className="mb-1 text-3xl font-bold text-blue-600">Welcome Back</Text>
      <Text className="mb-8 text-gray-500">Login to SkyGuard</Text>

      {error ? <ErrorBanner message={error} onDismiss={() => setError('')} /> : null}

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
        title="Login"
        onPress={handleLogin}
        loading={loading}
        style={{ marginTop: 8, marginBottom: 16 }}
      />

      <Text className="text-center text-blue-600" onPress={() => router.push('/register')}>
        Don't have an account? Register
      </Text>
    </View>
  );
}
