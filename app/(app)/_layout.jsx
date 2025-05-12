import { router, Tabs } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useEffect } from "react";
import { ProtectedLayout } from "../_layout";
import { style } from "twrnc";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

function CustomTabBar({ state, descriptors, navigation }) {
  const bounceAnim = useRef(new Animated.Value(1)).current;

  const animateBounce = () => {
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(bounceAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      <View style={styles.backgroundGradient} />
      <View style={styles.tabsContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              router.push(`/${route.name}`);
              animateBounce();
            }
          };

          let iconName;
          if (route.name === "(home)") {
            iconName = isFocused ? "home" : "home-outline";
          } else if (route.name === "(guest)") {
            iconName = isFocused ? "people" : "people-outline";
          } else if (route.name === "(payment)") {
            iconName = isFocused ? "card" : "card-outline";
          } else if (route.name === "(profile)") {
            iconName = isFocused ? "person" : "person-outline";
          }

          let tabLabel;
          if (route.name === "(home)") {
            tabLabel = "Home";
          } else if (route.name === "(guest)") {
            tabLabel = "Guest";
          } else if (route.name === "(payment)") {
            tabLabel = "Payment";
          } else if (route.name === "(profile)") {
            tabLabel = "Profile";
          }

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={[styles.tab, { width: width / 4.2 }]}
              activeOpacity={0.7}
            >
              <Animated.View
                style={[
                  styles.tabContent,
                  {
                    transform: [
                      { scale: isFocused ? bounceAnim : 1 },
                      { translateY: isFocused ? -10 : 0 },
                    ],
                  },
                ]}
              >
                {isFocused && <View style={styles.before} />}
                <View
                  style={[
                    styles.iconContainer,
                    isFocused && styles.activeIconContainer,
                  ]}
                >
                  <Ionicons
                    name={iconName}
                    size={isFocused ? 28 : 22}
                    color={isFocused ? "#3B82F6" : "rgba(255,255,255,0.7)"}
                  />
                </View>
                {isFocused && <Text style={styles.tabLabel}>{tabLabel}</Text>}
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function AppLayout() {
  return (
    <ProtectedLayout>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: "none" },
        }}
        tabBar={(props) => <CustomTabBar {...props} />}
      >
        <Tabs.Screen name="(home)" />
        <Tabs.Screen name="(guest)" />
        <Tabs.Screen name="(payment)" />
        <Tabs.Screen name="(profile)" />
      </Tabs>
    </ProtectedLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
    zIndex: 1000,
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    // overflow: "hidden",
    height: 70,
    paddingBottom: 20,
  },
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#121212",
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
  },
  tabsContainer: {
    flexDirection: "row",
    width: width,
    justifyContent: "space-around",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  tab: {
    justifyContent: "center",
    alignItems: "center",
  },
  tabContent: {
    alignItems: "center",
    justifyContent: "center",
    padding: 2,
    zIndex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  activeIconContainer: {
    backgroundColor: "#fff",
    width: 50,
    height: 50,
    borderRadius: 25,
    transform: "translateY(-10px)",
    position: "absolute",
    zIndex: 50000,
  },
  tabLabel: {
    color: "#fff",
    fontSize: 9,
    marginTop: 1,
    fontWeight: "500",
    top: 25,
    zIndex: 500000,
  },
  before: {
    backgroundColor: "#121212",
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: -35,
  },
  leftCurve: {},
  rightCurve: {},
});
