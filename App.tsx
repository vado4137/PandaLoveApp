// App.tsx
import 'react-native-get-random-values'; // <-- ganz oben!
import React, { useState, useEffect } from 'react';
import { SafeAreaView, StatusBar, View, StyleSheet, Alert, Vibration } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MainTabs from './src/navigation/MainTabs';
import Parse from 'parse/react-native.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {OneSignal} from 'react-native-onesignal';




// 🔐 Parse einrichten
Parse.setAsyncStorage(AsyncStorage);
Parse.initialize('ZuoMuJJ7w8YHB0t66DfPLsfRYpmHdvr9rbLEg8Xs', 'SwHoOYtmJH3WCRJxHkCsq6vM4BRtEirjjh6o2J4o');
// REST-API-Keys
// ZcCYMakaczDHGB7qfvQZ7AyqOgfhA4UL4kBwicZK
Parse.serverURL = 'https://parseapi.back4app.com/';
Parse.liveQueryServerURL = 'wss://PandaLoveApp.back4app.io';
//OneSignal.setAppId("4c65c406-f6b5-4363-9e83-936cc62890c2"); // ✅ App-ID deiner OneSignal-App
OneSignal.initialize("4c65c406-f6b5-4363-9e83-936cc62890c2"); // ✅ App-ID deiner OneSignal-App
OneSignal.Notifications.requestPermission(true); // ✅ fragt Nutzer nach Erlaubnis für Notifications



const Drawer = createDrawerNavigator();

export default function App() {

  const [userRole, setUserRole] = useState<'Hazechen' | 'Roter Panda'>('Roter Panda');

 

  useEffect(() => {
    // 📲 OneSignal initialisieren
    OneSignal.User.addTag("role", userRole); // z. B. "Hazechen" oder "Roter Panda"
  
    // 🧠 Player ID speichern
    const savePlayerId = async () => {
      try {
        
        const deviceState = await OneSignal.getDeviceState();
        const playerId = deviceState?.userId;
  
        if (playerId) {
          const UserDevice = Parse.Object.extend('UserDevice');
          const query = new Parse.Query(UserDevice);
          query.equalTo('role', userRole);
  
          const existing = await query.first();
          if (existing) {
            existing.set('playerId', playerId);
            await existing.save();
          } else {
            const obj = new UserDevice();
            obj.set('role', userRole);
            obj.set('playerId', playerId);
            await obj.save();
          }
  
          console.log(`💾 Player ID für ${userRole}:`, playerId);
        }
      } catch (error) {
        console.warn('❌ Fehler beim Speichern der Player ID:', error);
      }
    };
  
    savePlayerId();
  
    // 🔁 Polling für neue Emotionen
    const Emotion = Parse.Object.extend('emotions');
    const query = new Parse.Query(Emotion);
    query.descending('createdAt');
    query.limit(1);
  
    const poll = async () => {
      try {
        const results = await query.find();
        if (results.length > 0) {
          const latest = results[0];
          const latestId = latest.id;
  
          const storedId = await AsyncStorage.getItem('lastEmotionId');
          if (storedId === latestId) return; // schon gesehen
  
          const emotion = latest.get('emotion');
          const from = latest.get('from');
  
          if (from !== userRole) {
            console.log('📥 Neue Emotion empfangen:', emotion);
            Vibration.vibrate(300);
            Alert.alert('🐾 Nachricht', `${from} denkt: ${emotion}`);
          }
  
          await AsyncStorage.setItem('lastEmotionId', latestId);
        }
      } catch (error) {
        if (error instanceof Error) {
          console.warn('❌ Fehler beim Empfangen:', error.message);
        } else {
          console.warn('❌ Fehler beim Empfangen:', error);
        }
      }
  
      setTimeout(poll, 3000);
    };
  
    poll();
  }, [userRole]);
  
  

  return (
    <>
      <StatusBar backgroundColor="#180A39" barStyle="light-content" />
      <SafeAreaView style={styles.topSafeArea} />
      <View style={styles.appContainer}>
        <NavigationContainer>
          <Drawer.Navigator
            initialRouteName={userRole}
            screenOptions={{
              drawerStyle: { backgroundColor: '#180A39', width: 220 },
              drawerActiveTintColor: '#ffcc00',
              drawerInactiveTintColor: '#fff',
              drawerLabelStyle: { fontSize: 16 },
            }}
            screenListeners={{
              state: (e) => {
                const name = e.data?.state?.routes[e.data.state.index]?.name;
                if (name === 'Hazechen' || name === 'Roter Panda') {
                  setUserRole(name);
                }
              },
            }}
          >
            <Drawer.Screen
              name="Hazechen"
              component={MainTabs}
              options={{ headerShown: false }}
              initialParams={{ currentUser: 'Hazechen' }}
            />
            <Drawer.Screen
              name="Roter Panda"
              component={MainTabs}
              options={{ headerShown: false }}
              initialParams={{ currentUser: 'Roter Panda' }}
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
