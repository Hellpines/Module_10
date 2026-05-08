import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import style from './themeToggle.module.css';

export const ThemeToggle = () => {
    const { theme, toggleTheme } = useContext(ThemeContext)!;

    return (
        <button 
            onClick={toggleTheme}
            className={style.toggleTheme}
        >
            {theme === 'light' ? 'Темная тема' : 'Светлая тема'}
        </button>
    );
};