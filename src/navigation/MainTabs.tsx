// src/navigation/MainTabs.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ThinkScreen from '../screens/ThinkScreen';
import FeelingsScreen from '../screens/FeelingsScreen';
import GalleryScreen from '../screens/GalleryScreen';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { TouchableOpacity, Text } from 'react-native';

const MyHeaderButton = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())} style={{ padding: 10 }}>
      <Text style={{ fontSize: 24, color: '#fff' }}>☰</Text>
    </TouchableOpacity>
  );
};


export type MainTabParamList = {
    Think: { currentUser: string };
    Feelings: { currentUser: string };
    Galerie: { currentUser: string };
  };
  


const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabs({ route }) {
    
    const currentUser = route.params?.currentUser ?? 'Unbekannt';
  return (
    <Tab.Navigator initialRouteName="Think">
    <Tab.Screen
      name="Think"
      component={ThinkScreen}
      initialParams={{ currentUser }}
        options={{
          title: '💭 Denken',
          tabBarStyle: { backgroundColor: '#003D5A' },
          tabBarActiveTintColor: '#ffcc00',
          tabBarInactiveTintColor: '#888',
          headerStyle: { backgroundColor: '#180A39' },
          headerTintColor: '#fff',
          headerLeft: () => <MyHeaderButton/>,
        }}
      />
      <Tab.Screen
        name="Feelings"
        component={FeelingsScreen}
        initialParams={{ currentUser }}
        options={{
          title: '🧠 Gefühle',
          tabBarStyle: { backgroundColor: '#004080' },
          tabBarActiveTintColor: '#00ffff',
          tabBarInactiveTintColor: '#ccc',
          headerStyle: { backgroundColor: '#003366' },
          headerTintColor: '#fff',
          headerLeft: () => <MyHeaderButton/>,
        }}
      />
      <Tab.Screen
        name="Galerie"
        component={GalleryScreen}
        initialParams={{ currentUser }}
        options={{
          title: '🖼️ Galerie',
          tabBarStyle: { backgroundColor: '#220022' },
          tabBarActiveTintColor: '#ff66cc',
          tabBarInactiveTintColor: '#aaa',
          headerStyle: { backgroundColor: '#330033' },
          headerTintColor: '#fff',
          headerLeft: () => <MyHeaderButton/>,
        }}
      />
    </Tab.Navigator>
  );
}
