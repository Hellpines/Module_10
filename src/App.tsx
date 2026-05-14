import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Notes from './pages/Notes/Notes';
import Archived from './pages/Archived/Archived';
import Trash from './pages/Trash/Trash';
import SignIn from './pages/Sign/SignIn';
import SignUp from './pages/Sign/SignUp';
import NoAuthPage from './pages/NoAuth/NoAuthPage';
import NotFound from './pages/NotFound/NotFound';
import PublicRoute from './components/PublicRoute/PublicRoute';
import Profile from './pages/Profile/Profile';

function App() {
    return (
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
            <Route
                path='*'
                element={<NotFound />}
            />
        </Routes>
    )
}

export default App;