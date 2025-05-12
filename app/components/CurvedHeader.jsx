import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function CurvedHeader({
  title,
  showBack = false,
  onBack,
  rightIcon = null,
  onRightPress = null,
  style = {},
}) {
  const router = useRouter();

  return (
    <View style={[styles.header, style]}>
      <View style={styles.innerRow}>
        {showBack ? (
          <TouchableOpacity
            onPress={onBack || (() => router.back())}
            style={styles.iconButton}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconPlaceholder} />
        )}
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {rightIcon ? (
          <TouchableOpacity onPress={onRightPress} style={styles.iconButton}>
            {rightIcon}
          </TouchableOpacity>
        ) : (
          <View style={styles.iconPlaceholder} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#121212",
    paddingTop: 24,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  innerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  iconButton: {
    padding: 8,
  },
  iconPlaceholder: {
    width: 32,
    height: 32,
  },
});
