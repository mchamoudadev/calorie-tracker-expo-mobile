import { API_URL } from "@/constants/config";
import axios, { AxiosError, AxiosRequestHeaders } from "axios";
import * as SecureStore from "expo-secure-store";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  dailyCalorieGoal: number;
  onboardingCompleted?: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  dailyCalorieGoal: number;
  onboardingCompleted?: boolean;
}

export interface AuthResponse {
  message: string;
  user: User & { token: string };
}

interface ProfileUpdateData {
  onboardingCompleted?: boolean;
  dailyCalorieGoal?: number;
  name?: string;
}

export interface FoodAnalysis {
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  imageUrl: string;
  storageKey: string;
  imageBase64?: string; // Base64 encoded image for preview
}

export interface FoodEntry {
  _id: string;
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  timestamp: string;
  imageUrl?: string;
  mealType?: string;
}

interface DailyReport {
  date: string;
  consumed: number;
  goal: number;
  remaining: number;
  percentComplete: number;
  entriesCount: number;
  macros?: {
    protein: { grams: number; percentage: number };
    carbs: { grams: number; percentage: number };
    fat: { grams: number; percentage: number };
  };
}

interface WeeklyDay {
  date: string;
  dayName: string;
  calories: number;
}

interface WeeklyReport {
  totalEntries: number;
  avgCalories: number;
  goal: number;
  week: WeeklyDay[];
  macros?: {
    protein: { grams: number; percentage: number };
    carbs: { grams: number; percentage: number };
    fat: { grams: number; percentage: number };
  };
}

interface MonthlyReport {
  totalEntries: number;
  totalCalories: number;
  avgCalories: number;
  daysTracked: number;
  highestDay: number;
}

const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const token = await SecureStore.getItemAsync("userToken");
  return {
    "Content-type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const authAPI = {
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      const url = `${API_URL}/auth/register`;
      const { data } = await axios.post<AuthResponse>(url, userData);

      if (data.user?.token) {
        await SecureStore.setItemAsync("userToken", data.user?.token);
      }
      return data;
    } catch (error) {
      throw (
        (error as AxiosError<{ message: string }>)?.response?.data?.message ||
        "An unknown error occurred"
      );
    }
  },

  login: async (userData: LoginData): Promise<AuthResponse> => {
    try {
      const url = `${API_URL}/auth/login`;
      const { data } = await axios.post<AuthResponse>(url, userData);

      console.log("data in login", data);

      if (data.user?.token) {
        await SecureStore.setItemAsync("userToken", data.user?.token);
      }
      return data;
    } catch (error) {
      throw (
        (error as AxiosError<{ message: string }>)?.response?.data?.message ||
        "An unknown error occurred"
      );
    }
  },

  logout: async (): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync("userToken");
      return;
    } catch (error) {
      throw (
        (error as AxiosError<{ message: string }>)?.response?.data?.message ||
        "An unknown error occurred"
      );
    }
  },

  getMe: async (): Promise<User> => {
    try {
      const url = `${API_URL}/auth/me`;
      const { data } = await axios.get<{ message: string; user: User }>(url, {
        headers: await getAuthHeaders(),
      });
      console.log("data", data);
      return data.user;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw (
        (error as AxiosError<{ message: string }>)?.response?.data?.message ||
        "An unknown error occurred"
      );
    }
  },

  updateProfile: async (userData: ProfileUpdateData): Promise<User> => {
    try {
      const url = `${API_URL}/auth/update-profile`;
      const { data } = await axios.put<User>(url, userData, {
        headers: await getAuthHeaders(),
      });
      return data;
    } catch (error) {
      throw (
        (error as AxiosError<{ message: string }>)?.response?.data?.message ||
        "An unknown error occurred"
      );
    }
  },
};

// TODO: Add food tracking API

