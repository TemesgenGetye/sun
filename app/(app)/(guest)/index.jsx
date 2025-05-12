import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { guestsApi } from "../../services/api";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GuestScreen() {
  const router = useRouter();
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      fetchGuests();
    }, [])
  );

  const fetchGuests = async () => {
    try {
      setLoading(true);
      const response = await guestsApi.get("/");
      // Handle paginated response
      const guestsData = response.data.results || [];
      setGuests(guestsData);
      setError(null);
    } catch (err) {
      console.error("Error fetching guests:", err);
      setError("Failed to load guests. Please try again later.");
      setGuests([]); // Reset guests to empty array on error
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={fetchGuests}
          activeOpacity={0.7}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.innerContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Guests</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.navigate("/(guest)/add")}
              activeOpacity={0.7}
            >
              <Text style={styles.addButtonText}>+ Add Guest</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            This are the list of guests in SunShine Meri Luke Compound
          </Text>

          {guests.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={48} color="#999" />
              <Text style={styles.emptyText}>No guests found</Text>
            </View>
          ) : (
            <ScrollView
              style={styles.guestList}
              showsVerticalScrollIndicator={false}
            >
              {guests.map((guest) => (
                <TouchableOpacity
                  key={guest.id}
                  style={styles.guestItem}
                  onPress={() => router.navigate(`/(guest)/${guest.id}`)}
                  activeOpacity={0.7}
                >
                  <View style={styles.guestInfo}>
                    <View style={styles.avatarContainer}>
                      <Ionicons name="person" size={20} color="#007AFF" />
                    </View>
                    <View style={styles.textContainer}>
                      <Text style={styles.guestName}>{guest.guest_name}</Text>
                      <Text style={styles.guestDate}>{guest.visit_date}</Text>
                    </View>
                  </View>
                  {guest.has_vechile && (
                    <View style={styles.vechileBadge}>
                      <Ionicons name="car" size={16} color="#4CD964" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
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
    paddingBottom: 100,
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
  guestList: {
    flex: 1,
  },
  guestItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  guestInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
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
  guestName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    marginBottom: 4,
  },
  guestDate: {
    fontSize: 12,
    color: "#666",
  },
  vechileBadge: {
    backgroundColor: "#E8F5E9",
    padding: 8,
    borderRadius: 8,
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    color: "#999",
    fontSize: 16,
    marginTop: 12,
  },
});
