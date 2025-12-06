import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Flame, Book, Sun, Moon } from 'lucide-react-native';
import AnimatedGradientBackground from '@/components/AnimatedGradientBackground';
import Button from '@/components/Button';
import Colors from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { useJournal } from '@/contexts/JournalContext';

const AFFIRMATIONS = ['amazing', 'doing great', 'enough', 'worthy', 'strong', 'capable'];

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const { entries, getStreakDays, getTodayEntries } = useJournal();
  
  const firstName = user?.firstName || 'friend';
  const affirmation = AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)];
  const streak = getStreakDays();
  const todayEntries = getTodayEntries();

  const now = new Date();
  const currentHour = now.getHours();
  const isMorning = currentHour >= 0 && currentHour < 14;
  const hasCompletedMorning = todayEntries.some(e => new Date(e.timestamp).getHours() < 14);
  const hasCompletedEvening = todayEntries.some(e => new Date(e.timestamp).getHours() >= 14);

  const CardWrapper = Platform.OS === 'web' ? View : BlurView;

  return (
    <AnimatedGradientBackground>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hey {firstName},</Text>
            <Text style={styles.affirmation}>you&apos;re {affirmation}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/journal')}>
            <View style={styles.iconButton}>
              <Book size={24} color={Colors.primary.rose} />
            </View>
          </TouchableOpacity>
        </View>

        {streak > 0 && (
          <CardWrapper intensity={40} style={styles.streakCard} tint="light">
            <Flame size={32} color={Colors.primary.orange} fill={Colors.primary.orange} />
            <View style={styles.streakContent}>
              <Text style={styles.streakNumber}>{streak}</Text>
              <Text style={styles.streakText}>day streak</Text>
            </View>
          </CardWrapper>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today&apos;s Reflections</Text>
          <View style={styles.reflectionCards}>
            <TouchableOpacity
              style={styles.reflectionCard}
              onPress={() => {
                if (isMorning && !hasCompletedMorning) {
                  router.push('/record');
                }
              }}
              activeOpacity={0.8}
              disabled={!isMorning || hasCompletedMorning}
            >
              <CardWrapper
                intensity={40}
                style={[
                  styles.reflectionCardInner,
                  (!isMorning || hasCompletedMorning) && styles.reflectionCardDisabled,
                ]}
                tint="light"
              >
                <Sun size={28} color={hasCompletedMorning ? Colors.primary.amber : Colors.text.light} />
                <Text style={styles.reflectionCardTitle}>Morning Intention</Text>
                <Text style={styles.reflectionCardTime}>12:01 AM - 1:59 PM</Text>
                {hasCompletedMorning && <Text style={styles.checkmark}>✓</Text>}
              </CardWrapper>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.reflectionCard}
              onPress={() => {
                if (!isMorning && !hasCompletedEvening) {
                  router.push('/record');
                }
              }}
              activeOpacity={0.8}
              disabled={isMorning || hasCompletedEvening}
            >
              <CardWrapper
                intensity={40}
                style={[
                  styles.reflectionCardInner,
                  (isMorning || hasCompletedEvening) && styles.reflectionCardDisabled,
                ]}
                tint="light"
              >
                <Moon size={28} color={hasCompletedEvening ? Colors.primary.indigo : Colors.text.light} />
                <Text style={styles.reflectionCardTitle}>Evening Reflection</Text>
                <Text style={styles.reflectionCardTime}>2:00 PM - 11:59 PM</Text>
                {hasCompletedEvening && <Text style={styles.checkmark}>✓</Text>}
              </CardWrapper>
            </TouchableOpacity>
          </View>
        </View>

        {entries.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Highlights</Text>
              <TouchableOpacity onPress={() => router.push('/journal')}>
                <Text style={styles.viewAll}>View All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.highlightsList}>
              {entries.slice(0, 3).map((entry) => (
                <TouchableOpacity
                  key={entry.id}
                  onPress={() => router.push(`/entry/${entry.id}`)}
                  activeOpacity={0.8}
                >
                  <CardWrapper intensity={40} style={styles.highlightCard} tint="light">
                    <Text style={styles.highlightEmoji}>{entry.analysis.emoji}</Text>
                    <View style={styles.highlightContent}>
                      <Text style={styles.highlightMood}>{entry.analysis.mood}</Text>
                      <Text style={styles.highlightText} numberOfLines={2}>
                        {entry.transcript}
                      </Text>
                      <Text style={styles.highlightTime}>
                        {new Date(entry.timestamp).toLocaleDateString()}
                      </Text>
                    </View>
                  </CardWrapper>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={styles.actions}>
          <Button
            title="Start Reflecting"
            onPress={() => router.push('/record')}
            style={styles.recordButton}
          />
        </View>
      </ScrollView>
    </AnimatedGradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingTop: 60,
    gap: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text.dark,
  },
  affirmation: {
    fontSize: 18,
    fontWeight: '400' as const,
    color: Colors.text.primary,
    fontStyle: 'italic',
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surface.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary.rose,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 20,
    borderRadius: 20,
    backgroundColor: Colors.surface.whiteBlur,
    borderWidth: 1,
    borderColor: 'rgba(251, 147, 60, 0.3)',
  },
  streakContent: {
    flex: 1,
  },
  streakNumber: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: Colors.text.dark,
  },
  streakText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text.primary,
  },
  section: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text.dark,
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary.rose,
  },
  reflectionCards: {
    flexDirection: 'row',
    gap: 12,
  },
  reflectionCard: {
    flex: 1,
  },
  reflectionCardInner: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: Colors.surface.whiteBlur,
    borderWidth: 2,
    borderColor: 'rgba(251, 113, 133, 0.2)',
    alignItems: 'center',
    gap: 8,
    minHeight: 160,
  },
  reflectionCardDisabled: {
    opacity: 0.5,
  },
  reflectionCardTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text.dark,
    textAlign: 'center',
  },
  reflectionCardTime: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: Colors.text.light,
    textAlign: 'center',
  },
  checkmark: {
    fontSize: 32,
    color: Colors.primary.rose,
    position: 'absolute',
    top: 12,
    right: 12,
  },
  highlightsList: {
    gap: 12,
  },
  highlightCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    backgroundColor: Colors.surface.whiteBlur,
    borderWidth: 1,
    borderColor: 'rgba(251, 113, 133, 0.2)',
    gap: 12,
    alignItems: 'flex-start',
  },
  highlightEmoji: {
    fontSize: 32,
  },
  highlightContent: {
    flex: 1,
    gap: 4,
  },
  highlightMood: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.primary.rose,
  },
  highlightText: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: Colors.text.primary,
    lineHeight: 20,
  },
  highlightTime: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: Colors.text.light,
  },
  actions: {
    marginTop: 16,
  },
  recordButton: {
    flexDirection: 'row',
    gap: 8,
  },
});
