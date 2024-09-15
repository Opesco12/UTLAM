import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { endpoints } from "./endpoints";

const BASE_URL = "https://xfundtestapi.utlam.com:2939/api/v1";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000,
});

// Auth token will be stored in async storage so as to use it for protected routes
const getAuthToken = async () => {
  return await AsyncStorage.getItem("authToken");
};

const apiRequest = async (method, url, data = null, requiresAuth = false) => {
  try {
    const headers = {};
    if (requiresAuth) {
      const token = getAuthToken();
      if (token) {
        headers[`Authorization`] = `Bearer ${token}`;
      }
    }

    const response = await api({
      method,
      url,
      data,
      headers,
    });
    console.log("i got here");

    return response.data;
  } catch (error) {
    console.log(`API error (${method} ${url})`, error);
    console.log(error.response);
  }
};

export const registerNewIndividual = async (data) => {
  await apiRequest("post", endpoints.RegisterNewIndividual, data);
};

export const login = async () => {
  await apiRequest("post", endpoints.Login, data);
};

export const getCurrencies = async () => {
  // await apiRequest("get", endpoints.getCurrencies);

  // axios.get('https://xfundtestapi.utlam.com:2939/api/v1/getpasswordrules', {
  //   headers: {
  //     'accept': 'application/json', 'Content-Type': 'application/json'
  //   }
  // })
  // .then(response => {
  //   console.log(response.data);
  // })
  // .catch(error => {
  //   console.error('Error:', error);
  // });

  fetch('https://xfundtestapi.utlam.com:2939/api/v1/getcountries', {
    
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(res => console.log(res.data)).catch(err => {console.error(err); 
    console.log(err.message)})
};
