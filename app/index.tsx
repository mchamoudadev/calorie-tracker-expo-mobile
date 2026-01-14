import { Redirect, useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { colors } from "@/constants/theme";
import * as SecureStore from "expo-secure-store";

export default function Index() {
  const { isAuthenticated, loading, user } = useAuth();

  console.log("--------------------------------");

  console.log("user", user?.onboardingCompleted);

  useEffect(() => {
    const checkToken = async () => {
      const token = await SecureStore.getItemAsync("userToken");
     
    };
    checkToken();
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // if authenticated, redirect to home

  if (isAuthenticated) {
    // TODO: onboarding flow

    if (user?.onboardingCompleted) {
      return <Redirect href="/(tabs)/home" />;
    }

    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/login" />;
}
