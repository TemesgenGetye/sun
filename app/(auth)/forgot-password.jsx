import { View, Text, StyleSheet, Alert } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { forgotPasswordRequest } from "../services/api";

export default function ForgotPassword() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleResetPassword = async () => {
    try {
      setLoading(true);
      await forgotPasswordRequest(phoneNumber);
      router.push({
        pathname: "/otpForgotPassword",
        params: { phoneNumber },
      });
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.detail || "Failed to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Forget Password</Text>
        <Text style={styles.subtitle}>
          Enter your phone number{"\n"}to reset password.
        </Text>
      </View>

      <View style={styles.form}>
        <Input
          label="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="+251 987456321"
          keyboardType="phone-pad"
        />

        <Button
          title="Reset Password"
          onPress={handleResetPassword}
          style={styles.resetButton}
          disabled={!phoneNumber || loading}
          loading={loading}
        />
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
    lineHeight: 24,
  },
  form: {
    flex: 1,
  },
  resetButton: {
    marginTop: 20,
  },
});
