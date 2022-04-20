import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FooterComponent from './components/FooterComponent';
import HomeView from './pages/HomeView';

export default function Main() {
  return (
    <View>
      <StatusBar style="auto" />
      <HomeView/>
      <FooterComponent/>
    </View>
  );
}
