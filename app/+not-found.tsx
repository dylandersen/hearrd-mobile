import { View, Text, StyleSheet } from 'react-native';
import { Link, Stack } from 'expo-router';
import AnimatedGradientBackground from '@/components/AnimatedGradientBackground';
import Colors from '@/constants/colors';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <AnimatedGradientBackground>
        <View style={styles.container}>
          <Text style={styles.title}>404</Text>
          <Text style={styles.message}>This page doesn&apos;t exist</Text>
          <Link href="/" style={styles.link}>
            <Text style={styles.linkText}>Go back home</Text>
          </Link>
        </View>
      </AnimatedGradientBackground>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 16,
  },
  title: {
    fontSize: 72,
    fontWeight: '800' as const,
    color: Colors.primary.rose,
  },
  message: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: Colors.text.dark,
  },
  link: {
    marginTop: 16,
  },
  linkText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.primary.rose,
    textDecorationLine: 'underline',
  },
});
