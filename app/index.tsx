import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import AnimatedGradientBackground from '@/components/AnimatedGradientBackground';

export default function Index() {
  const auth = useAuth();
  const router = useRouter();
  
  // Safely destructure with defaults
  const user = auth?.user ?? null;
  const isLoading = auth?.isLoading ?? true;

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        if (user.hasCompletedOnboarding) {
          router.replace('/home');
        } else {
          router.replace('/onboarding');
        }
      } else {
        router.replace('/landing');
      }
    }
  }, [user, isLoading, router]);

  return (
    <AnimatedGradientBackground>
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FB7185" />
      </View>
    </AnimatedGradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
