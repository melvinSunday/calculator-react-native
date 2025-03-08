import React from 'react';
import { TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SIZES } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

interface HistoryButtonProps {
  onPress: () => void;
  historyVisible: boolean;
}

/**
 * renders a button that toggles the history view with a rotation animation
 */
const HistoryButton: React.FC<HistoryButtonProps> = ({ onPress, historyVisible }) => {
  const { colors } = useTheme();
  const rotateAnim = React.useRef(new Animated.Value(0)).current; // animated value for rotation

  React.useEffect(() => {
    Animated.spring(rotateAnim, {
      toValue: historyVisible ? 1 : 0, // rotate to 180deg if history is visible, 0deg otherwise
      useNativeDriver: true,
      friction: 8,
    }).start(); // start the animation
  }, [historyVisible, rotateAnim]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'], // map 0 to 0deg and 1 to 180deg
  });

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: colors.buttonBackground }]}
      onPress={onPress} // trigger onPress function
      activeOpacity={0.7} // reduce opacity when pressed
    >
      <Animated.View style={{ transform: [{ rotate: rotation }] }}>
        <Ionicons 
          name="time-outline" 
          size={24} 
          color={historyVisible ? colors.primary : colors.text} // change color based on history visibility
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: SIZES.medium,
    right: SIZES.medium,
    width: 46,
    height: 46,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 100, 
  },
});

export default HistoryButton;