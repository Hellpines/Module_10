import './index.css';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { NotesProvider } from './context/NotesContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

const root = ReactDOM.createRoot(
    document.getElementById('root')!
);

root.render(
    <ErrorBoundary>
        <ThemeProvider>
            <AuthProvider>
                <NotesProvider>
                    <HashRouter>
                        <App />
                    </HashRouter>
                </NotesProvider>
            </AuthProvider>
        </ThemeProvider>
    </ErrorBoundary>
);