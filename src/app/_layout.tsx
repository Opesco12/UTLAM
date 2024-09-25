import "react-native-reanimated";
import { Platform } from "react-native";
import { useFonts } from "expo-font";
import { View, Text } from "react-native";
import { Stack, useSegments, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import FlashMessage from "react-native-flash-message";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  // initialRouteName: "(auth)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    IBMRegular: require("../../assets/fonts/IBMPlexSans-Regular.ttf"),
    IBMMedium: require("../../assets/fonts/IBMPlexSans-Medium.ttf"),
    IBMBold: require("../../assets/fonts/IBMPlexSans-Bold.ttf"),
    IBMSemibold: require("../../assets/fonts/IBMPlexSans-SemiBold.ttf"),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
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

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <>
      <Stack
        screenOptions={{ headerShown: false, animation: "ios" }}
        initialRouteName="/(auth)/login"
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
      <FlashMessage
        position="top"
        style={{
          paddingTop: Platform.OS === "android" && StatusBar.currentHeight,
        }}
      />
    </>
  );
}
