import { View, Text, StyleSheet, Platform, Animated } from "react-native";
import { SIZES, FONTS } from "../constants/theme";
import { useTheme } from "../context/ThemeContext";
import { OperationType } from "../utils/calculatorUtils";
import { useMemo } from "react";

// define the props for the calculator display component
interface CalculatorDisplayProp {
  value: string;
  expression?: string;
  operation?: OperationType;
}

/**
 * renders the calculator display showing the current value and expression
 */
const CalculatorDisplay: React.FC<CalculatorDisplayProp> = ({
  value,
  expression = "",
  operation = null,
}) => {
  // access the theme and transition values from the ThemeContext
  const { colors, transitionValue } = useTheme();
  
  /**
   * determines the expression to display based on calculation state:
   * - for completed calculations (with =), shows the full expression
   * - for ongoing calculations, shows expression with current operation
   * - for new calculations, shows just the current value
   */
  const isShowingResult = expression.includes('=');
  
  // memoize the display expression to avoid unnecessary re-renders
  const displayExpression = useMemo(() => {
    if (isShowingResult) {
      return expression;
    } else if (expression) {
      // if there's an operation and it's not already at the end of the expression, add it
      if (operation && !expression.endsWith(operation)) {
        return `${expression} ${operation}`;
      }
      return expression;
    } else {
      // if there's no expression, show the current value
      return value;
    }
  }, [expression, isShowingResult, operation, value]);
  
  // interpolate colors for smooth transitions
  const backgroundColor = transitionValue.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.background, colors.background],
  });
  
  const textColor = transitionValue.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.text, colors.text],
  });
  
  const secondaryColor = transitionValue.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.secondary, colors.secondary],
  });
  
  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <View style={styles.contentContainer}>
        {displayExpression !== value && (
          <Text
            style={[
              isShowingResult ? styles.resultExpression : styles.expressionText,
              { color: colors.text },
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {displayExpression}
          </Text>
        )}
        <Text
          style={[styles.valueText, { color: colors.text }]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {value}
        </Text>
      </View>
    </Animated.View>
  );
};


const styles = StyleSheet.create({
  container: {
    height: Platform.OS === 'android' ? 130 : 150,
    paddingHorizontal: Platform.OS === 'android' ? SIZES.medium : SIZES.large,
    paddingTop: Platform.OS === 'android' ? SIZES.large : SIZES.large * 1.5,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginBottom: Platform.OS === 'android' ? SIZES.small : SIZES.medium,
    borderRadius: SIZES.small,
  },
  contentContainer: {
    width: "100%",
    alignItems: "flex-end",
  },
  valueText: {
    ...FONTS.bold,
    fontSize: Platform.OS === 'android' ? SIZES.xxLarge * 1.5 : SIZES.xxLarge * 2,
    textAlign: "right",
    marginTop: SIZES.small,
    paddingHorizontal: Platform.OS === 'android' ? SIZES.xSmall : 0,
  },
  expressionText: {
    ...FONTS.regular,
    fontSize: Platform.OS === 'android' ? SIZES.medium : SIZES.large,
    textAlign: "right",
    paddingHorizontal: Platform.OS === 'android' ? SIZES.xSmall : 0,
    opacity: 0.7,
  },
  resultExpression: {
    ...FONTS.regular,
    fontSize: Platform.OS === 'android' ? SIZES.small : SIZES.medium,
    opacity: 0.6,
  },
  secondNumberText: {
    ...FONTS.bold,
    fontSize: Platform.OS === 'android' ? SIZES.xxLarge * 1.5 : SIZES.xxLarge * 2,
  },
});

export default CalculatorDisplay;