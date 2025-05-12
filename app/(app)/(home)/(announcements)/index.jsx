import React, {
  useCallback,
  useEffect,
  useState,
  useLayoutEffect,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { router, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { getAnnouncements } from "../../../services/api";

const AnnouncementCard = React.memo(
  ({ title, description, time, group, onPress }) => (
    <TouchableOpacity
      style={styles.announcementCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Ionicons name="notifications" size={24} color="#FF6B3D" />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.cardTitle}>{title}</Text>
          {group && (
            <View style={styles.groupBadge}>
              <Text style={styles.groupText}>{group}</Text>
            </View>
          )}
        </View>
        <Text style={styles.cardDescription} numberOfLines={2}>
          {description}
        </Text>
      </View>
      <Text style={styles.timeText}>{time}</Text>
    </TouchableOpacity>
  )
);

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await getAnnouncements();
      setAnnouncements(data.results);
    } catch (err) {
      setError("Failed to load announcements");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`;
    } else {
      return `${Math.floor(diffInHours / 24)}d`;
    }
  };

  const handleAnnouncementPress = useCallback((announcement) => {
    router.push({
      pathname: "/(app)/(home)/AnnouncementDetail",
      params: {
        title: announcement.announcement_title,
        content: announcement.announcement_content,
        time: formatTime(announcement.created_at),
        group: announcement.group,
      },
    });
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#FF6B3D" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const todayAnnouncements = announcements.filter(
    (announcement) =>
      new Date(announcement.created_at).toDateString() ===
      new Date().toDateString()
  );

  const yesterdayAnnouncements = announcements.filter(
    (announcement) =>
      new Date(announcement.created_at).toDateString() ===
      new Date(Date.now() - 86400000).toDateString()
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {todayAnnouncements.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Today</Text>
            {todayAnnouncements.map((announcement) => (
              <AnnouncementCard
                key={announcement.id}
                title={announcement.announcement_title}
                description={announcement.announcement_content}
                time={formatTime(announcement.created_at)}
                group={announcement.group}
                onPress={() => handleAnnouncementPress(announcement)}
              />
            ))}
          </View>
        )}

        {yesterdayAnnouncements.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Yesterday</Text>
            {yesterdayAnnouncements.map((announcement) => (
              <AnnouncementCard
                key={announcement.id}
                title={announcement.announcement_title}
                description={announcement.announcement_content}
                time={formatTime(announcement.created_at)}
                group={announcement.group}
                onPress={() => handleAnnouncementPress(announcement)}
              />
            ))}
          </View>
        )}

        {todayAnnouncements.length === 0 &&
          yesterdayAnnouncements.length === 0 && (
            <View style={styles.centerContent}>
              <Text style={styles.noAnnouncementsText}>
                No announcements available.
              </Text>
            </View>
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
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 24,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
    color: "#111827",
  },
  announcementCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF5E8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  timeText: {
    fontSize: 12,
    color: "#666",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#FF6B3D",
    fontSize: 16,
    textAlign: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  groupBadge: {
    backgroundColor: "#FFF5E8",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  groupText: {
    fontSize: 12,
    color: "#FF6B3D",
    fontWeight: "500",
  },
  noAnnouncementsText: {
    color: "#666",
    fontSize: 16,
    textAlign: "center",
  },
});
