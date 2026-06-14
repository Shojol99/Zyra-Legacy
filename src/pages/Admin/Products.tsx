import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Eye, 
  Package, 
  ArrowLeft,
  Image as ImageIcon,
  Check,
  ChevronDown,
  X,
  Upload,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatPrice, cn } from '../../lib/utils';
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
  serverTimestamp,
  where
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

import Papa from 'papaparse';

export default function AdminProducts() {
  const [view, setView] = useState<'list' | 'add' | 'edit'>('list');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const bulkInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setView('edit');
  };

  const handleBulkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const newProducts = results.data;
          const productsCol = collection(db, 'products');
          
          for (const item of newProducts as any[]) {
            await addDoc(productsCol, {
              title: item.title || 'Untitled Product',
              price: Number(item.price) || 0,
              stock: Number(item.stock) || 0,
              category: item.category || 'Heels',
              status: item.status || 'Active',
              images: item.images ? item.images.split(',') : [],
              sizes: item.sizes ? item.sizes.split(',') : ['37', '38', '39', '40'],
              colors: item.colors ? item.colors.split(',') : [],
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            });
          }
          alert(`Successfully uploaded ${newProducts.length} items to the archive.`);
          fetchProducts();
        } catch (error) {
          console.error('Bulk upload failed:', error);
          alert('Bulk upload failed. Ensure CSV format is correct.');
        } finally {
          setLoading(false);
          if (bulkInputRef.current) bulkInputRef.current.value = '';
        }
      },
      error: (err) => {
        console.error('CSV Parsing failed:', err);
        alert('CSV Parsing failed.');
        setLoading(false);
      }
    });
  };

  const filteredProducts = products.filter(p => 
    (p.title?.toLowerCase().includes(searchQuery.toLowerCase()) || '') &&
    (selectedCategory === 'All' || p.category === selectedCategory)
  );

  return (
    <div className="space-y-8">
      {view === 'list' ? (
        <>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">Product Archive</h1>
              <p className="text-slate-500 text-sm">Manage your exquisite collection of footwear assets.</p>
            </div>
            <div className="flex items-center gap-4">
              <input type="file" ref={bulkInputRef} className="hidden" accept=".csv" onChange={handleBulkUpload} />
              <button 
                onClick={() => bulkInputRef.current?.click()}
                className="bg-slate-100 text-slate-600 px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-200 transition-all"
              >
                <Upload className="w-5 h-5" />
                Upload Bulk Product
              </button>
              <button 
                onClick={() => {
                  setEditingProduct(null);
                  setView('add');
                }}
                className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
              >
                <Plus className="w-5 h-5" />
                Add New Product
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between bg-slate-50/50">
              <div className="relative flex-grow max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-12 pr-4 text-sm focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-200 outline-none transition-all"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                   <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium pr-10 outline-none focus:ring-4 focus:ring-indigo-500/5 appearance-none"
                  >
                    <option>All</option>
                    <option>Heels</option>
                    <option>Sneakers</option>
                    <option>Flats</option>
                    <option>Sandals</option>
                    <option>Boots</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto min-h-[400px]">
              {loading ? (
                <div className="flex items-center justify-center py-32">
                  <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold tracking-[0.3em] border-b border-slate-100">
                      <th className="px-8 py-5 whitespace-nowrap">Product Details</th>
                      <th className="px-8 py-5 whitespace-nowrap">Category</th>
                      <th className="px-8 py-5 whitespace-nowrap">Price</th>
                      <th className="px-8 py-5 whitespace-nowrap">Stock</th>
                      <th className="px-8 py-5 whitespace-nowrap">Status</th>
                      <th className="px-8 py-5 text-right whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-16 bg-slate-100 rounded-xl overflow-hidden border border-slate-100 shrink-0">
                              <img src={product.images?.[0] || 'https://via.placeholder.com/300x400?text=No+Image'} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-serif font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">{product.title}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">SKU: ZYRA-{product.id.slice(0, 4)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 bg-slate-100 px-3 py-1 rounded-full">{product.category}</span>
                        </td>
                        <td className="px-8 py-6">
                          <p className="font-bold text-slate-900 text-sm tracking-widest">{formatPrice(product.price)}</p>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <div className={cn("w-1.5 h-1.5 rounded-full", product.stock > 10 ? "bg-emerald-500" : product.stock > 0 ? "bg-amber-500" : "bg-rose-500")} />
                            <span className={cn("text-sm font-medium", product.stock === 0 ? "text-rose-500" : "text-slate-700")}>
                              {product.stock === 0 ? 'Out of Stock' : `${product.stock} Units`}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={cn(
                            "text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border",
                            product.status === 'Active' ? "border-emerald-100 text-emerald-600 bg-emerald-50" : "border-slate-200 text-slate-500 bg-slate-50"
                          )}>
                            {product.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleEdit(product)}
                              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Edit">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(product.id)}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="Delete">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {!loading && filteredProducts.length === 0 && (
                <div className="py-32 text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Package className="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">No masterpieces found</h3>
                  <p className="text-slate-500 text-sm">Your search returned no results in this archive.</p>
                </div>
              )}
            </div>
            
            <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Showing {filteredProducts.length} items</p>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors" disabled>Previous</button>
                <button className="w-8 h-8 rounded-lg bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center shadow-lg shadow-indigo-600/20">1</button>
                <button className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors" disabled>Next</button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <ProductForm 
          onCancel={() => setView('list')} 
          onSuccess={() => {
            setView('list');
            fetchProducts();
          }}
          initialData={editingProduct}
        />
      )}
    </div>
  );
}

