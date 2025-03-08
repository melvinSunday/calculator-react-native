import React, { createContext, useState, useContext, useEffect } from 'react';
import { COLORS } from '../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Animated } from 'react-native';

// Define theme types
export type ThemeType = 'light' | 'dark';

// Define theme colors interface
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  buttonBackground: string;
  operatorButton: string;
  functionButton: string;
  numberButton: string;
  shadow: string;
  historyBackground: string;
  historyItemBorder: string;
  historyItemHighlight: string;
  lightText: string;
}

// Define light and dark theme colors
export const themes: Record<ThemeType, ThemeColors> = {
  light: {
    ...COLORS,
  },
  dark: {
    primary: '#7895CB',
    secondary: '#4A55A2',
    accent: '#A0BFE0',
    background: '#1E1E1E',
    text: '#FFFFFF',
    buttonBackground: '#333333',
    operatorButton: '#FF9500',
    functionButton: '#505050',
    numberButton: '#FFFFFF',
    shadow: 'rgba(0, 0, 0, 0.3)',
    historyBackground: '#2A2A2A',
    historyItemBorder: '#3A3A3A',
    historyItemHighlight: '#3D3D3D',
    lightText: '#FFFFFF',
  },
};

// Theme context interface
interface ThemeContextType {
  theme: ThemeType;
  colors: ThemeColors;
  toggleTheme: () => void;
  transitionValue: Animated.Value;
}

// Create the context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme storage key
const THEME_STORAGE_KEY = 'calculator_theme';

// Theme provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>('light');
  const [colors, setColors] = useState<ThemeColors>(themes.light);
  
  // Create an animated value for smooth transitions
  const transitionValue = React.useRef(new Animated.Value(theme === 'dark' ? 1 : 0)).current;

  // Load saved theme on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
          setTheme(savedTheme);
          setColors(themes[savedTheme]);
          // Set initial transition value based on theme
          transitionValue.setValue(savedTheme === 'dark' ? 1 : 0);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };

    loadTheme();
  }, []);

  // Toggle between light and dark themes with animation
  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    
    // Update theme state immediately to avoid UI inconsistencies
    setTheme(newTheme);
    setColors(themes[newTheme]);
    
    // Animate the transition
    Animated.timing(transitionValue, {
      toValue: newTheme === 'dark' ? 1 : 0,
      duration: 300, // Adjust duration as needed
      useNativeDriver: false, // We need to animate non-transform/opacity properties
    }).start();
    
    // Save theme preference
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme, transitionValue }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 