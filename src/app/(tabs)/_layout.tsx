import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1D6FEB',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E7EB',
          height: 76,
          paddingBottom: 14,
          paddingTop: 10,
          elevation: 8,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: focused ? 26 : 22 }}>🌤️</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Disaster Radar',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: focused ? 26 : 22 }}>🛰️</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="planner"
        options={{
          title: 'AI Travel',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: focused ? 26 : 22 }}>✈️</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="safety"
        options={{
          title: 'Emergency',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: focused ? 26 : 22 }}>🛡️</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: focused ? 26 : 22 }}>👤</Text>
          ),
        }}
      />
    </Tabs>
  );
}