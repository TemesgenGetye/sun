import { Stack } from "expo-router";

export default function IncidentsLayout() {
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
          title: "Incidents",
          headerShown: true,
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="AddIncident"
        options={{
          title: "Add Incident",
          headerShown: true,
          headerBackTitle: "Back",
        }}
      />
    </Stack>
  );
}
