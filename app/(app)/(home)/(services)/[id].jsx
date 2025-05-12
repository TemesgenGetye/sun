import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { servicesApi } from "../../../services/api";

export default function ServiceDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchServiceDetails();
  }, [id]);

  const fetchServiceDetails = async () => {
    try {
      setLoading(true);
      const response = await servicesApi.get(`/${id}/`);
      setService(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load service details. Please try again later.");
      setService(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Service Request",
      "Are you sure you want to delete this service request? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setDeleting(true);
              await servicesApi.delete(`/${id}/`);
              setDeleting(false);
              router.back();
            } catch (err) {
              setDeleting(false);
              Alert.alert(
                "Error",
                "Failed to delete service. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </SafeAreaView>
    );
  }

  if (error || !service) {
    return (
      <SafeAreaView style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorText}>{error || "Service not found"}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={fetchServiceDetails}
          activeOpacity={0.7}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.headerContainer}>
          <View style={styles.avatarContainer}>
            {/* Use the same icon logic as the list */}
            <Ionicons name="construct-outline" size={24} color="white" />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.title}>{service.service_type}</Text>
            <Text style={styles.dateText}>
              {new Date(service.created_at).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Service Type</Text>
            <Text style={styles.detailValue}>{service.service_type}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Status</Text>
            <Text style={styles.detailValue}>{service.request_status}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Description</Text>
            <Text style={styles.detailValue}>
              {service.request_description}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Created At</Text>
            <Text style={styles.detailValue}>
              {new Date(service.created_at).toLocaleString()}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Last Updated</Text>
            <Text style={styles.detailValue}>
              {new Date(service.updated_at).toLocaleString()}
            </Text>
          </View>
        </View>

        {service.request_status === "PENDING" && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
            activeOpacity={0.7}
            disabled={deleting}
          >
            <Text style={styles.deleteButtonText}>
              {deleting ? "Deleting..." : "Delete Service Request"}
            </Text>
          </TouchableOpacity>
        )}
        {service.request_status === "RESOLVED" && (
          <TouchableOpacity
            style={[
              styles.reviewButton,
              service.rating !== null &&
                service.rating !== undefined &&
                styles.inactiveButton,
            ]}
            onPress={() =>
              router.push(`/(app)/(home)/(services)/${service.id}/review`)
            }
            activeOpacity={0.7}
            disabled={service.rating !== null && service.rating !== undefined}
          >
            <Text
              style={[
                styles.reviewButtonText,
                service.rating !== null &&
                  service.rating !== undefined &&
                  styles.inactiveButtonText,
              ]}
            >
              {service.rating !== null && service.rating !== undefined
                ? "Already Reviewed"
                : "Review"}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
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
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 8,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
  },
  dateText: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  detailsContainer: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  detailItem: {
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: "#222",
    fontWeight: "500",
  },
  deleteButton: {
    backgroundColor: "#FF5C5C",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  errorText: {
    color: "#FF5C5C",
    fontSize: 16,
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  reviewButton: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
  },
  reviewButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  inactiveButton: {
    backgroundColor: "#94a3b8",
  },
  inactiveButtonText: {
    color: "#f1f5f9",
  },
});
