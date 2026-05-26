import { ThemeType } from '../theme/ThemeType';

export interface ThemeContextParts {
    theme: ThemeType;
    toggleTheme: () => void;
    fontSizeRatio: number;
    updateFontSizeRatio: (value: number) => void;
}
