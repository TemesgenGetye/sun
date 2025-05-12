import {
  View,
  StyleSheet,
  FlatList,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { useRouter, Redirect } from "expo-router";
import { useState, useRef } from "react";
import OnboardingItem from "../components/onboarding/OnboardingItem";
import { TouchableOpacity, Text } from "react-native";
import { useAuth } from "./context/AuthContext";

const slides = [
  {
    id: "1",
    title: "Welcome to SunShine\nMeri Luke Village",
    description:
      "Manage your home, guests, payments, and services seamlessly with our secure and convenient app.",
    image: require("../assets/onBoarding1.png"),
  },
  {
    id: "2",
    title: "Resident\nManagement",
    description:
      "Register, verify your phone number, and get admin approval to start using the app.",
    image: require("../assets/onBoarding2.png"),
  },
  {
    id: "3",
    title: "Secure & Easy\nPayments",
    description:
      "Pay your bills online via Telebirr, CBE, and Chapa. Get automatic reminders for upcoming payments.",
    image: require("../assets/onBoarding3.png"),
  },
];

export default function Onboarding() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slidesRef = useRef(null);
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0]?.index ?? 0);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.push("/login");
    }
  };

  // Show loading screen while checking auth state
  if (authLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Redirect href="/(app)/(home)" />;
  }

  return (
    <View style={styles.container}>
      <View style={{ flex: 3 }}>
        <FlatList
          data={slides}
          renderItem={({ item }) => (
            <OnboardingItem item={item} onSkip={() => router.push("/login")} />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id}
          scrollEventThrottle={32}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
          initialNumToRender={1}
          maxToRenderPerBatch={1}
          windowSize={1}
          removeClippedSubviews={true}
          getItemLayout={(data, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
        />
      </View>

      <View style={styles.footer}>
        <View style={styles.indicatorContainer}>
          {slides.map((_, index) => (
            <View
              key={index.toString()}
              style={[
                styles.dot,
                {
                  width: currentIndex === index ? 20 : 10,
                  opacity: currentIndex === index ? 1 : 0.3,
                },
              ]}
            />
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={scrollTo}>
            <Text style={styles.buttonText}>
              {currentIndex === slides.length - 1 ? "Get Started" : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    height: 100,
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: "#2196F3",
    marginHorizontal: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
    paddingHorizontal: 20,
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 50,
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  skipButton: {
    padding: 15,
    borderRadius: 5,
  },
  skipText: {
    color: "#2196F3",
    fontWeight: "bold",
  },
});
