import React, { useState } from "react";
import { View, Text, Image, Alert, StyleSheet, Dimensions } from "react-native";
import { FlashList } from "@shopify/flash-list";
import {
  GestureHandlerRootView,
  TapGestureHandler,
  LongPressGestureHandler,
  State,
} from "react-native-gesture-handler";
import { favoritesFeed } from "../../placeholder";

const screenWidth = Dimensions.get("window").width;

export default function FavoritesScreen() {
  const [visibleCaptions, setVisibleCaptions] = useState<{
    [key: string]: boolean;
  }>({});

  const handleLongPress = (id: string, state: number) => {
    if (state === State.ACTIVE) {
      setVisibleCaptions((prev) => ({ ...prev, [id]: !prev[id] }));
    }
  };

  const handleDoubleTap = () => {
    Alert.alert(
      "Double Tap Detected",
      "This will favorite the image in the next project."
    );
  };

  const renderItem = ({
    item,
  }: {
    item: { id: string; image: string; caption: string };
  }) => (
    <GestureHandlerRootView>
      <LongPressGestureHandler
        onHandlerStateChange={({ nativeEvent }) =>
          handleLongPress(item.id, nativeEvent.state)
        }
        minDurationMs={500}
      >
        <TapGestureHandler numberOfTaps={2} onActivated={handleDoubleTap}>
          <View style={styles.imageWrapper}>
            <Image source={{ uri: item.image }} style={styles.image} />

            {visibleCaptions[item.id] && (
              <View style={styles.captionOverlay}>
                <Text style={styles.captionText}>{item.caption}</Text>
              </View>
            )}
          </View>
        </TapGestureHandler>
      </LongPressGestureHandler>
    </GestureHandlerRootView>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <FlashList
        data={favoritesFeed}
        renderItem={renderItem}
        estimatedItemSize={300}
        keyExtractor={(item) => item.id}
        extraData={visibleCaptions}
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
  },
  captionOverlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingVertical: 10,
    alignItems: "center",
  },
  captionText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
