import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

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

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#121212",
          height: 64,
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "600",
        },
        headerShadowVisible: false,
        headerBackTitleVisible: false,
        animation: "none",
        animationDuration: 0,
        detachInactiveScreens: true,
        freezeOnBlur: true,
        lazy: true,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Profile",
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          title: "Edit Profile",
          presentation: "modal",
          headerStyle: {
            backgroundColor: "#121212",
            height: 64,
          },
        }}
      />
      <Stack.Screen
        name="change-password"
        options={{
          title: "Change Password",
          presentation: "modal",
          headerStyle: {
            backgroundColor: "#121212",
            height: 64,
          },
        }}
      />
      <Stack.Screen
        name="contact"
        options={{
          title: "Contact Us",
          presentation: "modal",
          headerStyle: {
            backgroundColor: "#121212",
            height: 64,
          },
        }}
      />
      <Stack.Screen
        name="faq"
        options={{
          title: "FAQs",
          presentation: "modal",
          headerStyle: {
            backgroundColor: "#121212",
            height: 64,
          },
        }}
      />
    </Stack>
  );
}
