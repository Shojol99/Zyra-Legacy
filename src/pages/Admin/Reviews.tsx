import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Search, 
  Check, 
  X, 
  MoreVertical, 
  Trash2, 
  MessageSquare, 
  User, 
  Clock,
  Filter,
  ShieldCheck,
  Flag,
  Loader2
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../../lib/firebase';
import { 
  collection, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy 
} from 'firebase/firestore';

export default function AdminReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    setLoading(true);
    try {
      const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setReviews(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'reviews', id), { status: newStatus });
      setReviews(reviews.map(r => r.id === id ? { ...r, status: newStatus } : r));
    } catch (error) {
      console.error('Error updating review status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sentiment?')) return;
    try {
      await deleteDoc(doc(db, 'reviews', id));
      setReviews(reviews.filter(r => r.id !== id));
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const filteredReviews = reviews.filter(r => {
    if (filter === 'All') return true;
    return r.status === filter;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">Public Sentiments</h1>
          <p className="text-slate-500 text-sm">Curate and respond to the authentic experiences of your patrons.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50 outline-none appearance-none pr-10"
            >
              <option value="All">All Sentiments</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Flagged">Flagged</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
         <div className="p-8 space-y-8">
           {loading ? (
             <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
           ) : filteredReviews.map((review, i) => (
             <motion.div 
               key={review.id}
               initial={{ opacity: 0, x: -10 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: i * 0.1 }}
               className="p-8 bg-slate-50/50 rounded-[2rem] border border-slate-100 group hover:bg-white hover:border-indigo-100 transition-all duration-500"
             >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
                  <div className="space-y-6 flex-grow">
                    <div className="flex items-center justify-between lg:justify-start lg:gap-8">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 font-bold uppercase">
                          {review.userName?.[0] || <User className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 tracking-tight leading-none">{review.userName || 'Patron'}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Verified Patron</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={cn("w-3 h-3 transition-colors", i < review.rating ? "text-amber-400 fill-amber-400" : "text-slate-200")} />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 flex items-center gap-1.5">
                        <MessageSquare className="w-3 h-3" /> Regarding: {review.productTitle || 'Heritage Item'}
                      </p>
                      <p className="text-slate-700 font-medium leading-relaxed italic text-lg pr-4">"{review.comment}"</p>
                    </div>

                    <div className="flex items-center gap-6 text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                       <div className="flex items-center gap-1.5"><Clock className="w-3 h-3 text-slate-300" /> {review.createdAt?.toDate?.().toLocaleDateString() || review.date}</div>
                       <div className={cn(
                          "flex items-center gap-1.5 px-3 py-1 rounded-full border",
                          review.status === 'Approved' ? "border-emerald-100 text-emerald-600 bg-emerald-50" :
                          review.status === 'Flagged' ? "border-rose-100 text-rose-600 bg-rose-50" : "border-amber-100 text-amber-600 bg-amber-50"
                        )}>
                          {review.status || 'Pending'}
                       </div>
                    </div>
                  </div>

                  <div className="flex lg:flex-col items-center justify-center gap-3 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-10">
                    {review.status !== 'Approved' && (
                      <button 
                        onClick={() => handleStatusUpdate(review.id, 'Approved')}
                        className="flex-grow lg:w-full bg-white border border-slate-200 text-emerald-600 px-6 py-3 rounded-2xl font-bold text-[9px] uppercase tracking-widest hover:border-emerald-200 hover:bg-emerald-50 transition-all flex items-center justify-center gap-2 shadow-sm">
                        <Check className="w-3.5 h-3.5" /> Approve
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(review.id)}
                      className="flex-grow lg:w-full bg-white border border-slate-200 text-rose-500 px-6 py-3 rounded-2xl font-bold text-[9px] uppercase tracking-widest hover:border-rose-200 hover:bg-rose-50 transition-all flex items-center justify-center gap-2 shadow-sm">
                       <Trash2 className="w-3.5 h-3.5" /> Reject
                    </button>
                    {review.status !== 'Flagged' && (
                      <button 
                        onClick={() => handleStatusUpdate(review.id, 'Flagged')}
                        className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all border border-transparent hover:border-indigo-100 shadow-sm">
                        <Flag className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
             </motion.div>
           ))}
           {!loading && filteredReviews.length === 0 && (
             <div className="text-center py-20">
               <ShieldCheck className="w-12 h-12 text-slate-200 mx-auto mb-4" />
               <p className="text-slate-500 font-serif">No sentiments recorded in this segment.</p>
             </div>
           )}
         </div>
      </div>
    </div>
  );
}

import { ChevronDown } from 'lucide-react';
