import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/axios';
import { BookCard } from '../components/BookCard';
import type { Book } from '../components/BookCard';
import { Search, BookOpen, X } from 'lucide-react';
import toast from 'react-hot-toast';

export const BrowseBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [conditionFilter, setConditionFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBooks = useCallback(async (searchQuery = search) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (typeFilter) params.append('exchange_type', typeFilter);
      if (conditionFilter) params.append('condition', conditionFilter);
      params.append('page', page.toString());

      const res = await api.get(`/api/books/?${params.toString()}`);
      if (res.data.results) {
        setBooks(res.data.results);
        setTotalPages(Math.ceil(res.data.count / 10));
      } else {
        setBooks(res.data);
        setTotalPages(1);
      }
    } catch {
      toast.error('Failed to load books');
    } finally {
      setIsLoading(false);
    }
  }, [search, typeFilter, conditionFilter, page]);

  useEffect(() => {
    void Promise.resolve().then(() => fetchBooks());
  }, [fetchBooks]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchBooks();
  };

  const clearFilters = () => {
    setSearch('');
    setTypeFilter('');
    setConditionFilter('');
    setPage(1);
    fetchBooks('');
  };

  const hasFilters = search || typeFilter || conditionFilter;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Browse Library</h1>
        <p className="text-slate-500 mt-2">Discover books available for exchange or donation.</p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-8 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
        <form onSubmit={handleSearch} className="relative flex-1">
          <input
            type="text"
            placeholder="Search by title or author..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute left-3 top-3 text-slate-400" size={16} />
        </form>

        <div className="flex gap-3">
          <select
            className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
          >
            <option value="">All Types</option>
            <option value="exchange">Exchange</option>
            <option value="donate">Donation</option>
            <option value="both">Both</option>
          </select>

          <select
            className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
            value={conditionFilter}
            onChange={(e) => { setConditionFilter(e.target.value); setPage(1); }}
          >
            <option value="">All Conditions</option>
            <option value="new">New</option>
            <option value="like_new">Like New</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="worn">Worn</option>
          </select>

          {hasFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-500 hover:text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <X size={14} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-slate-200 aspect-[3/4] rounded-2xl mb-3"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-slate-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : books.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 gap-y-8">
            {books.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-slate-500">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="text-slate-300" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-slate-900">No books found</h3>
          <p className="text-slate-500 mt-2 text-sm">Try adjusting your search or filters.</p>
          {hasFilters && (
            <button onClick={clearFilters} className="mt-4 text-indigo-600 font-medium text-sm hover:text-indigo-500">
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};
