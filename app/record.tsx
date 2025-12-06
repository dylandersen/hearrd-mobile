import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { ArrowLeft, Square } from 'lucide-react-native';
import AnimatedGradientBackground from '@/components/AnimatedGradientBackground';
import Colors from '@/constants/colors';
import { useJournal } from '@/contexts/JournalContext';
import type { JournalEntry } from '@/constants/types';

export default function Record() {
  const router = useRouter();
  const { addEntry } = useJournal();
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const waveformAnims = useRef(
    Array.from({ length: 14 }, () => new Animated.Value(0.3))
  ).current;

  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      waveformAnims.forEach((anim, index) => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: Math.random() * 0.7 + 0.3,
              duration: 200 + index * 80,
              useNativeDriver: false,
            }),
            Animated.timing(anim, {
              toValue: 0.3,
              duration: 200 + index * 80,
              useNativeDriver: false,
            }),
          ])
        ).start();
      });

      const timer = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isRecording, pulseAnim, waveformAnims]);

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Required', 'Microphone access is needed to record audio.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(newRecording);
      setIsRecording(true);
      setDuration(0);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      console.error('Failed to start recording', error);
      Alert.alert('Error', 'Failed to start recording. Please try again.');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      setIsRecording(false);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      setIsProcessing(true);

      const mockTranscript = "Today was a good day. I felt productive and accomplished many of my goals. I'm grateful for the support of my friends and family. Looking forward to tomorrow.";
      const mockAnalysis = {
        mood: 'Grateful',
        themes: ['productivity', 'gratitude', 'family'],
        emoji: '🙏',
        color: Colors.mood.grateful,
        reflection: "It's wonderful to see you acknowledging your accomplishments and expressing gratitude. This positive mindset can be a powerful force in your life.",
        keyMoments: {
          wins: ['Feeling productive', 'Accomplishing goals'],
          worries: [],
          goals: ['Looking forward to tomorrow'],
        },
      };

      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        transcript: mockTranscript,
        audioFileId: null,
        audioUrl: null,
        durationSeconds: duration,
        deviceType: 'mobile',
        analysis: mockAnalysis,
      };

      await addEntry(newEntry);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      setIsProcessing(false);
      router.replace('/home');
    } catch (error) {
      console.error('Failed to stop recording', error);
      setIsProcessing(false);
      Alert.alert('Error', 'Failed to process recording. Please try again.');
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatedGradientBackground>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={Colors.text.dark} />
        </TouchableOpacity>

        <View style={styles.content}>
          {isProcessing ? (
            <>
              <Text style={styles.processingText}>Listening carefully to{'\n'}what you shared...</Text>
              <View style={styles.processingIndicator} />
            </>
          ) : (
            <>
              <Text style={styles.timer}>{formatDuration(duration)}</Text>

              {isRecording && (
                <View style={styles.waveform}>
                  {waveformAnims.map((anim, index) => (
                    <Animated.View
                      key={index}
                      style={[
                        styles.waveformBar,
                        {
                          height: anim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [20, 80],
                          }),
                        },
                      ]}
                    />
                  ))}
                </View>
              )}

              {!isRecording && (
                <Text style={styles.instruction}>Tap to start reflecting</Text>
              )}
            </>
          )}
        </View>

        {!isProcessing && (
          <View style={styles.controls}>
            <TouchableOpacity
              onPress={isRecording ? stopRecording : startRecording}
              activeOpacity={0.8}
            >
              <Animated.View
                style={[
                  styles.recordButton,
                  isRecording && {
                    transform: [{ scale: pulseAnim }],
                  },
                ]}
              >
                {isRecording ? (
                  <Square size={32} color={Colors.surface.white} fill={Colors.surface.white} />
                ) : (
                  <View style={styles.micIcon} />
                )}
              </Animated.View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </AnimatedGradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingBottom: 60,
    paddingHorizontal: 24,
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
  },
  timer: {
    fontSize: 48,
    fontWeight: '700' as const,
    color: Colors.text.dark,
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 100,
  },
  waveformBar: {
    width: 6,
    backgroundColor: Colors.primary.rose,
    borderRadius: 3,
  },
  instruction: {
    fontSize: 18,
    fontWeight: '400' as const,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  processingText: {
    fontSize: 24,
    fontWeight: '600' as const,
    color: Colors.text.dark,
    textAlign: 'center',
    lineHeight: 32,
  },
  processingIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: Colors.primary.rose,
    borderTopColor: 'transparent',
  },
  controls: {
    alignItems: 'center',
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary.rose,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary.rose,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  micIcon: {
    width: 24,
    height: 32,
    backgroundColor: Colors.surface.white,
    borderRadius: 12,
  },
});
