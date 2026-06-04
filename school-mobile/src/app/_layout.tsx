import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { useContext } from 'react';
import { useColorScheme, Text, Pressable, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { AuthProvider, AuthContext } from '../contexts/AuthContext';

function PushStatusBanner() {
  const { user, pushRegistered, initializing, retryPushRegistration } = useContext(AuthContext);

  if (initializing || !user) {
    return null;
  }

  const handleRetry = async () => {
    const success = await retryPushRegistration();
    Toast.show({
      type: success ? 'success' : 'error',
      text1: success ? 'Push enabled' : 'Push unavailable',
      text2: success ? 'Notifications are now active.' : 'Please enable push permissions in device settings.',
    });
  };

  return (
    <Pressable
      onPress={!pushRegistered ? handleRetry : undefined}
      style={[styles.banner, pushRegistered ? styles.bannerActive : styles.bannerInactive]}
    >
      <Text style={styles.bannerText}>
        {pushRegistered ? 'Push notifications enabled' : 'Tap to enable push notifications'}
      </Text>
      {!pushRegistered ? <Text style={styles.retryText}>Retry</Text> : null}
    </Pressable>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <AnimatedSplashOverlay />
        <PushStatusBanner />
        <AppTabs />
        <Toast />
      </AuthProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  banner: {
    width: '100%',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  bannerText: {
    color: '#fff',
    fontWeight: '600',
  },
  retryText: {
    color: '#fff',
    fontWeight: '700',
    textDecorationLine: 'underline',
    marginLeft: 10,
  },
  bannerActive: {
    backgroundColor: '#34C759',
  },
  bannerInactive: {
    backgroundColor: '#FF9500',
  },
});
