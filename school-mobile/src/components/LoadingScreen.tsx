import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { BrandColors, Typography } from '@/constants/theme';

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>School App</Text>
      <ActivityIndicator size="large" color={BrandColors.accent} style={styles.spinner} />
      <Text style={styles.subtitle}>Preparing your experience...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrandColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: Typography.h2,
    fontWeight: Typography.bold,
    color: BrandColors.white,
    marginBottom: 20,
  },
  spinner: {
    marginVertical: 10,
  },
  subtitle: {
    marginTop: 15,
    color: '#ccc',
    fontSize: Typography.body,
  },
});
