import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, User as UserIcon, LogOut, LogIn, PlusCircle } from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-slate-900 text-slate-50 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-emerald-400 hover:text-emerald-300 transition-colors">
              <BookOpen size={28} />
              BookSwap
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/browse" className="text-slate-300 hover:text-white transition-colors">Browse</Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-slate-300 hover:text-white transition-colors">Exchanges</Link>
                <Link to="/my-books" className="text-slate-300 hover:text-white transition-colors">My Books</Link>
                <Link to="/books/add" className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-md transition-colors text-sm font-medium">
                  <PlusCircle size={16} /> Add Book
                </Link>
                <div className="flex items-center gap-4 ml-4 pl-4 border-l border-slate-700">
                  <Link to="/profile" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-slate-600" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600">
                        <UserIcon size={16} />
                      </div>
                    )}
                    <span className="text-sm font-medium">{user?.username}</span>
                  </Link>
                  <button onClick={handleLogout} className="text-slate-400 hover:text-rose-400 transition-colors" title="Logout">
                    <LogOut size={20} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-slate-300 hover:text-white transition-colors font-medium flex items-center gap-1">
                  <LogIn size={18} /> Login
                </Link>
                <Link to="/register" className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-md transition-colors font-medium">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
