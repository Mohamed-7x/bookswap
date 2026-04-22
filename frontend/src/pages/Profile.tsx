import { useState, useEffect } from 'react';
import { api } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { User as UserIcon, Star, MapPin, RefreshCw, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

interface Review {
  id: number;
  reviewer: string;
  rating: number;
  comment: string;
  created_at: string;
}

export const Profile = () => {
  const { user, refreshUser } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!user?.username) return;
      try {
        const res = await api.get(`/api/reviews/user/${user.username}/`);
        setReviews(res.data.results || res.data);
      } catch {
        toast.error('Failed to load reviews');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
    if (user?.username) {
      refreshUser(); // Refresh user data to get latest rating
    }
  }, [user?.username, refreshUser]);

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-500"></div>
        <div className="px-8 pb-8 relative">
          <div className="absolute -top-14 border-4 border-white rounded-full bg-white shadow-sm">
            {user.avatar ? (
              <img src={user.avatar} alt={user.username} className="w-28 h-28 rounded-full object-cover" />
            ) : (
              <div className="w-28 h-28 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <UserIcon size={56} />
              </div>
            )}
          </div>

          <div className="pt-18 mt-16">
            <h1 className="text-2xl font-bold text-slate-900">{user.username}</h1>
            {(user.email) && (
              <p className="text-sm text-slate-500 mt-1">{user.email}</p>
            )}

            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
              <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1 rounded-full font-medium">
                <Star size={14} className="fill-amber-500 text-amber-500" />
                {Number(user.rating).toFixed(1)} rating
              </div>
              <div className="flex items-center gap-1.5 text-slate-500">
                <RefreshCw size={14} />
                {user.total_exchanges} exchanges
              </div>
              {user.city && (
                <div className="flex items-center gap-1.5 text-slate-500">
                  <MapPin size={14} />
                  {user.city}
                </div>
              )}
            </div>

            {user.bio && (
              <div className="mt-6 pt-6 border-t border-slate-100">
                <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2">About</h3>
                <p className="text-slate-600 text-sm">{user.bio}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Link to="/my-books" className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-3 group">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <BookOpen size={20} className="text-indigo-600" />
          </div>
          <div>
            <div className="font-semibold text-slate-900 text-sm">My Books</div>
            <div className="text-xs text-slate-400">Manage listings</div>
          </div>
        </Link>

        <Link to="/dashboard" className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-3 group">
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <RefreshCw size={20} className="text-emerald-600" />
          </div>
          <div>
            <div className="font-semibold text-slate-900 text-sm">Exchanges</div>
            <div className="text-xs text-slate-400">View requests</div>
          </div>
        </Link>

        <Link to="/browse" className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-3 group">
          <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <Star size={20} className="text-violet-600" />
          </div>
          <div>
            <div className="font-semibold text-slate-900 text-sm">Browse</div>
            <div className="text-xs text-slate-400">Find books</div>
          </div>
        </Link>
      </div>

      {/* Reviews Section */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-6">Reviews Received</h2>
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2].map(i => <div key={i} className="h-24 bg-slate-200 rounded-xl w-full"></div>)}
          </div>
        ) : reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map(review => (
              <div key={review.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-sm">
                      {review.reviewer.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 text-sm">{review.reviewer}</p>
                      <p className="text-[11px] text-slate-400">{new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} size={14} className={star <= review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"} />
                    ))}
                  </div>
                </div>
                {review.comment && (
                  <p className="text-slate-600 text-sm italic pl-12">"{review.comment}"</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-100">
            <Star className="mx-auto text-slate-300 mb-3" size={28} />
            <p className="text-slate-500 text-sm">No reviews received yet. Complete exchanges to earn reviews!</p>
          </div>
        )}
      </div>
    </div>
  );
};
