import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';

import HomeScreen from './src/screens/HomeScreen';
import MonthsScreen from './src/screens/MonthsScreen';
import MonthDaysScreen from './src/screens/MonthDaysScreen';
import DailyScreen from './src/screens/DailyScreen';
import BookmarksScreen from './src/screens/BookmarksScreen';

import { colors } from './src/utils/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function CalendarStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.textLight,
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Stack.Screen
        name="Months"
        component={MonthsScreen}
        options={{ title: 'Месяцы' }}
      />
      <Stack.Screen
        name="MonthDays"
        component={MonthDaysScreen}
        options={{ title: '' }}
      />
      <Stack.Screen
        name="Daily"
        component={DailyScreen}
        options={{ title: '' }}
      />
    </Stack.Navigator>
  );
}

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = {
    'Главная': '◉',
    'Календарь': '▦',
    'Закладки': '★',
  };
  return (
    <Text style={{ fontSize: 22, color: focused ? colors.primary : colors.textSecondary }}>
      {icons[name] || '●'}
    </Text>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.divider,
          },
        })}
      >
        <Tab.Screen
          name="Главная"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Календарь"
          component={CalendarStack}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Закладки"
          component={BookmarksScreen}
          options={{
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: colors.textLight,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
