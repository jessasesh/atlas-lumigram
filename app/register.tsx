import { useRouter } from "expo-router";
import { View, Text, TextInput, Pressable, Image, StyleSheet } from "react-native";

export default function RegisterScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image source={require("@/assets/images/logo.png")} style={styles.logo} />

      <Text style={styles.title}>Register</Text>

      <TextInput 
        style={styles.input} 
        placeholder="Email" 
        placeholderTextColor="#CCCCCC"
        keyboardType="email-address"
      />

      <TextInput 
        style={styles.input} 
        placeholder="Password" 
        placeholderTextColor="#CCCCCC"
        secureTextEntry 
      />

      <Pressable 
        style={styles.button} 
        onPress={() => router.replace("/(tabs)")}
      >
        <Text style={styles.buttonText}>Create Account</Text>
      </Pressable>

      <Pressable 
        onPress={() => router.push("/login")} 
        style={styles.secondaryButton}
      >
        <Text style={styles.secondaryButtonText}>Login to an existing account</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00052E",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 200,
    height: 80,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#00D4B1",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    color: "#FFF",
    marginBottom: 15,
  },
  button: {
    width: "100%",
    backgroundColor: "#00D4B1",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#00052E",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    marginTop: 15,
  },
  secondaryButtonText: {
    color: "#00D4B1",
    fontSize: 14,
  },
});
