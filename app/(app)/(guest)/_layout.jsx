import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

function NotificationIcon() {
  return (
    <TouchableOpacity
      style={{
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 8,
      }}
    >
      <Ionicons name="notifications-outline" size={24} color="#fff" />
    </TouchableOpacity>
  );
}

export default function GuestLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#121212", // Dark background color
          height: 64, // Set a specific height for the header
        },
        headerTintColor: "#fff", // White text color
        headerTitleStyle: {
          fontWeight: "600", // Semi-bold text
        },
        headerShadowVisible: false, // No shadow under header
        headerBackTitleVisible: false, // No back button title
        animation: "none", // No animation
        animationDuration: 0,
        detachInactiveScreens: true,
        freezeOnBlur: true,
        lazy: true,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Manage Guests",
        }}
      />
      <Stack.Screen
        name="add"
        options={{
          title: "Add Guest",
          headerStyle: {
            backgroundColor: "#121212",
            height: 64, // Match the height of the manage guests header
          },
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Guest Details",
          headerStyle: {
            backgroundColor: "#121212",
            height: 64, // Match the height of the manage guests header
          },
          headerBackTitle: "Back",
        }}
      />
    </Stack>
  );
}
