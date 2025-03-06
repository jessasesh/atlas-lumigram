import { useRouter } from "expo-router";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/AuthProvider";

export default function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <Pressable onPress={handleLogout} style={{ padding: 10, marginRight: 15 }}>
      <Ionicons name="log-out-outline" size={24} color="#00D4B1" />
    </Pressable>
  );
}
