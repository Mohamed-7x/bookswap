import { useState, useEffect } from 'react';
import { api } from '../api/axios';
import { BookCard } from '../components/BookCard';
import type { Book } from '../components/BookCard';
import { BookOpen, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export const MyBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMyBooks();
  }, []);

  const fetchMyBooks = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/api/books/mine/');
      setBooks(res.data.results || res.data);
    } catch (error) {
      toast.error('Failed to load your books');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Bookshelf</h1>
          <p className="text-slate-600 mt-2">Manage the books you've listed for exchange or donation.</p>
        </div>
        
        <Link to="/books/add" className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm">
          <Plus size={20} /> Add New Book
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse bg-slate-200 aspect-[2/3] rounded-xl"></div>
          ))}
        </div>
      ) : books.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 gap-y-10">
          {books.map(book => (
            <div key={book.id}>
              <BookCard book={book} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="text-slate-300" size={40} />
          </div>
          <h3 className="text-xl font-medium text-slate-900">Your shelf is empty</h3>
          <p className="text-slate-500 mt-2 mb-6 max-w-sm">You haven't listed any books yet. Add your first book to start exchanging.</p>
          <Link to="/books/add" className="text-indigo-600 font-medium hover:text-indigo-500 bg-indigo-50 px-6 py-2 rounded-lg transition-colors">
            Add a Book
          </Link>
        </div>
      )}
    </div>
  );
};

