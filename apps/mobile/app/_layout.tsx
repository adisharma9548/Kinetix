import React from "react";
import { Stack } from "expo-router";

export default function MobileRootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#F4F1EA" },
      }}
    />
  );
}
