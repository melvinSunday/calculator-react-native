import React, { useMemo, useCallback } from 'react';
import { 
  StyleSheet, 
  ViewStyle, 
  Platform,
  Animated,
  PressableAndroidRippleConfig,
  Pressable,
} from 'react-native';
import { SIZES, FONTS, SHADOWS } from '../constants/theme';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';

// button types
export type ButtonType = 'number' | 'operator' | 'function';

interface CalculatorButtonProps {
  label: string;
  onPress: () => void;
  type?: ButtonType;
  isActive?: boolean;
}

/**
 * renders a calculator button with different styles based on its type
 */
const CalculatorButton: React.FC<CalculatorButtonProps> = React.memo(({
  label,
  onPress,
  type = 'number',
  isActive = false,
}) => {
  const { colors, transitionValue } = useTheme();

  // default values for possibly undefined SIZES
  const buttonSize = SIZES.buttonSize ?? 80;
  const buttonRadius = SIZES.buttonRadius ?? 40;
  const buttonPadding = SIZES.buttonPadding ?? 8;

  // memoize color interpolations
  const colorInterpolations = useMemo(() => ({
    numberButton: transitionValue.interpolate({
      inputRange: [0, 1],
      outputRange: [colors.numberButton, colors.numberButton],
    }),
    buttonBackground: transitionValue.interpolate({
      inputRange: [0, 1],
      outputRange: [colors.buttonBackground, colors.buttonBackground],
    }),
    operatorButton: transitionValue.interpolate({
      inputRange: [0, 1],
      outputRange: [colors.operatorButton, colors.operatorButton],
    }),
    functionButton: transitionValue.interpolate({
      inputRange: [0, 1],
      outputRange: [colors.functionButton, colors.functionButton],
    }),
    text: transitionValue.interpolate({
      inputRange: [0, 1],
      outputRange: [colors.text, colors.text],
    }),
    lightText: transitionValue.interpolate({
      inputRange: [0, 1],
      outputRange: [colors.lightText, colors.lightText],
    }),
  }), [colors, transitionValue]);

  // memoize button style
  const buttonStyle = useMemo(() => {
    const baseStyle: ViewStyle = {
      ...styles.button,
      width: buttonSize,
      height: buttonSize,
      borderRadius: buttonRadius,
      margin: buttonPadding / 2,
      ...(Platform.OS === 'ios' ? {
        ...SHADOWS.small,
        shadowColor: colors.shadow,
      } : {
        elevation: 2,
        backgroundColor: colors.buttonBackground,
      }),
    };

    switch (type) {
      case 'operator':
        return {
          ...baseStyle,
          ...(Platform.OS === 'android' && {
            elevation: 3,
            backgroundColor: colors.operatorButton,
          }),
        };
      case 'function':
        return {
          ...baseStyle,
          ...(Platform.OS === 'android' && {
            elevation: 2,
            backgroundColor: colors.functionButton,
          }),
        };
      default:
        return {
          ...baseStyle,
          ...(Platform.OS === 'android' && {
            elevation: 2,
          }),
        };
    }
  }, [buttonSize, buttonRadius, buttonPadding, colors.shadow, colors.buttonBackground, colors.operatorButton, colors.functionButton, type]);

  // memoize background color
  const backgroundColor = useMemo(() => {
    switch (type) {
      case 'operator':
        return isActive ? colorInterpolations.lightText : colorInterpolations.operatorButton;
      case 'function':
        return colorInterpolations.functionButton;
      default:
        return colorInterpolations.buttonBackground;
    }
  }, [type, isActive, colorInterpolations]);

  // memoize text color
  const textColor = useMemo(() => {
    switch (type) {
      case 'operator':
        return isActive ? colorInterpolations.operatorButton : colorInterpolations.lightText;
      case 'function':
        return colorInterpolations.text;
      default:
        return colorInterpolations.numberButton;
    }
  }, [type, isActive, colorInterpolations]);

  // memoize text style
  const textStyle = useMemo(() => [
    styles.buttonText,
    {
      color: textColor,
      ...Platform.select({
        android: {
          fontSize: type === 'operator' ? SIZES.large * 1.2 : SIZES.large,
          letterSpacing: type === 'operator' ? 1 : 0,
        },
      }),
    }
  ], [textColor, type]);

  // memoize ripple config
  const rippleConfig: PressableAndroidRippleConfig | null = useMemo(() => 
    Platform.OS === 'android' ? {
      color: 'rgba(0, 0, 0, 0.1)',
      borderless: true,
      radius: buttonSize / 2,
    } : null
  , [buttonSize]);

  // optimize press handler
  const handlePress = useCallback(() => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (error) {
        console.log('Haptics not available:', error);
      }
    }
    onPress();
  }, [onPress]);

  return (
    <Animated.View
      style={[buttonStyle, { backgroundColor }]}
      shouldRasterizeIOS={true}
      renderToHardwareTextureAndroid={true}
    >
      <Pressable
        style={styles.touchable}
        onPress={handlePress}
        android_ripple={rippleConfig}
      >
        <Animated.Text style={textStyle}>
          {label}
        </Animated.Text>
      </Pressable>
    </Animated.View>
  );
}, (prevProps, nextProps) => {
  // custom comparison for react.memo
  return (
    prevProps.label === nextProps.label &&
    prevProps.type === nextProps.type &&
    prevProps.isActive === nextProps.isActive &&
    prevProps.onPress === nextProps.onPress
  );
});


const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    ...Platform.select({
      android: {
        backgroundColor: '#FFFFFF',
      },
    }),
  },
  touchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    ...Platform.select({
      android: {
        textAlign: 'center',
        includeFontPadding: false,
        textAlignVertical: 'center',
      },
    }),
  },
});

CalculatorButton.displayName = 'CalculatorButton';

export default CalculatorButton;