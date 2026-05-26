import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { ThemeContextParts } from '../types/context/ThemeContextParts';
import { ProviderProps } from '../types/props/ProviderProps';
import { ThemeType } from '../types/theme/ThemeType';

export const ThemeContext = createContext<ThemeContextParts | null>(null);

export const ThemeProvider = ({ children }: ProviderProps) => {
    const [theme, setTheme] = useState<ThemeType>(() => {
        const savedTheme = localStorage.getItem('app-theme');

        if (savedTheme === 'light' || savedTheme === 'dark') {
            return savedTheme;
        }

        return 'light';
    });

    const [fontSizeRatio, setFontSizeRatio] = useState<number>(() => {
        const saved = localStorage.getItem('app-font-size-ratio');

        const parsed = saved ? parseFloat(saved) : 1;

        return parsed >= 0.8 && parsed <= 2 ? parsed : 1;
    });

    useEffect(() => {
        localStorage.setItem('app-theme', theme);
        document.body.setAttribute('data-theme', theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('app-font-size-ratio', fontSizeRatio.toString());

        document.documentElement.style.setProperty('--font-size-ratio', fontSizeRatio.toString());

        document.body.style.setProperty('--font-size-ratio', fontSizeRatio.toString());
    }, [fontSizeRatio]);

    const toggleTheme = useCallback(() => {
        setTheme((prevTheme) => {
            return prevTheme === 'light' ? 'dark' : 'light';
        });
    }, []);

    const updateFontSizeRatio = useCallback((value: number) => {
        if (value >= 0.8 && value <= 2) {
            setFontSizeRatio(value);
        }
    }, []);

    const contextValue = useMemo(
        () => ({
            theme,
            toggleTheme,
            fontSizeRatio,
            updateFontSizeRatio,
        }),
        [theme, toggleTheme, fontSizeRatio, updateFontSizeRatio]
    );

    return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};
