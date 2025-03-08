import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SIZES } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

interface SettingsDropdownProps {
  onHistoryPress: () => void;
  historyVisible: boolean;
}

const { width, height } = Dimensions.get('window');

/**
 * settings dropdown component that shows theme toggle and history options
 */
const SettingsDropdown: React.FC<SettingsDropdownProps> = ({
  onHistoryPress,
  historyVisible,
}) => {
  // hooks and state
  const { colors, theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const [isOpen, setIsOpen] = useState(false);
  const dropdownAnimation = useRef(new Animated.Value(0)).current;
  const rotateAnimation = useRef(new Animated.Value(0)).current;
  const backdropAnimation = useRef(new Animated.Value(0)).current;

  // handlers
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const handleThemeToggle = () => {
    toggleTheme();
    // optional: close the dropdown after toggling theme
    // closeDropdown();
  };

  // animation effect
  useEffect(() => {
    Animated.parallel([
      Animated.spring(dropdownAnimation, {
        toValue: isOpen ? 1 : 0,
        useNativeDriver: true,
        friction: 8,
        tension: 40,
      }),
      Animated.spring(rotateAnimation, {
        toValue: isOpen ? 1 : 0,
        useNativeDriver: true,
        friction: 8,
        tension: 40,
      }),
      Animated.timing(backdropAnimation, {
        toValue: isOpen ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isOpen, dropdownAnimation, rotateAnimation, backdropAnimation]);

  // animation interpolations
  const opacity = dropdownAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const translateY = dropdownAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 0],
  });

  const rotate = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '0deg'],
  });

  const backdropOpacity = backdropAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  // backdrop render helper
  const renderBackdrop = () => {
    if (!isOpen) return null;
    
    return (
      <TouchableWithoutFeedback onPress={closeDropdown}>
        <Animated.View 
          style={[
            styles.backdrop,
            { opacity: backdropOpacity }
          ]}
        />
      </TouchableWithoutFeedback>
    );
  };

  return (
    <>
      {renderBackdrop()}
      <View style={styles.container}>
        <TouchableOpacity
          style={[
            styles.settingsButton, 
            { 
              backgroundColor: colors.buttonBackground,
              borderColor: isOpen ? colors.text + '30' : 'transparent'
            }
          ]}
          onPress={toggleDropdown}
          activeOpacity={0.8}
        >
          <Animated.View style={{ transform: [{ rotate }] }}>
            <Ionicons 
              name="menu-outline" 
              size={Platform.OS === 'android' ? 24 : 26} 
              color={colors.text} 
            />
          </Animated.View>
        </TouchableOpacity>

        {isOpen && (
          <Animated.View
            style={[
              styles.dropdown,
              {
                opacity,
                transform: [{ translateY }],
                backgroundColor: colors.buttonBackground,
                borderColor: colors.text + '15',
              },
            ]}
          >
            <View style={styles.dropdownContent}>
              <TouchableOpacity
                style={styles.dropdownItem}
                activeOpacity={0.7}
                onPress={handleThemeToggle}
              >
                <Text style={[styles.itemLabel, { color: colors.text }]}>
                  Theme
                </Text>
                <View style={styles.iconWrapper}>
                  <Ionicons
                    name={isDark ? "moon" : "sunny"}
                    size={Platform.OS === 'android' ? 20 : 22}
                    color={isDark ? "#FFC107" : "#FFC107"}
                  />
                </View>
              </TouchableOpacity>

              <View style={[styles.divider, { backgroundColor: colors.text + '15' }]} />

              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  closeDropdown();
                  onHistoryPress();
                }}
                activeOpacity={0.7}
              >
                <Text style={[styles.itemLabel, { color: colors.text }]}>
                  History
                </Text>
                <View style={styles.iconWrapper}>
                  <Ionicons
                    name={historyVisible ? "time" : "time-outline"}
                    size={Platform.OS === 'android' ? 20 : 24}
                    color={colors.text}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'android' ? SIZES.small : SIZES.medium,
    left: Platform.OS === 'android' ? SIZES.small : SIZES.medium,
    zIndex: 100,
  },
  settingsButton: {
    width: Platform.OS === 'android' ? 42 : 48,
    height: Platform.OS === 'android' ? 42 : 48,
    borderRadius: Platform.OS === 'android' ? 21 : 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    zIndex: 99,
  },
  dropdown: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 48 : 56,
    left: 0,
    width: Platform.OS === 'android' ? 180 : 200,
    borderRadius: Platform.OS === 'android' ? 12 : 16,
    overflow: 'hidden',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
  },
  dropdownContent: {
    padding: Platform.OS === 'android' ? SIZES.small : SIZES.medium,
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Platform.OS === 'android' ? SIZES.xSmall : SIZES.small,
    borderRadius: 8,
  },
  itemLabel: {
    fontSize: Platform.OS === 'android' ? 14 : 16,
    fontWeight: '500',
  },
  iconWrapper: {
    width: Platform.OS === 'android' ? 30 : 34,
    height: Platform.OS === 'android' ? 30 : 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Platform.OS === 'android' ? 15 : 17,
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: Platform.OS === 'android' ? SIZES.xSmall : SIZES.small,
  },
});

export default SettingsDropdown; 