import React, { createContext, useContext, useState, useEffect } from 'react';

type Currency = {
  code: string;
  symbol: string;
  rate: number; // Rate relative to USD
};

const currencies: Record<string, Currency> = {
  USD: { code: 'USD', symbol: '$', rate: 1 },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92 },
  GBP: { code: 'GBP', symbol: '£', rate: 0.79 },
  BDT: { code: 'BDT', symbol: '৳', rate: 110 },
  INR: { code: 'INR', symbol: '₹', rate: 83 },
};

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (code: string) => void;
  convert: (amount: number) => string;
  availableCurrencies: Currency[];
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(currencies.USD);

  const setCurrency = (code: string) => {
    if (currencies[code]) {
      setCurrentCurrency(currencies[code]);
    }
  };

  const convert = (amount: number) => {
    const converted = amount * currentCurrency.rate;
    return `${currentCurrency.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <CurrencyContext.Provider value={{ 
      currency: currentCurrency, 
      setCurrency, 
      convert, 
      availableCurrencies: Object.values(currencies) 
    }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
