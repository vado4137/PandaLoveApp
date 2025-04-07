import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Text,
  Modal,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import Swiper from 'react-native-swiper';


type GalleryItem = {
  id: string;
  image: string; // Base64 string
};

export default function GalleryScreen() {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null); 

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <FlatList
        data={images}
        numColumns={3}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.gallery}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => setSelectedIndex(index)}>
            <Image
              source={{ uri: `data:image/jpeg;base64,${item.image}` }}
              style={styles.image}
            />
          </TouchableOpacity>
        )}
      />

      {/* Modal für Fullscreen-Ansicht */}
      <Modal visible={selectedIndex !== null} transparent animationType="fade">
  <View style={styles.overlay}>
    <Swiper
      loop={false}
      index={selectedIndex ?? 0}
      showsPagination={false}
    >
      {images.map((img, i) => (
        <View key={img.id} style={styles.slide}>
          <Image
            source={{ uri: `data:image/jpeg;base64,${img.image}` }}
            style={styles.fullImage}
            resizeMode="contain"
          />
        </View>
      ))}
    </Swiper>

    <TouchableOpacity style={styles.deleteButton} onPress={() => {}}>
  <Text style={styles.deleteText}>🗑️</Text>
</TouchableOpacity>

  </View>
</Modal>


      <TouchableOpacity style={styles.fab} onPress={() => {}}>
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
