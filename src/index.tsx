import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './i18n';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NotesProvider } from './context/NotesContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import { startMockingNotes } from '@sidekick-monorepo/internship-backend';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { NotificationProvider } from './context/NotificationContext';

const queryClient = new QueryClient();

export async function enableMocking() {
    const isProduction = process.env.NODE_ENV === 'production';
    await startMockingNotes(isProduction ? 'Module_10' : '.');
}

enableMocking().then(() => {
    const root = ReactDOM.createRoot(document.getElementById('root')!);

    root.render(
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <React.StrictMode>
                    <ThemeProvider>
                        <AuthProvider>
                            <NotificationProvider>
                                <NotesProvider>
                                    <BrowserRouter>
                                        <ErrorBoundary>
                                            <App />
                                        </ErrorBoundary>
                                    </BrowserRouter>
                                </NotesProvider>
                            </NotificationProvider>
                        </AuthProvider>
                    </ThemeProvider>
                </React.StrictMode>
            </QueryClientProvider>
        </Provider>
    );
});
