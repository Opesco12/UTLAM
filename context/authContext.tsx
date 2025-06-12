import { router } from "expo-router";
import { createContext, useContext, useEffect, useState, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { toast } from "sonner-native";

import Keys from "@/src/storage/keys";

const AuthContext = createContext({});

const retrieveUserData = async () => {
  try {
    const storedData = await AsyncStorage.getItem(Keys.USER_DATA);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      console.log("User data successfully retrieved:", parsedData);
      return parsedData;
    } else {
      console.log("No data found in AsyncStorage");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving user data", error);
    return null;
  }
};

const clearUserData = async () => {
  try {
    await AsyncStorage.removeItem(Keys.USER_DATA);
    console.log("User data successfully cleared");
  } catch (error) {
    console.error("Error clearing user data", error);
  }
};

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRouterReady, setIsRouterReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const isHandlingLogout = useRef(false);
  const logoutPromise = useRef<Promise<unknown> | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await retrieveUserData();
        if (data && data.token) {
          setIsAuthenticated(true);
          setUserData(data);
        } else {
          setIsAuthenticated(false);
          setUserData(null);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setIsLoading(false);
        setIsRouterReady(true);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    if (isHandlingLogout.current) {
      return logoutPromise.current;
    }

    isHandlingLogout.current = true;
    logoutPromise.current = new Promise(async (resolve) => {
      try {
        toast.error("Your session expired. Please log in again.");
        await clearUserData();
        setIsAuthenticated(false);
        setUserData(null);
        router.replace("/(auth)/login");
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        isHandlingLogout.current = false;
        logoutPromise.current = null;
        resolve(null);
      }
    });

    return logoutPromise.current;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        setIsAuthenticated,
        handleLogout,
        isRouterReady,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;
