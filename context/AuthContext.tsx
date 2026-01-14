import {
  authAPI,
  AuthResponse,
  LoginData,
  RegisterData,
  User,
} from "@/services/api";

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

interface ProfileUpdateData {
  onboardingCompleted?: boolean;
  dailyCalorieGoal?: number;
  name?: string;
}

interface AuthContextType {
  user: User | undefined;
  isAuthenticated: boolean;
  loading: boolean;
  registerMutation: UseMutationResult<
    AuthResponse,
    Error,
    RegisterData,
    unknown
  >;
  loginMutation: UseMutationResult<AuthResponse, Error, LoginData, unknown>;
  updateProfileMutation: UseMutationResult<
    User,
    Error,
    ProfileUpdateData,
    unknown
  >;
  logout: () => Promise<void>;
  refetchUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isReady, setIsReady] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const queryClient = useQueryClient();

  // check if token exists in secure store

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      setHasToken(!!token);
      setIsReady(true);
    } catch (error) {
      console.error("Error checking token:", error);
      setHasToken(false);
      setIsReady(true);
    }
  };

  // Query to fecth current user

  const {
    data: user,
    isLoading: userLoading,
    error: userError,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: authAPI.getMe,
    enabled: isReady && hasToken,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  //   Handle Authetication Error celar the token

  useEffect(() => {
    if (userError) {
      console.error("Authentication error:", userError);
      setHasToken(false);
      SecureStore.deleteItemAsync("userToken");
    }
  }, [userError]);

  // register mutation
  const registerMutation = useMutation({
    mutationFn: authAPI.register,
    onSuccess: (data) => {
      queryClient.setQueryData(["currentUser"], data.user);
      setHasToken(true);
    },
    onError: (error) => {
      console.error("Registration error:", error);
    },
  });

  // login mutation
  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: async (data) => {
      // awiar a tiny bit of time to make sure the token is saved
      await new Promise((resolve) => setTimeout(resolve, 500));
      setHasToken(true);
    },
    onError: (error) => {
      console.error("Login error:", error);
    },
  });

  // update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: authAPI.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error) => {
      console.error("Update profile error:", error);
    },
  });

  // logout mutation
  const logout = async () => {
    try {
      await authAPI.logout();
      queryClient.clear();
      setHasToken(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading: userLoading || !isReady,
    registerMutation,
    loginMutation,
    updateProfileMutation,
    logout,
    refetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
