import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useEffect, useState } from 'react';
import type { JournalEntry } from '@/constants/types';

const STORAGE_KEY = 'journal_entries';

export const [JournalContext, useJournal] = createContextHook(() => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setEntries(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveEntries = async (newEntries: JournalEntry[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
      setEntries(newEntries);
    } catch (error) {
      console.error('Error saving entries:', error);
    }
  };

  const addEntry = async (entry: JournalEntry) => {
    const newEntries = [entry, ...entries];
    await saveEntries(newEntries);
  };

  const deleteEntry = async (id: string) => {
    const newEntries = entries.filter(e => e.id !== id);
    await saveEntries(newEntries);
  };

  const getEntryById = (id: string) => {
    return entries.find(e => e.id === id);
  };

  const getTodayEntries = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return entries.filter(e => new Date(e.timestamp) >= today);
  };

  const getStreakDays = () => {
    if (entries.length === 0) return 0;
    
    const sortedDates = entries
      .map(e => {
        const d = new Date(e.timestamp);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      })
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort((a, b) => b - a);

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let currentDate = today.getTime();

    for (const date of sortedDates) {
      if (date === currentDate) {
        streak++;
        currentDate -= 86400000;
      } else if (date === currentDate + 86400000) {
        continue;
      } else {
        break;
      }
    }

    return streak;
  };

  return {
    entries,
    isLoading,
    addEntry,
    deleteEntry,
    getEntryById,
    getTodayEntries,
    getStreakDays,
  };
});
