import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MainLayout } from './layouts/MainLayout';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { BrowseBooks } from './pages/BrowseBooks';
import { BookDetail } from './pages/BookDetail';
import { MyBooks } from './pages/MyBooks';
import { BookForm } from './pages/BookForm';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { PublicProfile } from './pages/PublicProfile';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Landing />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="browse" element={<BrowseBooks />} />
            <Route path="books/:id" element={<BookDetail />} />
            <Route path="user/:username" element={<PublicProfile />} />

            {/* Protected Routes */}
            <Route path="my-books" element={<ProtectedRoute><MyBooks /></ProtectedRoute>} />
            <Route path="books/add" element={<ProtectedRoute><BookForm /></ProtectedRoute>} />
            <Route path="books/:id/edit" element={<ProtectedRoute><BookForm /></ProtectedRoute>} />
            <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
