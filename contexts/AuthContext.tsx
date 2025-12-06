import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useEffect, useState } from 'react';
import type { User } from '@/constants/types';

export const [AuthContext, useAuth] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const newUser: User = {
      id: Date.now().toString(),
      email,
      firstName: '',
      lastName: '',
      hasCompletedOnboarding: false,
      onboardingGoals: [],
      attribution: '',
      ageRange: '',
      lifeStage: '',
      currentStruggles: [],
      createdAt: Date.now(),
    };
    await AsyncStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const signUp = async (email: string, password: string) => {
    const newUser: User = {
      id: Date.now().toString(),
      email,
      firstName: '',
      lastName: '',
      hasCompletedOnboarding: false,
      onboardingGoals: [],
      attribution: '',
      ageRange: '',
      lifeStage: '',
      currentStruggles: [],
      createdAt: Date.now(),
    };
    await AsyncStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateUser,
  };
});
