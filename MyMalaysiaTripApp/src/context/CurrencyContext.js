import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CurrencyContext = createContext();

export const CURRENCIES = {
    MYR: { code: 'MYR', symbol: 'RM', rate: 1.0, name: 'Malaysian Ringgit' },
    USD: { code: 'USD', symbol: '$', rate: 0.21, name: 'US Dollar' },
    SGD: { code: 'SGD', symbol: 'S$', rate: 0.29, name: 'Singapore Dollar' },
    IDR: { code: 'IDR', symbol: 'Rp', rate: 3300, name: 'Indonesian Rupiah' },
    EUR: { code: 'EUR', symbol: '€', rate: 0.20, name: 'Euro' },
    GBP: { code: 'GBP', symbol: '£', rate: 0.17, name: 'British Pound' }
};

export const CurrencyProvider = ({ children }) => {
    const [currency, setCurrency] = useState(CURRENCIES.MYR);

    // Load saved currency from AsyncStorage on mount
    useEffect(() => {
        const loadCurrency = async () => {
            try {
                const saved = await AsyncStorage.getItem('app_currency');
                if (saved && CURRENCIES[saved]) {
                    setCurrency(CURRENCIES[saved]);
                }
            } catch (e) {
                console.error("Failed to load currency", e);
            }
        };
        loadCurrency();
    }, []);

    const changeCurrency = async (code) => {
        if (CURRENCIES[code]) {
            setCurrency(CURRENCIES[code]);
            try {
                await AsyncStorage.setItem('app_currency', code);
            } catch (e) {
                console.error("Failed to save currency", e);
            }
        }
    };

    // Helper to format price
    const formatPrice = (amountInMYR) => {
        if (amountInMYR === 0) return 'Free';
        const converted = amountInMYR * currency.rate;

        // Different formatting for IDR (no decimals usually)
        if (currency.code === 'IDR') {
            return `${currency.symbol} ${Math.round(converted).toLocaleString()}`;
        }

        return `${currency.symbol} ${converted.toFixed(2)}`;
    };

    return (
        <CurrencyContext.Provider value={{ currency, changeCurrency, formatPrice }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => useContext(CurrencyContext);
