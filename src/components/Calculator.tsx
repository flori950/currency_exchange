import React from 'react';
import { useCalculator } from '../hooks/useCalculator';
import '../styles/Calculator.css';

interface CalculatorProps {
  onUseResult?: (value: number) => void;
  className?: string;
}

export const Calculator: React.FC<CalculatorProps> = ({ onUseResult, className = '' }) => {
  const calculator = useCalculator();

  const handleButtonClick = (value: string) => {
    if (value === 'C') {
      calculator.clear();
    } else if (value === '⌫') {
      calculator.backspace();
    } else if (value === '=') {
      calculator.calculate();
    } else if (value === '.') {
      calculator.inputDecimal();
    } else if (calculator.isOperation(value)) {
      calculator.inputOperation(value);
    } else if (/^\d$/.test(value)) {
      calculator.inputNumber(value);
    }
  };

  const handleUseResult = () => {
    if (onUseResult) {
      onUseResult(calculator.getResult());
    }
  };

  const buttons = [
    ['C', '⌫', '/', '*'],
    ['7', '8', '9', '-'],
    ['4', '5', '6', '+'],
    ['1', '2', '3', '='],
    ['0', '.', 'Use', '=']
  ];

  return (
    <div className={`calculator ${className}`}>
      <div className="calculator-display">
        <span className="calculator-value">{calculator.display}</span>
      </div>
      
      <div className="calculator-buttons">
        {buttons.map((row, rowIndex) => (
          <div key={rowIndex} className="calculator-row">
            {row.map((button, buttonIndex) => {
              if (button === 'Use') {
                return (
                  <button
                    key={buttonIndex}
                    className="calculator-button calculator-button-use"
                    onClick={handleUseResult}
                    disabled={!onUseResult}
                    title="Use this value in currency converter"
                  >
                    Use
                  </button>
                );
              }

              if (button === '=' && rowIndex === 4) {
                return null; // Skip duplicate equals button
              }

              const isOperation = calculator.isOperation(button);
              const isEquals = button === '=';
              const isClear = button === 'C';
              const isBackspace = button === '⌫';

              return (
                <button
                  key={buttonIndex}
                  className={`calculator-button ${
                    isOperation ? 'calculator-button-operation' : ''
                  } ${isEquals ? 'calculator-button-equals' : ''} ${
                    isClear ? 'calculator-button-clear' : ''
                  } ${isBackspace ? 'calculator-button-backspace' : ''} ${
                    button === '0' ? 'calculator-button-zero' : ''
                  }`}
                  onClick={() => handleButtonClick(button)}
                >
                  {isBackspace ? '⌫' : button}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
