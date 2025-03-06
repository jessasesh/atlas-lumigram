import React, { useState, useEffect } from "react";
import { View, Text, Image, ActivityIndicator, StyleSheet, Alert, Dimensions } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { fetchPosts, addToFavorites } from "@/lib/Firestore";
import { GestureHandlerRootView, TapGestureHandler, LongPressGestureHandler, State } from "react-native-gesture-handler";

const screenWidth = Dimensions.get("window").width;

export default function HomeScreen() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState<any | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [captions, setCaptions] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async (refresh = false) => {
    setLoading(true);
    try {
      const data = await fetchPosts(refresh ? null : lastVisible);
      if (refresh) {
        setPosts(data.posts);
      } else {
        setPosts((prev) => [...prev, ...data.posts]);
      }
      setLastVisible(data.lastVisible);
    } catch (error) {
      Alert.alert("Failed to load posts", error.message);
    }
    setLoading(false);
  };

  // ✅ Toggle caption visibility (same as before)
  const toggleCaption = (id: string, state: number) => {
    if (state === State.ACTIVE) {
      setCaptions((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    }
  };

  // ✅ Double Tap to Favorite
  const handleDoubleTap = async (postId: string, imageUrl: string, caption: string) => {
    await addToFavorites(postId, imageUrl, caption);
    Alert.alert("Favorited", "Added to your favorites!");
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#00D4B1" />}
      <FlashList
        data={posts}
        keyExtractor={(item, index) => item.id || `post-${index}`}
        estimatedItemSize={300}
        onRefresh={() => loadPosts(true)}
        refreshing={refreshing}
        onEndReached={() => loadPosts()}
        onEndReachedThreshold={0.5}
        extraData={captions}
        renderItem={({ item }) => (
          <GestureHandlerRootView>
            <LongPressGestureHandler
              onHandlerStateChange={({ nativeEvent }) => toggleCaption(item.id, nativeEvent.state)}
              minDurationMs={500}
            >
              <TapGestureHandler
                numberOfTaps={2}
                onActivated={() => handleDoubleTap(item.id, item.imageUrl, item.caption)}
              >
                <View style={styles.imageWrapper}>
                  <Image source={{ uri: item.imageUrl }} style={styles.image} />
                  {captions[item.id] && (
                    <View style={styles.captionOverlay}>
                      <Text style={styles.caption}>{item.caption}</Text>
                    </View>
                  )}
                </View>
              </TapGestureHandler>
            </LongPressGestureHandler>
          </GestureHandlerRootView>
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
  imageWrapper: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    marginVertical: 10,
    alignSelf: "center",
    width: screenWidth * 0.9,
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 12,
    resizeMode: "cover",
  },
  captionOverlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingVertical: 10,
    alignItems: "center",
  },
  caption: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
