import { useRouter } from "expo-router";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function LogoutButton() {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.replace("/login")}
      style={{ padding: 10, marginRight: 15 }}
    >
      <Ionicons name="log-out-outline" size={24} color="#00D4B1" />
    </Pressable>
  );
}
