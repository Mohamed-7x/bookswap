import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/axios';
import { Check, X, RefreshCw, Star, MessageSquare, ArrowRightLeft, Send, Inbox } from 'lucide-react';
import type { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

interface ExchangeBook {
  id: number;
  title: string;
  owner: string;
}

interface Exchange {
  id: number;
  sender: string;
  receiver: string;
  offered_book: ExchangeBook;
  requested_book: ExchangeBook;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Review state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedExchange, setSelectedExchange] = useState<number | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const fetchExchanges = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/api/exchanges/?direction=${activeTab}`);
      setExchanges(res.data.results || res.data);
    } catch {
      toast.error('Failed to load exchanges');
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    void Promise.resolve().then(() => fetchExchanges());
  }, [fetchExchanges]);

  const handleAction = async (id: number, action: 'accept' | 'reject' | 'cancel' | 'complete') => {
    try {
      await api.post(`/api/exchanges/${id}/${action}/`);
      toast.success(`Exchange ${action}ed successfully`);
      fetchExchanges();
    } catch {
      toast.error(`Failed to ${action} exchange`);
    }
  };

  const submitReview = async () => {
    if (!selectedExchange) return;
    try {
      await api.post('/api/reviews/', {
        exchange: selectedExchange,
        rating: reviewRating,
        comment: reviewComment,
      });
      toast.success('Review submitted successfully!');
      setReviewModalOpen(false);
      setReviewRating(5);
      setReviewComment('');
    } catch (error) {
      const data = (error as AxiosError<{ non_field_errors?: string[]; detail?: string }>).response?.data;
      const msg = data?.non_field_errors?.[0]
        || data?.detail
        || 'Failed to submit review';
      toast.error(msg);
    }
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700 border border-amber-200',
    accepted: 'bg-indigo-100 text-indigo-700 border border-indigo-200',
    completed: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    rejected: 'bg-rose-100 text-rose-700 border border-rose-200',
    cancelled: 'bg-slate-100 text-slate-600 border border-slate-200',
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Exchange Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage your book exchange requests.</p>
        </div>
        <Link to="/browse" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors">
          <ArrowRightLeft size={16} /> Browse & Exchange
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-8 w-fit">
        <button
          className={`flex items-center gap-2 py-2.5 px-5 rounded-lg font-medium text-sm transition-all ${
            activeTab === 'received'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
          onClick={() => setActiveTab('received')}
        >
          <Inbox size={16} /> Received
        </button>
        <button
          className={`flex items-center gap-2 py-2.5 px-5 rounded-lg font-medium text-sm transition-all ${
            activeTab === 'sent'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
          onClick={() => setActiveTab('sent')}
        >
          <Send size={16} /> Sent
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse bg-white border border-slate-100 rounded-xl p-6">
              <div className="flex justify-between">
                <div className="space-y-3 flex-1">
                  <div className="h-4 bg-slate-200 rounded w-24"></div>
                  <div className="h-5 bg-slate-200 rounded w-48"></div>
                  <div className="h-4 bg-slate-200 rounded w-32"></div>
                </div>
                <div className="h-10 bg-slate-200 rounded w-28"></div>
              </div>
            </div>
          ))}
        </div>
      ) : exchanges.length > 0 ? (
        <div className="space-y-4">
          {exchanges.map(ex => (
            <div key={ex.id} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-2.5 py-1 text-[11px] font-bold uppercase rounded-lg ${statusColors[ex.status] || 'bg-slate-100 text-slate-700'}`}>
                      {ex.status}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(ex.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex-1 bg-slate-50 rounded-lg p-3 border border-slate-100">
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider font-medium mb-1">Offered</div>
                      <Link to={`/books/${ex.offered_book.id}`} className="font-semibold text-slate-800 hover:text-indigo-600 transition-colors line-clamp-1">
                        {ex.offered_book.title}
                      </Link>
                      <div className="text-xs text-slate-400 mt-0.5">by {ex.offered_book.owner}</div>
                    </div>
                    <ArrowRightLeft size={16} className="text-slate-300 flex-shrink-0" />
                    <div className="flex-1 bg-slate-50 rounded-lg p-3 border border-slate-100">
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider font-medium mb-1">Requested</div>
                      <Link to={`/books/${ex.requested_book.id}`} className="font-semibold text-slate-800 hover:text-indigo-600 transition-colors line-clamp-1">
                        {ex.requested_book.title}
                      </Link>
                      <div className="text-xs text-slate-400 mt-0.5">by {ex.requested_book.owner}</div>
                    </div>
                  </div>

                  {ex.message && (
                    <p className="text-xs text-slate-500 mt-3 italic bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
                      "{ex.message}"
                    </p>
                  )}

                  <div className="text-xs text-slate-400 mt-3">
                    {activeTab === 'received' ? `From: ${ex.sender}` : `To: ${ex.receiver}`}
                  </div>
                </div>

                <div className="flex items-start gap-2 flex-shrink-0">
                  {activeTab === 'received' && ex.status === 'pending' && (
                    <>
                      <button onClick={() => handleAction(ex.id, 'accept')} className="flex items-center gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700 px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                        <Check size={16} /> Accept
                      </button>
                      <button onClick={() => handleAction(ex.id, 'reject')} className="flex items-center gap-1.5 bg-white text-rose-600 border border-rose-200 hover:bg-rose-50 px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                        <X size={16} /> Reject
                      </button>
                    </>
                  )}

                  {activeTab === 'sent' && ex.status === 'pending' && (
                    <button onClick={() => handleAction(ex.id, 'cancel')} className="flex items-center gap-1.5 bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                      <X size={16} /> Cancel
                    </button>
                  )}

                  {ex.status === 'accepted' && (
                    <button onClick={() => handleAction(ex.id, 'complete')} className="flex items-center gap-1.5 bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                      <Check size={16} /> Complete
                    </button>
                  )}

                  {ex.status === 'completed' && (
                    <button onClick={() => { setSelectedExchange(ex.id); setReviewModalOpen(true); }} className="flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                      <Star size={16} /> Review
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <RefreshCw className="text-slate-300" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">No {activeTab} exchanges</h3>
          <p className="text-slate-500 mt-2 text-sm max-w-sm mx-auto">
            {activeTab === 'received'
              ? "You haven't received any exchange requests yet."
              : "You haven't sent any exchange requests yet. Browse books to get started."}
          </p>
          {activeTab === 'sent' && (
            <Link to="/browse" className="inline-flex items-center gap-2 mt-6 text-indigo-600 font-medium hover:text-indigo-500 text-sm">
              Browse Books <ArrowRightLeft size={14} />
            </Link>
          )}
        </div>
      )}

      {/* Review Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setReviewModalOpen(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-slate-900 mb-6">Leave a Review</h3>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} onClick={() => setReviewRating(star)} className="focus:outline-none p-1 hover:scale-110 transition-transform">
                      <Star size={32} className={star <= reviewRating ? "text-amber-400 fill-amber-400" : "text-slate-200"} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Comment</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-colors text-sm"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience with this exchange..."
                ></textarea>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setReviewModalOpen(false)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium text-sm transition-colors">
                Cancel
              </button>
              <button onClick={submitReview} className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium text-sm transition-colors hover:bg-indigo-700 flex items-center gap-2">
                <MessageSquare size={16} /> Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
