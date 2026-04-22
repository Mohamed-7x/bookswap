import { useState, useEffect } from 'react';
import { api } from '../api/axios';
import { BookCard } from '../components/BookCard';
import type { Book } from '../components/BookCard';
import { Search, Filter, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

export const BrowseBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Basic filtering for MVP
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    fetchBooks();
  }, [typeFilter]);

  const fetchBooks = async (searchQuery = '') => {
    setIsLoading(true);
    try {
      let url = '/api/books/';
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (typeFilter) params.append('exchange_type', typeFilter);
      
      const res = await api.get(`${url}?${params.toString()}`);
      // Assuming paginated response with 'results' key
      setBooks(res.data.results || res.data);
    } catch (error) {
      toast.error('Failed to load books');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBooks(search);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Browse Library</h1>
          <p className="text-slate-600 mt-2">Discover books to exchange or receive as donations.</p>
        </div>

        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
          <form onSubmit={handleSearch} className="relative flex-grow sm:flex-grow-0">
            <input
              type="text"
              placeholder="Search title or author..."
              className="w-full sm:w-64 pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          </form>

          <div className="relative">
            <select
              className="w-full sm:w-auto appearance-none pl-10 pr-8 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="exchange">Exchange Only</option>
              <option value="donate">Donation Only</option>
              <option value="both">Exchange or Donate</option>
            </select>
            <Filter className="absolute left-3 top-2.5 text-slate-400" size={18} />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
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
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <BookOpen className="mx-auto text-slate-300 mb-4" size={48} />
          <h3 className="text-xl font-medium text-slate-900">No books found</h3>
          <p className="text-slate-500 mt-2">Try adjusting your filters or search terms.</p>
        </div>
      )}
    </div>
  );
};

