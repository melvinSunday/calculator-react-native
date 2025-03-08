import React, { useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Animated, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

/**
 * theme toggle component that handles switching between light and dark themes
 */
const ThemeToggle: React.FC = () => {
  // theme context
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  
  // animation values
  const rotateAnim = React.useRef(new Animated.Value(isDark ? 1 : 0)).current;
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // handle rotate animation
    Animated.spring(rotateAnim, {
      toValue: isDark ? 1 : 0,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();

    // handle scale animation with bounce effect
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [theme, rotateAnim, scaleAnim]);

  // interpolate rotation for smooth transition
  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <TouchableOpacity onPress={toggleTheme} activeOpacity={0.7}>
      <Animated.View
        style={[
          styles.iconContainer,
          {
            transform: [{ rotate: rotation }, { scale: scaleAnim }],
          },
        ]}
      >
        <Ionicons
          name={isDark ? "moon" : "sunny"}
          size={22}
          color={isDark ? "#FFC107" : "#FFC107"}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
    height: 32,
    borderRadius: 16,
  },
});

export default ThemeToggle;