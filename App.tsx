import React from 'react';
import {
SafeAreaView,
StatusBar,
View,
StyleSheet,
Platform,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ThinkScreen from './src/screens/ThinkScreen';
import FeelingsScreen from './src/screens/FeelingsScreen';
import GalleryScreen from './src/screens/GalleryScreen';

const Tab = createBottomTabNavigator();

export default function App() {
return (
  <>
    {/* StatusBar-Farbe (nur für Android relevant) */}
    <StatusBar
      backgroundColor="#180A39"
      barStyle="light-content"
      translucent={false}
    />

    {/* Safe-Area oben */}
    <SafeAreaView style={styles.topSafeArea} />

    {/* App-Inhalt */}
    <View style={styles.appContainer}>
      <NavigationContainer>
      <Tab.Navigator initialRouteName="Think">
  <Tab.Screen
    name="Think"
    component={ThinkScreen}
    options={{
      title: '💭 Denken',
      tabBarStyle: {
        backgroundColor: '#003D5A', // dunkler Hintergrund
      },
      tabBarActiveTintColor: '#ffcc00',
      tabBarInactiveTintColor: '#888',
      headerStyle: { backgroundColor: '#180A39' },
      headerTintColor: '#fff',
    }}
  />
  <Tab.Screen
    name="Feelings"
    component={FeelingsScreen}
    options={{
      title: '🧠 Gefühle',
      tabBarStyle: {
        backgroundColor: '#004080', // blauer Hintergrund
      },
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
      tabBarStyle: {
        backgroundColor: '#220022', // violett
      },
      tabBarActiveTintColor: '#ff66cc',
      tabBarInactiveTintColor: '#aaa',
      headerStyle: { backgroundColor: '#330033' },
      headerTintColor: '#fff',
    }}
  />
</Tab.Navigator>


      </NavigationContainer>
    </View>

    {/* Safe-Area unten */}
    <SafeAreaView style={styles.bottomSafeArea} />
  </>
);
}

const styles = StyleSheet.create({
topSafeArea: {
  backgroundColor: '#180939', // obere Farbe
},
bottomSafeArea: {
  backgroundColor: '#07526B', // untere Farbe (hinter den Tabs)
},
appContainer: {
  flex: 1,
  backgroundColor: '#07526B', // Hintergrund der App
},
});
