import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import {
  useDailyReport,
  useWeeklyReport,
  useMonthlyReport,
} from "@/hooks/useReport";
import {
  borderRadius,
  colors,
  fontSize,
  fontWeight,
  spacing,
} from "@/constants/theme";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

const Reports = () => {
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0]; // 2026-01-01T00:0000

  // Get current year and month
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // JS months are 0-based

  // Fetch data
  const {
    data: dailyData,
    isLoading: dailyLoading,
    refetch: refetchDaily,
  } = useDailyReport(today);
  const {
    data: weeklyData,
    isLoading: weeklyLoading,
    refetch: refetchWeekly,
  } = useWeeklyReport();
  const {
    data: monthlyData,
    isLoading: monthlyLoading,
    refetch: refetchMonthly,
  } = useMonthlyReport(currentYear, currentMonth);

  const isLoading = dailyLoading || weeklyLoading || monthlyLoading;
  const hasData = dailyData && weeklyData && weeklyData.totalEntries > 0;

  const handleRefresh = async () => {
    await Promise.all([refetchDaily(), refetchWeekly(), refetchMonthly()]);
  };

  // Get max calories for scaling the bar chart
  const maxCalories = weeklyData?.week
    ? Math.max(
        ...weeklyData.week.map((d) => d.calories),
        weeklyData.goal || 2000
      )
    : 2000;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerLabel}>Analytics</Text>
        <Text style={styles.headerTitle}>Reports</Text>
        <Text style={styles.headerSubtitle}>
          Track your nutrition and calorie intake
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.emerald} />
          </View>
        ) : (
          <>
            {/* Stats Cards */}
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <View style={styles.statIconBlue}>
                  <Ionicons
                    name="calendar-outline"
                    size={24}
                    color={colors.blue}
                  />
                </View>
                <Text style={styles.statValue}>
                  {dailyData?.entriesCount || 0}
                </Text>
                <Text style={styles.statLabel}>Entries Today</Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statIconEmerald}>
                  <Ionicons
                    name="flame-outline"
                    size={24}
                    color={colors.emerald}
                  />
                </View>
                <Text style={styles.statValue}>
                  {Math.round(dailyData?.consumed || 0)}
                </Text>
                <Text style={styles.statLabel}>Calories Today</Text>
              </View>
            </View>

            {/* Weekly Summary */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>This Week</Text>
              <Text style={styles.sectionSubtitle}>
                {weeklyData?.totalEntries || 0} total entries
              </Text>
            </View>

            <View style={styles.weeklyCard}>
              <View style={styles.weeklyChart}>
                {weeklyData?.week?.map((dayData, index) => {
                  const heightPercent =
                    maxCalories > 0
                      ? (dayData.calories / maxCalories) * 100
                      : 0;
                  const isOverGoal = dayData.calories > (weeklyData.goal || 0);
                  const caloriesDisplay = Math.round(dayData.calories);

                  return (
                    <View key={index} style={styles.weeklyDay}>
                      <Text style={styles.weeklyDayLabel}>
                        {dayData.dayName}
                      </Text>
                      <View style={styles.weeklyBar}>
                        {dayData.calories > 0 && (
                          <View
                            style={[
                              styles.weeklyBarFill,
                              {
                                height: `${Math.max(
                                  Math.min(heightPercent, 100),
                                  5
                                )}%`,
                                backgroundColor: isOverGoal
                                  ? colors.primary
                                  : colors.emerald,
                              },
                            ]}
                          />
                        )}
                      </View>
                      <Text style={styles.weeklyCalories}>
                        {caloriesDisplay > 0 ? caloriesDisplay : "-"}
                      </Text>
                    </View>
                  );
                })}
              </View>

              <View style={styles.weeklyStats}>
                <View style={styles.weeklyStatItem}>
                  <Text style={styles.weeklyStatLabel}>Average</Text>
                  <Text style={styles.weeklyStatValue}>
                    {Math.round(weeklyData?.avgCalories || 0)} cal
                  </Text>
                </View>
                <View style={styles.weeklyStatDivider} />
                <View style={styles.weeklyStatItem}>
                  <Text style={styles.weeklyStatLabel}>Daily Goal</Text>
                  <Text style={styles.weeklyStatValue}>
                    {Math.round(weeklyData?.goal || 0)} cal
                  </Text>
                </View>
              </View>
            </View>
            {/* Empty State or Macro Breakdown */}

            {!hasData ? (
              <View style={styles.emptyState}>
                <View style={styles.emptyStateIcon}>
                  <Ionicons
                    name="bar-chart-outline"
                    size={28}
                    color={colors.textTertiary}
                  />
                </View>
                <Text style={styles.emptyStateTitle}>No data yet</Text>
                <Text style={styles.emptyStateText}>
                  Start logging your meals to see your nutrition insights
                </Text>
              </View>
            ) : (
              <>
                {/* Macros Section */}
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Macros This Week</Text>
                </View>

                <View style={styles.macrosCard}>
                  <View style={styles.macroRow}>
                    {/* Protein */}
                    <View style={styles.macroItem}>
                      <View
                        style={[
                          styles.macroIcon,
                          { backgroundColor: colors.blueTint },
                        ]}
                      >
                        <Ionicons
                          name="fitness-outline"
                          size={20}
                          color={colors.blue}
                        />
                      </View>
                      <Text style={styles.macroLabel}>Protein</Text>
                      <Text style={styles.macroValue}>
                        {Math.round(weeklyData?.macros?.protein?.grams || 0)}g
                      </Text>
                      <Text style={styles.macroPercent}>
                        {weeklyData?.macros?.protein?.percentage || 0}%
                      </Text>
                    </View>

                    {/* Carbs */}
                    <View style={styles.macroItem}>
                      <View
                        style={[
                          styles.macroIcon,
                          { backgroundColor: colors.amberLight },
                        ]}
                      >
                        <Ionicons
                          name="nutrition-outline"
                          size={20}
                          color={colors.amber}
                        />
                      </View>
                      <Text style={styles.macroLabel}>Carbs</Text>
                      <Text style={styles.macroValue}>
                        {Math.round(weeklyData?.macros?.carbs?.grams || 0)}g
                      </Text>
                      <Text style={styles.macroPercent}>
                        {weeklyData?.macros?.carbs?.percentage || 0}%
                      </Text>
                    </View>

                    {/* Fat */}
                    <View style={styles.macroItem}>
                      <View
                        style={[
                          styles.macroIcon,
                          { backgroundColor: colors.pinkTint },
                        ]}
                      >
                        <Ionicons
                          name="water-outline"
                          size={20}
                          color={colors.pink}
                        />
                      </View>
                      <Text style={styles.macroLabel}>Fat</Text>
                      <Text style={styles.macroValue}>
                        {Math.round(weeklyData?.macros?.fat?.grams || 0)}g
                      </Text>
                      <Text style={styles.macroPercent}>
                        {weeklyData?.macros?.fat?.percentage || 0}%
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Monthly Report Section */}

                {monthlyData && (
                  <>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionTitle}>This Month</Text>
                      <Text style={styles.sectionSubtitle}>
                        {new Date(
                          currentYear,
                          currentMonth - 1
                        ).toLocaleDateString("en-US", { month: "long" })}
                      </Text>
                    </View>

                    <View style={styles.monthlyCard}>
                      {/* Monthly Stats Grid */}
                      <View style={styles.monthlyStatsGrid}>
                        <View style={styles.monthlyStatBox}>
                          <Ionicons
                            name="calendar-outline"
                            size={24}
                            color={colors.purple}
                            style={styles.monthlyStatIcon}
                          />
                          <Text style={styles.monthlyStatValue}>
                            {monthlyData.daysTracked}
                          </Text>
                          <Text style={styles.monthlyStatLabel}>
                            Days Tracked
                          </Text>
                        </View>

                        <View style={styles.monthlyStatBox}>
                          <Ionicons
                            name="restaurant-outline"
                            size={24}
                            color={colors.pink}
                            style={styles.monthlyStatIcon}
                          />
                          <Text style={styles.monthlyStatValue}>
                            {monthlyData.totalEntries}
                          </Text>
                          <Text style={styles.monthlyStatLabel}>
                            Total Meals
                          </Text>
                        </View>

                        <View style={styles.monthlyStatBox}>
                          <Ionicons
                            name="stats-chart-outline"
                            size={24}
                            color={colors.emerald}
                            style={styles.monthlyStatIcon}
                          />
                          <Text style={styles.monthlyStatValue}>
                            {Math.round(monthlyData.avgCalories)}
                          </Text>
                          <Text style={styles.monthlyStatLabel}>
                            Avg Calories
                          </Text>
                        </View>

                        <View style={styles.monthlyStatBox}>
                          <Ionicons
                            name="trophy-outline"
                            size={24}
                            color={colors.amber}
                            style={styles.monthlyStatIcon}
                          />
                          <Text style={styles.monthlyStatValue}>
                            {Math.round(monthlyData.highestDay)}
                          </Text>
                          <Text style={styles.monthlyStatLabel}>
                            Highest Day
                          </Text>
                        </View>
                      </View>

                      <View style={styles.monthlyTotalSection}>
                        <Text style={styles.monthlyTotalLabel}>
                          Total Calories
                        </Text>
                        <Text style={styles.monthlyTotalValue}>
                          {Math.round(
                            monthlyData.totalCalories
                          ).toLocaleString()}{" "}
                          cal
                        </Text>
                      </View>
                    </View>
                  </>
                )}
              </>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default Reports;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 64,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
  headerSubtitle: {
    color: colors.textTertiary,
    fontSize: fontSize.md,
    marginTop: spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: spacing.xl,
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statIconBlue: {
    backgroundColor: colors.blueTint,
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  statIconEmerald: {
    backgroundColor: colors.emeraldTint,
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  statValue: {
    color: colors.text,
    fontSize: 30,
    fontWeight: fontWeight.bold,
  },
  statLabel: {
    color: colors.textTertiary,
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  sectionSubtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: fontWeight.medium,
  },
  weeklyCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  weeklyChart: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  weeklyDay: {
    alignItems: "center",
    flex: 1,
  },
  weeklyDayLabel: {
    color: colors.textTertiary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    marginBottom: 6,
  },
  weeklyBar: {
    width: 28,
    height: 100,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.sm,
    justifyContent: "flex-end",
    overflow: "hidden",
    marginBottom: 6,
  },
  weeklyBarFill: {
    width: "100%",
    borderRadius: borderRadius.sm,
  },
  weeklyCalories: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  weeklyStats: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  weeklyStatItem: {
    alignItems: "center",
    flex: 1,
  },
  weeklyStatDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.border,
  },
  weeklyStatLabel: {
    color: colors.textTertiary,
    fontSize: fontSize.base,
    marginBottom: 4,
  },
  weeklyStatValue: {
    color: colors.textMedium,
    fontSize: 15,
    fontWeight: fontWeight.semibold,
  },
  macrosCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  macroRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  macroItem: {
    alignItems: "center",
  },
  macroIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  macroLabel: {
    color: colors.textTertiary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    marginBottom: 4,
  },
  macroValue: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    marginBottom: 2,
  },
  macroPercent: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
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
    marginBottom: spacing.xl,
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
  },
  monthlyCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: 20,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  monthlyStatsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: spacing.md,
  },
  monthlyStatBox: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: "center",
  },
  monthlyStatIcon: {
    marginBottom: spacing.sm,
  },
  monthlyStatValue: {
    color: colors.text,
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    marginBottom: 4,
  },
  monthlyStatLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    textAlign: "center",
  },
  monthlyTotalSection: {
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: "center",
  },
  monthlyTotalLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: fontWeight.medium,
    marginBottom: 4,
  },
  monthlyTotalValue: {
    color: colors.text,
    fontSize: fontSize.huge,
    fontWeight: fontWeight.bold,
  },
});
