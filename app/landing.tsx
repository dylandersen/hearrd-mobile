import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Sparkles } from 'lucide-react-native';
import AnimatedGradientBackground from '@/components/AnimatedGradientBackground';
import Button from '@/components/Button';
import Colors from '@/constants/colors';

export default function Landing() {
  const router = useRouter();

  return (
    <AnimatedGradientBackground>
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <View style={styles.iconCircle}>
              <Sparkles size={48} color={Colors.primary.rose} strokeWidth={2.5} />
            </View>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Hearrd</Text>
            <Text style={styles.tagline}>A cozy voice journal for your{'\n'}thoughts, feelings, and moments</Text>

            {Platform.OS === 'web' ? (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Your Private Space to Reflect</Text>
                <Text style={styles.cardText}>
                  Express yourself freely with voice journaling.{'\n'}
                  AI helps you understand your patterns while{'\n'}
                  keeping everything completely private.
                </Text>
              </View>
            ) : (
              <BlurView intensity={40} style={styles.card} tint="light">
                <Text style={styles.cardTitle}>Your Private Space to Reflect</Text>
                <Text style={styles.cardText}>
                  Express yourself freely with voice journaling.{'\n'}
                  AI helps you understand your patterns while{'\n'}
                  keeping everything completely private.
                </Text>
              </BlurView>
            )}
          </View>

          <View style={styles.actions}>
            <Button
              title="Get Started"
              onPress={() => router.push('/signup')}
              style={styles.primaryButton}
            />
            <Button
              title="Sign In"
              variant="secondary"
              onPress={() => router.push('/signin')}
            />
          </View>
        </View>
      </ScrollView>
    </AnimatedGradientBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.surface.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary.rose,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  content: {
    alignItems: 'center',
    gap: 24,
  },
  title: {
    fontSize: 48,
    fontWeight: '800' as const,
    color: Colors.text.dark,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 18,
    fontWeight: '400' as const,
    color: Colors.text.primary,
    textAlign: 'center',
    lineHeight: 26,
  },
  card: {
    marginTop: 16,
    padding: 24,
    borderRadius: 24,
    backgroundColor: Colors.surface.whiteBlur,
    borderWidth: 1,
    borderColor: 'rgba(251, 113, 133, 0.2)',
    overflow: 'hidden',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text.dark,
    marginBottom: 12,
    textAlign: 'center',
  },
  cardText: {
    fontSize: 15,
    fontWeight: '400' as const,
    color: Colors.text.primary,
    textAlign: 'center',
    lineHeight: 22,
  },
  actions: {
    gap: 12,
    marginTop: 32,
  },
  primaryButton: {
    marginBottom: 0,
  },
});
