import React from "react";
import { createContext, useState } from "react";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    setUser(JSON.parse(storedUser));
    setIsAuthenticated(true);
  } else {
    setIsAuthenticated(false);
    setUser(null);
  }

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", userData);
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("token", data.token);
      setIsAuthenticated(true);
      return data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const verifyOTP = async () => {
    try {
      const { data } = await api.post("/auth/verify-otp", otpData);
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("token", data.token);
      setIsAuthenticated(true);
      return data;
    } catch (error) {
      console.error("OTP verification failed:", error);
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      return data;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        login,
        logout,
        verifyOTP,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
