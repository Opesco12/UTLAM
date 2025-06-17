import axios from "axios";
import { endpoints } from "./endpoints";
import {
  clearUserData,
  retrieveUserData,
  storeUserData,
} from "../storage/userData";
import { router } from "expo-router";
import { toast } from "sonner-native";

const BASE_URL = "https://xfundclientapi.utlam.com:1008/api/v1";

const getAuthToken = async () => {
  const data = await retrieveUserData();
  return data?.token;
};

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

let isHandling401 = false;
let hasRedirectedToLogin = false;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { requiresAuth } = error.config || {};
    if (
      error.response?.status === 401 &&
      requiresAuth &&
      !isHandling401 &&
      !hasRedirectedToLogin
    ) {
      isHandling401 = true;
      try {
        const token = await getAuthToken();
        if (!token) {
          return Promise.reject(error);
        }
        toast.error("Your session expired. Please log in again.", {
          id: "session-expired",
        });
        await clearUserData();
        hasRedirectedToLogin = true;
        router.replace("/(auth)/login");
      } catch (err) {
        console.error("Error handling 401:", err);
      } finally {
        isHandling401 = false;
      }
    }
    return Promise.reject(error);
  }
);

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
      requiresAuth,
      ...customConfig,
    };

    if (data) {
      config.data = data;
    }

    if (requiresAuth) {
      const token = await getAuthToken();
      if (!token) {
        return router.replace("/(auth)/login");
      }
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await axiosInstance(config);
    return response.data;
  } catch (error) {
    if (error.response?.status !== 401 || !requiresAuth) {
      console.log("error response: ", error);
      console.error("API call error:", error);
      throw error;
    }
    return undefined;
  }
};

export const getCountries = async () => {
  try {
    const data = await apiCall({
      endpoint: endpoints.getCountries,
      method: "GET",
      requiresAuth: false,
    });
    return data;
  } catch (error) {
    console.log(error);
    toast.error("Unable to fetch countries");
  }
};

export const registerNewIndividual = async (info) => {
  try {
    const data = await apiCall({
      method: "POST",
      endpoint: endpoints.RegisterNewIndividual,
      data: info,
      requiresAuth: false,
    });
    return data;
  } catch (error) {
    console.log(error);
    if (error.response?.status === 400) {
      toast.error(
        `Email address ${info?.email} or phone number has been used or is not available`
      );
    } else {
      toast.error("Please try again later");
    }
  }
};

export const registerExistingIndividual = async (info) => {
  try {
    const data = await apiCall({
      method: "POST",
      endpoint: endpoints.RegisterExistingIndividual,
      data: info,
      requiresAuth: false,
    });
    return data;
  } catch (error) {
    if (error.response?.status === 400) {
      toast.error("Invalid Details or account already exists");
    } else {
      toast.error("An error occurred");
    }
  }
};

export const getClientInfo = async () => {
  try {
    const data = await apiCall({
      endpoint: endpoints.getClientInfo,
      method: "GET",
    });
    return data;
  } catch (error) {
    if (error.response?.status !== 401) {
      console.log(error);
      toast.error("An error occurred");
    }
  }
};

export const getNextOfKins = async () => {
  try {
    const data = await apiCall({
      endpoint: endpoints.getNextOfKins,
      method: "GET",
    });
    return data;
  } catch (error) {
    if (error.response?.status !== 401) {
      console.log(error);
      toast.error("An error occurred");
    }
  }
};

export const createNextOfKin = async (info) => {
  try {
    const data = await apiCall({
      endpoint: endpoints.createNextOfKin,
      method: "POST",
      data: info,
    });
    return data;
  } catch (error) {
    if (error.response?.status !== 401) {
      console.log(error);
      toast.error("An error occurred");
    }
  }
};

export const login = async (username, password) => {
  try {
    const data = await apiCall({
      endpoint: endpoints.Login,
      method: "POST",
      requiresAuth: false,
      data: { username: username, password: password },
    });
    return data;
  } catch (error) {
    console.log(error);
    if (error.response?.status === 400) {
      toast.error("Incorrect Email or Password");
    } else {
      toast.error("Please try again later");
    }
  }
};

