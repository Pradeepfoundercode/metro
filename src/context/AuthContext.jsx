import React, { createContext, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { disconnect, checkLoginToServer } from "../services/deviceSession";
import { loginUser, getUserProfile } from "../services/auth.service";
import { useWalletStore } from "../store/useWalletStore";



export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const userProfile = useCallback(async (userId) => {
    if (!userId) {
      return null;
    }

    try {
      const response = await getUserProfile(userId);

      if (!response?.success || !response?.data) {
        return response;
      }

      const profile = response.data;

      setUser(profile);

      localStorage.setItem("userId", String(profile.id));
      

      if (profile.wallet != null) {
        useWalletStore.getState().setWallet(profile.wallet);
      }

      return response;
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      return null;
    }
  }, []);

 const login = useCallback(
  async ({ username, password }) => {
    const response = await loginUser({
      username,
      password,
    });

    if (!response?.success) {
      return response;
    }

    if (!response?.id) {
      return {
        success: false,
        message: "User ID not received from server",
      };
    }
    

    const profileResponse = await userProfile(response.id);

    if (!profileResponse?.success) {
      return {
        success: false,
        message: "Unable to load user profile",
      };
    }

    return response;
  },
  [userProfile],
);

  const logout = useCallback(() => {
    disconnect();

    setUser(null);

    useWalletStore.getState().resetWallet();

    localStorage.removeItem("userId");
    localStorage.removeItem("username");
  }, []);


  useEffect(() => {
    const initSession = async () => {
      const storedUserId = localStorage.getItem("userId");

      if (storedUserId) {
        const response = await userProfile(storedUserId);

        if (!response?.success) {
          localStorage.removeItem("userId");
          localStorage.removeItem("username");
          setUser(null);
        }
      }

      setIsLoading(false);
    };

    initSession();
  }, [userProfile]);


  //socket
  useEffect(() => {
  if (!user?.id) {
    disconnect();
    return;
  }

  checkLoginToServer(() => {
    logout();

    toast.error(
      "You have been logged out because your account was logged in on another browser.",
    );
  });

  return () => {
    disconnect();
  };
}, [user?.id, logout]);

  const value = {
    user,
    isLoading,
    login,
    logout,
    userProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
