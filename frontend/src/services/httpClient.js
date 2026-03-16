import axios from "axios";

const BASE_URL = "http://localhost:5004/api";

const http = axios.create({ baseURL: BASE_URL });

// Attach Authorization header
http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (newToken) => {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
};

const refreshToken = async () => {
  const token = localStorage.getItem("token");
  // use a separate axios instance to avoid interceptor recursion
  const refreshClient = axios.create({ baseURL: BASE_URL });
  return refreshClient.post(
    "/auth/refresh",
    {},
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );
};

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};
    const status = error?.response?.status;
    const isRefreshCall = originalRequest?.url?.includes("/auth/refresh");
    const isLoginCall = originalRequest?.url?.includes("/auth/signin");

    // If refresh itself failed or status is not 401/403, reject
    // Also skip interceptor for login endpoint
    const shouldHandleAuth = (status === 401 || status === 403) && !isRefreshCall && !isLoginCall;
    if (!shouldHandleAuth) {
      if (isRefreshCall) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
      return Promise.reject(error);
    }

    // avoid multiple refreshes
    if (isRefreshing) {
      return new Promise((resolve) => {
        subscribeTokenRefresh((newToken) => {
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(http(originalRequest));
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await refreshToken();
      const newToken = data?.token;
      if (newToken) {
        localStorage.setItem("token", newToken);
        onRefreshed(newToken);
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return http(originalRequest);
      }
      // no token in response -> logout
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return Promise.reject(error);
    } catch (e) {
      // refresh failed -> logout
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return Promise.reject(e);
    } finally {
      isRefreshing = false;
    }
  }
);

export default http;
