import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/axios';
import { User as UserIcon, Star, MapPin, BookOpen, RefreshCw } from 'lucide-react';
import { BookCard } from '../components/BookCard';
import type { Book } from '../components/BookCard';
import toast from 'react-hot-toast';

interface PublicUser {
  id: number;
  username: string;
  bio: string;
  city: string;
  avatar: string | null;
  rating: number;
  total_exchanges: number;
}

interface Review {
  id: number;
  reviewer: string;
  rating: number;
  comment: string;
  created_at: string;
}

export const PublicProfile = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<PublicUser | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      if (!username) return;
      setIsLoading(true);
      try {
        const [profileRes, reviewsRes, booksRes] = await Promise.all([
          api.get(`/api/auth/users/${username}/`),
          api.get(`/api/reviews/user/${username}/`),
          api.get(`/api/books/?search=${username}`),
        ]);
        setProfile(profileRes.data);
        setReviews(reviewsRes.data.results || reviewsRes.data);
        // Filter books by owner username
        const allBooks = booksRes.data.results || booksRes.data;
        setBooks(allBooks.filter((b: Book) => b.owner === username));
      } catch {
        toast.error('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, [username]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="animate-pulse bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="h-32 bg-slate-200"></div>
          <div className="p-8">
            <div className="h-8 bg-slate-200 rounded w-48 mb-4"></div>
            <div className="h-4 bg-slate-200 rounded w-32"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-emerald-500"></div>
        <div className="px-8 pb-8 relative">
          <div className="absolute -top-14 border-4 border-white rounded-full bg-white shadow-sm">
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.username} className="w-28 h-28 rounded-full object-cover" />
            ) : (
              <div className="w-28 h-28 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <UserIcon size={56} />
              </div>
            )}
          </div>

          <div className="pt-18 mt-16">
            <h1 className="text-2xl font-bold text-slate-900">{profile.username}</h1>

            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
              <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1 rounded-full font-medium">
                <Star size={14} className="fill-amber-500 text-amber-500" />
                {Number(profile.rating).toFixed(1)} rating
              </div>
              <div className="flex items-center gap-1.5 text-slate-500">
                <RefreshCw size={14} />
                {profile.total_exchanges} exchanges
              </div>
              {profile.city && (
                <div className="flex items-center gap-1.5 text-slate-500">
                  <MapPin size={14} />
                  {profile.city}
                </div>
              )}
            </div>

            {profile.bio && (
              <p className="mt-4 text-slate-600 text-sm leading-relaxed">{profile.bio}</p>
            )}
          </div>
        </div>
      </div>

      {/* User's Books */}
      {books.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <BookOpen size={20} /> Books by {profile.username}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {books.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Star size={20} /> Reviews ({reviews.length})
        </h2>
        {reviews.length > 0 ? (
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
            <p className="text-slate-500 text-sm">No reviews yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};
