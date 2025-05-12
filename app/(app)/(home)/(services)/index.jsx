import React, { useEffect, useState } from "react";
import { servicesApi } from "../../../services/api";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { router, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import CurvedHeader from "../../../components/CurvedHeader";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

const getServiceIcon = (type) => {
  switch (type?.toLowerCase()) {
    case "plumbing":
      return <Ionicons name="water-outline" size={30} color="#2563eb" />;
    case "electric":
    case "electricity":
      return <Ionicons name="flash-outline" size={30} color="#fbbf24" />;
    case "wall fix":
    case "maintenance":
      return <Ionicons name="construct-outline" size={30} color="#22C55E" />;
    case "cleaning":
      return <Ionicons name="broom-outline" size={30} color="#a855f7" />;
    default:
      return <Ionicons name="help-circle-outline" size={30} color="#6B7280" />;
  }
};

const ServiceCard = ({ service }) => (
  <TouchableOpacity
    style={{
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
      backgroundColor: "#fff",
      borderRadius: 12,
      marginBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: "#f0f0f0",
    }}
    onPress={() => router.push(`/(app)/(home)/(services)/${service.id}`)}
    activeOpacity={0.7}
  >
    <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: "#F0F9FF",
          justifyContent: "center",
          alignItems: "center",
          marginRight: 12,
        }}
      >
        {getServiceIcon(service.service_type)}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: "700", fontSize: 15, color: "#222" }}>
          {service.service_type}
        </Text>
        <Text style={{ fontSize: 11, color: "#A1A1AA" }}>
          Due{" "}
          {new Date(service.created_at).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </Text>
      </View>
    </View>
    <View
      style={{
        marginLeft: 8,
        backgroundColor:
          service.request_status === "Pending"
            ? "#FF5C5C"
            : service.request_status === "Ongoing"
            ? "#FFB020"
            : "#22C55E",
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 2,
        alignSelf: "flex-start",
      }}
    >
      <Text style={{ color: "#fff", fontSize: 11, fontWeight: "600" }}>
        {service.request_status}
      </Text>
    </View>
  </TouchableOpacity>
);

export default function Services() {
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  });

  const fetchServices = async (url = "/") => {
    setLoading(true);
    try {
      const response = await servicesApi.get(url);
      setServices(response.data.results);
      setPagination({
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
      });
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchServices();
    }, [])
  );

  const handlePress = (service) => {
    router.push(`/(app)/(home)/(services)/${service.id}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.innerContent}>
          <Text style={styles.subtitle}>
            This is the list of services provided by SunShine Meri Luke Compound
          </Text>
          <TouchableOpacity
            style={styles.requestButton}
            onPress={() =>
              router.push("/(app)/(home)/(services)/RequestService")
            }
          >
            <Ionicons name="add-circle-outline" size={20} color="#fff" />
            <Text style={styles.requestButtonText}>Request Service</Text>
          </TouchableOpacity>
          {loading ? (
            <ActivityIndicator size="large" color="#007AFF" />
          ) : (
            <ScrollView
              style={styles.servicesList}
              showsVerticalScrollIndicator={false}
            >
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
              <View style={styles.paginationContainer}>
                {pagination.previous && (
                  <TouchableOpacity
                    style={styles.paginationButton}
                    onPress={() => fetchServices(pagination.previous)}
                  >
                    <Text style={styles.paginationText}>Previous</Text>
                  </TouchableOpacity>
                )}
                {pagination.next && (
                  <TouchableOpacity
                    style={styles.paginationButton}
                    onPress={() => fetchServices(pagination.next)}
                  >
                    <Text style={styles.paginationText}>Next</Text>
                  </TouchableOpacity>
                )}
              </View>
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
  },
  innerContent: {
    flex: 1,
    padding: 16,
  },
  servicesList: {
    flex: 1,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  paginationButton: {
    padding: 8,
    backgroundColor: "#007AFF",
    borderRadius: 4,
  },
  paginationText: {
    color: "#fff",
    fontSize: 14,
  },
  subtitle: {
    color: "#6B7280",
    marginBottom: 18,
    fontSize: 13,
  },
  requestButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  requestButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