export const login2fa = async (info) => {
  try {
    const data = await apiCall({
      endpoint: endpoints.Login2Fa,
      method: "POST",
      data: info,
      requiresAuth: false,
    });
    await storeUserData(data);
    return data;
  } catch (error) {
    console.log(error);
    if (error.response?.status === 400) {
      toast.error("Incorrect Security Code");
    } else {
      toast.error("Please try again later");
    }
  }
};

export const activateAccount = async (info) => {
  try {
    const data = await apiCall({
      endpoint: endpoints.ActivateAccount,
      method: "POST",
      data: info,
      requiresAuth: false,
    });
    return data;
  } catch (error) {
    console.log(error);
    if (error.response?.status === 400) {
      toast.error("Incorrect Security Code");
    } else {
      toast.error("Please try again later");
    }
  }
};

export const resnedActivationCode = async (info) => {
  try {
    const data = await apiCall({
      endpoint: endpoints.ResendActivationCode,
      method: "POST",
      data: info,
      requiresAuth: false,
    });
    return data;
  } catch (error) {
    console.log(error);
    if (error.response?.status === 400) {
      toast.error("Incorrect Security Code");
    } else {
      toast.error("An error occurred");
    }
  }
};

export const logout = async (token) => {
  try {
    const data = await apiCall({
      method: "POST",
      endpoint: endpoints.Logout,
      data: { token: token },
    });
    return data;
  } catch (error) {
    if (error.response?.status !== 401) {
      console.log(error);
      toast.error("An error occurred during logout");
    }
  }
};

export const changePassword = async (oldPassword, newPassword) => {
  try {
    const data = await apiCall({
      endpoint: endpoints.ChangePassword,
      method: "POST",
      data: { oldPassword: oldPassword, newPassword: newPassword },
    });
    return data;
  } catch (error) {
    if (error.response?.status !== 401) {
      console.log(error);
      toast.error(
        error.response?.status === 400
          ? "Incorrect Password"
          : "An error occurred"
      );
    }
  }
};

export const resetPasswordRequest = async (email) => {
  try {
    const data = await apiCall({
      endpoint: endpoints.ResetPasswordRequest,
      method: "POST",
      data: { username: email, emailAddress: email },
      requiresAuth: false,
    });
    return data;
  } catch (error) {
    toast.error(
      error.response?.status === 400
        ? "Please input a registered email address"
        : "An error occurred"
    );
  }
};

export const resetPassword = async (token, password) => {
  try {
    const data = await apiCall({
      endpoint: endpoints.ResetPassword,
      method: "POST",
      data: { token: token, password: password },
      requiresAuth: false,
    });
    return data;
  } catch (error) {
    toast.error(
      error.response?.status === 400 ? "Incorrect token" : "An error occurred"
    );
  }
};

export const getWalletBalance = async () => {
  try {
    const data = await apiCall({
      endpoint: endpoints.getWalletBalance,
      method: "GET",
      requiresAuth: true,
    });
    return data;
  } catch (error) {
    if (error.response?.status !== 401) {
      console.log(error);
      toast.error("An error occurred");
    }
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
    if (error.response?.status !== 401) {
      console.log(error);
      toast.error("An error occurred");
    }
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
    if (error.response?.status !== 401) {
      toast.error("An error occurred");
    }
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
    if (error.response?.status !== 401) {
      toast.error("An error occurred");
    }
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
    if (error.response?.status !== 401) {
      toast.error("An error occurred");
    }
  }
};

export const getMutualFundOnlineBalance = async (portfolioId) => {
  try {
    const data = await apiCall({
      endpoint: `${endpoints.getMutualFundOnlineBalance}/${portfolioId}`,
      method: "GET",
    });
    return data;
  } catch (error) {
    if (error.response?.status !== 401) {
      console.log(error);
      toast.error("An error occurred");
    }
  }
};

export const getMutualFundStatement = async (portfolioId) => {
  try {
    const date = new Date().toISOString();
    const data = await apiCall({
      endpoint: `${endpoints.getMutualFundStatement}/${portfolioId}/${date}`,
      method: "GET",
    });
    return data;
  } catch (error) {
    if (error.response?.status !== 401) {
      console.log(error);
      toast.error("An error occurred");
    }
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
    if (error.response?.status !== 401) {
      toast.error("An error occurred");
    }
  }
};

