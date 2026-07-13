import { View, Text, TextInput, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View className="justify-center flex-1 px-6 bg-white">
      <Text className="mb-1 text-3xl font-bold text-blue-600">Create Account</Text>
      <Text className="mb-8 text-gray-500">Join SkyGuard today</Text>

      <TextInput
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        className="px-4 py-3 mb-4 border border-gray-300 rounded-lg"
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        className="px-4 py-3 mb-4 border border-gray-300 rounded-lg"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="px-4 py-3 mb-6 border border-gray-300 rounded-lg"
      />

      <Pressable
        className="items-center py-4 mb-4 bg-blue-600 rounded-lg"
        onPress={() => router.replace('/(tabs)')}
      >
        <Text className="font-bold text-white">Register</Text>
      </Pressable>

      <Pressable onPress={() => router.back()}>
        <Text className="text-center text-blue-600">Already have an account? Login</Text>
      </Pressable>
    </View>
  );
}