import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useState, useRef, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import Button from "../../components/ui/Button";
import { TextInput } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function OTPVerification() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(50);
  const [canResend, setCanResend] = useState(false);
  const router = useRouter();
  const inputRefs = useRef([]);
  const { verifyPhone, resendPhoneOTP } = useAuth();
  const { phoneNumber: routePhoneNumber, houseNumber: routeHouseNumber } = useLocalSearchParams();

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    // Move to previous input on backspace if current input is empty
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    try {
      await resendPhoneOTP(routePhoneNumber);
      setTimer(50);
      setCanResend(false);
      setError("");
    } catch (error) {
      setError(
        error.response?.data?.detail ||
          "Failed to resend OTP. Please try again."
      );
    }
  };

  const handleSubmit = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 4) {
      setError("Please enter a valid OTP");
      return;
    }

    try {
      await verifyPhone(otpValue, routePhoneNumber, routeHouseNumber);
      router.replace("/(app)/(home)");
    } catch (error) {
      setError(
        error.response?.data?.detail || "Invalid OTP. Please try again."
      );
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>OTP Verification</Text>
        <Text style={styles.subtitle}>
          An Authentication code has been sent to{"\n"} your phone number{" "}
          <Text style={styles.phoneNumber}>{routePhoneNumber}</Text>
        </Text>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.otpInput}
            value={digit}
            onChangeText={(value) => handleOtpChange(value, index)}
            keyboardType="numeric"
            maxLength={1}
            ref={(ref) => (inputRefs.current[index] = ref)}
            onKeyPress={(e) => handleKeyPress(e, index)}
          />
        ))}
      </View>

      <Text style={styles.timerText}>
        {canResend ? (
          <TouchableOpacity onPress={handleResendOTP}>
            <Text style={styles.resendText}>Resend Code</Text>
          </TouchableOpacity>
        ) : (
          <>
            Code Sent. Resend Code in{" "}
            <Text style={styles.timer}>{formatTime(timer)}</Text>
          </>
        )}
      </Text>

      <Button
        title="Submit"
        onPress={handleSubmit}
        style={styles.submitButton}
        disabled={otp.some((digit) => !digit)}
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
  phoneNumber: {
    fontWeight: "600",
    color: "#333",
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
    textAlign: "center",
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
  resendText: {
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
