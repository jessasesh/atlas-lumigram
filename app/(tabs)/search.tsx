import { useRouter } from "expo-router";
import { View, Text, Pressable } from "react-native";

export default function SearchScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Search Screen</Text>

      <Pressable
        onPress={() => router.push("/profile/1")}
        style={{
          backgroundColor: "#007AFF",
          padding: 10,
          borderRadius: 5,
          marginBottom: 10,
        }}
      >
        <Text style={{ color: "white" }}>Go to Profile 1</Text>
      </Pressable>

      <Pressable
        onPress={() => router.push("/profile/2")}
        style={{ backgroundColor: "#007AFF", padding: 10, borderRadius: 5 }}
      >
        <Text style={{ color: "white" }}>Go to Profile 2</Text>
      </Pressable>
    </View>
  );
}
