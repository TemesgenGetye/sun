import { Stack } from "expo-router";

export default function GroupsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#121212",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "600",
        },
        headerBackTitle: "Back",
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
          title: "Groups",
          headerShown: true,
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="groupAnouncements"
        options={{
          title: "Group Announcements",
          headerShown: true,
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Group Details",
          headerShown: true,
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="groupPayments"
        options={{
          title: "Group Payments",
          headerShown: true,
          headerBackTitle: "Back",
        }}
      />
    </Stack>
  );
}
