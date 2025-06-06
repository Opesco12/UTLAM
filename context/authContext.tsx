import { router } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRouterReady, setIsRouterReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);

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

  //   const login = async (token) => {
  //     try {
  //       await AsyncStorage.setItem("authToken", token);
  //       setIsAuthenticated(true);
  //       if (isRouterReady) {
  //         router.replace("/(tabs)");
  //       }
  //     } catch (error) {
  //       console.error("Login error:", error);
  //     }
  //   };

  //   const logout = async () => {
  //     try {
  //       await AsyncStorage.removeItem("authToken");
  //       setIsAuthenticated(false);
  //       if (isRouterReady) {
  //         router.replace("/(auth)/login");
  //       }
  //     } catch (error) {
  //       console.error("Logout error:", error);
  //     }
  //   };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, setIsAuthenticated }}
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
