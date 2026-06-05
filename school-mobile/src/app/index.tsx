import { useContext, useEffect } from 'react';
import { Redirect } from 'expo-router';
import { AuthContext } from '@/contexts/AuthContext';
import HomeScreen from '@/components/HomeScreen';
import { View, ActivityIndicator } from 'react-native';
import { BrandColors } from '@/constants/theme';

export default function Index() {
  const { isSignedIn, initializing } = useContext(AuthContext);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: BrandColors.white }}>
        <ActivityIndicator size="large" color={BrandColors.accent} />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href="./login" />;
  }

  return <HomeScreen />;
}
