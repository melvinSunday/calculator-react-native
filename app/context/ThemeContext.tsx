import React, { createContext, useState, useContext, useEffect } from 'react';
import { COLORS } from '../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Animated } from 'react-native';

// define theme types
export type ThemeType = 'light' | 'dark';

// define theme colors interface
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

// define light and dark theme colors
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

// theme context interface
interface ThemeContextType {
  theme: ThemeType;
  colors: ThemeColors;
  toggleTheme: () => void;
  transitionValue: Animated.Value;
}

// create the context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// theme storage key
const THEME_STORAGE_KEY = 'calculator_theme';

// theme provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>('light');
  const [colors, setColors] = useState<ThemeColors>(themes.light);
  
  // create an animated value for smooth transitions
  const transitionValue = React.useRef(new Animated.Value(theme === 'dark' ? 1 : 0)).current;

  // load saved theme on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
          setTheme(savedTheme);
          setColors(themes[savedTheme]);
          // set initial transition value based on theme
          transitionValue.setValue(savedTheme === 'dark' ? 1 : 0);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };

    loadTheme();
  }, []);

  // toggle between light and dark themes with animation
  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    
    // update theme state immediately to avoid UI inconsistencies
    setTheme(newTheme);
    setColors(themes[newTheme]);
    
    // animate the transition
    Animated.timing(transitionValue, {
      toValue: newTheme === 'dark' ? 1 : 0,
      duration: 300, // adjust duration as needed
      useNativeDriver: false, // we need to animate non-transform/opacity properties
    }).start();
    
    // save theme preference
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

// custom hook to use the theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};