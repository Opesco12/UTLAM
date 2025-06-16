import "react-native-reanimated";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Toaster } from "sonner-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { OneSignal, LogLevel } from "react-native-onesignal";
import { PostHogProvider } from "posthog-react-native";

import { Colors } from "../constants/Colors";
import AuthProvider, { useAuth } from "@/context/authContext";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  // initialRouteName: "(auth)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    IBMRegular: require("../../assets/fonts/IBMPlexSans-Regular.ttf"),
    IBMMedium: require("../../assets/fonts/IBMPlexSans-Medium.ttf"),
    IBMBold: require("../../assets/fonts/IBMPlexSans-Bold.ttf"),
    IBMSemibold: require("../../assets/fonts/IBMPlexSans-SemiBold.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // useEffect(() => {
  //   // Enable verbose logging for debugging (remove in production)
  //   // OneSignal.Debug.setLogLevel(LogLevel.Verbose);
  //   OneSignal.initialize("c75039b5-eb9a-4161-8758-6bdf5e05d99a");
  //   OneSignal.Notifications.requestPermission(true);
  // }, []);

  if (!loaded) {
    return null;
  }

  return (
    <PostHogProvider
      apiKey="phc_Qi5RDCJvHzdDDldZwFC8gqLUUwZVpRMxCMrI05bSY0e"
      autocapture={true}
      options={{
        host: "https://us.i.posthog.com",
      }}
    >
      <AuthProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <RootLayoutNav />;
            <Toaster
              style={{ backgroundColor: Colors.white }}
              toastOptions={{ titleStyle: { color: Colors.black } }}
            />
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </AuthProvider>
    </PostHogProvider>
  );
}

function RootLayoutNav() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;
  return (
    <Stack screenOptions={{ headerShown: false, animation: "ios_from_right" }}>
      <Stack.Screen name="index" />
      {!isAuthenticated && <Stack.Screen name="(auth)" />}
      {isAuthenticated && <Stack.Screen name="(app)" />}
      {isAuthenticated && <Stack.Screen name="(tabs)" />}
    </Stack>
  );
}
