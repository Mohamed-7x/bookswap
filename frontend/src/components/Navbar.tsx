import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, LogOut, LogIn, PlusCircle, Menu, X, ArrowRightLeft } from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/');
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <nav className="bg-slate-900 text-slate-50 sticky top-0 z-50 shadow-lg border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2.5 text-xl font-bold text-emerald-400 hover:text-emerald-300 transition-colors" onClick={closeMobile}>
            <BookOpen size={26} />
            <span>BookSwap</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/browse" className="text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-all text-sm font-medium">Browse</Link>

            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-all text-sm font-medium flex items-center gap-1.5">
                  <ArrowRightLeft size={14} /> Exchanges
                </Link>
                <Link to="/my-books" className="text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-all text-sm font-medium">My Books</Link>
                <Link to="/books/add" className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium ml-2">
                  <PlusCircle size={15} /> Add Book
                </Link>

                <div className="flex items-center gap-3 ml-4 pl-4 border-l border-slate-700/50">
                  <Link to="/profile" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="" className="w-8 h-8 rounded-full object-cover border-2 border-slate-600" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center border-2 border-slate-600 text-xs font-bold">
                        {user?.username?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm font-medium max-w-[100px] truncate">{user?.username}</span>
                  </Link>
                  <button onClick={handleLogout} className="text-slate-400 hover:text-rose-400 transition-colors p-1.5 rounded-lg hover:bg-white/5" title="Logout">
                    <LogOut size={18} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3 ml-4">
                <Link to="/login" className="text-slate-300 hover:text-white font-medium flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg hover:bg-white/5 transition-all">
                  <LogIn size={16} /> Login
                </Link>
                <Link to="/register" className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-lg transition-colors font-medium text-sm">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden text-slate-300 hover:text-white p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700 px-4 py-4 space-y-1">
          <Link to="/browse" onClick={closeMobile} className="block text-slate-300 hover:text-white px-3 py-2.5 rounded-lg hover:bg-white/5 text-sm font-medium">Browse</Link>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" onClick={closeMobile} className="block text-slate-300 hover:text-white px-3 py-2.5 rounded-lg hover:bg-white/5 text-sm font-medium">Exchanges</Link>
              <Link to="/my-books" onClick={closeMobile} className="block text-slate-300 hover:text-white px-3 py-2.5 rounded-lg hover:bg-white/5 text-sm font-medium">My Books</Link>
              <Link to="/books/add" onClick={closeMobile} className="block text-slate-300 hover:text-white px-3 py-2.5 rounded-lg hover:bg-white/5 text-sm font-medium">Add Book</Link>
              <Link to="/profile" onClick={closeMobile} className="block text-slate-300 hover:text-white px-3 py-2.5 rounded-lg hover:bg-white/5 text-sm font-medium">Profile</Link>
              <hr className="border-slate-700 my-2" />
              <button onClick={handleLogout} className="w-full text-left text-rose-400 hover:text-rose-300 px-3 py-2.5 rounded-lg hover:bg-white/5 text-sm font-medium">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMobile} className="block text-slate-300 hover:text-white px-3 py-2.5 rounded-lg hover:bg-white/5 text-sm font-medium">Login</Link>
              <Link to="/register" onClick={closeMobile} className="block text-emerald-400 hover:text-emerald-300 px-3 py-2.5 rounded-lg hover:bg-white/5 text-sm font-medium">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};
