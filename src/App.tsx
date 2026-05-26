import { Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/Routes/ProtectedRoute';
import PublicRoute from './components/Routes/PublicRoute';
import Notification from './components/Notification/Notification';
import { Loader } from './components/UI/Loader/Loader';
import { useAuth } from './hooks/useAuth';

const Notes = lazy(() => import('./pages/Notes/Notes'));
const Profile = lazy(() => import('./pages/Profile/Profile'));
const Trash = lazy(() => import('./pages/Trash/Trash'));
const Archived = lazy(() => import('./pages/Archived/Archived'));
const SignIn = lazy(() => import('./pages/Sign/SignIn'));
const SignUp = lazy(() => import('./pages/Sign/SignUp'));
const NotFound = lazy(() => import('./pages/NotFound/NotFound'));
const NoAuthPage = lazy(() => import('./pages/NoAuth/NoAuthPage'));

function App() {
    const { isAuthLoading } = useAuth();
    const { t } = useTranslation();

    if (isAuthLoading) {
        return <Loader label={t('app.loading')} />;
    }

    return (
        <>
            <Notification />
            <Suspense fallback={<Loader label={t('app.pageLoading')} />}>
                <Routes>
                    <Route
                        path='/'
                        element={
                            <ProtectedRoute>
                                <Notes />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path='/profile'
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path='/archived'
                        element={
                            <ProtectedRoute>
                                <Archived />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path='/trash'
                        element={
                            <ProtectedRoute>
                                <Trash />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path='/signin'
                        element={
                            <PublicRoute>
                                <SignIn />
                            </PublicRoute>
                        }
                    />

                    <Route
                        path='/signup'
                        element={
                            <PublicRoute>
                                <SignUp />
                            </PublicRoute>
                        }
                    />

                    <Route
                        path='/noauth'
                        element={
                            <PublicRoute>
                                <NoAuthPage />
                            </PublicRoute>
                        }
                    />

                    <Route path='*' element={<NotFound />} />
                </Routes>
            </Suspense>
        </>
    );
}

export default App;
