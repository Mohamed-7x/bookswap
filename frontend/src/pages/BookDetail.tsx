import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Book } from '../components/BookCard';
import { BookOpen, User, Calendar, Edit, Trash2, ArrowLeft, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book & { description: string; owner: number; genre: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const res = await api.get(`/api/books/${id}/`);
      setBook(res.data);
    } catch (error) {
      toast.error('Failed to load book details');
      navigate('/browse');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await api.delete(`/api/books/${id}/`);
        toast.success('Book deleted successfully');
        navigate('/my-books');
      } catch (error) {
        toast.error('Failed to delete book');
      }
    }
  };

  const handleExchangeRequest = async () => {
    // In a full implementation, this would open a modal to select which book to offer
    // For MVP, we will just navigate to an exchange request page or show a toast
    toast('Exchange request flow will be implemented here', { icon: '🔄' });
  };

  if (isLoading) return <div className="min-h-[50vh] flex items-center justify-center">Loading...</div>;
  if (!book) return null;

  const isOwner = user?.id === book.owner;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-8">
        <ArrowLeft size={20} /> Back to browsing
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col md:flex-row">
        {/* Book Image */}
        <div className="md:w-1/3 bg-slate-50 p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-100 relative">
          {!book.is_available && (
            <div className="absolute top-4 left-4 bg-slate-800 text-white px-3 py-1 rounded-md font-medium z-10">
              Unavailable
            </div>
          )}
          
          <div className="w-full max-w-[250px] aspect-[2/3] shadow-xl rounded-sm overflow-hidden bg-white relative">
            <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/20 to-transparent z-10"></div>
            {book.image ? (
              <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                <BookOpen size={64} strokeWidth={1} />
                <span className="mt-2 font-medium tracking-widest text-sm uppercase">No Cover</span>
              </div>
            )}
          </div>
        </div>

        {/* Book Info */}
        <div className="md:w-2/3 p-8 md:p-12 flex flex-col">
          <div className="mb-2 flex items-center gap-3">
            <span className="bg-indigo-100 text-indigo-700 text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">
              {book.exchange_type}
            </span>
            <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-md font-medium capitalize">
              {book.condition.replace('_', ' ')}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{book.title}</h1>
          <p className="text-xl text-slate-600 mb-8">by {book.author}</p>

          <div className="prose prose-slate max-w-none mb-8 flex-grow">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Description</h3>
            <p className="text-slate-600 whitespace-pre-line leading-relaxed">
              {book.description || "No description provided for this book."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-slate-100 gap-4">
            <div className="flex items-center gap-6 w-full sm:w-auto">
              {book.owner_username && (
                <div className="flex items-center gap-2 text-slate-600">
                  <User size={18} className="text-slate-400" />
                  <span className="font-medium">{book.owner_username}</span>
                </div>
              )}
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
              {isOwner ? (
                <>
                  <button onClick={() => navigate(`/books/${id}/edit`)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-lg font-medium transition-colors">
                    <Edit size={18} /> Edit
                  </button>
                  <button onClick={handleDelete} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 px-5 py-2.5 rounded-lg font-medium transition-colors">
                    <Trash2 size={18} /> Delete
                  </button>
                </>
              ) : (
                <button 
                  onClick={handleExchangeRequest}
                  disabled={!isAuthenticated || !book.is_available}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
                >
                  <RefreshCw size={20} /> 
                  {book.is_available ? 'Request Exchange' : 'Currently Unavailable'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
