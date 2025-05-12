import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import {
  getItemAsync,
  setItemAsync,
  deleteItemAsync,
  logout as apiLogout,
} from "../services/api";

const AuthContext = createContext(null);

const API_BASE_URL =
  "https://api.sunshine-meri-luke-village.com/api/v1/accounts";
const REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes in milliseconds

// Create axios instance with interceptors
const api = axios.create({
  baseURL: API_BASE_URL,
});

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    accessToken: null,
    refreshToken: null,
    phoneNumber: null,
    houseNumber: null,
    isAuthenticated: false,
    userData: null,
    isLoading: true, // Add loading state
  });

  // Add axios interceptor for handling 401 errors
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // If the error is 401 and we haven't tried to refresh the token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Try to refresh the token
            const newToken = await refreshAccessToken();

            // Update the authorization header
            originalRequest.headers.Authorization = `JWT ${newToken}`;

            // Retry the original request
            return api(originalRequest);
          } catch (refreshError) {
            // If refresh fails, clear auth data and throw error
            await clearAuthData();
            throw refreshError;
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [authState.refreshToken]);

  // Set up periodic token refresh
  useEffect(() => {
    let refreshInterval;

    if (authState.isAuthenticated) {
      refreshInterval = setInterval(async () => {
        try {
          await refreshAccessToken();
        } catch (error) {
          console.error("Failed to refresh token:", error);
          await clearAuthData();
        }
      }, REFRESH_INTERVAL);
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [authState.isAuthenticated]);

  useEffect(() => {
    // Load stored auth data on app start
    loadStoredAuthData();
  }, []);

  const verifyTokens = async (accessToken, refreshToken) => {
    try {
      // First try to decode the access token to check if it's expired
      const tokenParts = accessToken.split(".");
      if (tokenParts.length !== 3) {
        throw new Error("Invalid token format");
      }

      const payload = JSON.parse(atob(tokenParts[1]));
      const expirationTime = payload.exp * 1000; // Convert to milliseconds

      // If token is not expired, it's valid
      if (Date.now() < expirationTime) {
        return true;
      }

      // If token is expired, try to refresh it
      try {
        const response = await api.post("/refresh/", {
          refresh: refreshToken,
        });

        // Store the new access token
        await setItemAsync("accessToken", response.data.access);
        return true;
      } catch (refreshError) {
        // If refresh fails, clear all tokens
        await clearAuthData();
        return false;
      }
    } catch (error) {
      // If there's any error in decoding or the token is invalid
      await clearAuthData();
      return false;
    }
  };

  const loadStoredAuthData = async () => {
    try {
      const accessToken = await getItemAsync("accessToken");
      const refreshToken = await getItemAsync("refreshToken");
      const phoneNumber = await getItemAsync("phoneNumber");
      const houseNumber = await getItemAsync("houseNumber");

      if (accessToken && refreshToken) {
        // Verify tokens before setting authentication state
        const isValid = await verifyTokens(accessToken, refreshToken);

        if (isValid) {
          setAuthState({
            accessToken,
            refreshToken,
            phoneNumber,
            houseNumber,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setAuthState((prev) => ({
            ...prev,
            isAuthenticated: false,
            isLoading: false,
          }));
        }
      } else {
        setAuthState((prev) => ({
          ...prev,
          isAuthenticated: false,
          isLoading: false,
        }));
      }
    } catch (error) {
      console.error("Error loading auth data:", error);
      setAuthState((prev) => ({
        ...prev,
        isAuthenticated: false,
        isLoading: false,
      }));
    }
  };

  const storeAuthData = async (data) => {
    try {
      if (data.accessToken) await setItemAsync("accessToken", data.accessToken);
      if (data.refreshToken)
        await setItemAsync("refreshToken", data.refreshToken);
      if (data.phoneNumber) await setItemAsync("phoneNumber", data.phoneNumber);
      if (data.houseNumber) await setItemAsync("houseNumber", data.houseNumber);
    } catch (error) {
      console.error("Error storing auth data:", error);
    }
  };

  const clearAuthData = async () => {
    try {
      await deleteItemAsync("accessToken");
      await deleteItemAsync("refreshToken");
      await deleteItemAsync("phoneNumber");
      await deleteItemAsync("houseNumber");
      setAuthState({
        accessToken: null,
        refreshToken: null,
        phoneNumber: null,
        houseNumber: null,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error("Error clearing auth data:", error);
    }
  };

  const refreshAccessToken = async () => {
    try {
      const response = await api.post("/refresh/", {
        refresh: authState.refreshToken,
      });

      const newAccessToken = response.data.access;
      await setItemAsync("accessToken", newAccessToken);
      setAuthState((prev) => ({
        ...prev,
        accessToken: newAccessToken,
      }));
      return newAccessToken;
    } catch (error) {
      console.error("Error refreshing token:", error);
      await clearAuthData();
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post("/register/", {
        user: {
          phone_number: userData.phoneNumber,
          password: userData.password,
        },
        full_name: userData.fullName,
        house_number: userData.houseNumber,
      });

      await storeAuthData({
        phoneNumber: userData.phoneNumber,
        houseNumber: userData.houseNumber,
      });
      setAuthState({
        phoneNumber: userData.phoneNumber,
        houseNumber: userData.houseNumber,
      });
      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const verifyHouse = async (otp, overridePhone, overrideHouse) => {
    try {
      const payload = { otp };
      payload.phone_number = overridePhone || authState.phoneNumber;
      payload.house_number = overrideHouse || authState.houseNumber;
      const response = await api.post("/verify_house/", payload);
      return response.data;
    } catch (error) {
      console.error("House verification error:", error);
      throw error;
    }
  };

  const verifyPhone = async (otp, overridePhone, overrideHouse) => {
    try {
      const payload = { otp };
      payload.phone_number = overridePhone || authState.phoneNumber;
      payload.house_number = overrideHouse || authState.houseNumber;
      const response = await api.post("/verify_phone/", payload);
      return response.data;
    } catch (error) {
      console.error("Phone verification error:", error);
      throw error;
    }
  };

  const login = async (phoneNumber, password) => {
    try {
      const response = await api.post("/login/", {
        phone_number: phoneNumber,
        password,
      });

      const { access, refresh } = response.data;
      await storeAuthData({
        accessToken: access,
        refreshToken: refresh,
        phoneNumber,
      });

      setAuthState((prev) => ({
        ...prev,
        accessToken: access,
        refreshToken: refresh,
        phoneNumber,
        isAuthenticated: true,
      }));

      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (authState.refreshToken) {
        await apiLogout(authState.refreshToken);
      }
      await clearAuthData();
    } catch (error) {
      console.error("Logout error:", error);
      // Even if the API call fails, we should still clear the local auth data
      await clearAuthData();
    }
  };

  const forgotPassword = async (phoneNumber) => {
    try {
      const response = await api.post("/forgot-password/request/", {
        phone_number: phoneNumber,
      });
      return response.data;
    } catch (error) {
      console.error("Forgot password error:", error);
      throw error;
    }
  };

  const verifyForgotPasswordOTP = async (phoneNumber, otp) => {
    try {
      const response = await api.post("/forgot-password/verify/", {
        phone_number: phoneNumber,
        otp,
      });
      return response.data;
    } catch (error) {
      console.error("Verify forgot password OTP error:", error);
      throw error;
    }
  };

  const resetPassword = async (phoneNumber, newPassword) => {
    try {
      const response = await api.post("/forgot-password/reset/", {
        phone_number: phoneNumber,
        new_password: newPassword,
      });
      return response.data;
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    }
  };

  const resendHouseOTP = async (overrideHouse) => {
    try {
      const payload = { house_number: overrideHouse || authState.houseNumber };
      const response = await api.post("/resend_otp/", payload);
      return response.data;
    } catch (error) {
      console.error("Resend house OTP error:", error);
      throw error;
    }
  };

  const resendPhoneOTP = async (overridePhone) => {
    try {
      const payload = { phone_number: overridePhone || authState.phoneNumber };
      const response = await api.post("/resend_otp/", payload);
      return response.data;
    } catch (error) {
      console.error("Resend phone OTP error:", error);
      throw error;
    }
  };

  const getUser = async () => {
    try {
      const response = await api.get("/self/", {
        headers: {
          Authorization: `JWT ${authState.accessToken}`,
        },
      });

      setAuthState((prev) => ({
        ...prev,
        userData: response.data,
      }));

      return response.data;
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    }
  };

  const updateUser = async (updates) => {
    try {
      const response = await api.patch("/self/", updates, {
        headers: {
          Authorization: `JWT ${authState.accessToken}`,
        },
      });

      setAuthState((prev) => ({
        ...prev,
        userData: response.data,
      }));

      return response.data;
    } catch (error) {
      console.error("Error updating user data:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        register,
        verifyHouse,
        verifyPhone,
        login,
        logout,
        forgotPassword,
        verifyForgotPasswordOTP,
        resetPassword,
        resendHouseOTP,
        resendPhoneOTP,
        refreshAccessToken,
        getUser,
        updateUser,
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
