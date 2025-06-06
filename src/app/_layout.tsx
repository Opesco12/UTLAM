import "react-native-reanimated";
import { Platform, StatusBar } from "react-native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import FlashMessage from "react-native-flash-message";
import { Toaster } from "sonner-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
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

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <RootLayoutNav />;
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack
          screenOptions={{ headerShown: false, animation: "ios_from_right" }}
        >
          <Stack.Screen name="index" />
          {!isAuthenticated && <Stack.Screen name="(auth)" />}
          {isAuthenticated && <Stack.Screen name="(app)" />}
          {isAuthenticated && <Stack.Screen name="(tabs)" />}
        </Stack>
        <Toaster
          style={{ backgroundColor: Colors.white }}
          toastOptions={{ titleStyle: { color: Colors.black } }}
        />
        <FlashMessage position="top" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
