import React, { useState } from 'react';
import {
  StyleSheet,
  ImageBackground,
  Pressable,
  Image,
  View,
  Text,
  Modal,
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
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';

type Props = {
  deviceName: 'Häschen' | 'Roter Panda';
};

export default function ThinkScreen({ deviceName }: Props) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(1);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSequence(
      withSpring(0.9, { stiffness: 200 }),
      withSpring(1)
    );
  
    sendPushToOtherDevice(); // 💌 Push senden!
  };
  

  const handleMenuSelect = (imgNum: React.SetStateAction<number>) => {
    setSelectedImage(imgNum);
    setMenuVisible(false);
  };

  const getTargetToken = async (targetDevice: 'deviceA' | 'deviceB') => {
    const doc = await firestore().collection('deviceTokens').doc(targetDevice).get();
    return doc.data()?.token;
  };
  
  const sendPushToOtherDevice = async () => {
    const token = await getTargetToken('deviceB'); // <== oder 'deviceA' je nach Gerät
  
    if (!token) {
      console.warn('⚠️ Kein Token gefunden');
      return;
    }
  
    await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        Authorization: '259702786890', // aus Firebase-Projekt kopieren!
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: token,
        notification: {
          title: '🐼 Ich denke an dich!',
          body: 'Ein Panda hat gedrückt 💌',
        },
      }),
    });
  
    console.log('📨 Nachricht gesendet');
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
      {/* Menü-Button oben rechts */}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setMenuVisible(true)}
      >
        <Text style={styles.menuDots}>⋮</Text>
      </TouchableOpacity>

      {/* Bild-Button in der Mitte */}
      <Pressable onPress={handlePress}>
        <Animated.Image
          source={buttonImage}
          style={[styles.imageButton, animatedStyle]}
          resizeMode="contain"
        />
      </Pressable>

      {/* Modal-Menü zentriert über allem */}
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
  menuDots: {
    fontSize: 24,
    color: '#fff',
  },
  menu: {
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 30,
    elevation: 10,
    alignItems: 'center',
    minWidth: 240,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  
  menuItem: {
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
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

  // 👉️ DAS HAT GEFELHT
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
});

