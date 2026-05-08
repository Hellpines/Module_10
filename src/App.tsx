import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Notes from './pages/Notes/Notes';
import Archived from './pages/Archived/Archived';
import Trash from './pages/Trash/Trash';
import SignIn from './pages/Sign/SignIn';
import SignUp from './pages/Sign/SignUp';
import NoAuthPage from './pages/NoAuth/NoAuthPage';
import NotFound from './pages/NotFound/NotFound';

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

            <Route path='/signin' element={<SignIn />} />
            <Route path='/signup' element={<SignUp />} />
            <Route path='/noauth' element={<NoAuthPage />} />
            <Route path='*' element={<NotFound />} />
        </Routes>
    )
}

export default App;