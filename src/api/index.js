import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { endpoints } from "./endpoints";
import keys from "../storage/keys";
import { retrieveUserData } from "../storage/userData";
import { showMessage } from "react-native-flash-message";
import { Redirect, router } from "expo-router";

const BASE_URL = "https://utl-proxy.vercel.app/api/v1";

const getAuthToken = async () => {
  const data = await retrieveUserData();
  return data?.token;
};

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

const apiCall = async ({
  endpoint,
  method = "GET",
  data = null,
  requiresAuth = true,
  customConfig = {},
} = {}) => {
  try {
    if (!endpoint) {
      throw new Error("Endpoint is required");
    }

    const config = {
      method,
      url: endpoint,
      headers: {
        "Content-Type": "application/json",
      },
      ...customConfig,
    };

    if (data) {
      config.data = data;
    }

    if (requiresAuth) {
      const token = await getAuthToken();
      if (!token) {
        throw new Error("Authentication required but no token found");
      }
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await axiosInstance(config);
    return response.data;
  } catch (error) {
    console.error("API call error:", error);
    console.log(typeof error.status);
    if (error.status === 401) {
      return router.replace("/");
    }
    throw error;
  }
};

// export const registerNewIndividual = async (data) => {
//   await apiRequest("post", endpoints.RegisterNewIndividual, data);
// };

// export const login = async () => {
//   await apiRequest("post", endpoints.Login, data);
// };

export const getWalletBalance = async () => {
  try {
    const data = await apiCall({
      endpoint: endpoints.getWalletBalance,
      method: "GET",
      requiresAuth: true,
    });
    return data;
  } catch (error) {
    console.log(error);
    showMessage({
      message: "Unable to fetch wallet balance",
      type: "warning",
    });
  }
};

export const getProducts = async () => {
  try {
    const data = await apiCall({
      endpoint: endpoints.getProducts,
      method: "GET",
      requiresAuth: true,
    });
    return data;
  } catch (error) {
    console.log(error);
    showMessage({
      message: "An error occured",
      type: "warning",
    });
  }
};

export const getVirtualAccounts = async () => {
  try {
    const data = await apiCall({
      endpoint: endpoints.getVirtualAccounts,
      method: "GET",
    });
    return data;
  } catch (error) {
    showMessage({
      message: "Unable to fetch virtual accounts",
      type: "warning",
    });
  }
};

export const getClientPortfolio = async () => {
  try {
    const data = await apiCall({
      endpoint: endpoints.getPortfolio,
      method: "GET",
    });
    return data;
  } catch (error) {
    showMessage({
      message: "Unable to fetch portfolio",
      type: "warning",
    });
  }
};

export const getMutualFundOnlineBalances = async () => {
  try {
    const data = await apiCall({
      endpoint: endpoints.getMutualFundOnlineBalances,
      method: "GET",
    });
    return data;
  } catch (error) {
    showMessage({
      message: "Unable to fetch data",
      type: "warning",
    });
  }
};

export const getTransactions = async (startdate, enddate) => {
  try {
    const data = await apiCall({
      endpoint: `${endpoints.getTransactions}/${startdate}/${enddate}`,
      method: "GET",
    });
    return data;
  } catch (error) {
    showMessage({
      message: "Unable to fetch transactions",
      type: "warning",
    });
  }
};

export const mutualFundSubscription = async ({
  accountNumber,
  portfolioId,
  amount,
}) => {
  if (accountNumber) {
  } else {
    try {
      const data = await apiCall({
        endpoint: endpoints.mutualFundNoAccount,
        method: "POST",
        data: {
          portfolioId: portfolioId,
          amount: amount,
        },
      });
      return data;
    } catch (error) {
      showMessage({
        message: "An error occured",
        type: "warning",
      });
    }
  }
};
