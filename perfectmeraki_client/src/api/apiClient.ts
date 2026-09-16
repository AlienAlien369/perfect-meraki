import axios from "axios";
import Router from "next/router";
import store from "@/store/store";
import { signOut, setToken } from "@/store/slices/authSlice";
import { clearUser } from "@/store/slices/userSlice";
import { API_ROUTES } from "@/api/APIRoutes";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true, // sends the httpOnly refresh cookie
});

apiClient.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function forceLogout() {
  store.dispatch(signOut());
  store.dispatch(clearUser());
  Router.push("/signin?sessionExpired=1");
}

// Multiple requests can 401 at once (e.g. a page firing several calls with the
// same stale token) - share a single in-flight refresh instead of racing.
let refreshPromise: Promise<string> | null = null;

function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(
        API_ROUTES.AUTH.REFRESH,
        {},
        { withCredentials: true }
      )
      .then((res) => {
        const newToken = res.data.token as string;
        store.dispatch(setToken(newToken));
        return newToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthEndpoint =
      originalRequest?.url?.includes("/api/auth/login") ||
      originalRequest?.url?.includes("/api/auth/register") ||
      originalRequest?.url?.includes("/api/auth/refresh");

    if (
      error.response?.status === 401 &&
      store.getState().auth.isAuthenticated &&
      !isAuthEndpoint &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch {
        forceLogout();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
export { refreshAccessToken, forceLogout };
