import {
  borderRadius,
  colors,
  fontSize,
  fontWeight,
  spacing,
} from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const Onboarding = () => {
  const { updateProfileMutation } = useAuth();

  const handleGetStarted = async () => {
    await updateProfileMutation.mutateAsync({
      onboardingCompleted: true,
    });
    router.replace("/(tabs)/home");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="restaurant" size={72} color={colors.primary} />
        </View>

        <Text style={styles.title}>Welcome to Diet Tracker</Text>
        <Text style={styles.subtitle}>
          Track your meals, monitor calories, and achieve your health goals
        </Text>

        {/* Features */}
        <View style={styles.featuresContainer}>
          {/* Capture Your Meals */}
          <View style={styles.featureCard}>
            <View style={styles.featureIconRose}>
              <Ionicons name="camera" size={24} color={colors.primary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Capture Your Meals</Text>
              <Text style={styles.featureText}>Take photos of your food</Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIconOrange}>
              <Ionicons name="flame" size={24} color={colors.amber} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Auto Calorie Tracking</Text>
              <Text style={styles.featureText}>
                AI-powered nutrition analysis
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIconBlue}>
              <Ionicons name="bar-chart" size={24} color={colors.blue} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Detailed Reports</Text>
              <Text style={styles.featureText}>
                Track your progress over time
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleGetStarted}
          disabled={updateProfileMutation.isPending}
          activeOpacity={0.8}
          style={styles.button}
        >
          {updateProfileMutation.isPending ? (
            <ActivityIndicator color={colors.white} size="small" />
          ) : (
            <Text style={styles.buttonText}>Get Started</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
  },
  iconContainer: {
    backgroundColor: colors.roseLight,
    width: 128,
    height: 128,
    borderRadius: borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fontSize.massive,
    fontWeight: fontWeight.bold,
    color: colors.textDark,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: fontSize.xl,
    color: colors.textGrayDark,
    textAlign: "center",
    marginBottom: spacing.xxl,
    paddingHorizontal: spacing.md,
  },
  featuresContainer: {
    width: "100%",
    marginBottom: spacing.xxl,
    paddingHorizontal: spacing.sm,
  },
  featureCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.backgroundLight,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 20,
    borderRadius: borderRadius.lg,
    marginBottom: 12,
  },
  featureIconRose: {
    backgroundColor: colors.roseTint,
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  featureIconOrange: {
    backgroundColor: colors.amberTint,
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  featureIconBlue: {
    backgroundColor: colors.blueTint,
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: fontSize.lg,
    color: colors.textDark,
    fontWeight: fontWeight.bold,
    marginBottom: 4,
  },
  featureText: {
    fontSize: fontSize.md,
    color: colors.textGray,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 20,
    paddingHorizontal: 80,
    borderRadius: borderRadius.md,
    width: "100%",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.white,
    textAlign: "center",
  },
});
