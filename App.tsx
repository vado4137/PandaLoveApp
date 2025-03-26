import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ThinkScreen from './src/screens/ThinkScreen';
import FeelingsScreen from './src/screens/FeelingsScreen';
import GalleryScreen from './src/screens/GalleryScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Think">
        <Tab.Screen name="Think" component={ThinkScreen} />
        <Tab.Screen name="Feelings" component={FeelingsScreen} />
        <Tab.Screen name="Galerie" component={GalleryScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
