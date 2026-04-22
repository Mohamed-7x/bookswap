import { useState, useEffect } from 'react';
import { api } from '../api/axios';
import { BookCard } from '../components/BookCard';
import type { Book } from '../components/BookCard';
import { Plus, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export const MyBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyBooks = async () => {
      setIsLoading(true);
      try {
        const res = await api.get('/api/books/mine/');
        setBooks(res.data.results || res.data);
      } catch {
        toast.error('Failed to load your books');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyBooks();
  }, []);

  const availableCount = books.filter(b => b.is_available).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Bookshelf</h1>
          <p className="text-slate-500 mt-2">
            {books.length > 0
              ? `${books.length} book${books.length !== 1 ? 's' : ''} listed · ${availableCount} available`
              : "Manage the books you have listed for exchange or donation."}
          </p>
        </div>

        <Link to="/books/add" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm text-sm">
          <Plus size={18} /> Add New Book
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-slate-200 aspect-[3/4] rounded-2xl mb-3"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-slate-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : books.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 gap-y-8">
          {books.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200 flex flex-col items-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <Package className="text-slate-300" size={40} />
          </div>
          <h3 className="text-xl font-semibold text-slate-900">Your shelf is empty</h3>
          <p className="text-slate-500 mt-2 mb-6 max-w-sm text-sm">You haven't listed any books yet. Add your first book to start exchanging with others.</p>
          <Link to="/books/add" className="text-indigo-600 font-medium hover:text-indigo-500 bg-indigo-50 px-6 py-2.5 rounded-lg transition-colors text-sm">
            Add Your First Book
          </Link>
        </div>
      )}
    </div>
  );
};
