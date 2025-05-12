import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useState, useRef, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import Button from "../../components/ui/Button";
import { TextInput } from "react-native";
import { verifyForgotPasswordOTP } from "../services/api";

export default function OTPVerification() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(50);
  const router = useRouter();
  const { phoneNumber } = useLocalSearchParams();
  const inputRefs = useRef([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered and next input exists
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    // Move to previous input on backspace if current input is empty and previous input exists
    if (
      e.nativeEvent.key === "Backspace" &&
      !otp[index] &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const otpValue = otp.join("");
      await verifyForgotPasswordOTP(phoneNumber, otpValue);
      router.push({
        pathname: "/reset-password",
        params: { phoneNumber },
      });
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.detail || "Invalid OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>OTP Verification</Text>
        <Text style={styles.subtitle}>
          An Authentication code has been sent to{"\n"}
          <Text style={styles.phone}>{phoneNumber}</Text>
        </Text>
      </View>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.otpInput}
            value={digit}
            onChangeText={(value) => handleOtpChange(value, index)}
            keyboardType="numeric"
            maxLength={1}
            ref={(ref) => {
              inputRefs.current[index] = ref;
            }}
            onKeyPress={(e) => handleKeyPress(e, index)}
          />
        ))}
      </View>

      <Text style={styles.timerText}>
        Code Sent. Resend Code in{" "}
        <Text style={styles.timer}>
          {Math.floor(timer / 10)}0:{timer % 10}0
        </Text>
      </Text>

      <Button
        title="Submit"
        onPress={handleSubmit}
        style={styles.submitButton}
        disabled={otp.some((digit) => !digit) || loading}
        loading={loading}
      />

      <TouchableOpacity
        style={styles.loginLink}
        onPress={() => router.push("/login")}
      >
        <Text style={styles.loginText}>Go to Login page →</Text>
      </TouchableOpacity>
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
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
  phone: {
    fontWeight: "600",
    color: "#333",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    fontSize: 24,
    textAlign: "center",
    backgroundColor: "#f8f8f8",
  },
  timerText: {
    textAlign: "center",
    color: "#666",
    marginTop: 20,
  },
  timer: {
    color: "#2196F3",
    fontWeight: "600",
  },
  submitButton: {
    marginTop: 40,
  },
  loginLink: {
    marginTop: 20,
    alignItems: "center",
  },
  loginText: {
    color: "#2196F3",
    fontSize: 16,
    fontWeight: "600",
  },
});
