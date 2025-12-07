import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthContext } from "@/contexts/AuthContext";
import { JournalContext } from "@/contexts/JournalContext";

// Prevent the splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false, headerBackTitle: "Back" }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="landing" />
      <Stack.Screen name="signin" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="home" />
      <Stack.Screen name="record" options={{ presentation: "modal" }} />
      <Stack.Screen name="journal" />
      <Stack.Screen name="entry/[id]" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

const RootLayout: React.FC = () => {
  useEffect(() => {
    const prepare = async () => {
      try {
        // Wait for fonts or other resources if needed
        await SplashScreen.hideAsync();
      } catch (e) {
        console.warn(e);
      }
    };
    prepare();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext>
        <JournalContext>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <RootLayoutNav />
          </GestureHandlerRootView>
        </JournalContext>
      </AuthContext>
    </QueryClientProvider>
  );
};

export default RootLayout;