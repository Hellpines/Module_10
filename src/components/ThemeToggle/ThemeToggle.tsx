import { useContext } from 'react';
import style from './themeToggle.module.css';
import { ThemeContext } from '../../context/ThemeContext';

export const ThemeToggle = () => {
    const { theme, toggleTheme } = useContext(ThemeContext)!;

    return (
        <div className={style.toggleWrapper}>
            <button
                onClick={toggleTheme}
                className={style.toggleButton}
            >
                <div
                    className={`
                        ${style.toggle}
                        ${theme === 'dark' ? style.active : ''}
                    `}
                />
            </button>
            <p>Dark theme</p>
        </div>
    );
};