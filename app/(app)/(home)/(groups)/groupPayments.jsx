import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";

export default function GroupPaymentsScreen() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [groupPayments, setGroupPayments] = useState([]);

  useEffect(() => {
    // Simulate API call
    const loadPayments = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
        setGroupPayments([
          {
            id: 1,
            title: "Monthly Dues",
            amount: "Ksh 5,000",
            dueDate: "April 30, 2024",
            status: "Pending",
          },
          {
            id: 2,
            title: "Maintenance Fee",
            amount: "Ksh 2,000",
            dueDate: "May 15, 2024",
            status: "Paid",
          },
        ]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, [id]);

  const getStatusColor = (status) => {
    return status === "Paid" ? "#4CD964" : "#FF9500";
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.innerContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Group Payments</Text>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>+ Add Payment</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            These are the payments for your group
          </Text>

          <ScrollView style={styles.paymentsList}>
            {groupPayments.map((payment) => (
              <TouchableOpacity key={payment.id} style={styles.paymentCard}>
                <View style={styles.paymentInfo}>
                  <View style={styles.avatarContainer}>
                    <Ionicons name="cash" size={20} color="#007AFF" />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.paymentTitle}>{payment.title}</Text>
                    <Text style={styles.paymentAmount}>{payment.amount}</Text>
                    <Text style={styles.paymentDate}>
                      Due: {payment.dueDate}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(payment.status) },
                    ]}
                  >
                    <Text style={styles.statusText}>{payment.status}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

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
  },
  innerContent: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
  },
  addButton: {
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: "#007AFF",
    fontWeight: "500",
    fontSize: 14,
  },
  subtitle: {
    color: "#666",
    marginBottom: 24,
  },
  paymentsList: {
    flex: 1,
  },
  paymentCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  paymentInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F9FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    marginBottom: 4,
  },
  paymentAmount: {
    fontSize: 14,
    color: "#007AFF",
    marginBottom: 4,
  },
  paymentDate: {
    fontSize: 12,
    color: "#666",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
