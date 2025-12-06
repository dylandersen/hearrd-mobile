import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import AnimatedGradientBackground from '@/components/AnimatedGradientBackground';
import Button from '@/components/Button';
import Colors from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { ONBOARDING_GOALS } from '@/constants/types';

export default function Onboarding() {
  const router = useRouter();
  const { updateUser } = useAuth();
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const toggleGoal = (goalId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (selectedGoals.includes(goalId)) {
      setSelectedGoals(selectedGoals.filter(id => id !== goalId));
    } else {
      setSelectedGoals([...selectedGoals, goalId]);
    }
  };

  const handleContinue = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await updateUser({
      hasCompletedOnboarding: true,
      onboardingGoals: selectedGoals,
    });
    router.replace('/home');
  };

  const CardWrapper = Platform.OS === 'web' ? View : BlurView;

  return (
    <AnimatedGradientBackground>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Welcome to Hearrd</Text>
            <Text style={styles.subtitle}>What brings you here today?</Text>
          </View>

          <View style={styles.goalsContainer}>
            {ONBOARDING_GOALS.map((goal) => {
              const isSelected = selectedGoals.includes(goal.id);
              return (
                <TouchableOpacity
                  key={goal.id}
                  onPress={() => toggleGoal(goal.id)}
                  activeOpacity={0.8}
                >
                  <CardWrapper
                    intensity={40}
                    style={[
                      styles.goalCard,
                      isSelected && styles.goalCardSelected,
                    ]}
                    tint="light"
                  >
                    <Text style={styles.goalEmoji}>{goal.emoji}</Text>
                    <Text style={[styles.goalTitle, isSelected && styles.goalTitleSelected]}>
                      {goal.title}
                    </Text>
                  </CardWrapper>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            title="Continue"
            onPress={handleContinue}
            disabled={selectedGoals.length === 0}
          />
          <Text style={styles.hint}>Select one or more goals</Text>
        </View>
      </View>
    </AnimatedGradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  content: {
    gap: 32,
  },
  header: {
    gap: 12,
  },
  title: {
    fontSize: 36,
    fontWeight: '800' as const,
    color: Colors.text.dark,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '400' as const,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  goalsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  goalCard: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: Colors.surface.whiteBlur,
    borderWidth: 2,
    borderColor: 'rgba(251, 113, 133, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  goalCardSelected: {
    borderColor: Colors.primary.rose,
    backgroundColor: 'rgba(251, 113, 133, 0.1)',
  },
  goalEmoji: {
    fontSize: 24,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text.primary,
  },
  goalTitleSelected: {
    color: Colors.primary.rose,
    fontWeight: '700' as const,
  },
  actions: {
    gap: 12,
  },
  hint: {
    fontSize: 14,
    color: Colors.text.light,
    textAlign: 'center',
  },
});
