import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import {
  colors,
  fontWeight,
  fontSize,
  spacing,
  borderRadius,
} from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";

const Register = () => {
  const [email, setEmail] = useState("mchamuuda@dugsiiye.com");
  const [password, setPassword] = useState("12345678");
  const [name, setName] = useState("John Doe");
  const [confirmPassword, setConfirmPassword] = useState("12345678");
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState(2000);

  const { registerMutation } = useAuth();

  const handleRegister = async () => {
      if (!name || !email || !password || !confirmPassword) {
        Alert.alert("Error", "Please enter your name, email and password");
        return;
      }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Password and Confirm Password do not match");
      return;
    }

    try {
      await registerMutation.mutateAsync({ name, dailyCalorieGoal: 2000, email, password });
      router.replace("/onboarding");
    } catch (error) {
      console.error("Register error:", error);
      Alert.alert("Error", (error as string));
      // setPassword("");
    }
  };

  const goToLogin = () => {
    router.replace("/login");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="restaurant" size={24} color={colors.primary} />
            </View>

            <Text style={styles.title}>Welcome</Text>
            <Text style={styles.subtitle}>
              Sign in to continue tracking your meals
            </Text>
          </View>

          {/* form */}

          <View style={styles.form}>

          <View style={styles.inputGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor={colors.placeholder}
                value={name}
                onChangeText={setName}
                autoCapitalize="none"
                keyboardType="default"
                // editable={!loginMutation.isPending}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={colors.placeholder}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                // editable={!loginMutation.isPending}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Daily Calorie Goal</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 2000"
                placeholderTextColor={colors.placeholder}
                value={dailyCalorieGoal.toString()}
                onChangeText={(text) => setDailyCalorieGoal(Number(text))}
                autoCapitalize="none"
                keyboardType="numeric"
                // editable={!loginMutation.isPending}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor={colors.placeholder}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                // editable={!loginMutation.isPending}
              />
            </View>


            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                placeholderTextColor={colors.placeholder}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                // editable={!loginMutation.isPending}
              />
            </View>


            {/* <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Sigin</Text>
            </TouchableOpacity> */}

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleRegister}
              disabled={registerMutation.isPending}
              activeOpacity={0.8}
              style={styles.button}
            >
              {registerMutation.isPending ? (
                <ActivityIndicator color={colors.white} size="small" />
              ) : (
                <Text style={styles.buttonText}>Sign Up</Text>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.registerLink}>
              <Text style={styles.registerText}>Already have an account? </Text>
              <TouchableOpacity
                onPress={goToLogin}
                disabled={registerMutation.isPending}
              >
                <Text style={styles.registerLinkText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Register;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },

  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.xxl,
  },
  iconContainer: {
    backgroundColor: colors.background,
    width: 80,
    height: 80,
    borderRadius: borderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: colors.textDark,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: "center",
  },

  form: {
    marginBottom: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    color: colors.textMedium,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    marginBottom: spacing.sm,
    marginLeft: 4,
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: borderRadius.md,
    fontSize: 16,
    color: colors.textDark,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: borderRadius.md,
    elevation: 8,
  },
  buttonText: {
    color: colors.white,
    textAlign: "center",
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },

  scrollContent: {
    flexGrow: 1,
  },

  registerLink: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.md,
  },
  registerText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  registerLinkText: {
    color: colors.primary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
});
