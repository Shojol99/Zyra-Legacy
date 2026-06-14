import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Layers, 
  ChevronRight, 
  ChevronDown,
  LayoutGrid,
  Image as ImageIcon,
  X,
  Loader2,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { db, storage } from '../../lib/firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    image: '',
    subcategories: [] as string[]
  });
  const [subInput, setSubInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    try {
      const q = query(collection(db, 'categories'), orderBy('name', 'asc'));
      const snap = await getDocs(q);
      setCategories(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  }

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsSubmitting(true);
    try {
      const storageRef = ref(storage, `categories/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setFormData(prev => ({ ...prev, image: url }));
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Upload failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddSub = () => {
    if (subInput.trim() && !formData.subcategories.includes(subInput.trim())) {
      setFormData(prev => ({ ...prev, subcategories: [...prev.subcategories, subInput.trim()] }));
      setSubInput('');
    }
  };

  const removeSub = (sub: string) => {
    setFormData(prev => ({ ...prev, subcategories: prev.subcategories.filter(s => s !== sub) }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.slug) return alert('Name and Slug are required');
    setIsSubmitting(true);

    try {
      if (editingId) {
        await updateDoc(doc(db, 'categories', editingId), {
          ...formData,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'categories'), {
          ...formData,
          createdAt: serverTimestamp()
        });
      }
      setFormData({ name: '', slug: '', image: '', subcategories: [] });
      setEditingId(null);
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Failed to save category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    try {
      await deleteDoc(doc(db, 'categories', id));
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleEdit = (cat: any) => {
    setEditingId(cat.id);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      image: cat.image || '',
      subcategories: cat.subcategories || []
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearForm = () => {
    setFormData({ name: '', slug: '', image: '', subcategories: [] });
    setEditingId(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">Category Architecture</h1>
          <p className="text-slate-500 text-sm">Define the hierarchical structure of your boutique collections.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 ml-1">Main Categories</h2>
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
            ) : categories.map((cat) => (
              <div 
                key={cat.id} 
                className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden group"
              >
                <div className="p-6 flex items-center gap-6">
                  <button 
                    onClick={() => toggleExpand(cat.id)}
                    className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors"
                  >
                    {expandedId === cat.id ? <ChevronDown className="w-5 h-5 text-indigo-600" /> : <ChevronRight className="w-5 h-5" />}
                  </button>
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl overflow-hidden shrink-0 border border-slate-100 shadow-sm">
                    <img src={cat.image || 'https://via.placeholder.com/150'} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-serif font-bold text-slate-900 tracking-tight">{cat.name}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">/{cat.slug}</p>
                  </div>
                  <div className="flex items-center gap-2 lg:opacity-0 group-hover:opacity-100 transition-all">
                    <button 
                      onClick={() => handleEdit(cat)}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(cat.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedId === cat.id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="bg-slate-50 border-t border-slate-100 p-8 pt-0"
                    >
                      <div className="pt-8 space-y-6">
                        <div className="flex items-center justify-between">
                          <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Sub-Tier Collections</h4>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                          {(cat.subcategories || []).map((sub: string) => (
                            <div key={sub} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group/sub">
                              <span className="text-xs font-bold text-slate-700 tracking-tight">{sub}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Create/Edit Section */}
        <div className="space-y-6 sticky top-32 h-fit">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 ml-1">
            {editingId ? 'Modify Dimension' : 'Establish New Dimension'}
          </h2>
          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 ml-1">Category Designation</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Exotic Series"
                className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] py-5 px-8 text-sm font-bold text-slate-900 focus:bg-white focus:border-indigo-200 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none"
              />
            </div>
            
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 ml-1">URL Identifier (Slug)</label>
              <input 
                type="text" 
                value={formData.slug}
                onChange={e => setFormData({ ...formData, slug: e.target.value })}
                placeholder="exotic-series"
                className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] py-4 px-6 text-xs font-bold text-slate-400 focus:bg-white focus:border-indigo-100 outline-none transition-all"
              />
            </div>

            <div className="space-y-4">
               <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 ml-1">Hero Asset</label>
               <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageUpload} accept="image/*" />
               <div 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-video rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 overflow-hidden flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-indigo-400 hover:text-indigo-600 cursor-pointer transition-all">
                  {formData.image ? (
                    <img src={formData.image} className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <ImageIcon className="w-8 h-8" />
                      <span className="text-[9px] font-bold uppercase tracking-[0.3em]">Signature Image</span>
                    </>
                  )}
               </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 ml-1">Sub-Tier Collections</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.subcategories.map(sub => (
                  <span key={sub} className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                    {sub}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => removeSub(sub)} />
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={subInput}
                  onChange={e => setSubInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddSub()}
                  placeholder="e.g. Luxury"
                  className="flex-grow bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-xs font-bold outline-none"
                />
                <button onClick={handleAddSub} className="p-3 bg-indigo-600 text-white rounded-xl"><Plus className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <button 
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="w-full bg-indigo-600 text-white font-bold py-5 rounded-[1.5rem] text-[10px] uppercase tracking-[0.4em] hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingId ? 'Update Dimension' : 'Register Collection'}
              </button>
              <button 
                onClick={clearForm}
                className="w-full text-slate-400 font-bold py-4 text-[10px] uppercase tracking-[0.4em] hover:text-slate-600 transition-all">
                Clear Prototype
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
