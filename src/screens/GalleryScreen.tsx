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
import firestore from '@react-native-firebase/firestore';
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

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('gallery')
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        snapshot => {
          if (!snapshot || !snapshot.docs) {
            console.warn('📭 Kein Snapshot oder keine Daten vorhanden');
            return;
          }
  
          const data: GalleryItem[] = snapshot.docs.map(doc => ({
            id: doc.id,
            image: doc.data().image,
          }));
          setImages(data);
        },
        error => {
          console.error('❌ Firestore Fehler:', error);
        }
      );
  
    return () => unsubscribe();
  }, []);
  

  const handleAddImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      includeBase64: true,
    });

    if (result.assets && result.assets.length > 0) {
      const base64 = result.assets[0].base64;
      if (base64) {
        await firestore().collection('gallery').add({
          image: base64,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
        console.log('✅ Bild gespeichert');
      }
    }
  };

  const handleDelete = async () => {
    if (selectedIndex === null) return;
    const idToDelete = images[selectedIndex].id;
  
    try {
      await firestore().collection('gallery').doc(idToDelete).delete();
      console.log('🗑️ Bild gelöscht');
      setSelectedIndex(null); // Modal schließen
    } catch (error) {
      console.error('❌ Fehler beim Löschen:', error);
    }
  };
  

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

    <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
  <Text style={styles.deleteText}>🗑️</Text>
</TouchableOpacity>

  </View>
</Modal>


      <TouchableOpacity style={styles.fab} onPress={handleAddImage}>
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  gallery: {
    padding: 10,
  },
  deleteButton: {
    position: 'absolute',
    top: 40,
    right: 30,
    backgroundColor: '#ff4444',
    padding: 10,
    borderRadius: 20,
    zIndex: 10,
  },
  deleteText: {
    fontSize: 20,
    color: '#fff',
  },  
  image: {
    width: 110,
    height: 110,
    margin: 5,
    borderRadius: 10,
    backgroundColor: '#ddd',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#f33',
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 18,
    elevation: 5,
  },
  fabText: {
    fontSize: 26,
    color: '#fff',
    fontWeight: 'bold',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '90%',
    height: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  closeText: {
    fontSize: 30,
    color: '#fff',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
});