function ProductForm({ onCancel, onSuccess, initialData }: { onCancel: () => void, onSuccess: () => void, initialData?: any }) {
  const [activeTab, setActiveTab] = useState<'info' | 'variations' | 'seo'>('info');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    price: initialData?.price || 0,
    compareAtPrice: initialData?.compareAtPrice || 0,
    shortDescription: initialData?.shortDescription || '',
    fullDescription: initialData?.fullDescription || '',
    category: initialData?.category || 'Heels',
    status: initialData?.status || 'Active',
    sizes: initialData?.sizes || ['37', '38', '39', '40'],
    colors: initialData?.colors || [],
    images: initialData?.images || [],
    isFeatured: initialData?.isFeatured || false,
    lowInventoryPriority: initialData?.lowInventoryPriority || false,
    metaTitle: initialData?.seo?.metaTitle || '',
    keywords: initialData?.seo?.keywords || [],
    stock: initialData?.stock || 0
  });

  const [keywordInput, setKeywordInput] = useState('');
  const [colorInput, setColorInput] = useState('');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setFormData(prev => ({ ...prev, images: [...prev.images, url] }));
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Upload failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const toggleSize = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size) 
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleKeywordKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ',' || e.key === 'Enter') {
      e.preventDefault();
      const val = keywordInput.trim().replace(',', '');
      if (val && !formData.keywords.includes(val)) {
        setFormData(prev => ({ ...prev, keywords: [...prev.keywords, val] }));
        setKeywordInput('');
      }
    }
  };

  const removeKeyword = (kw: string) => {
    setFormData(prev => ({ ...prev, keywords: prev.keywords.filter(k => k !== kw) }));
  };

  const handleAddColor = () => {
    const val = colorInput.trim();
    if (val && !formData.colors.includes(val)) {
      setFormData(prev => ({ ...prev, colors: [...prev.colors, val] }));
      setColorInput('');
    }
  };

  const removeColor = (col: string) => {
    setFormData(prev => ({ ...prev, colors: prev.colors.filter(c => c !== col) }));
  };

  const handleSubmit = async () => {
    if (!formData.title) return alert('Master Title is required');
    setLoading(true);

    try {
      const data = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        compareAtPrice: Number(formData.compareAtPrice),
        updatedAt: serverTimestamp(),
        seo: {
          metaTitle: formData.metaTitle,
          keywords: formData.keywords
        }
      };

      if (initialData) {
        await updateDoc(doc(db, 'products', initialData.id), data);
      } else {
        await addDoc(collection(db, 'products'), {
          ...data,
          createdAt: serverTimestamp()
        });
      }
      onSuccess();
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to save legacy item.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <button onClick={onCancel} className="flex items-center gap-3 text-slate-500 hover:text-indigo-600 transition-colors group">
          <div className="p-2 border border-slate-200 rounded-xl group-hover:bg-indigo-50 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Back to Archive</span>
        </button>
        <div className="flex items-center gap-3">
          <button 
            disabled={loading}
            onClick={onCancel} 
            className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors disabled:opacity-50">
            Discard
          </button>
          <button 
            disabled={loading}
            onClick={handleSubmit}
            className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 flex items-center gap-2">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {initialData ? 'Update Legacy Item' : 'Communicate Legacy Item'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-10">
             <div className="flex items-center gap-4 mb-4">
              <div className="flex-grow h-[1px] bg-slate-100" />
              <div className="flex items-center gap-8">
                {['info', 'variations', 'seo'].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-[0.4em] transition-all relative pb-2",
                      activeTab === tab ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    {tab === 'info' && 'Identity'}
                    {tab === 'variations' && 'Structure'}
                    {tab === 'seo' && 'Presence'}
                    {activeTab === tab && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />}
                  </button>
                ))}
              </div>
              <div className="flex-grow h-[1px] bg-slate-100" />
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'info' && (
                <motion.div 
                  key="info"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-10"
                >
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 ml-1">Master Title</label>
                    <input 
                      type="text" 
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Stiletto High Heels - Noir Edition"
                      className="w-full bg-slate-50/50 border border-slate-100 rounded-[1.5rem] py-5 px-8 text-lg font-serif font-bold text-slate-900 focus:bg-white focus:border-indigo-200 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 ml-1">Asset Valuation (BDT)</label>
                      <input 
                        type="number" 
                        value={formData.price}
                        onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                        placeholder="2450"
                        className="w-full bg-slate-50/50 border border-slate-100 rounded-[1.2rem] py-4 px-6 text-sm font-bold text-slate-900 focus:bg-white focus:border-indigo-200 transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 ml-1">Comparison Valuation (BDT)</label>
                      <input 
                        type="number" 
                        value={formData.compareAtPrice}
                        onChange={e => setFormData({ ...formData, compareAtPrice: Number(e.target.value) })}
                        placeholder="2800"
                        className="w-full bg-slate-50/50 border border-slate-100 rounded-[1.2rem] py-4 px-6 text-sm font-bold text-slate-900 focus:bg-white focus:border-indigo-200 transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 ml-1">Stock Level</label>
                      <input 
                        type="number" 
                        value={formData.stock}
                        onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
                        placeholder="50"
                        className="w-full bg-slate-50/50 border border-slate-100 rounded-[1.2rem] py-4 px-6 text-sm font-bold text-slate-900 focus:bg-white focus:border-indigo-200 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 ml-1">Short Narrative</label>
                    <textarea 
                      rows={3} 
                      value={formData.shortDescription}
                      onChange={e => setFormData({ ...formData, shortDescription: e.target.value })}
                      placeholder="Crafted for the bold, finished in premium Italian suede."
                      className="w-full bg-slate-50/50 border border-slate-100 rounded-[1.5rem] py-5 px-8 text-sm font-medium text-slate-700 focus:bg-white focus:border-indigo-200 transition-all outline-none resize-none"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 ml-1">Full Product Manifesto</label>
                    <div className="rounded-[1.5rem] overflow-hidden border border-slate-100">
                      <ReactQuill 
                        theme="snow"
                        value={formData.fullDescription}
                        onChange={val => setFormData({ ...formData, fullDescription: val })}
                        className="bg-slate-50/50 focus-within:bg-white transition-all h-64"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'variations' && (
                <motion.div 
                  key="variations"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-10"
                >
                  <div className="space-y-6">
                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 ml-1">Dimensional Selection (Sizes)</label>
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
                      {['36', '37', '38', '39', '40', '41', '42', '43', '44'].map((size) => (
                        <button 
                          key={size} 
                          onClick={() => toggleSize(size)}
                          className={cn(
                            "rounded-xl py-3 text-sm font-bold transition-all border",
                            formData.sizes.includes(size) 
                              ? "bg-indigo-600 text-white border-indigo-600 shadow-md" 
                              : "bg-slate-50 text-slate-700 border-slate-100 hover:border-indigo-200 hover:bg-white"
                          )}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 ml-1">Chromatic Palette (Colors)</label>
                    <div className="flex flex-wrap gap-4">
                      {formData.colors.map((color) => (
                        <div key={color} className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl py-2 px-4 shadow-sm">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-700">{color}</span>
                          <button 
                            onClick={() => removeColor(color)}
                            className="text-slate-300 hover:text-rose-500 transition-colors"><X className="w-3 h-3" /></button>
                        </div>
                      ))}
                      <div className="flex items-center gap-2">
                        <input 
                          type="text"
                          value={colorInput}
                          onChange={e => setColorInput(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleAddColor()}
                          placeholder="e.g. Noir"
                          className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-xs font-bold focus:bg-white outline-none w-32"
                        />
                        <button 
                          onClick={handleAddColor}
                          className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'seo' && (
                <motion.div 
                  key="seo"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-10"
                >
                   <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 ml-1">Meta Title</label>
                    <input 
                      type="text" 
                      value={formData.metaTitle}
                      onChange={e => setFormData({ ...formData, metaTitle: e.target.value })}
                      placeholder="For engine indexing..."
                      className="w-full bg-slate-50/50 border border-slate-100 rounded-[1.2rem] py-4 px-6 text-sm font-bold text-slate-900 focus:bg-white transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 ml-1">Keywords (Comma Separated)</label>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {formData.keywords.map(kw => (
                          <span key={kw} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                            {kw}
                            <X className="w-3 h-3 cursor-pointer hover:text-rose-500" onClick={() => removeKeyword(kw)} />
                          </span>
                        ))}
                      </div>
                      <textarea 
                        rows={2} 
                        value={keywordInput}
                        onChange={e => setKeywordInput(e.target.value)}
                        onKeyDown={handleKeywordKeyDown}
                        placeholder="Write word and use comma... (e.g. luxury, heels, etc)"
                        className="w-full bg-slate-50/50 border border-slate-100 rounded-[1.2rem] py-4 px-6 text-sm font-medium text-slate-700 focus:bg-white transition-all outline-none resize-none"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="space-y-8">
          {/* Status & Categorization */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 ml-1">Existence Status</label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setFormData({ ...formData, status: 'Active' })}
                  className={cn(
                    "py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all",
                    formData.status === 'Active' ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "bg-slate-50 text-slate-400 border border-slate-100"
                  )}>Active</button>
                <button 
                  onClick={() => setFormData({ ...formData, status: 'Draft' })}
                  className={cn(
                    "py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all",
                    formData.status === 'Draft' ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20" : "bg-slate-50 text-slate-400 border border-slate-100"
                  )}>Draft</button>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 ml-1">Legacy Category</label>
              <div className="relative">
                <select 
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3.5 px-5 text-sm font-medium outline-none transition-all focus:bg-white focus:border-indigo-100 appearance-none"
                >
                  <option>Heels</option>
                  <option>Sneakers</option>
                  <option>Flats</option>
                  <option>Sandals</option>
                  <option>Boots</option>
                </select>
                 <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-50">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div 
                  onClick={() => setFormData({ ...formData, isFeatured: !formData.isFeatured })}
                  className={cn(
                    "w-6 h-6 border-2 rounded-lg flex items-center justify-center transition-all shadow-sm",
                    formData.isFeatured ? "bg-indigo-600 border-indigo-600" : "border-indigo-100 bg-white"
                  )}>
                  <Check className={cn("w-4 h-4", formData.isFeatured ? "text-white" : "text-transparent")} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 group-hover:text-indigo-600 transition-colors">Featured Acquisition</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div 
                  onClick={() => setFormData({ ...formData, lowInventoryPriority: !formData.lowInventoryPriority })}
                  className={cn(
                    "w-6 h-6 border-2 rounded-lg flex items-center justify-center transition-all shadow-sm",
                    formData.lowInventoryPriority ? "bg-amber-500 border-amber-500" : "border-indigo-100 bg-white"
                  )}>
                  <Package className={cn("w-3.5 h-3.5", formData.lowInventoryPriority ? "text-white" : "text-transparent")} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 group-hover:text-indigo-600 transition-colors">Low Inventory Priority</span>
              </label>
            </div>
          </div>

          {/* Visual Assets */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 ml-1">Visual Repository</h3>
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageUpload} accept="image/*" />
            
            <div className="grid grid-cols-2 gap-4">
              {formData.images.map((img, i) => (
                <div key={i} className="aspect-[4/5] rounded-2xl overflow-hidden relative group">
                  <img src={img} className="w-full h-full object-cover" />
                  <button 
                    onClick={() => removeImage(i)}
                    className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {formData.images.length < 6 && (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-[4/5] rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-indigo-400 hover:text-indigo-600 cursor-pointer transition-all">
                  <Plus className="w-6 h-6" />
                  <span className="text-[8px] font-bold uppercase tracking-widest">Add Image</span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <button className="w-full bg-slate-50 text-slate-600 py-3 rounded-xl font-bold text-[9px] uppercase tracking-widest border border-slate-100 hover:bg-slate-100 transition-colors">Bulk Perspective Upload</button>
              <p className="text-[8px] text-slate-400 text-center uppercase tracking-widest">Supports PNG, JPG, WEBP (Max 5MB)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
