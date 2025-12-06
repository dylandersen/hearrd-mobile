import { useEffect, useRef, ReactNode } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';

interface AnimatedGradientBackgroundProps {
  children: ReactNode;
}

export default function AnimatedGradientBackground({ children }: AnimatedGradientBackgroundProps) {
  const colorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(colorAnim, {
          toValue: 1,
          duration: 45000,
          useNativeDriver: false,
        }),
        Animated.timing(colorAnim, {
          toValue: 0,
          duration: 45000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [colorAnim]);

  return (
    <>
      <LinearGradient
        colors={[Colors.backgrounds.indigo50, Colors.backgrounds.rose50]}
        style={StyleSheet.absoluteFill}
      />
      {children}
    </>
  );
}
