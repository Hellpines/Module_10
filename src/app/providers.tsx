'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from '@/store/store';
import { ThemeProvider } from '@/context/ThemeContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { AuthProvider } from '@/context/AuthContext';
import { NotesProvider } from '@/context/NotesContext';
import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary';
import { Loader } from '@/components/UI/Loader/Loader';
import { getMswBasePath } from '@/lib/msw/get-msw-base-path';
import '@/i18n';

function MSWProvider({ children }: { children: ReactNode }) {
    const skipMsw = process.env.NEXT_PUBLIC_E2E === 'true';
    const [ready, setReady] = useState(skipMsw);

    useEffect(() => {
        if (skipMsw) {
            return;
        }

        async function init() {
            try {
                const { startMockingNotes } = await import('@sidekick-monorepo/internship-backend');
                await startMockingNotes(getMswBasePath());
            } catch (error) {
                console.error('Failed to initialize MSW:', error);
            } finally {
                setReady(true);
            }
        }

        init();
    }, [skipMsw]);

    if (!ready) {
        return <Loader label='Loading application...' />;
    }

    return <>{children}</>;
}

export function Providers({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <MSWProvider>
                    <ThemeProvider>
                        <NotificationProvider>
                            <AuthProvider>
                                <NotesProvider>
                                    <ErrorBoundary>{children}</ErrorBoundary>
                                </NotesProvider>
                            </AuthProvider>
                        </NotificationProvider>
                    </ThemeProvider>
                </MSWProvider>
            </QueryClientProvider>
        </Provider>
    );
}
