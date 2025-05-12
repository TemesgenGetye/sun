import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const PaymentsScreen = () => {
  const payments = [
    {
      id: 1,
      title: "June Rent",
      dueDate: "Due Sept 23 2025",
      amount: "8,000 Birr",
      status: "not-paid",
    },
    {
      id: 2,
      title: "August Rent",
      dueDate: "Due Sept 23 2025",
      amount: "8,000 Birr",
      status: "not-paid",
    },
    {
      id: 3,
      title: "April Rent",
      dueDate: "Due Sept 23 2025",
      amount: "8,000 Birr",
      status: "paid",
    },
    {
      id: 4,
      title: "May Rent",
      dueDate: "Due Sept 23 2025",
      amount: "8,000 Birr",
      status: "paid",
    },
    {
      id: 5,
      title: "April Rent",
      dueDate: "Due Sept 23 2025",
      amount: "8,000 Birr",
      status: "paid",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Payments</Text>
        <Text style={styles.subtitle}>
          This are the list of payments requested by SunShine Meri Luke Compound
        </Text>

        <ScrollView style={styles.paymentsList}>
          {payments.map((payment) => (
            <TouchableOpacity
              key={payment.id}
              style={styles.paymentItem}
              onPress={() => router.push(`/(app)/(payment)/${payment.id}`)}
            >
              <View style={styles.paymentInfo}>
                <View style={styles.dollarContainer}>
                  <Text style={styles.dollarSign}>$</Text>
                </View>
                <View>
                  <View style={styles.titleRow}>
                    <Text style={styles.paymentTitle}>{payment.title}</Text>
                    {payment.status === "not-paid" && (
                      <View style={styles.notPaidBadge}>
                        <Text style={styles.notPaidText}>Not Paid</Text>
                      </View>
                    )}
                    {payment.status === "paid" && (
                      <View style={styles.paidBadge}>
                        <Text style={styles.paidText}>Paid</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.dueDate}>{payment.dueDate}</Text>
                </View>
              </View>
              <Text style={styles.amount}>{payment.amount}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 8,
    color: "#000",
  },
  subtitle: {
    color: "#666",
    marginBottom: 16,
  },
  paymentsList: {
    flex: 1,
  },
  paymentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  paymentInfo: {
    flexDirection: "row",
    alignItems: "center",
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
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginRight: 8,
  },
  dueDate: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  amount: {
    fontSize: 14,
    fontWeight: "500",
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
  paidBadge: {
    backgroundColor: "#4CD964",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  paidText: {
    color: "white",
    fontSize: 10,
    fontWeight: "500",
  },
});

export default PaymentsScreen;
