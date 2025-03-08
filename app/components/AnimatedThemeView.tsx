import React from 'react';
import { Animated, StyleSheet, ViewProps } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface AnimatedThemeViewProps extends ViewProps {
  children: React.ReactNode;
  style?: any;
}

const AnimatedThemeView: React.FC<AnimatedThemeViewProps> = ({ children, style, ...props }) => {
  const { colors, transitionValue, theme } = useTheme();
  
  // interpolate background color for smooth transition
  const backgroundColor = transitionValue.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.background, colors.background],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor },
        style,
      ]}
      {...props}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AnimatedThemeView;