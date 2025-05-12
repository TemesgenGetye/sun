import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { router } from "expo-router";
import { servicesApi } from "../../../services/api";
import CurvedHeader from "../../../components/CurvedHeader";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RequestService() {
  const [serviceDescription, setServiceDescription] = useState("");
  const [serviceType, setServiceType] = useState("PLUMBING");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Plumbing", value: "PLUMBING" },
    { label: "Electricity", value: "ELECTRICITY" },
    { label: "Cleaning", value: "CLEANING" },
    { label: "Maintenance", value: "MAINTENANCE" },
    { label: "Other", value: "OTHER" },
  ]);

  const handleSubmit = async () => {
    if (!serviceDescription.trim()) {
      Alert.alert("Error", "Please enter a service description");
      return;
    }

    setLoading(true);

    try {
      const response = await servicesApi.post("/", {
        service_type: serviceType,
        request_description: serviceDescription,
      });

      setLoading(false);
      Alert.alert("Success", "Service request submitted successfully");
      router.push("/(app)/(home)/(services)");
    } catch (error) {
      setLoading(false);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to submit service request"
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.innerContent}>
          <Text style={styles.headerSubtitle}>
            Put the service you need below
          </Text>

          <DropDownPicker
            open={open}
            value={serviceType}
            items={items}
            setOpen={setOpen}
            setValue={setServiceType}
            setItems={setItems}
            style={{
              backgroundColor: "#F4F7FE",
              borderRadius: 14,
              marginBottom: 18,
              borderWidth: 0,
              minHeight: 44,
            }}
            dropDownContainerStyle={{ borderRadius: 14, borderWidth: 0 }}
            textStyle={{ fontSize: 15, color: "#222" }}
            placeholderStyle={{ color: "#A1A1AA" }}
          />

          <TextInput
            style={{
              backgroundColor: "#F4F7FE",
              borderRadius: 14,
              padding: 16,
              minHeight: 100,
              textAlignVertical: "top",
              marginBottom: 24,
              fontSize: 15,
              color: "#222",
            }}
            placeholder="Type here..."
            value={serviceDescription}
            onChangeText={setServiceDescription}
            multiline
            numberOfLines={4}
            placeholderTextColor="#A1A1AA"
          />

          <TouchableOpacity
            style={{
              backgroundColor:
                !serviceDescription.trim() || loading ? "#ccc" : "#2563eb",
              padding: 16,
              borderRadius: 14,
              alignItems: "center",
              marginTop: 8,
            }}
            onPress={handleSubmit}
            disabled={!serviceDescription.trim() || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
                Submit
              </Text>
            )}
          </TouchableOpacity>
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
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 18,
  },
  picker: {
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    marginBottom: 24,
  },
  input: {
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
    textAlignVertical: "top",
    marginBottom: 24,
  },
  submitButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#ccc",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
