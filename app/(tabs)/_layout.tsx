import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import LogoutButton from "@/components/LogoutButton";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: true,
        headerRight: () => <LogoutButton />,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: { position: "absolute" },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home Feed",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol name={"house.fill"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol name={focused ? "search" : "search"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="addpost"
        options={{
          title: "Add Post",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol name={"add"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol name={focused ? "heart.fill" : "heart"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: "My Profile",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              name={focused ? "person.fill" : "person"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
