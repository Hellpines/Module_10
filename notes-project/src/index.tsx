import './index.css';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import Archived from './pages/Archived/Archived';
import Trash from './pages/Trash/Trash';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import NoAuthPage from './pages/NoAuth/NoAuthPage';
import SignUp from './pages/SignUp/SignUp';
import SignIn from './pages/SignIn/SignIn';
import NotFound from './pages/NotFound/NotFound';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <ErrorBoundary>
    <AuthProvider>
      <AppProvider>
        <HashRouter>
          <Routes>
            <Route 
              path='/' 
              element={
                <ProtectedRoute>
                  <App/>
                </ProtectedRoute>
              }
            />
            <Route 
              path='/archived' 
              element={
                <ProtectedRoute>
                  <Archived/>
                </ProtectedRoute>
              } 
            />
            <Route 
              path='/trash' 
              element={
                <ProtectedRoute>
                  <Trash/>
                </ProtectedRoute>
              } 
            />
            <Route path='/noauth' element={<NoAuthPage/>}/>
            <Route path='/signup' element={<SignUp/>}/>
            <Route path='/signin' element={<SignIn/>}/>
            <Route path='*' element={<NotFound/>}/>
          </Routes>
        </HashRouter>
      </AppProvider>
    </AuthProvider>
  </ErrorBoundary>

);