import { Link } from 'react-router-dom';
import { BookOpen, RefreshCw, Star, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Landing = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white pt-20 pb-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 -left-1/4 w-1/2 h-full bg-emerald-500 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-0 -right-1/4 w-1/2 h-full bg-indigo-500 blur-[120px] rounded-full"></div>
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
            Read. Swap. <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400">Repeat.</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Join the community of book lovers. Exchange your read books for new adventures, or donate to fellow readers. Completely peer-to-peer.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link to="/browse" className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-indigo-500/25 flex items-center justify-center gap-2">
                Browse Books <ArrowRight size={20} />
              </Link>
            ) : (
              <>
                <Link to="/register" className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-emerald-500/25">
                  Join for Free
                </Link>
                <Link to="/browse" className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-8 py-4 rounded-full font-bold text-lg transition-all">
                  Explore Library
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">How it works</h2>
            <p className="text-slate-600 max-w-xl mx-auto">A simple, transparent system to keep stories circulating.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-6">
                <BookOpen size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">List your books</h3>
              <p className="text-slate-600">Add books you've finished reading to your virtual shelf. Mark them for exchange or donation.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                <RefreshCw size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Request Exchanges</h3>
              <p className="text-slate-600">Find books you want and propose an exchange with your available books. Safe and secure.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-6">
                <Star size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Review & Build Trust</h3>
              <p className="text-slate-600">After a successful swap, leave a review. Build your rating in the community.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