export const mutualFundSubscription = async ({ portfolioId, amount }) => {
  try {
    const data = await apiCall({
      endpoint: endpoints.mutualFundNoAccount,
      method: "POST",
      data: {
        portfolioId: portfolioId,
        amount: amount,
      },
    });
    console.log("The request gave back: ", data);
    return data;
  } catch (error) {
    if (error.response?.status !== 401) {
      toast.error("An error occurred");
    }
  }
};

export const mutualfundRedemption = async (accountNo, amount) => {
  try {
    console.log("account number is:", accountNo);
    console.log("amount is: ", amount);
    const data = await apiCall({
      endpoint: endpoints.mutualfundRedemption,
      method: "POST",
      data: {
        mutualfundAccountNo: accountNo,
        amount: amount,
      },
    });
    return data;
  } catch (error) {
    if (error.response?.status !== 401) {
      console.log(error);
      toast.error("An error occurred");
    }
  }
};

export const getFixedIcomeOnlineBalances = async (portfolioId) => {
  try {
    const data = await apiCall({
      endpoint: `${endpoints.getFixedIncomeBalances}/${portfolioId}`,
      method: "GET",
    });
    return data;
  } catch (error) {
    if (error.response?.status !== 401) {
      console.log(error);
      toast.error("An error occurred");
    }
  }
};

export const getLiabilityProducts = async (portfolioId) => {
  try {
    const data = await apiCall({
      endpoint: `${endpoints.getLiabilityProducts}/${portfolioId}`,
      method: "GET",
    });
    return data;
  } catch (error) {
    if (error.response?.status !== 401) {
      console.log(error);
      toast.error("An error occurred");
    }
  }
};

export const getTenor = async (productId) => {
  try {
    const data = await apiCall({
      endpoint: `${endpoints.getProductTenor}/${productId}`,
      method: "GET",
    });
    return data;
  } catch (error) {
    if (error.response?.status !== 401) {
      console.log(error);
      toast.error("An error occurred");
    }
  }
};

export const fixedIncomeSubscriptionOrder = async ({
  securityProductId,
  portfolioId,
  currency,
  faceValue,
  tenor,
}) => {
  try {
    const data = await apiCall({
      endpoint: endpoints.fixedIncomeSubscription,
      method: "POST",
      data: {
        securityProductId: securityProductId,
        portfolioId: portfolioId,
        currency: currency,
        faceValue: faceValue,
        tenor: tenor,
      },
    });
    return data;
  } catch (error) {
    if (error.response?.status !== 401) {
      console.log(error);
      toast.error("An error occurred while processing fund redemption");
    }
  }
};

export const fixedIncomeRedemptionOrder = async (referenceNo, amount) => {
  try {
    const data = await apiCall({
      endpoint: endpoints.fixedIncomeRedemption,
      method: "POST",
      data: {
        purchaseReferenceNo: referenceNo,
        faceValue: amount,
      },
    });
    return data;
  } catch (error) {
    if (error.response?.status !== 401) {
      console.log(error);
      toast.error("An error occurred while processing fund redemption");
    }
  }
};

export const hasTransactionPin = async () => {
  try {
    const data = await apiCall({
      endpoint: endpoints.hasTransactionPin,
      method: "GET",
    });
    return data;
  } catch (error) {
    if (error.response?.status !== 401) {
      toast.error("An error occurred");
    }
  }
};

export const createTransactionPin = async (requestData) => {
  try {
    const data = await apiCall({
      endpoint: endpoints.createPin,
      method: "POST",
      data: requestData,
    });
    return data;
  } catch (error) {
    if (error.response?.status !== 401) {
      toast.error("An error occurred");
    }
  }
};

export const changeTransactionPin = async (requestData) => {
  try {
    console.log("From endpoints: ", requestData);
    const data = await apiCall({
      endpoint: endpoints.changePin,
      method: "POST",
      data: requestData,
    });
    return data;
  } catch (error) {
    if (error.response?.status !== 401) {
      toast.error("An error occurred");
    }
  }
};

export const resetTransactionPinRequest = async (username) => {
  try {
    const data = await apiCall({
      endpoint: `${endpoints.resetPinRequest}?username=${username}`,
      method: "POST",
    });
    return data;
  } catch (error) {
    if (error.response?.status !== 401) {
      toast.error("An error occurred");
    }
  }
};

export const resetTransactionPin = async (requestData) => {
  try {
    const data = await apiCall({
      endpoint: endpoints.resetPin,
      method: "POST",
      data: requestData,
    });
    return data;
  } catch (error) {
    if (error.response?.status !== 401) {
      toast.error("An error occurred");
    }
  }
};

