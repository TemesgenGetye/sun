import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import mime from "mime";
import { incidentsApi } from "../../../services/api";

export default function AddIncident() {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImagePick = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Please allow access to your photos to upload images."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", error);
    }
  };

  const handleSubmit = async () => {
    if (!image) {
      Alert.alert("Error", "Please add an image as evidence");
      return;
    }

    if (!description.trim()) {
      Alert.alert("Error", "Please enter an incident description");
      return;
    }

    try {
      setLoading(true);

      const newImageUri = image.startsWith("file://")
        ? image
        : "file://" + image;
      const mimeType = mime.getType(newImageUri);

      const formData = new FormData();
      formData.append("evidence_file_path", {
        uri: newImageUri,
        type: mimeType || "image/jpeg",
        name: `evidence.${mime.getExtension(mimeType || "image/jpeg")}`,
      });
      formData.append("incident_description", description);
      formData.append("incident_status", "PENDING");

      await incidentsApi.post("/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Alert.alert("Success", "Incident reported successfully", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error(
        "Error submitting incident:",
        error.response?.data || error.message
      );
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Failed to submit incident. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.innerContent}>
              <View style={styles.header}>
                <Text style={styles.title}>Add Incident</Text>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => router.back()}
                >
                  <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.subtitle}>
                Put the information of the incident below
              </Text>

              <View style={styles.imageSection}>
                <Text style={styles.sectionTitle}>Evidence</Text>
                {image ? (
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: image }}
                      style={styles.selectedImage}
                    />
                    <TouchableOpacity
                      style={styles.removeImage}
                      onPress={() => setImage(null)}
                    >
                      <Ionicons name="close-circle" size={24} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.imagePicker}
                    onPress={handleImagePick}
                  >
                    <View style={styles.dottedBorder}>
                      <Ionicons name="camera-outline" size={32} color="#666" />
                      <Text style={styles.imagePickerText}>Add Photo</Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.descriptionSection}>
                <Text style={styles.sectionTitle}>WRITE THE INCIDENT</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Type here..."
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                />
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    (!image || !description.trim() || loading) &&
                      styles.submitButtonDisabled,
                  ]}
                  onPress={handleSubmit}
                  disabled={!image || !description.trim() || loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.submitButtonText}>Submit</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
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
  backButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
  subtitle: {
    color: "#666",
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    marginBottom: 12,
    textTransform: "uppercase",
  },
  imageSection: {
    marginBottom: 24,
  },
  imagePicker: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    overflow: "hidden",
  },
  dottedBorder: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#ddd",
    borderStyle: "dashed",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePickerText: {
    color: "#666",
    marginTop: 8,
  },
  imageContainer: {
    position: "relative",
  },
  selectedImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
  },
  removeImage: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  descriptionSection: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
    textAlignVertical: "top",
  },
  buttonContainer: {
    marginTop: 24,
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
