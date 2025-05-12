import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const PaymentDetailScreen = () => {
  const { id } = useLocalSearchParams();

  // In a real app, you would get this from route.params
  const payment = {
    title: "June Rent",
    dueDate: "Due Sept 23 2025",
    amount: "8,000 Birr",
    status: "not-paid",
    requestedBy: "SunShine Meri Luke Compound",
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{payment.title}</Text>
          {payment.status === "not-paid" && (
            <View style={styles.notPaidBadge}>
              <Text style={styles.notPaidText}>Not Paid</Text>
            </View>
          )}
        </View>

        <Text style={styles.subtitle}>
          This is a payment requested by {payment.requestedBy}
        </Text>

        <View style={styles.paymentDetails}>
          <View style={styles.paymentRow}>
            <View style={styles.dollarContainer}>
              <Text style={styles.dollarSign}>$</Text>
            </View>
            <View style={styles.paymentInfo}>
              <Text style={styles.dueDate}>{payment.dueDate}</Text>
              <Text style={styles.amount}>{payment.amount}</Text>
            </View>
          </View>
        </View>

        {/* Pay Button */}
        <TouchableOpacity
          style={styles.payButton}
          onPress={() => router.push("/(app)/(payment)/success")}
        >
          <Text style={styles.payButtonText}>Pay</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    marginTop: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginRight: 10,
    color: "#000",
  },
  notPaidBadge: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  notPaidText: {
    color: "white",
    fontSize: 10,
    fontWeight: "500",
  },
  subtitle: {
    color: "#666",
    fontSize: 14,
    marginBottom: 30,
  },
  paymentDetails: {
    flex: 1,
  },
  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  dollarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  dollarSign: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  paymentInfo: {
    flex: 1,
  },
  dueDate: {
    fontSize: 14,
    color: "#666",
  },
  amount: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 4,
  },
  payButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  payButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default PaymentDetailScreen;
