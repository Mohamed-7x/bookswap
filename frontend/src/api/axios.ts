import axios from 'axios';

const baseURL = 'http://localhost:8000';

export const api = axios.create({
  baseURL,
});

// Request interceptor to add the access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to refresh the token on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Call the refresh endpoint directly with axios to avoid infinite loop
        const res = await axios.post(`${baseURL}/api/auth/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = res.data.access;
        localStorage.setItem('access_token', newAccessToken);

        // Retry the original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        // Refresh token failed, clean up
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        // Redirect to login (handled in AuthContext usually, or a custom event)
        window.dispatchEvent(new Event('auth:logout'));
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
