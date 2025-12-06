import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { ArrowLeft } from 'lucide-react-native';
import AnimatedGradientBackground from '@/components/AnimatedGradientBackground';
import Colors from '@/constants/colors';
import { useJournal } from '@/contexts/JournalContext';

export default function Journal() {
  const router = useRouter();
  const { entries } = useJournal();

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
          <Text style={styles.title}>Your Journal</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
          {entries.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No entries yet</Text>
              <Text style={styles.emptySubtext}>Start recording to see your reflections here</Text>
            </View>
          ) : (
            entries.map((entry) => (
              <TouchableOpacity
                key={entry.id}
                onPress={() => router.push(`/entry/${entry.id}`)}
                activeOpacity={0.8}
              >
                <CardWrapper intensity={40} style={styles.entryCard} tint="light">
                  <View style={styles.entryHeader}>
                    <Text style={styles.entryEmoji}>{entry.analysis.emoji}</Text>
                    <View style={styles.entryInfo}>
                      <Text style={styles.entryMood}>{entry.analysis.mood}</Text>
                      <Text style={styles.entryDate}>
                        {new Date(entry.timestamp).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.entryText} numberOfLines={3}>
                    {entry.transcript}
                  </Text>
                </CardWrapper>
              </TouchableOpacity>
            ))
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
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text.dark,
  },
  placeholder: {
    width: 48,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 12,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    gap: 12,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: Colors.text.dark,
  },
  emptySubtext: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: Colors.text.light,
    textAlign: 'center',
  },
  entryCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: Colors.surface.whiteBlur,
    borderWidth: 1,
    borderColor: 'rgba(251, 113, 133, 0.2)',
    gap: 12,
    marginBottom: 12,
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  entryEmoji: {
    fontSize: 40,
  },
  entryInfo: {
    flex: 1,
  },
  entryMood: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.primary.rose,
  },
  entryDate: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: Colors.text.light,
  },
  entryText: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: Colors.text.primary,
    lineHeight: 20,
  },
});
