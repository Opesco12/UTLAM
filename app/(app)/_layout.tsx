import { Stack } from "expo-router";

const AppLayout = () => {
  return <Stack screenOptions={{ headerShown: false, animation: "ios" }} />;
};

export default AppLayout;
