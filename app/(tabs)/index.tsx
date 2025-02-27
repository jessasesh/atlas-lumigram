import React, { useState } from "react";
import { View, Text, Image, Alert, StyleSheet, Dimensions } from "react-native";
import { FlashList } from "@shopify/flash-list";
import {
  GestureHandlerRootView,
  TapGestureHandler,
  LongPressGestureHandler,
  State,
} from "react-native-gesture-handler";
import { homeFeed } from "../../placeholder";

const screenWidth = Dimensions.get("window").width;

export default function HomeScreen() {
  const [captions, setCaptions] = useState<{ [key: string]: boolean }>({});

  const toggleCaption = (id: string, state: number) => {
    if (state === State.ACTIVE) {
      setCaptions((prevState) => ({
        ...prevState,
        [id]: !prevState[id],
      }));
    }
  };

  const handleDoubleTap = () => {
    Alert.alert(
      "Favorited",
      "This will favorite the image in the next project."
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <FlashList
        data={homeFeed}
        keyExtractor={(item) => item.id}
        estimatedItemSize={300}
        extraData={captions}
        renderItem={({ item }) => (
          <GestureHandlerRootView>
            <LongPressGestureHandler
              onHandlerStateChange={({ nativeEvent }) =>
                toggleCaption(item.id, nativeEvent.state)
              }
              minDurationMs={500}
            >
              <TapGestureHandler numberOfTaps={2} onActivated={handleDoubleTap}>
                <View style={styles.imageWrapper}>
                  <Image source={{ uri: item.image }} style={styles.image} />
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
