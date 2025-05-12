import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { incidentsApi } from "../../../services/api";
import { useFocusEffect } from "@react-navigation/native";

const IncidentCard = ({ image, description, time, status }) => (
  <View style={styles.incidentCard}>
    <Image source={{ uri: image }} style={styles.incidentImage} />
    <Text style={styles.incidentDescription}>{description}</Text>
    <View style={styles.incidentFooter}>
      <Text style={styles.incidentTime}>{time}</Text>
      <View
        style={[
          styles.statusBadge,
          status === "PENDING" && styles.pendingBadge,
        ]}
      >
        <Text style={styles.statusText}>{status}</Text>
      </View>
    </View>
  </View>
);

export default function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const response = await incidentsApi.get("/");
      setIncidents(response.data.results || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching incidents:", err);
      setError("Failed to load incidents. Please try again later.");
      setIncidents([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchIncidents();
    }, [])
  );

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
          onPress={fetchIncidents}
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
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.innerContent}>
            <View style={styles.header}>
              <Text style={styles.title}>Incidents</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() =>
                  router.push("/(app)/(home)/(incidents)/AddIncident")
                }
              >
                <Text style={styles.addButtonText}>Add Incident</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.subtitle}>
              These are the reported incidents in SunShine Meri Luke Compound
            </Text>

            {incidents.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No incidents reported yet</Text>
              </View>
            ) : (
              <View style={styles.incidentsList}>
                {incidents.map((incident) => (
                  <IncidentCard
                    key={incident.id}
                    image={incident.evidence_file_path}
                    description={incident.incident_description}
                    time={new Date(incident.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    status={incident.incident_status}
                  />
                ))}
              </View>
            )}
          </View>
        </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  innerContent: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
  },
  subtitle: {
    color: "#666",
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
  incidentsList: {
    flex: 1,
  },
  incidentCard: {
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
  },
  incidentImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  incidentDescription: {
    fontSize: 16,
    fontWeight: "500",
    padding: 16,
    paddingBottom: 8,
  },
  incidentFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  incidentTime: {
    color: "#666",
    fontSize: 14,
  },
  statusBadge: {
    backgroundColor: "#4CD964",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  pendingBadge: {
    backgroundColor: "#FF9500",
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  emptyText: {
    color: "#666",
    fontSize: 16,
  },
});
