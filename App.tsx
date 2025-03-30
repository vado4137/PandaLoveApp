import React from 'react';
import { SafeAreaView, StatusBar, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MainTabs from './src/navigation/MainTabs';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import { useEffect } from 'react';
import { useNavigationState } from '@react-navigation/native';
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs(); // nur um visuelle Fehler zu vermeiden


const Drawer = createDrawerNavigator();
const navigationState = useNavigationState(state => state);


export default function App() {
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('emotions')
      .orderBy('createdAt', 'desc')
      .limit(1)
      .onSnapshot(snapshot => {
        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          const emotion = doc.data().emotion;
          const from = doc.data().from;
  
          if (from !== 'deviceB') return;
  
          console.log('🎉 Emotion empfangen:', emotion);
        }
      }, (error) => {
        console.error('❌ Firestore Fehler:', error); // NEU!
      });
  
    return () => unsubscribe();
  }, []);
  
  
  return (
    <>
      <StatusBar backgroundColor="#180A39" barStyle="light-content" />
      <SafeAreaView style={styles.topSafeArea} />
      <View style={styles.appContainer}>
        <NavigationContainer>
          <Drawer.Navigator
            initialRouteName="Roter Panda"
            screenOptions={{
              drawerStyle: { backgroundColor: '#180A39', width: 220 },
              drawerActiveTintColor: '#ffcc00',
              drawerInactiveTintColor: '#fff',
              drawerLabelStyle: { fontSize: 16 },
            }}
          >
           <Drawer.Screen
  name="Häschen"
  component={MainTabs}
  initialParams={{ name: 'Häschen' }}
/>
<Drawer.Screen
  name="Roter Panda"
  component={MainTabs}
  initialParams={{ name: 'Roter Panda' }}
/>

          </Drawer.Navigator>
        </NavigationContainer>
      </View>
      <SafeAreaView style={styles.bottomSafeArea} />
    </>
  );
}

const styles = StyleSheet.create({
  topSafeArea: { backgroundColor: '#180939' },
  bottomSafeArea: { backgroundColor: '#07526B' },
  appContainer: { flex: 1, backgroundColor: '#07526B' },
});
