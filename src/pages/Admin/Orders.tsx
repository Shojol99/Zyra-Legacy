import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  ShoppingCart, 
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  Package,
  Phone,
  Printer,
  ChevronDown,
  ArrowRight,
  ExternalLink,
  Loader2,
  Trash2
} from 'lucide-react';
import { formatPrice, cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../../lib/firebase';
import { 
  collection, 
  getDocs, 
  updateDoc, 
  doc, 
  query, 
  orderBy, 
  deleteDoc,
  where
} from 'firebase/firestore';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setLoading(true);
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete/reject this order?')) return;
    try {
      await deleteDoc(doc(db, 'orders', orderId));
      setOrders(orders.filter(o => o.id !== orderId));
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const generateInvoice = async (order: any) => {
    const doc = new jsPDF();
    const invoiceContent = document.getElementById(`invoice-content`);
    if (invoiceContent) {
      const canvas = await html2canvas(invoiceContent);
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      doc.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      doc.save(`Invoice_${order.id || order.orderId}.pdf`);
    } else {
      // Fallback simple text PDF if element not present
      doc.setFontSize(20);
      doc.text(`INVOICE: ${order.id || order.orderId}`, 10, 20);
      doc.setFontSize(12);
      doc.text(`Customer: ${order.customerDetails?.name || order.customer}`, 10, 30);
      doc.text(`Total: ${formatPrice(order.total)}`, 10, 40);
      doc.text(`Date: ${order.createdAt?.toDate?.().toLocaleDateString() || order.date}`, 10, 50);
      doc.save(`Invoice_${order.id || order.orderId}.pdf`);
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesStatus = statusFilter === 'All Status' || o.status === statusFilter;
    const matchesSearch = 
      (o.id || o.orderId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.customerDetails?.name || o.customer || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.customerDetails?.phone || o.phone || '').includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">Acquisition Registry</h1>
          <p className="text-slate-500 text-sm">Monitor and manage the fulfillment journey of every legacy item.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.print()}
            className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
            <Printer className="w-3.5 h-3.5" />
            Print Registry
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between bg-slate-50/50">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by ID, customer, or phone..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-12 pr-4 text-sm focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-200 outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium pr-10 outline-none focus:ring-4 focus:ring-indigo-500/5 appearance-none min-w-[150px]"
              >
                <option>All Status</option>
                <option>Pending</option>
                <option>Confirmed</option>
                <option>Processing</option>
                <option>Shipped</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold tracking-[0.3em] border-b border-slate-100">
                  <th className="px-8 py-5">Order ID</th>
                  <th className="px-8 py-5">Customer Profile</th>
                  <th className="px-8 py-5">Payment</th>
                  <th className="px-8 py-5">Value</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <p className="font-bold text-slate-900 tracking-tight">{order.orderId || order.id.slice(0, 8)}</p>
                      <p className="text-[10px] text-slate-400 font-medium tracking-wide mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {order.createdAt?.toDate?.().toLocaleDateString() || order.date}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <p className="font-bold text-slate-900 leading-none">{order.customerDetails?.name || order.customer}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {order.customerDetails?.phone || order.phone}
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 bg-slate-100 px-3 py-1 rounded-full">{order.paymentMethod || order.payment}</span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-bold text-indigo-600 tracking-widest">{formatPrice(order.total)}</p>
                      <p className="text-[10px] text-slate-400 font-medium tracking-wide mt-1">{order.items?.length || order.items} items</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className={cn(
                        "inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border",
                        order.status === 'Processing' ? "border-amber-100 text-amber-600 bg-amber-50" :
                        order.status === 'Shipped' ? "border-indigo-100 text-indigo-600 bg-indigo-50" :
                        order.status === 'Delivered' ? "border-emerald-100 text-emerald-600 bg-emerald-50" :
                        order.status === 'Cancelled' ? "border-rose-100 text-rose-600 bg-rose-50" : "border-slate-200 text-slate-500 bg-slate-50"
                      )}>
                        {order.status === 'Processing' && <Clock className="w-3 h-3" />}
                        {order.status === 'Shipped' && <Truck className="w-3 h-3" />}
                        {order.status === 'Delivered' && <CheckCircle2 className="w-3 h-3" />}
                        {order.status === 'Cancelled' && <XCircle className="w-3 h-3" />}
                        {order.status}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                        {(order.paymentMethod === 'cod' || order.payment === 'COD') && (
                          <button 
                            onClick={() => handleDeleteOrder(order.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="Reject Order">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!loading && filteredOrders.length === 0 && (
            <div className="py-20 text-center">
              <Package className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-500 font-serif">No acquisitions found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal Overlay */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[60] flex items-center justify-end p-4 lg:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
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
                <div className="space-y-1">
                  <h2 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">Order #{selectedOrder.orderId || selectedOrder.id.slice(0, 8)}</h2>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                    <Clock className="w-3 h-3" /> Received on {selectedOrder.createdAt?.toDate?.().toLocaleDateString() || selectedOrder.date}
                  </p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm">
                  <XCircle className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              {/* Modal Body */}
              <div id="invoice-content" className="flex-grow overflow-y-auto p-10 space-y-10 custom-scrollbar bg-white">
                {/* Status Update (Not for print) */}
                <div className="bg-indigo-50/50 p-8 rounded-[2rem] border border-indigo-100/50 print:hidden">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">Master Fulfillment Status</h3>
                    <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm tracking-tight">
                      Current State: {selectedOrder.status}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                      <button 
                        key={status}
                        onClick={() => handleUpdateStatus(selectedOrder.id, status)}
                        className={cn(
                          "py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all",
                          selectedOrder.status === status ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "bg-white border border-indigo-100 text-indigo-400 hover:border-indigo-300 shadow-sm"
                        )}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 ml-1">Customer Profile</h3>
                    <div className="bg-slate-50 p-6 rounded-2xl space-y-4">
                      <div className="space-y-1">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-none mb-2">Identity</p>
                        <p className="font-serif font-bold text-slate-900 text-lg">{selectedOrder.customerDetails?.name || selectedOrder.customer}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-none mb-2">Email Address</p>
                        <p className="font-bold text-slate-700">{selectedOrder.customerDetails?.email || 'N/A'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-none mb-2">Secure Line</p>
                        <p className="font-bold text-slate-700">{selectedOrder.customerDetails?.phone || selectedOrder.phone}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 ml-1">Shipping Passage</h3>
                    <div className="bg-slate-50 p-6 rounded-2xl space-y-4">
                      <div className="space-y-1">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-none mb-2">Delivery Meta-City</p>
                        <p className="font-bold text-slate-900">{selectedOrder.customerDetails?.city || 'N/A'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-none mb-2">Precise Coordinates</p>
                        <p className="text-sm font-medium text-slate-600 leading-relaxed italic">{selectedOrder.customerDetails?.address || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 ml-1">Acquisition Contents</h3>
                  <div className="space-y-4">
                    {(selectedOrder.items || []).map((item: any, i: number) => (
                      <div key={i} className="flex gap-4 p-4 bg-white border border-slate-100 rounded-2xl group transition-all hover:border-indigo-100 hover:shadow-sm">
                        <div className="w-16 h-20 bg-slate-50 rounded-xl overflow-hidden border border-slate-50 shrink-0">
                          <img src={item.image || 'https://via.placeholder.com/150'} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow py-1">
                          <p className="font-bold text-slate-900 tracking-tight">{item.title}</p>
                          <div className="flex gap-3 text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-1">
                            <span>QTY: {item.quantity}</span>
                            <span>SIZE: {item.size || 'N/A'}</span>
                            <span>COLOR: {item.color || 'N/A'}</span>
                          </div>
                          <p className="font-bold text-indigo-600 text-sm mt-2">{formatPrice(item.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                 <div className="pt-8 border-t border-slate-100 space-y-4">
                  <div className="flex justify-between items-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                    <span>Subtotal Valuation</span>
                    <span>{formatPrice(selectedOrder.total - (selectedOrder.shippingCost || 0))}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                    <span>Logistics Passage</span>
                    <span>{formatPrice(selectedOrder.shippingCost || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-4">
                     <span className="text-xl font-serif font-bold text-slate-900 tracking-tight">Total Assets</span>
                     <span className="text-3xl font-serif font-bold text-indigo-600 leading-none">{formatPrice(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-10 border-t border-slate-100 flex gap-4 shrink-0 bg-slate-50/50 print:hidden">
                <button 
                  onClick={() => handleUpdateStatus(selectedOrder.id, selectedOrder.status)}
                  className="flex-grow bg-indigo-600 text-white font-bold py-4 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
                  Update Registry State
                </button>
                <button 
                  onClick={() => generateInvoice(selectedOrder)}
                  className="px-8 border border-slate-200 text-slate-500 font-bold py-4 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-white transition-all flex items-center gap-2">
                  <Printer className="w-4 h-4" />
                  View Invoice PDF
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
