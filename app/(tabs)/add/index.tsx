import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { FoodAnalysis } from "@/services/api";
import { useAnalyzeFood, useDiscardFood, useSaveFood } from "@/hooks/useFood";
import {
  borderRadius,
  colors,
  fontSize,
  fontWeight,
  spacing,
} from "@/constants/theme";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import FoodPreviewModal from "@/components/FoodPreviewModal";

const Add = () => {
  const [foodName, setFoodName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [previewData, setPreviewData] = useState<FoodAnalysis | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const analyzeMutation = useAnalyzeFood();
  const saveMutation = useSaveFood();
  const discardMutation = useDiscardFood();

  const requestCameraPermission = async (): Promise<boolean> => {
    const { status: cameraStatus } =
      await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== "granted" || mediaStatus !== "granted") {
      Alert.alert(
        "Permission Required",
        "we need your permission to access your camera and media library",
        [{ text: "OK" }]
      );
      return false;
    }

    return true;
  };

  const handleImagePicker = async (source: "camera" | "gallery") => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    let result: ImagePicker.ImagePickerResult;

    if (source === "camera") {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    }

    if (!result.canceled && result.assets && result.assets[0]) {
      setImage(result.assets[0]);
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      "Select Image Source",
      "Choose an image from your camera or gallery",
      [
        {
          text: "Camera",
          onPress: () => handleImagePicker("camera"),
        },
        {
          text: "Gallery",
          onPress: () => handleImagePicker("gallery"),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      {
        cancelable: true,
      }
    );
  };

  const handleAccept = async () => {
    if (!previewData) return;

    try {
      // save food to database

      await saveMutation.mutateAsync(previewData);

      // clear form data

      setShowPreview(false);
      setImage(null);
      setFoodName("");
      setDescription("");
      setPreviewData(null);

      Alert.alert("Success", `${previewData.foodName} added to your diary`, [
        { text: "OK" },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to add food to your diary", [
        { text: "OK" },
      ]);
    }
  };

  const handleDecline = async () => {
    // discard food from database
    if (!previewData) return;

    try {
      await discardMutation.mutateAsync(previewData.storageKey);

      // clear form data
      setShowPreview(false);
      setPreviewData(null);
    } catch (error) {
      console.error("error in handleDecline", error);

      // clear form data
      setShowPreview(false);
      setPreviewData(null);
    }
  };

  const handleSubmit = async () => {
    if (!image) {
      Alert.alert("Error", "Please select an image");
      return;
    }

    try {
      const formData = new FormData();



       // Extract file extension from image uri properly
    // Handle different URI formats: file://, ph://, content://, etc.
    let fileExtension = "jpg";
    let mimeType = "image/jpeg";
    
    // Try to get extension from URI
    const uriMatch = image.uri.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
    if (uriMatch) {
      fileExtension = uriMatch[1].toLowerCase();
    }
    
    // Set proper MIME type based on extension
    switch (fileExtension) {
      case "jpg":
      case "jpeg":
        mimeType = "image/jpeg";
        break;
      case "png":
        mimeType = "image/png";
        break;
      case "gif":
        mimeType = "image/gif";
        break;
      case "webp":
        mimeType = "image/webp";
        break;
      default:
        mimeType = "image/jpeg"; // default to jpeg
        fileExtension = "jpg";
    }

    // Append image to form data
    // React Native FormData requires this specific format
    // expo-image-picker handles ph:// URIs correctly
    // @ts-ignore - React Native FormData typing
    formData.append("image", {
      uri: image.uri,
      name: `image.${fileExtension}`,
      type: mimeType,
    } as any);
      

      // mutation to analyze food

      const result = await analyzeMutation.mutateAsync(formData);

      setPreviewData(result);
      setShowPreview(true);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to analyze food");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={0}
    >
      <StatusBar style="dark" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerLabel}>New Entry</Text>
          <Text style={styles.headerTitle}>Log Your Meal</Text>
          <Text style={styles.headerSubtitle}>
            Add a photo or describe what you ate
          </Text>
        </View>

        <View style={styles.content}>
          {/* Image Preview */}
          {image && (
            <View style={styles.imageContainer}>
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: image.uri }}
                  style={styles.image}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  onPress={() => setImage(null)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={20} color={colors.white} />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Take Photo / Select Image Button */}
          <TouchableOpacity
            onPress={showImagePickerOptions}
            activeOpacity={0.7}
            style={[
              styles.imagePickerButton,
              analyzeMutation.isPending && styles.disabled,
            ]}
            disabled={analyzeMutation.isPending}
          >
            <View style={styles.imagePickerIcon}>
              <Ionicons
                name={image ? "image-outline" : "camera-outline"}
                size={22}
                color={colors.primary}
              />
            </View>
            <Text style={styles.imagePickerText}>
              {image ? "Change Image" : "Take Photo or Select from Gallery"}
            </Text>
          </TouchableOpacity>

          {/* Food Name (Optional - will be auto-filled by AI) */}
          <Text style={styles.label}>
            Food Name (Optional - AI will detect)
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="e.g., Chicken Salad (optional)"
              value={foodName}
              onChangeText={setFoodName}
              placeholderTextColor={colors.textTertiary}
              style={styles.input}
              editable={!analyzeMutation.isPending}
            />
          </View>

          {/* Description (Optional) */}
          <Text style={styles.label}>Description (Optional)</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Describe your meal..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholderTextColor={colors.textTertiary}
              style={styles.textArea}
              editable={!analyzeMutation.isPending}
            />
          </View>

          {/* Submit Button */}

          {/* Analyze Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            activeOpacity={0.8}
            style={[
              styles.submitButton,
              (analyzeMutation.isPending || !image) &&
                styles.submitButtonDisabled,
            ]}
            disabled={analyzeMutation.isPending || !image}
          >
            {analyzeMutation.isPending ? (
              <>
                <ActivityIndicator
                  color={colors.white}
                  size="small"
                  style={styles.loader}
                />
                <Text style={styles.submitButtonText}>Analyzing Food...</Text>
              </>
            ) : (
              <Text style={styles.submitButtonText}>Analyze Food</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Food Analysis Result Modal */}
      <FoodPreviewModal
        visible={showPreview}
        foodData={previewData}
        isLoading={analyzeMutation.isPending}
        onAccept={handleAccept}
        onDecline={handleDecline}
      />
    </KeyboardAvoidingView>
  );
};

export default Add;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
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
  content: {
    paddingHorizontal: 20,
    paddingTop: spacing.lg,
  },
  imageContainer: {
    marginBottom: 20,
  },
  imageWrapper: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  image: {
    width: "100%",
    height: 256,
    borderRadius: borderRadius.md,
  },
  closeButton: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    backgroundColor: colors.overlay,
    borderRadius: borderRadius.full,
    padding: spacing.sm,
  },
  imagePickerButton: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.6,
  },
  imagePickerIcon: {
    backgroundColor: colors.roseLight,
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  imagePickerText: {
    color: colors.primary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  label: {
    color: colors.textSecondary,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
    marginLeft: 4,
  },
  inputContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  input: {
    color: colors.text,
    fontSize: fontSize.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  textArea: {
    color: colors.text,
    fontSize: fontSize.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    height: 112,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    alignItems: "center",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  loader: {
    marginRight: spacing.sm,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  tipCard: {
    backgroundColor: colors.yellowLight,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.amberLight,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  tipIcon: {
    backgroundColor: colors.amberLight,
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 2,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    color: colors.amberDark,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    marginBottom: 4,
  },
  tipText: {
    color: colors.amberLight,
    fontSize: fontSize.base,
    lineHeight: 20,
  },
});
