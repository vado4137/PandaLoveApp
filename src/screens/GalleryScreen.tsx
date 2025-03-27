import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const initialImages = [
  require('../assets/Gallery/img1.jpg'),
  require('../assets/Gallery/img2.jpg'),
  require('../assets/Gallery/img3.jpg'),
  require('../assets/Gallery/img4.jpg'),
];


export default function GalleryScreen() {
  const [images, setImages] = useState(initialImages);

  const handleAddImage = () => {
    // Placeholder: hier später Upload-Logik (z. B. Firebase)
    console.log('Upload button clicked');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        numColumns={3}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Image source={item} style={styles.image} resizeMode="cover" />
        )}
      />

      {/* Floating + Button */}
      <TouchableOpacity style={styles.fab} onPress={handleAddImage}>
        <Icon name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  list: {
    padding: 10,
    justifyContent: 'center',
  },
  image: {
    width: '30%',
    height: 100,
    margin: 5,
    borderRadius: 10,
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
});
