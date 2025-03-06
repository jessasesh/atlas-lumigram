import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { uploadImageToStorage } from "@/lib/Storage";
import { addPost } from "@/lib/Firestore";

export default function AddPostScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Denied", "You need to grant access to the photo library.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handlePost = async () => {
    if (!selectedImage || caption.trim() === "") {
      Alert.alert("Error", "Please select an image and enter a caption.");
      return;
    }
  
    setLoading(true);
    try {
      const imageUrl = await uploadImageToStorage(selectedImage);
  
      await addPost(imageUrl, caption);
  
      Alert.alert("Success", "Post added successfully!");
      setSelectedImage(null);
      setCaption("");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Something went wrong.";
      Alert.alert("Upload Failed", errorMessage);
    }
    setLoading(false);
  };  

  return (
    <View style={styles.container}>
      <Pressable onPress={pickImage} style={styles.imagePlaceholder}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.image} />
        ) : (
          <Text style={styles.imageText}>Tap to select an image</Text>
        )}
      </Pressable>

      <TextInput
        style={styles.input}
        placeholder="Add a caption"
        placeholderTextColor="#00D4B1"
        value={caption}
        onChangeText={setCaption}
      />

      <Pressable onPress={handlePost} style={styles.saveButton} disabled={loading}>
        {loading ? <ActivityIndicator color="white" /> : <Text style={styles.saveButtonText}>Save</Text>}
      </Pressable>

      <Pressable onPress={() => { setSelectedImage(null); setCaption(""); }} style={styles.resetButton}>
        <Text style={styles.resetText}>Reset</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 20,
  },
  imagePlaceholder: {
    width: 300,
    height: 300,
    backgroundColor: "#F0F0F0",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  imageText: {
    color: "#888",
    fontSize: 16,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  input: {
    width: "100%",
    borderWidth: 1.5,
    borderColor: "#00D4B1",
    color: "black",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#00D4B1",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "90%",
    alignItems: "center",
    marginBottom: 10,
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  resetButton: {
    paddingVertical: 10,
  },
  resetText: {
    color: "#333",
    fontSize: 16,
  },
});