export const sendMessageToClientManager = async (message) => {
  try {
    const data = await apiCall({
      endpoint: endpoints.sendMessageToClientManager,
      method: "POST",
      data: { message: message },
    });
    return data;
  } catch (error) {
    if (error.response?.status !== 401) {
      toast.error("An error occurred");
    }
    return null;
  }
};

export const updateClientInfo = async (info) => {
  try {
    const data = await apiCall({
      endpoint: endpoints.UpdateClientInfo,
      method: "POST",
      data: info,
    });
    return data;
  } catch (error) {
    if (error.response?.status !== 401) {
      console.error(error.message);
      toast.error("An error occurred");
    }
  }
};

export const getBanks = async () => {
  try {
    const data = await apiCall({
      endpoint: endpoints.getBanks,
      method: "GET",
    });
    return data;
  } catch (error) {
    if (error.response?.status !== 401) {
      toast.error("An error occurred");
    }
  }
};

export const createClientBank = async (requestData) => {
  try {
    const data = await apiCall({
      endpoint: endpoints.createBank,
      method: "POST",
      data: requestData,
    });
    return data;
  } catch (error) {
    if (error.response?.status !== 401) {
      toast.error(error?.response?.data?.Message || "An error occurred");
    }
  }
};

export const getClientBankAccounts = async () => {
  try {
    const data = await apiCall({
      endpoint: endpoints.getClientBanks,
      method: "GET",
    });
    return data;
  } catch (error) {
    if (error.response?.status !== 401) {
      toast.error("Unable to fetch client bank accounts");
    }
  }
};

export const debitWallet = async (requestData) => {
  try {
    const data = await apiCall({
      endpoint: endpoints.withdraw,
      method: "POST",
      data: requestData,
    });
    return data;
  } catch (error) {
    if (error.response?.status !== 401) {
      if (error.response?.status === 400) {
        toast.error("Incorrect pin");
      } else {
        toast.error("An error occurred while processing fund withdrawal");
      }
    }
  }
};

export const getPendingWithdrawals = async () => {
  try {
    const data = await apiCall({
      endpoint: endpoints.getPendingWithdrawals,
      method: "GET",
    });
    return data;
  } catch (error) {
    if (error.response?.status !== 401) {
      toast.error("An error occurred");
    }
  }
};

export const getPendingDocuments = async () => {
  try {
    const data = await apiCall({
      endpoint: endpoints.getPendingDocuments,
      method: "GET",
    });
    return data;
  } catch (error) {
    if (error.response?.status !== 401) {
      toast.error("An error occurred while fetching photo");
    }
  }
};

export const uploadClientDocument = async (file, documentId, comment) => {
  try {
    const formData = new FormData();
    formData.append("Files", file);
    formData.append("DocumentId", documentId);
    if (comment) {
      formData.append("Comment", comment);
    }

    const token = await getAuthToken();
    const response = await axios.post(
      `${BASE_URL}/${endpoints.uploadClientDocument}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        requiresAuth: true, // Add for consistency with interceptor
      }
    );
    toast.success("Document uploaded successfully");
    return response.data;
  } catch (error) {
    if (error.response?.status !== 401) {
      console.log(error.message);
      toast.error("Document upload failed");
    }
    throw error;
  }
};

export const fetchClientPhoto = async () => {
  try {
    const data = await apiCall({
      endpoint: endpoints.getClientPhoto,
      method: "GET",
    });
    return data;
  } catch (error) {
    if (error.response?.status !== 401) {
      console.error(error);
      toast.error("An error occurred while fetching photo");
    }
  }
};

export const uploadImage = async (file) => {
  try {
    let base64String = file.base64;
    if (base64String.length > 1000000) {
      base64String = base64String.substring(0, base64String.length / 2);
    }

    const requestBody = {
      base64: file?.base64,
      filename: file?.fileName || `image_${Date.now()}.jpg`,
    };

    const token = await getAuthToken();
    const response = await fetch(`${BASE_URL}/${endpoints.uploadClientPhoto}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Upload failed:", errorText);
      throw new Error(`Upload failed: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    if (error.response?.status !== 401) {
      console.error("Upload error:", error);
      toast.error("An error occurred");
    }
    throw error;
  }
};
