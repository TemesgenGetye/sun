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

export default function GroupAnnouncementsScreen() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [groupAnnouncements, setGroupAnnouncements] = useState([]);

  useEffect(() => {
    // Simulate API call
    const loadAnnouncements = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
        setGroupAnnouncements([
          {
            id: 1,
            title: "Monthly Book Discussion",
            content:
              "Join us this Friday at 7 PM for our monthly book discussion. We'll be discussing 'The Great Gatsby'.",
            date: "April 20, 2024",
            status: "New",
          },
          {
            id: 2,
            title: "New Members Welcome",
            content:
              "We're excited to welcome new members to our book club! Please introduce yourself at our next meeting.",
            date: "April 15, 2024",
            status: "Active",
          },
        ]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadAnnouncements();
  }, [id]);

  const getStatusColor = (status) => {
    return status === "New" ? "#4CD964" : "#FF9500";
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
            <Text style={styles.title}>Group Announcements</Text>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>+ Add Announcement</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            These are the announcements for your group
          </Text>

          <ScrollView style={styles.announcementsList}>
            {groupAnnouncements.map((announcement) => (
              <TouchableOpacity
                key={announcement.id}
                style={styles.announcementCard}
              >
                <View style={styles.announcementInfo}>
                  <View style={styles.avatarContainer}>
                    <Ionicons name="megaphone" size={20} color="#007AFF" />
                  </View>
                  <View style={styles.textContainer}>
                    <View style={styles.titleContainer}>
                      <View
                        style={[
                          styles.statusBadge,
                          {
                            backgroundColor: getStatusColor(
                              announcement.status
                            ),
                          },
                        ]}
                      >
                        <Text style={styles.statusText}>
                          {announcement.status}
                        </Text>
                      </View>
                      <Text style={styles.announcementTitle}>
                        {announcement.title}
                      </Text>
                    </View>
                    <Text style={styles.announcementContent}>
                      {announcement.content}
                    </Text>
                    <Text style={styles.announcementDate}>
                      {announcement.date}
                    </Text>
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
  announcementsList: {
    flex: 1,
  },
  announcementCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  announcementInfo: {
    flexDirection: "row",
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
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    flex: 1,
  },
  announcementContent: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    lineHeight: 20,
  },
  announcementDate: {
    fontSize: 12,
    color: "#999",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
