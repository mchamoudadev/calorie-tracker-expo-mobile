import {
  borderRadius,
  colors,
  fontSize,
  fontWeight,
  spacing,
} from "@/constants/theme";
import { FoodAnalysis } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
} from "react-native";

import { Image } from "expo-image";

interface FoodPreviewModalProps {
  visible: boolean;
  foodData: FoodAnalysis | null;
  isLoading?: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

const FoodPreviewModal = ({
  visible,
  foodData,
  isLoading,
  onAccept,
  onDecline,
}: FoodPreviewModalProps) => {
  if (!foodData) return null;

  const totalMacros =
    (foodData.protein || 0) + (foodData.carbs || 0) + (foodData.fat || 0);
  const proteinPercent =
    totalMacros > 0 ? ((foodData.protein || 0) / totalMacros) * 100 : 0;
  const carbsPercent =
    totalMacros > 0 ? ((foodData.carbs || 0) / totalMacros) * 100 : 0;
  const fatPercent =
    totalMacros > 0 ? ((foodData.fat || 0) / totalMacros) * 100 : 0;

  return (
    <Modal
      visible={visible}
      onRequestClose={onDecline}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Header */}
            <View style={styles.header}>
              <View>
                <Text style={styles.headerLabel}>Food Preview</Text>
                <Text style={styles.headerTitle}>Does this look right?</Text>
              </View>
              <TouchableOpacity onPress={onDecline} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Food Image */}
            {(foodData.imageBase64 || foodData.imageUrl) && (
              <View style={styles.imageContainer}>
                <Image
                  source={foodData.imageBase64 || foodData.imageUrl}
                  style={styles.image}
                  contentFit="cover"
                  transition={200}
                  onError={(error) => {
                    console.log("❌ Image load error:", error);
                    console.log(
                      "Image source:",
                      foodData.imageBase64 ? "base64" : foodData.imageUrl
                    );
                  }}
                  onLoad={() => {
                    console.log(
                      "✅ Image loaded successfully via",
                      foodData.imageBase64 ? "base64" : "URL"
                    );
                  }}
                />
              </View>
            )}

            {/* Food Name */}
            <View style={styles.section}>
              <View style={styles.nameContainer}>
                <Ionicons name="restaurant" size={24} color={colors.primary} />
                <Text style={styles.foodName}>{foodData.foodName}</Text>
              </View>
              <View style={styles.mealTypeBadge}>
                <Text style={styles.mealTypeText}>{foodData.mealType}</Text>
              </View>
            </View>

            {/* Calories Card */}
            <View style={styles.caloriesCard}>
              <View style={styles.caloriesIcon}>
                <Ionicons name="flame" size={32} color={colors.primary} />
              </View>
              <View style={styles.caloriesContent}>
                <Text style={styles.caloriesLabel}>Total Calories</Text>
                <Text style={styles.caloriesValue}>{foodData.calories}</Text>
              </View>
            </View>

            {/* Macros Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Nutritional Information</Text>


            {/* Macro Bars */}
            <View style={styles.macroItem}>
              <View style={styles.macroHeader}>
                <View style={styles.macroLabel}>
                  <View
                    style={[styles.macroDot, { backgroundColor: colors.blue }]}
                  />
                  <Text style={styles.macroName}>Protein</Text>
                </View>
                <Text style={styles.macroValue}>{foodData.protein || 0}g</Text>
              </View>
              <View style={styles.macroBarContainer}>
                <View
                  style={[
                    styles.macroBar,
                    {
                      width: `${proteinPercent}%`,
                      backgroundColor: colors.blue,
                    },
                  ]}
                />
              </View>
            </View>
            {/* Carbs Bar */}
            <View style={styles.macroItem}>
              <View style={styles.macroHeader}>
                <View style={styles.macroLabel}>
                  <View
                    style={[styles.macroDot, { backgroundColor: colors.amber }]}
                  />
                  <Text style={styles.macroName}>Carbs</Text>
                </View>
                <Text style={styles.macroValue}>{foodData.carbs || 0}g</Text>
              </View>
              <View style={styles.macroBarContainer}>
                <View
                  style={[
                    styles.macroBar,
                    {
                      width: `${carbsPercent}%`,
                      backgroundColor: colors.amber,
                    },
                  ]}
                />
              </View>
            </View>
            {/* Fat Bar */}
            <View style={styles.macroItem}>
              <View style={styles.macroHeader}>
                <View style={styles.macroLabel}>
                  <View
                    style={[
                      styles.macroDot,
                      { backgroundColor: colors.emerald },
                    ]}
                  />
                  <Text style={styles.macroName}>Fat</Text>
                </View>
                <Text style={styles.macroValue}>{foodData.fat || 0}g</Text>
              </View>
              <View style={styles.macroBarContainer}>
                <View
                  style={[
                    styles.macroBar,
                    {
                      width: `${fatPercent}%`,
                      backgroundColor: colors.emerald,
                    },
                  ]}
                />
              </View>
            </View>

