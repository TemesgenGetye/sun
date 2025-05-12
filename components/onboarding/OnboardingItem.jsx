import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  Image,
  TouchableOpacity,
} from "react-native";

export default function OnboardingItem({ item, onSkip }) {
  const { width, height } = useWindowDimensions();

  return (
    <View style={[styles.container, { width }]}>
      <View style={[styles.imageContainer, { height: height * 0.6 }]}>
        <Image
          source={item.image}
          style={[styles.image, { width: width, height: height * 0.6 }]}
          resizeMode="cover"
        />
        <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    marginTop: 0,
  },
  imageContainer: {
    width: "100%",
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingTop: 0,
    marginTop: 0,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  skipButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginTop: 30,
  },
  skipText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  content: {
    flex: 0.3,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontWeight: "800",
    fontSize: 33,
    marginBottom: 10,
    marginTop: 25,
    color: "#333",
    textAlign: "center",
  },
  description: {
    fontWeight: "300",
    color: "#62656b",
    textAlign: "center",
    paddingHorizontal: 64,
    fontSize: 18,
    marginTop: 20,
  },
});
