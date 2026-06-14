import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Mail, 
  Phone, 
  ShoppingBag, 
  User, 
  MapPin, 
  MoreVertical,
  ChevronRight,
  ExternalLink,
  Calendar,
  Loader2,
  XCircle,
  Clock,
  Download
} from 'lucide-react';
import { formatPrice, cn } from '../../lib/utils';
import { db } from '../../lib/firebase';
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  where,
  limit
} from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import Papa from 'papaparse';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [customerOrders, setCustomerOrders] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    setLoading(true);
    try {
      // Note: If users collection doesn't exist, we might want to derive from orders too
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setCustomers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  }

  const fetchCustomerOrders = async (userId: string) => {
    try {
      const q = query(collection(db, 'orders'), where('userId', '==', userId), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setCustomerOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching customer orders:', error);
    }
  };

  const handleExport = () => {
    const data = customers.map(c => ({
      Name: c.name,
      Email: c.email,
      Phone: c.phone || 'N/A',
      City: c.city || 'N/A',
      Address: c.address || 'N/A',
      JoinDate: c.createdAt?.toDate?.().toLocaleDateString() || 'N/A'
    }));
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'zyra_customers.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredCustomers = customers.filter(c => 
    (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.phone || '').includes(searchQuery)
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">Citizen Archive</h1>
          <p className="text-slate-500 text-sm">Review and support the individuals who have joined the Zyra Legecy family.</p>
        </div>
        <button 
          onClick={handleExport}
          className="bg-white border border-slate-200 text-slate-600 px-6 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
          <Download className="w-3.5 h-3.5" />
          Export Contacts
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between bg-slate-50/50">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, email, or phone..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-12 pr-4 text-sm focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-200 outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
             <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold tracking-[0.3em] border-b border-slate-100">
                  <th className="px-8 py-5">Individual</th>
                  <th className="px-8 py-5">Communication Info</th>
                  <th className="px-8 py-5 text-center">Join Date</th>
                  <th className="px-8 py-5 text-right">Insight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-bold text-sm border border-indigo-200 ring-4 ring-indigo-50 group-hover:ring-indigo-100 transition-all uppercase">
                          {customer.name?.[0] || <User className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="font-serif font-bold text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">{customer.name || 'Anonymous'}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                            <Calendar className="w-2.5 h-2.5" /> ID: {customer.id.slice(0, 8)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm">
                      <div className="space-y-1">
                        <p className="text-slate-600 flex items-center gap-2 font-medium">
                          <Mail className="w-3.5 h-3.5 text-slate-400" /> {customer.email}
                        </p>
                        <p className="text-slate-400 text-xs flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-slate-400" /> {customer.phone || 'N/A'}
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="inline-flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full text-[10px] font-bold text-slate-600">
                        {customer.createdAt?.toDate?.().toLocaleDateString() || 'N/A'}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => {
                          setSelectedCustomer(customer);
                          fetchCustomerOrders(customer.id);
                        }}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Customer Profile Modal */}
      <AnimatePresence>
        {selectedCustomer && (
          <div className="fixed inset-0 z-[60] flex items-center justify-end p-4 lg:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCustomer(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-2xl bg-white h-full rounded-[3rem] shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-10 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white border border-slate-100 rounded-3xl flex items-center justify-center text-2xl text-indigo-600 font-bold shadow-sm uppercase">
                    {selectedCustomer.name?.[0] || 'A'}
                  </div>
                  <div>
                    <h2 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">{selectedCustomer.name}</h2>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                      <Calendar className="w-3 h-3" /> Member Since {selectedCustomer.createdAt?.toDate?.().toLocaleDateString() || 'N/A'}
                    </p>
                  </div>
                </div>
                <button onClick={() => setSelectedCustomer(null)} className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm">
                  <XCircle className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-grow overflow-y-auto p-10 space-y-10 custom-scrollbar">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-6 rounded-[2rem] space-y-4">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Secure Details</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest mb-1">Email</p>
                        <p className="text-sm font-bold text-slate-900">{selectedCustomer.email}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest mb-1">Phone</p>
                        <p className="text-sm font-bold text-slate-900">{selectedCustomer.phone || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-[2rem] space-y-4">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Metadata</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest mb-1">Total Orders</p>
                        <p className="text-sm font-bold text-slate-900">{customerOrders.length}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest mb-1">Total Spent</p>
                        <p className="text-sm font-bold text-indigo-600">{formatPrice(customerOrders.reduce((acc, curr) => acc + curr.total, 0))}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 ml-1">Fulfillment Registry</h3>
                  <div className="space-y-4">
                    {customerOrders.length === 0 ? (
                      <div className="text-center py-10 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                        <Clock className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">No previous history</p>
                      </div>
                    ) : (
                      customerOrders.map(order => (
                        <div key={order.id} className="bg-white border border-slate-100 p-4 rounded-2xl flex items-center justify-between hover:border-indigo-100 transition-all group">
                          <div>
                            <p className="font-bold text-slate-900 tracking-tight">Order #{order.orderId || order.id.slice(0, 8)}</p>
                            <p className="text-[10px] text-slate-400 mt-1">{order.createdAt?.toDate?.().toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-indigo-600">{formatPrice(order.total)}</p>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{order.status}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
