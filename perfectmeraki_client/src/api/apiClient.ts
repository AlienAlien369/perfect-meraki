import axios from "axios";
import Router from "next/router";
import store from "@/store/store";
import { signOut } from "@/store/slices/authSlice";
import { clearUser } from "@/store/slices/userSlice";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && store.getState().auth.isAuthenticated) {
      store.dispatch(signOut());
      store.dispatch(clearUser());
      Router.push("/signin?sessionExpired=1");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
