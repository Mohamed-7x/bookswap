import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { AxiosError } from 'axios';
import { api } from '../api/axios';
import toast from 'react-hot-toast';

export const BookForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    condition: 'good',
    exchange_type: 'exchange',
    genre_id: '',
    description: '',
    is_available: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const genresRes = await api.get('/api/books/genres/');
        setGenres(genresRes.data.results || genresRes.data);
      } catch {
        // Genres are optional
      }

      if (!isEditing) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await api.get(`/api/books/${id}/`);
        const book = res.data;
        setFormData({
          title: book.title,
          author: book.author,
          isbn: book.isbn || '',
          condition: book.condition,
          exchange_type: book.exchange_type,
          genre_id: book.genre?.id?.toString() || '',
          description: book.description || '',
          is_available: book.is_available,
        });
      } catch {
        toast.error('Failed to load book');
        navigate('/my-books');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, isEditing, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload: Record<string, string | boolean | number> = { ...formData };
    if (payload.genre_id) {
      payload.genre_id = Number(payload.genre_id);
    } else {
      delete payload.genre_id;
    }

    try {
      if (isEditing) {
        await api.patch(`/api/books/${id}/`, payload);
        toast.success('Book updated successfully');
      } else {
        await api.post('/api/books/', payload);
        toast.success('Book added successfully');
      }
      navigate('/my-books');
    } catch (error) {
      const detail = (error as AxiosError<{ detail?: string }>).response?.data?.detail;
      toast.error(detail || 'Failed to save book. Check your inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="min-h-[50vh] flex items-center justify-center text-slate-400">Loading...</div>;

  const inputClass = "w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-sm transition-colors";
  const selectClass = `${inputClass} bg-white`;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">{isEditing ? 'Edit Book' : 'Add New Book'}</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
              <input type="text" name="title" required value={formData.title} onChange={handleChange} className={inputClass} />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Author *</label>
              <input type="text" name="author" required value={formData.author} onChange={handleChange} className={inputClass} />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">ISBN</label>
              <input type="text" name="isbn" value={formData.isbn} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Genre</label>
              <select name="genre_id" value={formData.genre_id} onChange={handleChange} className={selectClass}>
                <option value="">Select Genre</option>
                {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Condition *</label>
              <select name="condition" required value={formData.condition} onChange={handleChange} className={selectClass}>
                <option value="new">New</option>
                <option value="like_new">Like New</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="worn">Worn</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Exchange Type *</label>
              <select name="exchange_type" required value={formData.exchange_type} onChange={handleChange} className={selectClass}>
                <option value="exchange">Exchange</option>
                <option value="donate">Donate</option>
                <option value="both">Both</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea name="description" rows={4} value={formData.description} onChange={handleChange} className={inputClass}></textarea>
          </div>

          <div className="flex items-center">
            <input type="checkbox" id="is_available" name="is_available" checked={formData.is_available} onChange={handleChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded" />
            <label htmlFor="is_available" className="ml-2 block text-sm text-slate-700">Available for exchange</label>
          </div>

          <div className="pt-6 flex justify-end gap-4 border-t border-slate-100">
            <button type="button" onClick={() => navigate('/my-books')} className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg font-medium text-sm hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium text-sm hover:bg-indigo-700 transition-colors disabled:opacity-60">
              {isSubmitting ? 'Saving...' : 'Save Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
