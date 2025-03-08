import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { ThemeProvider, useTheme } from "./context/ThemeContext";

// wrap the app with themeprovider
export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutNav />
    </ThemeProvider>
  );
}

// navigation component that uses the theme
function RootLayoutNav() {
  const { colors, theme } = useTheme();
  
  return (
    <>
      <StatusBar 
        barStyle={theme === 'dark' ? "light-content" : "dark-content"} 
        backgroundColor={colors.background} 
      />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" />
      </Stack>
    </>
  );
}