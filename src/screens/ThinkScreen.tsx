//Think.tsx
import React, { useState } from 'react';
import {
  StyleSheet,
  ImageBackground,
  Pressable,
  Image,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
  FadeIn,
} from 'react-native-reanimated';
import Parse from 'parse/react-native';
import type { RouteProp } from '@react-navigation/native';
import type { MainTabParamList } from '../navigation/MainTabs'; // anpassen!
import axios from 'axios'; // falls noch nicht importiert

const sendPush = async (from: string) => {
  const toRole = from === 'Hazechen' ? 'Roter Panda' : 'Hazechen';

  const query = new Parse.Query('UserDevice');
  query.equalTo('role', toRole);
  const recipient = await query.first();

  if (recipient) {
    const playerId = recipient.get('playerId');
    try {
      await axios.post(
        'https://onesignal.com/api/v1/notifications',
        {
          app_id: '4c65c406-f6b5-4363-9e83-936cc62890c2',
          include_player_ids: [playerId],
          headings: { en: '💭 Eine Nachricht von ' + from },
          contents: { en: 'Denkt gerade an dich!' },
        },
        {
          headers: {
            Authorization: 'Basic mxpm4q4d3e6r5qxo2xnuzxmpj', // OneSignal REST API Key
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('✅ Push-Benachrichtigung gesendet!');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('❌ Fehler beim Senden der Push-Benachrichtigung:', error.response?.data || error.message);
      } else {
        console.error('❌ Fehler beim Senden der Push-Benachrichtigung:', error);
      }
    }
  } else {
    console.error('❌ Kein Empfänger gefunden für Rolle:', toRole);
  }
};


type ThinkScreenRouteProp = RouteProp<MainTabParamList, 'Think'>;

type Props = {
  route: ThinkScreenRouteProp;
};

export default function ThinkScreen({ route }: Props) {
  const currentUser = route.params?.currentUser ?? 'Unbekannt';
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(1);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = async () => {
    scale.value = withSequence(
      withSpring(0.9, { stiffness: 200 }),
      withSpring(1)
    );

    const Emotion = Parse.Object.extend('emotions');
    const emotion = new Emotion();

    emotion.set('emotion', 'thinking');
    emotion.set('from', currentUser);

    try {
      await emotion.save();
      await sendPush(currentUser); // 👈 Push senden
      console.log('✅ Emotion gesendet von:', currentUser);
    } catch (e) {
      console.error('❌ Fehler beim Speichern:', e);
    }
  };

  const handleMenuSelect = (imgNum: number) => {
    setSelectedImage(imgNum);
    setMenuVisible(false);
  };

  const buttonImage =
    selectedImage === 2
      ? require('../assets/think-button-1.png')
      : require('../assets/think-button-2.png');

  return (
    <ImageBackground
      source={require('../assets/star-bg.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setMenuVisible(true)}
      >
        <Text style={styles.menuDots}>⋮</Text>
      </TouchableOpacity>

      <Pressable onPress={handlePress}>
        <Animated.Image
          source={buttonImage}
          style={[styles.imageButton, animatedStyle]}
          resizeMode="contain"
        />
      </Pressable>

      {menuVisible && (
        <View style={styles.menuOverlay}>
          <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
            <View style={styles.backdrop} />
          </TouchableWithoutFeedback>

          <Animated.View entering={FadeIn.springify()} style={styles.menu}>
            <Text style={styles.menuTitle}>🛠 Bild wechseln:</Text>
            <TouchableOpacity onPress={() => handleMenuSelect(1)}>
              <Text style={styles.menuItem}>🟢 Bild 1 wählen</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleMenuSelect(2)}>
              <Text style={styles.menuItem}>🔵 Bild 2 wählen</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  imageButton: { width: 420, height: 420 },
  menuButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 10,
    zIndex: 10,
  },
  menuDots: { fontSize: 24, color: '#fff' },
  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  menu: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  menuItem: {
    fontSize: 16,
    paddingVertical: 6,
  },
});
