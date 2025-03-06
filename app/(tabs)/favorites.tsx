import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Dimensions,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import {
  GestureHandlerRootView,
  LongPressGestureHandler,
  State,
} from "react-native-gesture-handler";
import { fetchFavorites } from "@/lib/Firestore";
import { useAuth } from "@/AuthProvider";

const screenWidth = Dimensions.get("window").width;

export default function FavoritesScreen() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      if (!user) throw new Error("User not authenticated.");
      const favs = await fetchFavorites(user.uid);
      if (!favs.length) {
        setErrorMessage("No favorites yet.");
      }
      setFavorites(favs);
    } catch (error: any) {
      setErrorMessage(error.message || "Error fetching favorites.");
      console.error("Error fetching favorites:", error);
    }
    setLoading(false);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#00D4B1" />}
      {errorMessage && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      )}
      <FlashList
        data={favorites}
        keyExtractor={(item) => item.id}
        estimatedItemSize={300}
        onRefresh={loadFavorites}
        refreshing={refreshing}
        renderItem={({ item }) => (
          <LongPressGestureHandler
            onHandlerStateChange={({ nativeEvent }) => {
              if (nativeEvent.state === State.ACTIVE) {
                Alert.alert("Caption", item.caption);
              }
            }}
            minDurationMs={500}
          >
            <View style={styles.post}>
              <Image source={{ uri: item.imageUrl }} style={styles.image} />
              <Text style={styles.caption}>{item.caption}</Text>
            </View>
          </LongPressGestureHandler>
        )}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  post: {
    backgroundColor: "#fff",
    padding: 10,
    margin: 10,
    borderRadius: 10,
    alignItems: "center",
    width: screenWidth * 0.9,
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 12,
    resizeMode: "cover",
  },
  caption: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "bold",
  },
  errorContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
});
