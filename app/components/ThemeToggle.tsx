import React, { useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Animated, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SIZES } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, colors, toggleTheme, transitionValue } = useTheme();
  const isDark = theme === 'dark';
  
  // animation values
  const rotateAnim = React.useRef(new Animated.Value(isDark ? 1 : 0)).current;
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  // update animation when theme changes
  useEffect(() => {
    // rotate animation
    Animated.spring(rotateAnim, {
      toValue: isDark ? 1 : 0,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();

    // scale animation (bounce effect)
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.8,
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

  // interpolate rotation value
  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // interpolate background color for smooth transition
  const backgroundColor = transitionValue.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.buttonBackground, colors.buttonBackground],
  });

  return (
    <Animated.View
      style={[
        styles.button,
        {
          backgroundColor: backgroundColor,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.touchable}
        onPress={toggleTheme}
        activeOpacity={0.7}
      >
        <Animated.View 
          style={[
            styles.iconContainer,
            { transform: [{ rotate: rotation }] }
          ]}
        >
          {isDark ? (
            <Ionicons name="moon" size={24} color={colors.text} />
          ) : (
            <Ionicons name="sunny" size={24} color="#FFC107" />
          )}
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: SIZES.medium,
    left: SIZES.medium,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  touchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ThemeToggle;