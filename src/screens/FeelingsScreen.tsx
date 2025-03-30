import React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  SafeAreaView,
} from 'react-native';
  const pandas = [
    {id:1, name: 'Happy', image: require('../assets/pandas/happy.png') },
    {id:2, name: 'Sad', image: require('../assets/pandas/sad.png') },
    {id:3, name: 'Angry', image: require('../assets/pandas/angry.png') },
    // usw...
  ];
  
  type Props = {
    deviceName: 'Häschen' | 'Roter Panda';
  };
  
  export default function FeelingsScreen({ deviceName }: Props) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.background} />
        <ScrollView contentContainerStyle={styles.container}>
          {pandas.map((panda, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => console.log(`${panda.name} gedrückt`)}
              style={styles.pandaWrapper}
            >
              <Image source={panda.image} style={styles.image} resizeMode="contain" />
              <Text style={styles.label}>{panda.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }
  
  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#ccc', // Als Fallback
    },
    background: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: '#eeeeee', // Heller Grauton
      zIndex: -1,
    },
    container: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      paddingVertical: 20,
    },
    pandaWrapper: {
      width: 100,
      alignItems: 'center',
      margin: 10,
    },
    image: {
      width: 80,
      height: 80,
    },
    label: {
      marginTop: 5,
      fontSize: 14,
      color: '#333',
    },
  });