import { View, StyleSheet, StatusBar } from "react-native";
import { COLORS } from './constants/theme';
import Calculator from "./components/Calculator";
import AnimatedThemeView from "./components/AnimatedThemeView";
import { useTheme } from "./context/ThemeContext";

export default function Home() {
  const { theme, colors } = useTheme();
  
  return (
    <AnimatedThemeView style={styles.container}>
      <StatusBar 
        barStyle={theme === 'dark' ? "light-content" : "dark-content"} 
        backgroundColor={colors.background}
        animated={true}
      />
      <Calculator />
    </AnimatedThemeView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});