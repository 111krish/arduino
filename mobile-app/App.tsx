import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import { LoginScreen } from './src/screens/LoginScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { ResearchScreen } from './src/screens/ResearchScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { Colors } from './src/theme/colors';

const Tab = createBottomTabNavigator();

export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const [userName, setUserName] = useState('Researcher');

  function handleLogin(newToken: string, name: string) {
    setToken(newToken);
    setUserName(name);
  }

  function handleLogout() {
    setToken(null);
  }

  if (!token) {
    return (
      <>
        <StatusBar style="light" />
        <LoginScreen onLogin={handleLogin} />
      </>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: Colors.primary,
            tabBarInactiveTintColor: Colors.textDisabled,
            tabBarStyle: {
              backgroundColor: Colors.surface,
              borderTopColor: Colors.divider,
              paddingBottom: 4,
              height: 60,
            },
            tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
            tabBarIcon: ({ focused, color, size }) => {
              const icons: Record<string, [string, string]> = {
                Dashboard: ['home', 'home-outline'],
                Research: ['flask', 'flask-outline'],
                Settings: ['settings', 'settings-outline'],
              };
              const [active, inactive] = icons[route.name] ?? ['help-circle', 'help-circle-outline'];
              return <Ionicons name={(focused ? active : inactive) as any} size={size} color={color} />;
            },
          })}
        >
          <Tab.Screen name="Dashboard">
            {() => <DashboardScreen userName={userName} onLogout={handleLogout} />}
          </Tab.Screen>
          <Tab.Screen name="Research" component={ResearchScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}
