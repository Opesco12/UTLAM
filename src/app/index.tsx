import { useAuth } from "@/context/authContext";
import { Redirect } from "expo-router";

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;

  return <Redirect href={isAuthenticated ? "/(tabs)" : "/(auth)/login"} />;
};

export default Index;