            </View>


            {/* Info Card */}
            <View style={styles.infoCard}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color={colors.blue}
              />
              <Text style={styles.infoText}>
                AI-detected nutritional information. You can still add this to
                your diary or decline if it doesn't look right.
              </Text>
            </View>
          </ScrollView>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={onDecline}
              style={[styles.button, styles.declineButton]}
              disabled={isLoading}
            >
              <Ionicons name="close-circle-outline" size={20} color={colors.textSecondary} />
              <Text style={styles.declineButtonText}>Decline</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onAccept}
              style={[styles.button, styles.acceptButton]}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <ActivityIndicator color={colors.white} size="small" />
                  <Text style={styles.acceptButtonText}>Saving...</Text>
                </>
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={20} color={colors.white} />
                  <Text style={styles.acceptButtonText}>Add to Diary</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
};

export default FoodPreviewModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: "90%",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 20,
    paddingTop: spacing.lg,
  },
  headerLabel: {
    fontSize: fontSize.base,
    color: colors.textTertiary,
    fontWeight: fontWeight.medium,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginTop: 4,
  },
  closeButton: {
    padding: 4,
  },
  imageContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surfaceSecondary,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  foodName: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginLeft: spacing.sm,
    flex: 1,
  },
  mealTypeBadge: {
    backgroundColor: colors.roseLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.md,
    alignSelf: "flex-start",
  },
  mealTypeText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
    textTransform: "capitalize",
  },
  caloriesCard: {
    backgroundColor: colors.roseLight,
    marginHorizontal: 20,
    marginBottom: spacing.lg,
    padding: 20,
    borderRadius: borderRadius.lg,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.borderRose,
  },
  caloriesIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  caloriesContent: {
    flex: 1,
  },
  caloriesLabel: {
    fontSize: fontSize.md,
    color: colors.primaryDark,
    fontWeight: fontWeight.medium,
    marginBottom: 4,
  },
  caloriesValue: {
    fontSize: fontSize.massive,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  macroItem: {
    marginBottom: spacing.md,
  },
  macroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  macroLabel: {
    flexDirection: "row",
    alignItems: "center",
  },
  macroDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.sm,
  },
  macroName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.textBody,
  },
  macroValue: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  macroBarContainer: {
    height: 8,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 4,
    overflow: "hidden",
  },
  macroBar: {
    height: "100%",
    borderRadius: 4,
  },
  infoCard: {
    backgroundColor: colors.blueLight,
    marginHorizontal: 20,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: colors.borderBlue,
  },
  infoText: {
    fontSize: fontSize.base,
    color: colors.blueDark,
    lineHeight: 18,
    marginLeft: spacing.sm,
    flex: 1,
  },
  actions: {
    flexDirection: "row",
    padding: 20,
    paddingTop: spacing.md,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  declineButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderMedium,
  },
  declineButtonText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
  },
  acceptButton: {
    backgroundColor: colors.primary,
  },
  acceptButtonText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.white,
  },
});
