// src/navigation/MainTabs.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ThinkScreen from '../screens/ThinkScreen';
import FeelingsScreen from '../screens/FeelingsScreen';
import GalleryScreen from '../screens/GalleryScreen';

export type DeviceType = 'Häschen' | 'Roter Panda';

const Tab = createBottomTabNavigator();

type MainTabsProps = {
  route: { name: DeviceType };
};

export default function MainTabs({ route }: MainTabsProps) {
  const deviceName = route?.name || 'Roter Panda';

  return (
    <Tab.Navigator initialRouteName="Think">
      <Tab.Screen
        name="Think"
        children={() => <ThinkScreen deviceName={deviceName} />}
        options={{
          title: '💭 Denken',
          tabBarStyle: { backgroundColor: '#003D5A' },
          tabBarActiveTintColor: '#ffcc00',
          tabBarInactiveTintColor: '#888',
          headerStyle: { backgroundColor: '#180A39' },
          headerTintColor: '#fff',
        }}
      />
      <Tab.Screen
        name="Feelings"
        children={() => <FeelingsScreen deviceName={deviceName} />}
        options={{
          title: '🧠 Gefühle',
          tabBarStyle: { backgroundColor: '#004080' },
          tabBarActiveTintColor: '#00ffff',
          tabBarInactiveTintColor: '#ccc',
          headerStyle: { backgroundColor: '#003366' },
          headerTintColor: '#fff',
        }}
      />
      <Tab.Screen
        name="Galerie"
        component={GalleryScreen}
        options={{
          title: '🖼️ Galerie',
          tabBarStyle: { backgroundColor: '#220022' },
          tabBarActiveTintColor: '#ff66cc',
          tabBarInactiveTintColor: '#aaa',
          headerStyle: { backgroundColor: '#330033' },
          headerTintColor: '#fff',
        }}
      />
    </Tab.Navigator>
  );
}
