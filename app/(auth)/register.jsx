import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { useRouter, Redirect } from "expo-router";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const router = useRouter();
  const { register, isAuthenticated, isLoading: authLoading } = useAuth();

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

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setError(Object.values(newErrors).join("\n") || "");
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    setRegisterError("");
    if (validateForm()) {
      try {
        setIsLoading(true);
        await register({
          fullName,
          phoneNumber,
          houseNumber,
          password,
        });
        router.replace("/(app)/(home)");
      } catch (error) {
        console.error("Registration error:", error);
        setRegisterError(
          error.response?.data?.message ||
            "Registration failed. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Getting Started</Text>
          <Text style={styles.subtitle}>
            Seems you are new here,{"\n"}Let's set up your profile.
          </Text>
        </View>

        {registerError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{registerError}</Text>
          </View>
        ) : null}

        <View style={styles.form}>
          <Input
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
            placeholder="Abebe Kebede"
            autoCapitalize="words"
          />

          <Input
            label="Phone Number"
            value={phoneNumber}
            onChangeText={(text) => {
              // Only allow numbers and limit to 9 digits
              const cleanedText = text.replace(/[^0-9]/g, "").slice(0, 9);
              setPhoneNumber(cleanedText);
              if (error.includes("Phone number")) {
                setError(error.replace("Phone number", "").trim());
              }
            }}
            keyboardType="phone-pad"
            placeholder=""
            error={error.includes("Phone number")}
            prefix="+251"
          />

          <Input
            label="House Number"
            value={houseNumber}
            onChangeText={setHouseNumber}
            placeholder="907"
            Type="words"
          />

          <Input
            label="Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (error.includes("Password")) {
                setError(error.replace("Password", "").trim());
              }
            }}
            placeholder="Enter your password"
            secureTextEntry
            error={error.includes("Password")}
          />

          <Input
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (error.includes("Confirm password")) {
                setError(error.replace("Confirm password", "").trim());
              }
            }}
            placeholder="Confirm your password"
            secureTextEntry
            error={error.includes("Confirm password")}
          />

          <View style={styles.termsContainer}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setTermsAccepted(!termsAccepted)}
            >
              <View
                style={[
                  styles.checkboxInner,
                  termsAccepted && styles.checkboxChecked,
                ]}
              />
            </TouchableOpacity>
            <Text style={styles.termsText}>
              By creating an account, you agree to our{" "}
              <Text style={styles.termsLink}>Terms and Conditions</Text>
            </Text>
          </View>

          <Button
            title={isLoading ? "Creating Account..." : "Continue"}
            onPress={handleRegister}
            disabled={!termsAccepted || isLoading}
            style={styles.registerButton}
          >
            {isLoading && (
              <ActivityIndicator color="#fff" style={styles.loader} />
            )}
          </Button>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
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
    lineHeight: 24,
  },
  form: {
    flex: 1,
  },
  errorContainer: {
    backgroundColor: "#FFEBEE",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  errorText: {
    color: "#D32F2F",
    fontSize: 14,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#2196F3",
    marginRight: 10,
    padding: 2,
  },
  checkboxInner: {
    flex: 1,
    borderRadius: 2,
  },
  checkboxChecked: {
    backgroundColor: "#2196F3",
  },
  termsText: {
    flex: 1,
    color: "#666",
    fontSize: 14,
  },
  termsLink: {
    color: "#2196F3",
    fontWeight: "600",
  },
  registerButton: {
    marginTop: 20,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  loginText: {
    color: "#666",
  },
  loginLink: {
    color: "#2196F3",
    fontWeight: "600",
  },
  loader: {
    marginLeft: 10,
  },
});
