import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import AnimatedGradientBackground from '@/components/AnimatedGradientBackground';
import Button from '@/components/Button';
import Colors from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';

export default function SignUp() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({});

  const validate = () => {
    const newErrors: { email?: string; password?: string; confirmPassword?: string } = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = 'Password must contain uppercase letter';
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = 'Password must contain a number';
    } else if (!/[!@#$%^&*]/.test(password)) {
      newErrors.password = 'Password must contain a symbol';
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (validate()) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await signUp(email, password);
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Start your journaling journey</Text>

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
                    placeholder="Create a strong password"
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

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Confirm Password</Text>
                  <TextInput
                    style={[styles.input, errors.confirmPassword && styles.inputError]}
                    placeholder="Re-enter your password"
                    placeholderTextColor={Colors.text.light}
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                    }}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
                </View>

                <Button
                  title="Sign Up"
                  onPress={handleSignUp}
                  style={styles.button}
                />
              </View>
            </CardWrapper>

            <Button
              title="Already have an account? Sign In"
              variant="ghost"
              onPress={() => router.push('/signin')}
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
