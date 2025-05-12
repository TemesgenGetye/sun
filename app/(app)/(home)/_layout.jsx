import { Stack } from "expo-router";

export default function HomeLayout() {
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
          headerShown: false,
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="(services)"
        options={{
          headerShown: false,
          headerTitle: "Services",
        }}
      />
      <Stack.Screen
        name="(announcements)"
        options={{
          headerShown: true,
          headerTitle: "Announcements",
        }}
      />
      <Stack.Screen
        name="(incidents)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(groups)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(polls)"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
