import { View, StyleSheet, Platform } from 'react-native';
import CalculatorButton, { ButtonType } from './CalculatorButton';
import { SIZES } from '../constants/theme';
import { OperationType } from '../utils/calculatorUtils';

interface CalculatorKeypadProps {
  onNumberPress: (number: string) => void;
  onOperationPress: (operation: OperationType) => void;
  onClearPress: () => void;
  onEqualsPress: () => void;
  onDecimalPress: () => void;
  onToggleSignPress: () => void;
  onPercentPress: () => void;
  onDeletePress: () => void;
  currentOperation: OperationType;
}

/**
 * renders the calculator keypad with buttons for numbers and operations
 */
const CalculatorKeypad: React.FC<CalculatorKeypadProps> = ({
  onNumberPress,
  onOperationPress,
  onClearPress,
  onEqualsPress,
  onDecimalPress,
  onToggleSignPress,
  onPercentPress,
  onDeletePress,
  currentOperation,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <CalculatorButton
          label="AC"
          onPress={onClearPress}
          type="function"
        />
        <CalculatorButton
          label="⌫"
          onPress={onDeletePress}
          type="function"
        />
        <CalculatorButton
          label="%"
          onPress={onPercentPress}
          type="function"
        />
        <CalculatorButton
          label="÷"
          onPress={() => onOperationPress('÷')}
          type="operator"
          isActive={currentOperation === '÷'}
        />
      </View>

      <View style={styles.row}>
        <CalculatorButton
          label="7"
          onPress={() => onNumberPress('7')}
        />
        <CalculatorButton
          label="8"
          onPress={() => onNumberPress('8')}
        />
        <CalculatorButton
          label="9"
          onPress={() => onNumberPress('9')}
        />
        <CalculatorButton
          label="×"
          onPress={() => onOperationPress('×')}
          type="operator"
          isActive={currentOperation === '×'}
        />
      </View>

      <View style={styles.row}>
        <CalculatorButton
          label="4"
          onPress={() => onNumberPress('4')}
        />
        <CalculatorButton
          label="5"
          onPress={() => onNumberPress('5')}
        />
        <CalculatorButton
          label="6"
          onPress={() => onNumberPress('6')}
        />
        <CalculatorButton
          label="-"
          onPress={() => onOperationPress('-')}
          type="operator"
          isActive={currentOperation === '-'}
        />
      </View>

      <View style={styles.row}>
        <CalculatorButton
          label="1"
          onPress={() => onNumberPress('1')}
        />
        <CalculatorButton
          label="2"
          onPress={() => onNumberPress('2')}
        />
        <CalculatorButton
          label="3"
          onPress={() => onNumberPress('3')}
        />
        <CalculatorButton
          label="+"
          onPress={() => onOperationPress('+')}
          type="operator"
          isActive={currentOperation === '+'}
        />
      </View>

      <View style={styles.row}>
        <CalculatorButton
          label="+/-"
          onPress={onToggleSignPress}
          type="function"
        />
        <CalculatorButton
          label="0"
          onPress={() => onNumberPress('0')}
        />
        <CalculatorButton
          label="."
          onPress={onDecimalPress}
        />
        <CalculatorButton
          label="="
          onPress={onEqualsPress}
          type="operator"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.small,
  },
});

export default CalculatorKeypad;