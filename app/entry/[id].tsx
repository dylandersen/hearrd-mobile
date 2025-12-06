import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { BlurView } from 'expo-blur';
import { ArrowLeft, Trash2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import AnimatedGradientBackground from '@/components/AnimatedGradientBackground';
import Colors from '@/constants/colors';
import { useJournal } from '@/contexts/JournalContext';

export default function EntryDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { getEntryById, deleteEntry } = useJournal();

  const entry = getEntryById(id as string);

  if (!entry) {
    return (
      <AnimatedGradientBackground>
        <View style={styles.container}>
          <Text style={styles.errorText}>Entry not found</Text>
        </View>
      </AnimatedGradientBackground>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this entry? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteEntry(entry.id);
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.back();
          },
        },
      ]
    );
  };

  const CardWrapper = Platform.OS === 'web' ? View : BlurView;

  return (
    <AnimatedGradientBackground>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={Colors.text.dark} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
          >
            <Trash2 size={24} color={Colors.primary.rose} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
          <View style={styles.moodSection}>
            <Text style={styles.emoji}>{entry.analysis.emoji}</Text>
            <Text style={styles.mood}>{entry.analysis.mood}</Text>
            <Text style={styles.date}>
              {new Date(entry.timestamp).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
            <Text style={styles.time}>
              {new Date(entry.timestamp).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              })}
            </Text>
          </View>

          <CardWrapper intensity={40} style={styles.transcriptCard} tint="light">
            <Text style={styles.transcriptLabel}>Your Reflection</Text>
            <Text style={styles.transcript}>{entry.transcript}</Text>
          </CardWrapper>

          <CardWrapper intensity={40} style={styles.analysisCard} tint="light">
            <Text style={styles.analysisLabel}>AI Reflection</Text>
            <Text style={styles.reflection}>{entry.analysis.reflection}</Text>
          </CardWrapper>

          {entry.analysis.themes.length > 0 && (
            <CardWrapper intensity={40} style={styles.themesCard} tint="light">
              <Text style={styles.themesLabel}>Key Themes</Text>
              <View style={styles.themesList}>
                {entry.analysis.themes.map((theme, index) => (
                  <View key={index} style={styles.themeChip}>
                    <Text style={styles.themeText}>{theme}</Text>
                  </View>
                ))}
              </View>
            </CardWrapper>
          )}

          {entry.analysis.keyMoments.wins.length > 0 && (
            <CardWrapper intensity={40} style={styles.momentsCard} tint="light">
              <Text style={styles.momentsLabel}>Wins</Text>
              {entry.analysis.keyMoments.wins.map((win, index) => (
                <Text key={index} style={styles.momentText}>• {win}</Text>
              ))}
            </CardWrapper>
          )}

          {entry.analysis.keyMoments.goals.length > 0 && (
            <CardWrapper intensity={40} style={styles.momentsCard} tint="light">
              <Text style={styles.momentsLabel}>Goals</Text>
              {entry.analysis.keyMoments.goals.map((goal, index) => (
                <Text key={index} style={styles.momentText}>• {goal}</Text>
              ))}
            </CardWrapper>
          )}
        </ScrollView>
      </View>
    </AnimatedGradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  backButton: {
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
  deleteButton: {
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
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 16,
  },
  moodSection: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  emoji: {
    fontSize: 64,
  },
  mood: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.primary.rose,
  },
  date: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text.dark,
  },
  time: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: Colors.text.light,
  },
  transcriptCard: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: Colors.surface.whiteBlur,
    borderWidth: 1,
    borderColor: 'rgba(251, 113, 133, 0.2)',
    gap: 12,
  },
  transcriptLabel: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.text.dark,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  transcript: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: Colors.text.primary,
    lineHeight: 24,
  },
  analysisCard: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(251, 113, 133, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(251, 113, 133, 0.3)',
    gap: 12,
  },
  analysisLabel: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.primary.rose,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  reflection: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: Colors.text.dark,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  themesCard: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: Colors.surface.whiteBlur,
    borderWidth: 1,
    borderColor: 'rgba(251, 113, 133, 0.2)',
    gap: 12,
  },
  themesLabel: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.text.dark,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  themesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  themeChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: Colors.primary.rose,
  },
  themeText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.surface.white,
  },
  momentsCard: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: Colors.surface.whiteBlur,
    borderWidth: 1,
    borderColor: 'rgba(251, 113, 133, 0.2)',
    gap: 12,
  },
  momentsLabel: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.text.dark,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  momentText: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: Colors.text.primary,
    lineHeight: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text.dark,
    textAlign: 'center',
    marginTop: 100,
  },
});
