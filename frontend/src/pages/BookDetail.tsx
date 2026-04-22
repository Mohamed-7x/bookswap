import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { AxiosError } from 'axios';
import { api } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import type { Book } from '../components/BookCard';
import { BookOpen, Edit, Trash2, ArrowLeft, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Exchange request state
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [myBooks, setMyBooks] = useState<Book[]>([]);
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [exchangeMessage, setExchangeMessage] = useState('');
  const [isSubmittingExchange, setIsSubmittingExchange] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await api.get(`/api/books/${id}/`);
        setBook(res.data);
      } catch {
        toast.error('Failed to load book details');
        navigate('/browse');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBook();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await api.delete(`/api/books/${id}/`);
        toast.success('Book deleted successfully');
        navigate('/my-books');
      } catch {
        toast.error('Failed to delete book');
      }
    }
  };

  const openExchangeModal = async () => {
    try {
      const res = await api.get('/api/books/mine/');
      const available = (res.data.results || res.data).filter((b: Book) => b.is_available);
      setMyBooks(available);
      if (available.length > 0) setSelectedBookId(available[0].id);
      setShowExchangeModal(true);
    } catch {
      toast.error('Failed to load your books');
    }
  };

  const submitExchange = async () => {
    if (!selectedBookId || !book) return;
    setIsSubmittingExchange(true);
    try {
      await api.post('/api/exchanges/', {
        offered_book_id: selectedBookId,
        requested_book_id: book.id,
        message: exchangeMessage,
      });
      toast.success('Exchange request sent!');
      setShowExchangeModal(false);
      setExchangeMessage('');
    } catch (error) {
      const data = (error as AxiosError<{ offered_book_id?: string[]; requested_book_id?: string[]; detail?: string; non_field_errors?: string[] }>).response?.data;
      if (data) {
        const msg = data.offered_book_id || data.requested_book_id || data.detail || data.non_field_errors?.[0] || 'Failed to send request';
        toast.error(Array.isArray(msg) ? msg[0] : msg);
      } else {
        toast.error('Failed to send exchange request');
      }
    } finally {
      setIsSubmittingExchange(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="animate-pulse bg-white rounded-2xl border border-slate-100 overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-1/3 bg-slate-200 aspect-[2/3]"></div>
          <div className="md:w-2/3 p-12 space-y-4">
            <div className="h-6 bg-slate-200 rounded w-32"></div>
            <div className="h-10 bg-slate-200 rounded w-3/4"></div>
            <div className="h-5 bg-slate-200 rounded w-1/2"></div>
            <div className="h-32 bg-slate-200 rounded w-full mt-8"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) return null;

  const isOwner = user?.username === book.owner;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-8 text-sm font-medium">
        <ArrowLeft size={18} /> Back
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col md:flex-row">
        {/* Book Image */}
        <div className="md:w-1/3 bg-gradient-to-br from-slate-100 to-slate-50 p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-100 relative">
          {!book.is_available && (
            <div className="absolute top-4 left-4 bg-slate-800 text-white px-3 py-1.5 rounded-lg font-semibold text-sm z-10">
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
                <span className="mt-2 font-medium tracking-widest text-xs uppercase">No Cover</span>
              </div>
            )}
          </div>
        </div>

        {/* Book Info */}
        <div className="md:w-2/3 p-8 md:p-12 flex flex-col">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="bg-indigo-100 text-indigo-700 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
              {book.exchange_type}
            </span>
            <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-full font-medium capitalize">
              {book.condition.replace('_', ' ')}
            </span>
            {book.genre && (
              <span className="bg-violet-100 text-violet-700 text-xs px-2.5 py-1 rounded-full font-medium">
                {book.genre.name}
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{book.title}</h1>
          <p className="text-xl text-slate-500 mb-8">by {book.author}</p>

          {book.isbn && <p className="text-xs text-slate-400 mb-4">ISBN: {book.isbn}</p>}

          <div className="flex-grow mb-8">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">Description</h3>
            <p className="text-slate-600 whitespace-pre-line leading-relaxed text-sm">
              {book.description || "No description provided for this book."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-slate-100 gap-4">
            <Link to={`/user/${book.owner}`} className="flex items-center gap-3 text-slate-600 hover:text-indigo-600 transition-colors">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-sm font-bold text-indigo-600">{book.owner.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <div className="font-medium text-sm">{book.owner}</div>
                <div className="text-xs text-slate-400">View profile</div>
              </div>
            </Link>

            <div className="flex gap-3 w-full sm:w-auto">
              {isOwner ? (
                <>
                  <button onClick={() => navigate(`/books/${id}/edit`)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-lg font-medium text-sm transition-colors">
                    <Edit size={16} /> Edit
                  </button>
                  <button onClick={handleDelete} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 px-5 py-2.5 rounded-lg font-medium text-sm transition-colors">
                    <Trash2 size={16} /> Delete
                  </button>
                </>
              ) : (
                <button
                  onClick={openExchangeModal}
                  disabled={!isAuthenticated || !book.is_available}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow text-sm"
                >
                  <RefreshCw size={18} />
                  {book.is_available ? 'Request Exchange' : 'Currently Unavailable'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Exchange Request Modal */}
      {showExchangeModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowExchangeModal(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Request Exchange</h3>
            <p className="text-sm text-slate-500 mb-6">Select one of your available books to offer in exchange for <strong>{book.title}</strong>.</p>

            {myBooks.length > 0 ? (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Your book to offer</label>
                  <select
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-sm bg-white"
                    value={selectedBookId ?? ''}
                    onChange={(e) => setSelectedBookId(Number(e.target.value))}
                  >
                    {myBooks.map(b => (
                      <option key={b.id} value={b.id}>{b.title} — {b.author}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Message (optional)</label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-sm"
                    value={exchangeMessage}
                    onChange={(e) => setExchangeMessage(e.target.value)}
                    placeholder="Hi! I'd love to swap books with you..."
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button onClick={() => setShowExchangeModal(false)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium text-sm">
                    Cancel
                  </button>
                  <button onClick={submitExchange} disabled={isSubmittingExchange} className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium text-sm hover:bg-indigo-700 disabled:opacity-60 flex items-center gap-2">
                    <RefreshCw size={16} /> {isSubmittingExchange ? 'Sending...' : 'Send Request'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-500 text-sm mb-4">You don't have any available books to offer.</p>
                <Link to="/books/add" className="text-indigo-600 font-medium text-sm hover:text-indigo-500">
                  Add a book first →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
