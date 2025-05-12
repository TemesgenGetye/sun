import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Request notification permissions
export async function requestNotificationPermissions() {
  if (Platform.OS === "ios") {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Authorization status:", authStatus);
    }
  } else if (Platform.OS === "android") {
    const authStatus = await messaging().requestPermission();
    const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED;

    if (enabled) {
      console.log("Authorization status:", authStatus);
    }
  }
}

// Get FCM token
export async function getFCMToken() {
  try {
    const fcmToken = await AsyncStorage.getItem("fcmToken");
    if (!fcmToken) {
      const token = await messaging().getToken();
      if (token) {
        await AsyncStorage.setItem("fcmToken", token);
        return token;
      }
    } else {
      return fcmToken;
    }
  } catch (error) {
    console.log("Error getting FCM token:", error);
    return null;
  }
}

// Handle notification when app is in foreground
export function setupForegroundNotificationHandler() {
  messaging().onMessage(async (remoteMessage) => {
    console.log("Received foreground message:", remoteMessage);

    // Show local notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: remoteMessage.notification?.title || "New Notification",
        body: remoteMessage.notification?.body || "",
        data: remoteMessage.data,
      },
      trigger: null,
    });
  });
}

// Handle notification when app is in background
export function setupBackgroundNotificationHandler() {
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log("Received background message:", remoteMessage);
  });
}

// Handle notification open
export function setupNotificationOpenHandler() {
  messaging().onNotificationOpenedApp((remoteMessage) => {
    console.log("Notification opened app:", remoteMessage);
    handleNotificationNavigation(remoteMessage);
  });

  // Check if app was opened from a notification
  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        console.log("App opened from quit state:", remoteMessage);
        handleNotificationNavigation(remoteMessage);
      }
    });
}

// Handle navigation based on notification data
function handleNotificationNavigation(remoteMessage) {
  const data = remoteMessage.data;
  if (data) {
    // Add your navigation logic here based on the notification data
    // For example:
    if (data.type === "announcement") {
      router.push("/(app)/(home)/(announcements)");
    } else if (data.type === "payment") {
      router.push("/(app)/(payment)");
    }
    // Add more navigation cases as needed
  }
}

// Initialize notification service
export async function initializeNotifications() {
  await requestNotificationPermissions();
  await getFCMToken();
  setupForegroundNotificationHandler();
  setupBackgroundNotificationHandler();
  setupNotificationOpenHandler();
}
