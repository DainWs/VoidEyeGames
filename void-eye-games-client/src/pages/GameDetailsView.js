import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import HeaderComponent from '../components/HeaderComponent';
import FooterComponent from '../components/FooterComponent';

export default function App() {
  return (
    <View style={styles.container}>
        <HeaderComponent/>
        <Text>Open up App.js to start working on your app!</Text>
        <StatusBar style="auto" />
        <FooterComponent/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
