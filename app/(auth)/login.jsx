import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { useRouter, Redirect } from "expo-router";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Redirect href="/(app)/(home)" />;
  }

  // Show loading screen while checking auth state
  if (authLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  const validateForm = () => {
    const newErrors = {};

    // Phone number validation
    if (!phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d+$/.test(phoneNumber.replace(/\s/g, ""))) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    } else if (phoneNumber.length < 9) {
      newErrors.phoneNumber = "Phone number must be 9 digits";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    setLoginError("");
    if (validateForm()) {
      try {
        setIsLoading(true);
        await login(phoneNumber, password);
        router.replace("/(app)/(home)");
      } catch (error) {
        console.error("Login error:", error);
        const detail = error.response?.data?.detail;
        const houseNum = error.response?.data?.house_number;
        if (error.response?.status === 403 && detail) {
          if (detail.includes("house owner")) {
            router.push({
              pathname: "/otp",
              params: { houseNumber: houseNum, phoneNumber },
            });
            return;
          } else if (detail.includes("phone number")) {
            router.push({ pathname: "/otpPhone", params: { phoneNumber } });
            return;
          }
        }
        setLoginError(detail || "Login failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Let's Sign You In</Text>
        <Text style={styles.subtitle}>Welcome back, you've been missed!</Text>
      </View>

      <View style={styles.form}>
        <Input
          label="Phone Number"
          value={phoneNumber}
          onChangeText={(text) => {
            // Only allow numbers and limit to 9 digits
            const cleanedText = text.replace(/[^0-9]/g, "").slice(0, 9);
            setPhoneNumber(cleanedText);
            if (errors.phoneNumber) {
              setErrors({ ...errors, phoneNumber: null });
            }
          }}
          keyboardType="phone-pad"
          placeholder=""
          error={errors.phoneNumber}
          prefix="+251"
        />

        <Input
          label="Password"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (errors.password) {
              setErrors({ ...errors, password: null });
            }
          }}
          placeholder="Enter your password"
          secureTextEntry
          error={errors.password}
        />

        {loginError ? <Text style={styles.errorText}>{loginError}</Text> : null}

        <TouchableOpacity
          style={styles.forgotPassword}
          onPress={() => router.push("/forgot-password")}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <Button
          title={isLoading ? "Logging in..." : "Login"}
          onPress={handleLogin}
          style={styles.loginButton}
          disabled={isLoading}
        >
          {isLoading && (
            <ActivityIndicator color="#fff" style={styles.loader} />
          )}
        </Button>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/register")}>
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  form: {
    flex: 1,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginVertical: 16,
  },
  forgotPasswordText: {
    color: "#2196F3",
    fontSize: 14,
  },
  loginButton: {
    marginTop: 20,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signupText: {
    color: "#666",
  },
  signupLink: {
    color: "#2196F3",
    fontWeight: "600",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  loader: {
    marginLeft: 10,
  },
});