export const foodAPI = {
  getEntries: async (
    startDate: string,
    endDate: string
  ): Promise<FoodEntry[]> => {
    try {
      const headers = await getAuthHeaders();
      const url = `${API_URL}/food/entries`;

      const params: any = {};

      // date range

      if (startDate && endDate && startDate === endDate) {
        params.date = startDate;
      } else {
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
      }

      const { data } = await axios.get<FoodEntry[]>(url, {
        headers,
        params,
      });
      return data;
    } catch (error) {
      console.error("Error getting entries:", error);
      throw (
        (error as AxiosError<{ message: string }>)?.response?.data?.message ||
        "An unknown error occurred"
      );
    }
  },

  analyzeFood: async (formData: FormData): Promise<FoodAnalysis> => {
    try {
      // @ts-ignore

      // const headers = await getAuthHeaders();
      // delete headers["Content-type"];
      
      // console.log("API URL", API_URL);

      // const url = `${API_URL}/food/analyze`;
      // const { data } = await axios.post<FoodAnalysis>(url, formData, {
      //   headers,
      // });

      // console.log("data in analyzeFood", data);

      // return data;

      const token = await SecureStore.getItemAsync("userToken");

      const url = `${API_URL}/food/analyze`;


         // Use fetch API for FormData in React Native - it handles FormData more reliably
    const headers: HeadersInit = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

     
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 120 seconds or 2 minute timeout


    try {
      
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);


          
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Server error: ${response.status} ${response.statusText}`
        );
      }
      
      const data = await response.json();
      console.log("data in analyzeFood", data);
      
      return data as FoodAnalysis;

    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === "AbortError") {
        throw new Error("Request timeout: The server took too long to respond");
      }
      
      throw fetchError;
    }
    } catch (error) {
      console.error("Error analyzing food:", error);
      throw (
        (error as AxiosError<{ message: string }>)?.response?.data?.message ||
        "An unknown error occurred"
      );
    }
  },

  saveFood: async (foodData: FoodAnalysis): Promise<void> => {
    try {
      const url = `${API_URL}/food/save`;
      const { data } = await axios.post<void>(url, foodData, {
        headers: await getAuthHeaders(),
      });
      console.log("data in saveFood", data);
      return data;
    } catch (error) {
      console.error("Error saving food:", error);
      throw (
        (error as AxiosError<{ message: string }>)?.response?.data?.message ||
        "An unknown error occurred"
      );
    }
  },

  discardFood: async (storageKey: string): Promise<void> => {
    try {
      const url = `${API_URL}/food/discard`;
      const { data } = await axios.post<void>(
        url,
        { storageKey },
        {
          headers: await getAuthHeaders(),
        }
      );
      console.log("data in discardFood", data);
      return data;
    } catch (error) {
      console.error("Error discarding food:", error);
      throw (
        (error as AxiosError<{ message: string }>)?.response?.data?.message ||
        "An unknown error occurred"
      );
    }
  },
};

export const reportAPI = {
  // Get daily report
  getDailyReport: async (date: string): Promise<DailyReport> => {
    try {
      const headers = await getAuthHeaders();
      const { data } = await axios.get<DailyReport>(
        `${API_URL}/reports/daily`,
        {
          headers,
          params: { date },
        }
      );

      return data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(
          error.response.data?.message || "Failed to get daily report"
        );
      }
      throw error;
    }
  },

  // Get weekly report
  getWeeklyReport: async (): Promise<WeeklyReport> => {
    try {
      const headers = await getAuthHeaders();
      const { data } = await axios.get<WeeklyReport>(
        `${API_URL}/reports/weekly`,
        {
          headers,
        }
      );

      return data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(
          error.response.data?.message || "Failed to get weekly report"
        );
      }
      throw error;
    }
  },

  // Get monthly report
  getMonthlyReport: async (
    year: number,
    month: number
  ): Promise<MonthlyReport> => {
    try {
      const headers = await getAuthHeaders();
      const params: any = {};
      if (year) params.year = year;
      if (month) params.month = month;

      const { data } = await axios.get<MonthlyReport>(
        `${API_URL}/reports/monthly`,
        {
          headers,
          params,
        }
      );

      return data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(
          error.response.data?.message || "Failed to get monthly report"
        );
      }
      throw error;
    }
  },
};
