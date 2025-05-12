import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
export default function GroupDetailsScreen() {
  const { id } = useLocalSearchParams();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.innerContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Group Details</Text>
            <View style={{ width: 24 }} />
          </View>

          <Text style={styles.subtitle}>
            Select an option to manage your group
          </Text>

          <ScrollView
            style={styles.optionsList}
            showsVerticalScrollIndicator={false}
          >
            <TouchableOpacity
              style={styles.optionCard}
              onPress={() =>
                router.push({
                  pathname: "/(app)/(home)/(groups)/groupPayments",
                  params: { id },
                })
              }
              activeOpacity={0.7}
            >
              <View style={styles.optionInfo}>
                <View style={styles.avatarContainer}>
                  <Ionicons name="cash" size={20} color="#4CD964" />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.optionName}>Payments</Text>
                  <Text style={styles.optionDescription}>
                    View and manage group payments
                  </Text>
                </View>
              </View>
              <View style={styles.statusBadge}>
                <Ionicons name="chevron-forward" size={16} color="#666" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionCard}
              onPress={() =>
                router.push({
                  pathname: "/(app)/(home)/(groups)/groupAnnouncements",
                  params: { id },
                })
              }
              activeOpacity={0.7}
            >
              <View style={styles.optionInfo}>
                <View style={styles.avatarContainer}>
                  <Ionicons name="megaphone" size={20} color="#FF9500" />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.optionName}>Announcements</Text>
                  <Text style={styles.optionDescription}>
                    View and manage group announcements
                  </Text>
                </View>
              </View>
              <View style={styles.statusBadge}>
                <Ionicons name="chevron-forward" size={16} color="#666" />
              </View>
            </TouchableOpacity>
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
    marginBottom: 24,
    marginTop: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  subtitle: {
    color: "#666",
    marginBottom: 24,
  },
  optionsList: {
    flex: 1,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  optionInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
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
  optionName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 12,
    color: "#666",
  },
  statusBadge: {
    backgroundColor: "#f8f9fa",
    padding: 8,
    borderRadius: 8,
  },
});
