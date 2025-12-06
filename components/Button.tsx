import { Pressable, PressableProps, StyleSheet, Text, Animated, ViewStyle } from 'react-native';
import { useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  title: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  style?: ViewStyle;
}

export default function Button({ title, variant = 'primary', style, ...props }: ButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  if (variant === 'primary') {
    return (
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        {...props}
      >
        <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, styles.container, style]}>
          <LinearGradient
            colors={[Colors.primary.rose, Colors.primary.orange]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          >
            <Text style={styles.primaryText}>{title}</Text>
          </LinearGradient>
        </Animated.View>
      </Pressable>
    );
  }

  if (variant === 'secondary') {
    return (
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        {...props}
      >
        <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, styles.container, styles.secondary, style]}>
          <Text style={styles.secondaryText}>{title}</Text>
        </Animated.View>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...props}
    >
      <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
        <Text style={styles.ghostText}>{title}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  gradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondary: {
    backgroundColor: Colors.surface.white,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.primary.rose,
  },
  primaryText: {
    color: Colors.surface.white,
    fontSize: 16,
    fontWeight: '700' as const,
  },
  secondaryText: {
    color: Colors.primary.rose,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  ghostText: {
    color: Colors.text.primary,
    fontSize: 14,
    fontWeight: '600' as const,
  },
});
