import { Platform } from 'react-native';

export const COLORS = {
    primary: '#4A55A2',
    secondary: '#7895CB',
    accent: '#A0BFE0',
    background: '#F5F5F5',
    darkBackground: '#1E1E1E',
    text: '#333333',
    lightText: '#FFFFFF',
    buttonBackground: '#FFFFFF',
    operatorButton: '#FF9500',
    functionButton: '#C5C5C5',
    numberButton: '#333333',
    shadow: 'rgba(0, 0, 0, 0.1)',
    historyBackground: '#FFFFFF',
    historyItemBorder: '#F0F0F0',
    historyItemHighlight: '#F8F8F8',
  };
  
  export const SIZES = {
    xSmall: 8,
    small: 12,
    medium: 16,
    large: 24,
    xLarge: 28,
    xxLarge: 36,
    buttonSize: Platform.select({
      ios: 85,
      android: 80,
    }),
    buttonRadius: Platform.select({
      ios: 42.5,
      android: 40,
    }),
    buttonPadding: Platform.select({
      ios: 8,
      android: 6,
    }),
    historyItemHeight: Platform.select({
      ios: 85,
      android: 80,
    }),
    historyHeaderHeight: Platform.select({
      ios: 70,
      android: 65,
    }),
  };
  export const FONTS = {
    regular: {
      fontFamily: 'System',
      fontWeight: '400' as const,
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500' as const,
    },
    semiBold: {
      fontFamily: 'System',
      fontWeight: '600' as const,
    },
    bold: {
      fontFamily: 'System',
      fontWeight: '700' as const,
    },
  };
  
  export const SHADOWS = {
    small: {
      shadowColor: COLORS.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 4,
    },
    medium: {
      shadowColor: COLORS.shadow,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
    },
  }; 