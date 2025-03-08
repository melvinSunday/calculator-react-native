import { useState, useEffect, useCallback, useMemo } from "react";
import { View, StyleSheet, SafeAreaView, StatusBar, Animated } from "react-native";
import { SIZES } from "../constants/theme";
import CalculatorDisplay from "./CalculatorDisplay";
import { OperationType, formatDisplayValue, calculateResult } from "../utils/calculatorUtils";
import CalculatorKeypad from "./CalculatorKeypad";
import CalculatorHistory, { HistoryItem } from "./CalculatorHistory";
import { saveHistory, loadHistory, clearHistory } from "../utils/historyUtils";
import { useTheme } from "../context/ThemeContext";
import AnimatedThemeView from "./AnimatedThemeView";
import SettingsDropdown from "./SettingsDropdown";

// helper function to generate unique ids
const generateId = () => {
  return Date.now().toString() + Math.floor(Math.random() * 10000).toString();
};

const Calculator: React.FC = () => {
    const { colors, transitionValue } = useTheme();
    const [rawValue, setRawValue] = useState('0'); // raw input value
    const [displayValue, setDisplayValue] = useState('0'); // formatted display value
    const [firstNumber, setFirstNumber] = useState<number | null>(null); // first number in calculation
    const [operation, setOperation] = useState<OperationType>(null); // current operation
    const [waitingForSecondNumber, setWaitingForSecondNumber] = useState(false); // flag for second number input
    const [expression, setExpression] = useState(''); // current expression
    const [history, setHistory] = useState<HistoryItem[]>([]); // calculation history
    const [historyVisible, setHistoryVisible] = useState(false); // history modal visibility

    // memoize the history loading function
    const fetchHistory = useCallback(async () => {
      const savedHistory = await loadHistory();
      setHistory(savedHistory);
    }, []);

    // load history only once on mount
    useEffect(() => {
      fetchHistory();
    }, [fetchHistory]);

    // memoize display value formatting
    useEffect(() => {
      const formattedValue = formatDisplayValue(rawValue);
      if (formattedValue !== displayValue) {
        setDisplayValue(formattedValue);
      }
    }, [rawValue]);

    // optimize history saving
    useEffect(() => {
      if (history.length > 0) {
        const saveHistoryDebounced = setTimeout(() => {
          saveHistory(history);
        }, 500); // debounce save operations
        return () => clearTimeout(saveHistoryDebounced);
      }
    }, [history]);
    
    // optimize handlers with usecallback
    const handleNumberPress = useCallback((number: string) => {
      setRawValue(prev => {
        if (waitingForSecondNumber) {
          setWaitingForSecondNumber(false);
          return number;
        }
        return prev === '0' ? number : prev + number;
      });
    }, [waitingForSecondNumber]);
    
    const handleOperationPress = useCallback((nextOperation: OperationType) => {
      const currentValue = parseFloat(rawValue);
      
      if (firstNumber === null) {
        // first operation
        setFirstNumber(currentValue);
        setOperation(nextOperation);
        setWaitingForSecondNumber(true);
        setExpression(`${displayValue} ${nextOperation}`);
      } else if (operation) {
        if (waitingForSecondNumber) {
          // user is changing the operation before entering second number
          setOperation(nextOperation);
          // update the expression by replacing the last operator
          setExpression(prevExpression => {
            // replace the last operator in the expression
            const expressionWithoutOperator = prevExpression.substring(0, prevExpression.lastIndexOf(operation));
            return `${expressionWithoutOperator}${nextOperation}`;
          });
        } else {
          // user has entered a second number, calculate and continue
          const result = calculateResult(firstNumber, currentValue, operation);
          setFirstNumber(parseFloat(result));
          setOperation(nextOperation);
          setRawValue(result);
          setWaitingForSecondNumber(true);
          setExpression(`${formatDisplayValue(result)} ${nextOperation}`);
        }
      }
    }, [rawValue, firstNumber, operation, displayValue, waitingForSecondNumber]);
    
    const handleEqualsPress = useCallback(() => {
      if (firstNumber === null || operation === null) return;
      
      const currentValue = parseFloat(rawValue);
      const result = calculateResult(firstNumber, currentValue, operation);
      const fullExpression = `${formatDisplayValue(firstNumber.toString())} ${operation} ${formatDisplayValue(currentValue.toString())} =`;
      
      setRawValue(result);
      setExpression(fullExpression);
      
      const historyItem: HistoryItem = {
        id: generateId(),
        expression: fullExpression,
        result: formatDisplayValue(result),
        timestamp: new Date()
      };
      
      setHistory(prev => [historyItem, ...prev]);
      setFirstNumber(null);
      setOperation(null);
      setWaitingForSecondNumber(true);
    }, [firstNumber, operation, rawValue]);
    
    const handleClearPress = useCallback(() => {
      setRawValue('0');
      setFirstNumber(null);
      setOperation(null);
      setWaitingForSecondNumber(false);
      setExpression('');
    }, []);
    
    const handleDecimalPress = useCallback(() => {
      if (waitingForSecondNumber) {
        setRawValue('0.');
        setWaitingForSecondNumber(false);
        return;
      }
      
      if (!rawValue.includes('.')) {
        setRawValue(prev => prev + '.');
      }
    }, [waitingForSecondNumber, rawValue]);
    
    const handleToggleSignPress = useCallback(() => {
      setRawValue(prev => (parseFloat(prev) * -1).toString());
    }, []);
    
    const handlePercentPress = useCallback(() => {
      setRawValue(prev => (parseFloat(prev) / 100).toString());
    }, []);

    const handleDeletePress = useCallback(() => {
      setRawValue(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
    }, []);

    const toggleHistory = useCallback(() => {
      setHistoryVisible(prev => !prev);
    }, []);

    const handleHistoryItemPress = useCallback((item: HistoryItem) => {
      setRawValue(item.result.replace(/,/g, ''));
      setHistoryVisible(false);
    }, []);

    const handleClearHistory = useCallback(async () => {
      setHistory([]);
      await clearHistory();
    }, []);

    // memoize the background color interpolation
    const backgroundColor = useMemo(() => 
      transitionValue.interpolate({
        inputRange: [0, 1],
        outputRange: [colors.background, colors.background],
      })
    , [colors.background, transitionValue]);

    return (
      <AnimatedThemeView style={styles.container}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.calculatorContainer}>
            <SettingsDropdown 
              onHistoryPress={toggleHistory} 
              historyVisible={historyVisible} 
            />
            <CalculatorDisplay 
              value={displayValue} 
              expression={expression} 
              operation={operation}
            />
            <CalculatorKeypad
              onNumberPress={handleNumberPress}
              onOperationPress={handleOperationPress}
              onClearPress={handleClearPress}
              onEqualsPress={handleEqualsPress}
              onDecimalPress={handleDecimalPress}
              onToggleSignPress={handleToggleSignPress}
              onPercentPress={handlePercentPress}
              onDeletePress={handleDeletePress}
              currentOperation={operation}
            />
            <CalculatorHistory
              history={history}
              visible={historyVisible}
              onClose={toggleHistory}
              onItemPress={handleHistoryItemPress}
              onClearHistory={handleClearHistory}
            />
          </View>
        </SafeAreaView>
      </AnimatedThemeView>
    );
};

export default Calculator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  calculatorContainer: {
    flex: 1,
    justifyContent: "flex-end",
    padding: SIZES.medium,
  },
});