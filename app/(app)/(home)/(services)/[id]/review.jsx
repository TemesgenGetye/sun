import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { servicesApi } from "../../../../services/api";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ServiceReviewScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [selectedRating, setSelectedRating] = useState(null);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selectedRating) {
      Alert.alert("Please select a rating.");
      return;
    }
    setLoading(true);
    try {
      await servicesApi.patch(`/${id}/`, {
        rating: selectedRating + 1,
        feedback: review,
      });
      setLoading(false);
      router.push("/(app)/(home)/(services)");
    } catch (err) {
      setLoading(false);
      Alert.alert("Error", "Failed to submit feedback. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.innerContent}>
          <Text style={styles.title}>How was your Experience?</Text>
          <Text style={styles.subtitle}>
            Your order is Successfully Done. Do you mind giving a small feedback
            about your experience?
          </Text>

          <View style={styles.emojiContainer}>
            <TouchableOpacity
              style={[
                styles.emojiButton,
                selectedRating === 0 && styles.selectedEmoji,
              ]}
              onPress={() => setSelectedRating(0)}
            >
              <Text style={styles.emoji}>😢</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.emojiButton,
                selectedRating === 1 && styles.selectedEmoji,
              ]}
              onPress={() => setSelectedRating(1)}
            >
              <Text style={styles.emoji}>🙁</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.emojiButton,
                selectedRating === 2 && styles.selectedEmoji,
              ]}
              onPress={() => setSelectedRating(2)}
            >
              <Text style={styles.emoji}>😐</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.emojiButton,
                selectedRating === 3 && styles.selectedEmoji,
              ]}
              onPress={() => setSelectedRating(3)}
            >
              <Text style={styles.emoji}>😄</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.emojiButton,
                selectedRating === 4 && styles.selectedEmoji,
              ]}
              onPress={() => setSelectedRating(4)}
            >
              <Text style={styles.emoji}>😍</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.reviewInputContainer}>
            <Text style={styles.reviewLabel}>WRITE A REVIEW</Text>
            <TextInput
              style={styles.input}
              placeholder="Type here.."
              placeholderTextColor="#999"
              value={review}
              onChangeText={setReview}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.skipButton}
              onPress={() => router.back()}
            >
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.submitButton,
                (!selectedRating || loading) && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!selectedRating || loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Submit</Text>
              )}
            </TouchableOpacity>
          </View>
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
    marginTop: 10,
  },
  subtitle: {
    color: "#666",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 40,
  },
  emojiContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  emojiButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedEmoji: {
    borderColor: "#FF6B3D",
  },
  emoji: {
    fontSize: 30,
  },
  reviewInputContainer: {
    marginBottom: 40,
  },
  reviewLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
    textAlignVertical: "top",
    fontSize: 16,
    color: "#000",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  skipButton: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
  },
  skipButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "500",
  },
  submitButton: {
    flex: 1,
    backgroundColor: "#FF6B3D",
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
