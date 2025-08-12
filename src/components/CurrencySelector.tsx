import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import type { Currency } from '../types';
import '../styles/CurrencySelector.css';

interface CurrencySelectorProps {
  currencies: Currency[];
  selectedCurrency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  label: string;
  disabled?: boolean;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  currencies,
  selectedCurrency,
  onCurrencyChange,
  label,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filteredCurrencies = currencies.filter(currency =>
    currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    currency.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setSearchTerm('');
    }
  };

  const handleCurrencySelect = (currency: Currency) => {
    onCurrencyChange(currency);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    } else if (event.key === 'Enter' && filteredCurrencies.length > 0) {
      handleCurrencySelect(filteredCurrencies[0]);
    }
  };

  return (
    <div className="currency-selector" ref={dropdownRef}>
      <label className="currency-selector-label">{label}</label>
      <button
        className={`currency-selector-button ${disabled ? 'disabled' : ''} ${isOpen ? 'open' : ''}`}
        onClick={handleToggle}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="currency-selector-content">
          <span className="currency-code">{selectedCurrency.code}</span>
          <span className="currency-symbol">{selectedCurrency.symbol}</span>
          <span className="currency-name">{selectedCurrency.name}</span>
        </div>
        <ChevronDown 
          className={`currency-selector-icon ${isOpen ? 'rotated' : ''}`}
          size={20}
        />
      </button>

      {isOpen && (
        <div className="currency-dropdown">
          <div className="currency-search">
            <Search className="currency-search-icon" size={16} />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search currencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="currency-search-input"
            />
          </div>
          <div className="currency-list">
            {filteredCurrencies.length > 0 ? (
              filteredCurrencies.map((currency) => (
                <button
                  key={currency.code}
                  className={`currency-option ${
                    currency.code === selectedCurrency.code ? 'selected' : ''
                  }`}
                  onClick={() => handleCurrencySelect(currency)}
                >
                  <div className="currency-option-content">
                    <span className="currency-option-code">{currency.code}</span>
                    <span className="currency-option-symbol">{currency.symbol}</span>
                    <span className="currency-option-name">{currency.name}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="currency-no-results">
                No currencies found matching "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
