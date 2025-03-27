import React, { createContext, useState, useEffect } from "react";
import {jwtDecode} from 'jwt-decode';  // Correct import

import { login } from "../Services/AuthService"; // Import login service

// Create context to manage authentication state
const AuthContext = createContext();

// AuthProvider to provide authentication state to the rest of the app
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null); // State to store the token and role

  // Load token from localStorage when the component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token) {
      const decoded = jwtDecode(token);
      const expirationTime = decoded.exp * 1000; // Convert to milliseconds

      // If the token is expired, remove it and reset the state
      if (expirationTime < Date.now()) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setAuth(null);
      } else {
        setAuth({ token, role });
      }
    }
  }, []);

  // Function to login a user
  const handleLogin = async (username, password) => {
    try {
      const { token, role } = await login(username, password); // Call login service

      const decoded = jwtDecode(token); // Decode the JWT token

      const expirationTime = decoded.exp * 1000; // Convert to milliseconds

      // If the token is expired, remove it and reset the state
      if (expirationTime < Date.now()) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setAuth(null);
      } else {
        // If the token is valid, set auth state
        setAuth({ token, role });
      }
    } catch (error) {
      console.error("Error in login:", error);
      setAuth(null); // Reset auth state in case of error
    }
  };

  // Function to log out a user
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth,setAuth, handleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;