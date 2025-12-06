import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import AnimatedGradientBackground from '@/components/AnimatedGradientBackground';
import Button from '@/components/Button';
import Colors from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';

export default function SignIn() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (validate()) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await signIn(email, password);
      router.replace('/onboarding');
    } else {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const CardWrapper = Platform.OS === 'web' ? View : BlurView;

  return (
    <AnimatedGradientBackground>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
          <View style={styles.content}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue your journey</Text>

            <CardWrapper
              intensity={40}
              style={styles.card}
              tint="light"
            >
              <View style={styles.form}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={[styles.input, errors.email && styles.inputError]}
                    placeholder="you@example.com"
                    placeholderTextColor={Colors.text.light}
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (errors.email) setErrors({ ...errors, email: undefined });
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Password</Text>
                  <TextInput
                    style={[styles.input, errors.password && styles.inputError]}
                    placeholder="Enter your password"
                    placeholderTextColor={Colors.text.light}
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (errors.password) setErrors({ ...errors, password: undefined });
                    }}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                </View>

                <Button
                  title="Sign In"
                  onPress={handleSignIn}
                  style={styles.button}
                />
              </View>
            </CardWrapper>

            <Button
              title="Don't have an account? Sign Up"
              variant="ghost"
              onPress={() => router.push('/signup')}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AnimatedGradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  content: {
    gap: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: '800' as const,
    color: Colors.text.dark,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  card: {
    padding: 24,
    borderRadius: 24,
    backgroundColor: Colors.surface.whiteBlur,
    borderWidth: 1,
    borderColor: 'rgba(251, 113, 133, 0.2)',
    overflow: 'hidden',
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text.dark,
  },
  input: {
    backgroundColor: Colors.surface.white,
    borderWidth: 2,
    borderColor: 'rgba(251, 113, 133, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.text.dark,
  },
  inputError: {
    borderColor: Colors.primary.rose,
  },
  errorText: {
    fontSize: 12,
    color: Colors.primary.rose,
    marginTop: 4,
  },
  button: {
    marginTop: 12,
  },
});
