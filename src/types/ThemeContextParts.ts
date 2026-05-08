import { ThemeType } from './ThemeType';

export interface ThemeContextParts {
    theme: ThemeType;
    toggleTheme: () => void;
}