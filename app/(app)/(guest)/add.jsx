import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { guestsApi } from "../../services/api";

export default function AddGuestScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    guest_name: "",
    phone_number: "",
    visit_date: new Date(),
    arrival_status: false,
    has_vechile: false,
    is_payer: false,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData({ ...formData, visit_date: selectedDate });
    }
  };

  const handleSubmit = async () => {
    // Validate form data
    if (!formData.guest_name || !formData.phone_number) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }
    console.log(formData);
    try {
      setLoading(true);

      // Format the date to YYYY-MM-DD
      const formattedDate = formData.visit_date.toISOString().split("T")[0];

      // Prepare the request body
      const requestBody = {
        ...formData,
        visit_date: formattedDate,
      };

      // Make the API call
      await guestsApi.post("/", requestBody);

      // Show success message
      Alert.alert("Success", "Guest added successfully", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error("Error adding guest:", error);
      Alert.alert("Error", "Failed to add guest. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={styles.title}>Add Guest</Text>
        <Text style={styles.subtitle}>
          Put the information of the guest below
        </Text>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.guest_name}
              onChangeText={(text) =>
                setFormData({ ...formData, guest_name: text })
              }
              placeholder="John Smith"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              value={formData.phone_number}
              onChangeText={(text) =>
                setFormData({ ...formData, phone_number: text })
              }
              placeholder="987654321"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Visit Date *</Text>
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar" size={24} color="#007AFF" />
              <Text style={styles.dateTimeText}>
                {formData.visit_date.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.switchGroup}>
            <Text style={styles.switchLabel}>Has Vehicle</Text>
            <TouchableOpacity
              style={[
                styles.switchButton,
                formData.has_vechile && styles.switchButtonActive,
              ]}
              onPress={() =>
                setFormData({ ...formData, has_vechile: !formData.has_vechile })
              }
            >
              <Text
                style={[
                  styles.switchText,
                  formData.has_vechile && styles.switchTextActive,
                ]}
              >
                {formData.has_vechile ? true : false}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.switchGroup}>
            <Text style={styles.switchLabel}>Is Payer</Text>
            <TouchableOpacity
              style={[
                styles.switchButton,
                formData.is_payer && styles.switchButtonActive,
              ]}
              onPress={() =>
                setFormData({ ...formData, is_payer: !formData.is_payer })
              }
            >
              <Text
                style={[
                  styles.switchText,
                  formData.is_payer && styles.switchTextActive,
                ]}
              >
                {formData.is_payer ? true : false}
              </Text>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={formData.visit_date}
              mode="date"
              display="default"
              onChange={onDateChange}
              minimumDate={new Date()}
            />
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.addButton, loading && styles.addButtonDisabled]}
              onPress={handleSubmit}
              activeOpacity={0.7}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.addButtonText}>Add Guest</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
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
    paddingBottom: 120,
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
  formContainer: {
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  dateTimeContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: "#333",
  },
  dateTimeButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  dateTimeText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
  },
  switchGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 14,
    color: "#666",
  },
  switchButton: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  switchButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  switchText: {
    fontSize: 14,
    color: "#666",
  },
  switchTextActive: {
    color: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 30,
    marginBottom: 50,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "600",
  },
  addButton: {
    flex: 1,
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  addButtonDisabled: {
    opacity: 0.7,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
