import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, RefreshCw, Star, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/axios';
import { BookCard } from '../components/BookCard';
import type { Book } from '../components/BookCard';

export const Landing = () => {
  const { isAuthenticated } = useAuth();
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [isLoadingBooks, setIsLoadingBooks] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/api/books/?is_available=true&ordering=-created_at');
        const data = res.data.results || res.data;
        setFeaturedBooks(data.slice(0, 8));
      } catch {
        // Silently fail — landing page should still render
      } finally {
        setIsLoadingBooks(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white pt-24 pb-36 px-4 relative overflow-hidden">
        {/* Animated gradient blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[70%] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[70%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-[40%] left-[30%] w-[30%] h-[40%] bg-violet-500/5 blur-[80px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            <span className="text-sm text-slate-300 font-medium">Free & open book exchange platform</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
            Read. Swap.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-400">
              Repeat.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Join a thriving community of readers. Exchange books you've read for new adventures,
            or donate to fellow book lovers — completely peer-to-peer and free.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link to="/browse" className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-indigo-500/25 flex items-center justify-center gap-2 group">
                Browse Books <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <>
                <Link to="/register" className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-emerald-500/25">
                  Get Started — It's Free
                </Link>
                <Link to="/browse" className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-4 rounded-full font-bold text-lg transition-all backdrop-blur-sm">
                  Explore Library
                </Link>
              </>
            )}
          </div>

          {/* Stats row */}
          <div className="mt-16 flex justify-center gap-12 sm:gap-16 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-white">P2P</div>
              <div className="text-sm text-slate-500 mt-1">Exchange</div>
            </div>
            <div className="w-px bg-slate-700"></div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-white">Free</div>
              <div className="text-sm text-slate-500 mt-1">Forever</div>
            </div>
            <div className="w-px bg-slate-700"></div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-white">Secure</div>
              <div className="text-sm text-slate-500 mt-1">Reviews</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      {!isLoadingBooks && featuredBooks.length > 0 && (
        <section className="py-20 bg-white px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Recently Listed</h2>
                <p className="text-slate-500 mt-2">Fresh books just added to the library.</p>
              </div>
              <Link to="/browse" className="text-indigo-600 hover:text-indigo-500 font-semibold flex items-center gap-1 group transition-colors">
                View all <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 gap-y-8">
              {featuredBooks.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How It Works Section */}
      <section className="py-24 bg-slate-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">How BookSwap Works</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Three simple steps to keep great stories circulating.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center group hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BookOpen size={32} />
              </div>
              <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-3">Step 1</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">List Your Books</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Add books you've finished reading. Mark them for exchange, donation, or both.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center group hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <RefreshCw size={32} />
              </div>
              <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-3">Step 2</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Request Exchanges</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Browse available books, propose exchanges with yours. Everything is peer-to-peer.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center group hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Star size={32} />
              </div>
              <div className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-3">Step 3</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Review & Trust</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Complete exchanges and leave reviews. Build reputation in the community.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-20 bg-gradient-to-br from-indigo-600 to-violet-700 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Ready to start swapping?</h2>
            <p className="text-indigo-200 text-lg mb-10 max-w-xl mx-auto">
              Create your free account in seconds and join readers who are already sharing great books.
            </p>
            <Link to="/register" className="inline-flex items-center gap-2 bg-white text-indigo-700 px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-white/25 hover:bg-indigo-50">
              Join BookSwap <ArrowRight size={20} />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};
