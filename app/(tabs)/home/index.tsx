import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useMemo, useState } from "react";
import {
  borderRadius,
  colors,
  fontSize,
  fontWeight,
  spacing,
} from "@/constants/theme";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { router, useFocusEffect } from "expo-router";
import { useDailyReport } from "@/hooks/useReport";
import { useFoodEntries } from "@/hooks/useFood";
import { FoodEntry } from "@/services/api";

const Home = () => {
  const { user, logout } = useAuth();

  const [refreshing, setRefreshing] = useState(false);

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = (): string => {
    const today = new Date(); // 2026-01-13T00:00:00.000Z

    return today.toISOString().split("T")[0];
  };

  const today = getTodayDate();

  // Use existing hooks
  const {
    data: dailyReport,
    isLoading,
    error,
    refetch,
  } = useDailyReport(today);

  const { data: foodEntries, refetch: refetchEntries } = useFoodEntries(
    today,
    today
  );

  useFocusEffect(
    useCallback(() => {
      refetch();
      refetchEntries();
    }, [refetchEntries, refetch])
  );

  // Pull to refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetch(), refetchEntries()]);
    setRefreshing(false);
  }, [refetch, refetchEntries]);

  // Memoize derived values to prevent unnecessary recalculations
  const { dailyGoal, consumed, remaining, progress } = useMemo(() => {
    const goal = user?.dailyCalorieGoal || dailyReport?.goal || 2000;
    const cons = dailyReport?.consumed || 0;
    const rem = dailyReport?.remaining || Math.max(0, goal - cons);
    const prog = dailyReport?.percentComplete || (cons / goal) * 100;

    return { dailyGoal: goal, consumed: cons, remaining: rem, progress: prog };
  }, [user?.dailyCalorieGoal, dailyReport]);

  // Memoize macros from daily report
  const { protein, carbs, fat } = useMemo(
    () => ({
      protein: dailyReport?.macros?.protein?.grams || 0,
      carbs: dailyReport?.macros?.carbs?.grams || 0,
      fat: dailyReport?.macros?.fat?.grams || 0,
    }),
    [dailyReport]
  );

  // Memoize meals list - backend returns direct array
  const meals = useMemo(
    () => (foodEntries || []) as FoodEntry[],
    [foodEntries]
  );

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/login");
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerLabel}>Welcome back</Text>
            <Text style={styles.headerTitle}>{user?.name || "User"} 👋</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons
              name="log-out-outline"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Daily Progress Card */}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Calorie Card */}
        <View style={styles.calorieCard}>
          <View style={styles.calorieCardContent}>
            {/* Progress Circle */}
            <View style={styles.progressCircle}>
              <Text style={styles.progressText}>{consumed}</Text>
              <Text style={styles.progressLabel}>eaten</Text>
            </View>

            {/* Stats */}
            <View style={styles.stats}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Daily Goal</Text>
                <Text style={styles.statValue}>{dailyGoal} cal</Text>
              </View>
              <View>
                <Text style={styles.statLabel}>Remaining</Text>
                <Text style={styles.statValueRemaining}>{remaining} cal</Text>
              </View>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${Math.min(progress, 100)}%` },
                ]}
              />
            </View>
            <Text style={styles.progressBarText}>
              {progress.toFixed(0)}% of daily goal
            </Text>
          </View>
        </View>

        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Meals</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/add")}>
            <Text style={styles.addButton}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {/* Loading State */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading meals...</Text>
          </View>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <View style={styles.errorState}>
            <View style={styles.errorIcon}>
              <Ionicons
                name="alert-circle-outline"
                size={28}
                color={colors.error}
              />
            </View>
            <Text style={styles.errorTitle}>Unable to load data</Text>
            <Text style={styles.errorText}>{error.message}</Text>
            <TouchableOpacity
              onPress={() => refetch()}
              style={styles.retryButton}
            >
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Empty State */}
        {!isLoading && !error && meals.length === 0 && (
          <View style={styles.emptyState}>
            <View style={styles.emptyStateIcon}>
              <Ionicons
                name="restaurant-outline"
                size={28}
                color={colors.textTertiary}
              />
            </View>
            <Text style={styles.emptyStateTitle}>No meals logged yet</Text>
            <Text style={styles.emptyStateText}>
              Start tracking by logging your first meal
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/add")}
              style={styles.emptyStateButton}
            >
              <Text style={styles.emptyStateButtonText}>
                Log Your First Meal
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Meals List */}
        {!isLoading && !error && meals.length > 0 && (
          <View style={styles.mealsContainer}>
            {meals.map((meal) => (
              <View key={meal._id} style={styles.mealCard}>
                <View style={styles.mealContent}>
                  <View style={styles.mealHeader}>
                    <Text style={styles.mealName}>{meal.foodName}</Text>
                    <Text style={styles.mealCalories}>{meal.calories} cal</Text>
                  </View>
                  <View style={styles.mealDetails}>
                    <View style={styles.mealMacros}>
                      <View style={styles.mealMacroItem}>
                        <Ionicons
                          name="flame-outline"
                          size={12}
                          color={colors.blue}
                        />
                        <Text style={styles.mealMacroText}>
                          {meal.protein}g
                        </Text>
                      </View>
                      <View style={styles.mealMacroItem}>
                        <Ionicons
                          name="leaf-outline"
                          size={12}
                          color={colors.amber}
                        />
                        <Text style={styles.mealMacroText}>{meal.carbs}g</Text>
                      </View>
                      <View style={styles.mealMacroItem}>
                        <Ionicons
                          name="water-outline"
                          size={12}
                          color={colors.primary}
                        />
                        <Text style={styles.mealMacroText}>{meal.fat}g</Text>
                      </View>
                    </View>
                    <Text style={styles.mealTime}>
                      {new Date(meal.timestamp).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Macros */}
        <Text style={styles.macrosTitle}>Today's Macros</Text>
        <View style={styles.macrosContainer}>
          <View style={styles.macroCard}>
            <View style={styles.macroIconBlue}>
              <Ionicons name="flame-outline" size={18} color={colors.blue} />
            </View>
            <Text style={styles.macroLabel}>Protein</Text>
            <Text style={styles.macroValue}>{protein.toFixed(0)}g</Text>
          </View>
          <View style={styles.macroCard}>
            <View style={styles.macroIconAmber}>
              <Ionicons name="leaf-outline" size={18} color={colors.amber} />
            </View>
            <Text style={styles.macroLabel}>Carbs</Text>
            <Text style={styles.macroValue}>{carbs.toFixed(0)}g</Text>
          </View>
          <View style={styles.macroCard}>
            <View style={styles.macroIconRose}>
              <Ionicons name="water-outline" size={18} color={colors.primary} />
            </View>
            <Text style={styles.macroLabel}>Fat</Text>
            <Text style={styles.macroValue}>{fat.toFixed(0)}g</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 64,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  headerLabel: {
    color: colors.textTertiary,
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  headerTitle: {
    color: colors.text,
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: colors.surfaceSecondary,
    padding: 12,
    borderRadius: borderRadius.full,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  calorieCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: colors.border,
  },
  calorieCardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  progressCircle: {
    alignItems: "center",
    justifyContent: "center",
    width: 96,
    height: 96,
    borderRadius: borderRadius.full,
    backgroundColor: colors.roseLight,
    borderWidth: 4,
    borderColor: colors.primaryLight,
  },
  progressText: {
    color: colors.primary,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
  },
  progressLabel: {
    color: colors.textTertiary,
    fontSize: fontSize.base,
  },
  stats: {
    flex: 1,
    marginLeft: 20,
  },
  statItem: {
    marginBottom: 12,
  },
  statLabel: {
    color: colors.textTertiary,
    fontSize: fontSize.base,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontWeight: fontWeight.medium,
  },
  statValue: {
    color: colors.text,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
  },
  statValueRemaining: {
    color: colors.emerald,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
  },
  progressBarContainer: {
    marginTop: 20,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.full,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.full,
  },
  progressBarText: {
    color: colors.textTertiary,
    fontSize: fontSize.base,
    marginTop: spacing.sm,
    textAlign: "center",
    fontWeight: fontWeight.medium,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  addButton: {
    color: colors.primary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  emptyState: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  emptyStateIcon: {
    backgroundColor: colors.surfaceSecondary,
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  emptyStateTitle: {
    color: colors.textMedium,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    marginBottom: 4,
  },
  emptyStateText: {
    color: colors.textTertiary,
    fontSize: fontSize.md,
    textAlign: "center",
    marginBottom: 20,
  },
  emptyStateButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    borderRadius: borderRadius.md,
  },
  emptyStateButtonText: {
    color: colors.white,
    fontWeight: fontWeight.semibold,
  },
  macrosTitle: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    marginTop: spacing.lg,
    marginBottom: 12,
  },
  macrosContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: spacing.xl,
  },
  macroCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  macroIconBlue: {
    backgroundColor: colors.blueTint,
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  macroIconAmber: {
    backgroundColor: colors.amberLight,
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  macroIconRose: {
    backgroundColor: colors.roseTint,
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  macroLabel: {
    color: colors.textTertiary,
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
  },
  macroValue: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  loadingContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xxl,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  loadingText: {
    color: colors.textTertiary,
    fontSize: fontSize.md,
    marginTop: 12,
  },
  errorState: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.borderError,
  },
  errorIcon: {
    backgroundColor: colors.borderError,
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  errorTitle: {
    color: colors.error,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    marginBottom: 4,
  },
  errorText: {
    color: colors.textTertiary,
    fontSize: fontSize.md,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: colors.error,
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    borderRadius: borderRadius.md,
  },
  retryButtonText: {
    color: colors.white,
    fontWeight: fontWeight.semibold,
  },
  mealsContainer: {
    gap: 12,
    marginBottom: spacing.lg,
  },
  mealCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  mealContent: {
    gap: spacing.sm,
  },
  mealHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mealName: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    flex: 1,
  },
  mealCalories: {
    color: colors.primary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  mealDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mealMacros: {
    flexDirection: "row",
    gap: 12,
  },
  mealMacroItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  mealMacroText: {
    color: colors.textSecondary,
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
  },
  mealTime: {
    color: colors.textTertiary,
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
  },
});
