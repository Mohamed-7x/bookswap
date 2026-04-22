import { useState, useEffect } from 'react';
import { api } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { User as UserIcon, Star, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

interface Review {
  id: number;
  reviewer: string;
  rating: number;
  comment: string;
  created_at: string;
}

export const Profile = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.username) {
      fetchReviews();
    }
  }, [user]);

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/api/reviews/user/${user?.username}/`);
      setReviews(res.data.results || res.data);
    } catch (error) {
      toast.error('Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-8">
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-emerald-500"></div>
        <div className="px-8 pb-8 relative">
          <div className="absolute -top-16 border-4 border-white rounded-full bg-white">
            {user.avatar ? (
              <img src={user.avatar} alt={user.username} className="w-32 h-32 rounded-full object-cover" />
            ) : (
              <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <UserIcon size={64} />
              </div>
            )}
          </div>
          
          <div className="pt-20">
            <h1 className="text-3xl font-bold text-slate-900">{user.username}</h1>
            
            <div className="flex flex-wrap items-center gap-6 mt-4 text-slate-600">
              <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">
                <Star size={16} className="fill-amber-500 text-amber-500" />
                {user.rating} Average Rating
              </div>
              {user.city && (
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-slate-400" />
                  {user.city}
                </div>
              )}
            </div>

            {user.bio && (
              <div className="mt-6 pt-6 border-t border-slate-100">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-2">About</h3>
                <p className="text-slate-600">{user.bio}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Reviews Received</h2>
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2].map(i => <div key={i} className="h-32 bg-slate-200 rounded-xl w-full"></div>)}
          </div>
        ) : reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map(review => (
              <div key={review.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
                      {review.reviewer.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{review.reviewer}</p>
                      <p className="text-xs text-slate-500">{new Date(review.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} size={16} className={star <= review.rating ? "fill-amber-400" : "text-slate-200"} />
                    ))}
                  </div>
                </div>
                <p className="text-slate-600 italic">"{review.comment}"</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-100">
            <Star className="mx-auto text-slate-300 mb-3" size={32} />
            <p className="text-slate-500">No reviews received yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

