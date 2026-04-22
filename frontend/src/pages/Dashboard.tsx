import { useState, useEffect } from 'react';
import { api } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Check, X, RefreshCw, Star, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

interface Exchange {
  id: number;
  sender: number;
  receiver: number;
  offered_book: number;
  requested_book: number;
  status: string;
  created_at: string;
}

export const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Review state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedExchange, setSelectedExchange] = useState<number | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    fetchExchanges();
  }, []);

  const fetchExchanges = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/api/exchanges/');
      // API returns all for the user, we will filter in UI for simplicity, 
      // or backend is already returning the ones where user is sender/receiver.
      setExchanges(res.data.results || res.data);
    } catch (error) {
      toast.error('Failed to load exchanges');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (id: number, action: 'accept' | 'reject' | 'cancel' | 'complete') => {
    try {
      await api.post(`/api/exchanges/${id}/${action}/`);
      toast.success(`Exchange ${action}ed successfully`);
      fetchExchanges();
    } catch (error) {
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
      // Reset
      setReviewRating(5);
      setReviewComment('');
    } catch (error: any) {
      toast.error(error.response?.data?.non_field_errors?.[0] || 'Failed to submit review');
    }
  };

  const filteredExchanges = exchanges.filter(ex => 
    activeTab === 'received' ? ex.receiver === user?.id : ex.sender === user?.id
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Exchange Dashboard</h1>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-8">
        <button
          className={`py-3 px-6 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'received' 
              ? 'border-indigo-600 text-indigo-600' 
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
          onClick={() => setActiveTab('received')}
        >
          Received Requests
        </button>
        <button
          className={`py-3 px-6 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'sent' 
              ? 'border-indigo-600 text-indigo-600' 
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
          onClick={() => setActiveTab('sent')}
        >
          Sent Requests
        </button>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-24 bg-slate-200 rounded-xl w-full"></div>)}
        </div>
      ) : filteredExchanges.length > 0 ? (
        <div className="space-y-4">
          {filteredExchanges.map(ex => (
            <div key={ex.id} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-2.5 py-1 text-xs font-bold uppercase rounded-md ${
                    ex.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                    ex.status === 'accepted' ? 'bg-indigo-100 text-indigo-700' :
                    ex.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {ex.status}
                  </span>
                  <span className="text-sm text-slate-500">{new Date(ex.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-slate-900 font-medium">
                  {activeTab === 'received' ? 'Request from User' : 'Request sent to User'}
                </p>
                <div className="text-sm text-slate-600 mt-1 flex gap-4">
                  <Link to={`/books/${ex.requested_book}`} className="text-indigo-600 hover:underline">View Requested Book</Link>
                  <Link to={`/books/${ex.offered_book}`} className="text-indigo-600 hover:underline">View Offered Book</Link>
                </div>
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                {activeTab === 'received' && ex.status === 'pending' && (
                  <>
                    <button onClick={() => handleAction(ex.id, 'accept')} className="flex-1 md:flex-none flex items-center justify-center gap-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-4 py-2 rounded-lg font-medium transition-colors">
                      <Check size={18} /> Accept
                    </button>
                    <button onClick={() => handleAction(ex.id, 'reject')} className="flex-1 md:flex-none flex items-center justify-center gap-1 bg-rose-50 text-rose-600 hover:bg-rose-100 px-4 py-2 rounded-lg font-medium transition-colors">
                      <X size={18} /> Reject
                    </button>
                  </>
                )}
                
                {activeTab === 'sent' && ex.status === 'pending' && (
                  <button onClick={() => handleAction(ex.id, 'cancel')} className="w-full md:w-auto flex items-center justify-center gap-1 bg-slate-100 text-slate-600 hover:bg-slate-200 px-4 py-2 rounded-lg font-medium transition-colors">
                    <X size={18} /> Cancel
                  </button>
                )}

                {ex.status === 'accepted' && (
                  <button onClick={() => handleAction(ex.id, 'complete')} className="w-full md:w-auto flex items-center justify-center gap-1 bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-lg font-medium transition-colors">
                    <Check size={18} /> Mark Completed
                  </button>
                )}

                {ex.status === 'completed' && (
                  <button onClick={() => {
                    setSelectedExchange(ex.id);
                    setReviewModalOpen(true);
                  }} className="w-full md:w-auto flex items-center justify-center gap-1 bg-amber-50 text-amber-600 hover:bg-amber-100 px-4 py-2 rounded-lg font-medium transition-colors">
                    <Star size={18} /> Leave Review
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <RefreshCw className="mx-auto text-slate-300 mb-4" size={48} />
          <h3 className="text-lg font-medium text-slate-900">No {activeTab} requests</h3>
          <p className="text-slate-500 mt-1">You haven't {activeTab === 'received' ? 'received' : 'sent'} any exchange requests yet.</p>
        </div>
      )}

      {/* Review Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Leave a Review</h3>
            <div className="space-y-4">
              <div>
                <label-[deleted] className="block text-sm font-medium text-slate-700 mb-1">Rating</label-[deleted]>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} onClick={() => setReviewRating(star)} className="focus:outline-none">
                      <Star size={32} className={star <= reviewRating ? "text-amber-400 fill-amber-400" : "text-slate-200"} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label-[deleted] className="block text-sm font-medium text-slate-700 mb-1">Comment</label-[deleted]>
                <textarea 
                  rows={4} 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience..."
                ></textarea>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setReviewModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">
                Cancel
              </button>
              <button onClick={submitReview} className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium transition-colors hover:bg-indigo-700 flex items-center gap-2">
                <MessageSquare size={18} /> Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
