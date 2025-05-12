import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";

export default function AnnouncementDetail() {
  const { title, content, time, group } = useLocalSearchParams();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.noticeHeader}>
          <View style={styles.iconContainer}>
            <Ionicons name="notifications" size={24} color="#FF6B3D" />
          </View>
          <View style={styles.noticeContent}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{title}</Text>
              {group && (
                <View style={styles.groupBadge}>
                  <Text style={styles.groupText}>{group}</Text>
                </View>
              )}
            </View>
            <Text style={styles.time}>{time}</Text>
          </View>
        </View>

        <Text style={styles.contentText}>{content}</Text>
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
  noticeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
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
  noticeContent: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
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
  time: {
    fontSize: 12,
    color: "#666",
  },
  contentText: {
    fontSize: 14,
    lineHeight: 24,
    color: "#666",
  },
});
