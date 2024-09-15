import { Stack } from "expo-router";

const AuthLayout = () => {
  return (
    <Stack
      screenOptions={{ headerShown: false, animation: "ios" }}
      initialRouteName="login"
    >
      <Stack.Screen name="login" />
    </Stack>
  );
};

export default AuthLayout;
