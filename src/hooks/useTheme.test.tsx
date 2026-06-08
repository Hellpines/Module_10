import { renderHook } from '@testing-library/react';
import { useTheme } from './useTheme';

describe('useTheme hook', () => {
    test('should throw an error when used outside of an ThemeProvider', () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        expect(() => renderHook(() => useTheme())).toThrow(
            'useTheme must be used within an ThemeProvider'
        );

        consoleSpy.mockRestore();
    });
});
