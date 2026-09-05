import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

export default function AppTabs() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: colors.backgroundElement,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'الرئيسية',
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              color={color}
              name={focused ? 'home' : 'home-outline'}
              size={size}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="sections"
        options={{
          title: 'الأقسام',
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              color={color}
              name={focused ? 'grid' : 'grid-outline'}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
  name="articles/[slug]"
  options={{
    href: null,
  }}
/>
    </Tabs>
  );
}