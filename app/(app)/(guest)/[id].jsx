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
import { guestsApi } from "../../services/api";

export default function GuestDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [guest, setGuest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGuestDetails();
  }, [id]);

  const fetchGuestDetails = async () => {
    try {
      setLoading(true);
      const response = await guestsApi.get(`/${id}/`);
      setGuest(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching guest details:", err);
      setError("Failed to load guest details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Guest",
      "Are you sure you want to delete this guest? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await guestsApi.delete(`/${id}/`);
              router.back();
            } catch (err) {
              console.error("Error deleting guest:", err);
              Alert.alert("Error", "Failed to delete guest. Please try again.");
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

  if (error || !guest) {
    return (
      <SafeAreaView style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorText}>{error || "Guest not found"}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={fetchGuestDetails}
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
        <View style={styles.guestHeaderContainer}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={24} color="white" />
          </View>
          <View style={styles.guestHeaderInfo}>
            <Text style={styles.guestName}>{guest.guest_name}</Text>
            <Text style={styles.guestDate}>
              {new Date(guest.visit_date).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Full Name</Text>
            <Text style={styles.detailValue}>{guest.guest_name}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Phone Number</Text>
            <Text style={styles.detailValue}>{guest.phone_number}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Visit Date</Text>
            <Text style={styles.detailValue}>
              {new Date(guest.visit_date).toLocaleDateString()}
            </Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Vehicle Status</Text>
            <Text style={styles.detailValue}>
              {guest.has_vechile ? "Has Vehicle" : "No Vehicle"}
            </Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Is Payer</Text>
            <Text style={styles.detailValue}>
              {guest.is_payer ? "Yes" : "No"}
            </Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Resident ID</Text>
            <Text style={styles.detailValue}>{guest.resident}</Text>
          </View>

          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>
              Created: {new Date(guest.created_at).toLocaleString()}
            </Text>
            <Text style={styles.timeText}>
              Last Updated: {new Date(guest.updated_at).toLocaleString()}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          activeOpacity={0.7}
        >
          <Text style={styles.deleteButtonText}>Delete Guest</Text>
        </TouchableOpacity>
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
    marginTop: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  guestHeaderContainer: {
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
  guestHeaderInfo: {
    flex: 1,
  },
  guestName: {
    fontSize: 16,
    fontWeight: "500",
  },
  guestDate: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  detailsContainer: {
    marginBottom: 30,
  },
  detailItem: {
    marginBottom: 20,
  },
  detailLabel: {
    fontSize: 12,
    color: "#999",
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 16,
    color: "#333",
  },
  timeContainer: {
    marginTop: 20,
  },
  timeText: {
    fontSize: 14,
    color: "#666",
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: "auto",
  },
  deleteButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
