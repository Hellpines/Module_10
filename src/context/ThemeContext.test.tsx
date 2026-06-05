import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useContext } from 'react';
import { ThemeContext, ThemeProvider } from './ThemeContext';

const TestConsumer = () => {
    const context = useContext(ThemeContext);
    if (!context) return null;

    return (
        <div>
            <span data-testid='theme'>{context.theme}</span>
            <span data-testid='ratio'>{context.fontSizeRatio}</span>
            <button onClick={context.toggleTheme}>Toggle Theme</button>
            <button onClick={() => context.updateFontSizeRatio(1.5)}>Set Valid Ratio</button>
            <button onClick={() => context.updateFontSizeRatio(2.5)}>Set Invalid High Ratio</button>
            <button onClick={() => context.updateFontSizeRatio(0.5)}>Set Invalid Low Ratio</button>
        </div>
    );
};

describe('ThemeContext/ThemeProvider', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        window.localStorage.clear();
        jest.spyOn(Storage.prototype, 'setItem');

        document.body.removeAttribute('data-theme');
        document.body.style.removeProperty('--font-size-ratio');
        document.documentElement.style.removeProperty('--font-size-ratio');
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('initializes with default light theme and ratio of 1', () => {
        render(
            <ThemeProvider>
                <TestConsumer />
            </ThemeProvider>
        );

        expect(screen.getByTestId('theme').textContent).toBe('light');
        expect(screen.getByTestId('ratio').textContent).toBe('1');

        expect(document.body.getAttribute('data-theme')).toBe('light');
        expect(document.documentElement.style.getPropertyValue('--font-size-ratio')).toBe('1');
        expect(document.body.style.getPropertyValue('--font-size-ratio')).toBe('1');
    });

    test('initializes with values stored in localStorage', () => {
        window.localStorage.setItem('app-theme', 'dark');
        window.localStorage.setItem('app-font-size-ratio', '1.2');

        render(
            <ThemeProvider>
                <TestConsumer />
            </ThemeProvider>
        );

        expect(screen.getByTestId('theme').textContent).toBe('dark');
        expect(screen.getByTestId('ratio').textContent).toBe('1.2');

        expect(document.body.getAttribute('data-theme')).toBe('dark');
        expect(document.documentElement.style.getPropertyValue('--font-size-ratio')).toBe('1.2');
        expect(document.body.style.getPropertyValue('--font-size-ratio')).toBe('1.2');
    });

    test('falls back to defaults if localStorage values are invalid', () => {
        window.localStorage.setItem('app-theme', 'invalid-theme');
        window.localStorage.setItem('app-font-size-ratio', '3.0');

        render(
            <ThemeProvider>
                <TestConsumer />
            </ThemeProvider>
        );

        expect(screen.getByTestId('theme').textContent).toBe('light');
        expect(screen.getByTestId('ratio').textContent).toBe('1');
    });

    test('toggles theme, updates localStorage and sets body attribute', async () => {
        render(
            <ThemeProvider>
                <TestConsumer />
            </ThemeProvider>
        );

        const toggleBtn = screen.getByRole('button', { name: /toggle theme/i });
        userEvent.click(toggleBtn);

        expect(screen.getByTestId('theme').textContent).toBe('dark');
        expect(document.body.getAttribute('data-theme')).toBe('dark');
        expect(Storage.prototype.setItem).toHaveBeenCalledWith('app-theme', 'dark');

        userEvent.click(toggleBtn);

        expect(screen.getByTestId('theme').textContent).toBe('light');
        expect(document.body.getAttribute('data-theme')).toBe('light');
        expect(Storage.prototype.setItem).toHaveBeenCalledWith('app-theme', 'light');
    });

    test('updates font size ratio when value is within allowed range', async () => {
        render(
            <ThemeProvider>
                <TestConsumer />
            </ThemeProvider>
        );

        const validBtn = screen.getByRole('button', { name: /set valid ratio/i });
        userEvent.click(validBtn);

        expect(screen.getByTestId('ratio').textContent).toBe('1.5');
        expect(document.documentElement.style.getPropertyValue('--font-size-ratio')).toBe('1.5');
        expect(document.body.style.getPropertyValue('--font-size-ratio')).toBe('1.5');
        expect(Storage.prototype.setItem).toHaveBeenCalledWith('app-font-size-ratio', '1.5');
    });

    test('ignores font size ratio updates when value is out of allowed range', async () => {
        render(
            <ThemeProvider>
                <TestConsumer />
            </ThemeProvider>
        );

        const highBtn = screen.getByRole('button', { name: /set invalid high ratio/i });
        userEvent.click(highBtn);
        expect(screen.getByTestId('ratio').textContent).toBe('1');

        const lowBtn = screen.getByRole('button', { name: /set invalid low ratio/i });
        userEvent.click(lowBtn);
        expect(screen.getByTestId('ratio').textContent).toBe('1');
    });
});
