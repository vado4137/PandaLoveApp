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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  gallery: {
    padding: 10,
    justifyContent: 'center',
  },
  image: {
    width: '30%',
    height: 100,
    margin: 5,
    borderRadius: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  deleteButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 10,
  },
  deleteText: {
    color: '#fff',
    fontSize: 18,
  },
  fab: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    backgroundColor: '#2196F3',
    borderRadius: 30,
    padding: 15,
    elevation: 5,
  },
  fabText: {
    color: '#fff',
    fontSize: 24,
  },
});
