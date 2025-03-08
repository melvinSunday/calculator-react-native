export type OperationType = '+' | '-' | '×' | '÷' | '%' | null;

/**
 * performs arithmetic calculations based on the given operation
 */
export const calculate = (
  firstNumber: number,
  secondNumber: number,
  operation: OperationType
): number => {
    switch (operation) {
        case "+":
          return firstNumber + secondNumber;
        case "-":
          return firstNumber - secondNumber;
        case "×":
          return firstNumber * secondNumber;
        case "÷":
          return secondNumber !== 0 ? firstNumber / secondNumber : NaN; // returns NaN for division by zero
        case "%":
          return firstNumber % secondNumber;
        default:
          return secondNumber; // default returns secondNumber, handles null or invalid operation
      }
};

/**
 * formats the display value with commas and removes leading zeros
 */
export const formatDisplayValue = (value: string): string => {

    if (value === '0') return value;

    const formattedValue = value.replace(/^0+(?=\d)/, ''); // removes leading zeros

    const parts = formattedValue.split('.');

    if (parts[0].length > 0) {
        const integerPart = parseInt(parts[0], 10);
        if (!isNaN(integerPart)) {
          parts[0] = new Intl.NumberFormat('en-US', { 
            useGrouping: true,
            maximumFractionDigits: 0
          }).format(integerPart); // formats integer part with commas
        }
      }

      return parts.join('.');
}

/**
 * checks if a given value is a valid number
 */
export const isValidNumber = (value: string): boolean => {
    return !isNaN(parseFloat(value)) && isFinite(parseFloat(value)); // checks if parseable and finite
  };

/**
 * calculates the result and handles special cases like division by zero
 */
  export const calculateResult = (
    firstNumber: number,
    secondNumber: number,
    operation: OperationType
  ): string => {
    const result = calculate(firstNumber, secondNumber, operation);
    
    // handles division by zero or invalid operations, returns 'Undefined'
    if (isNaN(result) || !isFinite(result)) {
      return 'Undefined';
    }
    
    // converts result to string without additional formatting
    return result.toString();
  };

/**
 * formats the expression for display with the second number
 */
export const formatExpressionWithSecondNumber = (
  firstNumber: string,
  secondNumber: string,
  operation: OperationType
): string => {
  if (!operation) return firstNumber;
  
  const formattedFirst = formatDisplayValue(firstNumber);
  const formattedSecond = formatDisplayValue(secondNumber);
  
  return `${formattedFirst} ${operation} ${formattedSecond}`;
};