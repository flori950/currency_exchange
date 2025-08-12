import { useState, useCallback } from 'react';
import type { CalculatorState } from '../types';

const CALCULATOR_OPERATIONS = ['+', '-', '*', '/'];

export const useCalculator = () => {
  const [state, setState] = useState<CalculatorState>({
    display: '0',
    previousValue: null,
    operation: null,
    waitingForOperand: false,
  });

  const clear = useCallback(() => {
    setState({
      display: '0',
      previousValue: null,
      operation: null,
      waitingForOperand: false,
    });
  }, []);

  const inputNumber = useCallback((num: string) => {
    setState(prev => {
      if (prev.waitingForOperand) {
        return {
          ...prev,
          display: num,
          waitingForOperand: false,
        };
      }

      const newDisplay = prev.display === '0' ? num : prev.display + num;
      
      // Prevent invalid number formats
      if (newDisplay.includes('.') && num === '.') {
        return prev;
      }

      return {
        ...prev,
        display: newDisplay,
      };
    });
  }, []);

  const inputDecimal = useCallback(() => {
    setState(prev => {
      if (prev.waitingForOperand) {
        return {
          ...prev,
          display: '0.',
          waitingForOperand: false,
        };
      }

      if (!prev.display.includes('.')) {
        return {
          ...prev,
          display: prev.display + '.',
        };
      }

      return prev;
    });
  }, []);

  const inputOperation = useCallback((nextOperation: string) => {
    setState(prev => {
      const inputValue = parseFloat(prev.display);

      if (prev.previousValue === null) {
        return {
          ...prev,
          previousValue: inputValue,
          operation: nextOperation,
          waitingForOperand: true,
        };
      }

      if (prev.operation && prev.waitingForOperand) {
        return {
          ...prev,
          operation: nextOperation,
        };
      }

      const currentValue = prev.previousValue || 0;
      let result: number;

      switch (prev.operation) {
        case '+':
          result = currentValue + inputValue;
          break;
        case '-':
          result = currentValue - inputValue;
          break;
        case '*':
          result = currentValue * inputValue;
          break;
        case '/':
          result = inputValue !== 0 ? currentValue / inputValue : currentValue;
          break;
        default:
          result = inputValue;
      }

      return {
        display: String(result),
        previousValue: result,
        operation: nextOperation,
        waitingForOperand: true,
      };
    });
  }, []);

  const calculate = useCallback(() => {
    setState(prev => {
      const inputValue = parseFloat(prev.display);

      if (prev.previousValue === null || !prev.operation) {
        return prev;
      }

      const currentValue = prev.previousValue;
      let result: number;

      switch (prev.operation) {
        case '+':
          result = currentValue + inputValue;
          break;
        case '-':
          result = currentValue - inputValue;
          break;
        case '*':
          result = currentValue * inputValue;
          break;
        case '/':
          result = inputValue !== 0 ? currentValue / inputValue : currentValue;
          break;
        default:
          result = inputValue;
      }

      return {
        display: String(result),
        previousValue: null,
        operation: null,
        waitingForOperand: true,
      };
    });
  }, []);

  const backspace = useCallback(() => {
    setState(prev => {
      if (prev.waitingForOperand || prev.display === '0') {
        return prev;
      }

      const newDisplay = prev.display.slice(0, -1);
      return {
        ...prev,
        display: newDisplay === '' ? '0' : newDisplay,
      };
    });
  }, []);

  const getResult = useCallback((): number => {
    return parseFloat(state.display) || 0;
  }, [state.display]);

  const setDisplay = useCallback((value: string) => {
    setState(prev => ({
      ...prev,
      display: value,
      waitingForOperand: false,
    }));
  }, []);

  return {
    display: state.display,
    clear,
    inputNumber,
    inputDecimal,
    inputOperation,
    calculate,
    backspace,
    getResult,
    setDisplay,
    isOperation: (key: string) => CALCULATOR_OPERATIONS.includes(key),
  };
};
