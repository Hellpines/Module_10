import { createContext, useCallback, useEffect, useState } from 'react';
import { ThemeContextParts } from '../types/ThemeContextParts';
import { ProviderProps } from '../types/ProviderProps';
import { ThemeType } from '../types/ThemeType';

export const ThemeContext = createContext<ThemeContextParts | null>(null);

export const ThemeProvider = ({ children }: ProviderProps) => {
    const [theme, setTheme] = useState<ThemeType>(() => {
        const savedTheme = localStorage.getItem('app-theme');

        if (savedTheme === 'light' || savedTheme === 'dark') {
            return savedTheme;
        }

        return 'light';
    });

    useEffect(() => {
        localStorage.setItem('app-theme', theme);
        document.body.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme(prevTheme => {
            return prevTheme === 'light' ? 'dark' : 'light'
        });
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

