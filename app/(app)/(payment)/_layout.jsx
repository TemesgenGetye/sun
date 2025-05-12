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

export default function PaymentLayout() {
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
          title: "Payments",
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Payment Details",
          headerTitleStyle: {
            fontWeight: "600",
            fontSize: 20,
          },
          headerStyle: {
            backgroundColor: "#121212",
            height: 64,
          },
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="success"
        options={{
          title: "Success",
          headerStyle: {
            backgroundColor: "#121212",
            height: 64,
          },
          headerBackTitle: "Back",
        }}
      />
    </Stack>
  );
}
