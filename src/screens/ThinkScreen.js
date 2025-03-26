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

export default function ThinkScreen() {
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
  };

  const handleMenuSelect = (imgNum) => {
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
});
