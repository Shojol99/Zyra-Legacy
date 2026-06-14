import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Settings, 
  Eye, 
  Edit2, 
  Trash2, 
  FileText,
  Clock,
  User as UserIcon,
  Tag,
  Check,
  X,
  Image as ImageIcon,
  Loader2,
  ChevronLeft
} from 'lucide-react';
import { formatPrice, cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { db, storage, auth } from '../../lib/firebase';
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
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

export default function AdminBlog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [editingPost, setEditingPost] = useState<any | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    setLoading(true);
    try {
      const q = query(collection(db, 'blogPosts'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setPosts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this narration?')) return;
    try {
      await deleteDoc(doc(db, 'blogPosts', id));
      setPosts(posts.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleEdit = (post: any) => {
    setEditingPost(post);
    setView('editor');
  };

  return (
    <div className="space-y-8">
      {view === 'list' && (
        <>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">Narrative Studio</h1>
              <p className="text-slate-500 text-sm">Compose and distribute the stories that define your legacy brand.</p>
            </div>
            <button 
              onClick={() => {
                setEditingPost(null);
                setView('editor');
              }}
              className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
            >
              <Plus className="w-5 h-5" />
              New Chronicle
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {loading ? (
               <div className="col-span-full flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
             ) : posts.map((post, i) => (
               <motion.div 
                 key={post.id}
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: i * 0.1 }}
                 className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden group hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500 flex flex-col"
               >
                 <div className="aspect-video bg-slate-100 overflow-hidden">
                   <img src={post.images?.[0] || 'https://via.placeholder.com/400x225'} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                 </div>
                 <div className="p-8 flex-grow">
                   <div className="flex items-center justify-between mb-6">
                     <span className={cn(
                       "text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border",
                       post.status === 'Published' ? "border-emerald-100 text-emerald-600 bg-emerald-50" : "border-slate-200 text-slate-500 bg-slate-50"
                     )}>
                       {post.status || 'Draft'}
                     </span>
                     <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                       <Eye className="w-3.5 h-3.5" /> {post.views || 0}
                     </div>
                   </div>
                   <h3 className="text-xl font-serif font-bold text-slate-900 leading-tight mb-4 group-hover:text-indigo-600 transition-colors line-clamp-2 h-14">{post.title}</h3>
                   <div className="flex items-center gap-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest pb-6 border-b border-slate-50">
                     <div className="flex items-center gap-1.5"><UserIcon className="w-3 h-3 text-indigo-400" /> {post.author}</div>
                     <div className="flex items-center gap-1.5"><Clock className="w-3 h-3 text-indigo-400" /> {post.date}</div>
                   </div>
                 </div>
                 <div className="p-4 bg-slate-50/50 flex items-center justify-end gap-2">
                    <button 
                      onClick={() => handleEdit(post)}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all shadow-sm"><Edit2 className="w-4 h-4" /></button>
                    <button 
                      onClick={() => handleDelete(post.id)}
                      className="p-2 text-slate-400 hover:text-rose-500 hover:bg-white rounded-xl transition-all shadow-sm"><Trash2 className="w-4 h-4" /></button>
                 </div>
               </motion.div>
             ))}
          </div>
          {!loading && posts.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
               <FileText className="w-12 h-12 text-slate-200 mx-auto mb-4" />
               <p className="text-slate-500 font-serif">No stories recorded in the archive yet.</p>
            </div>
          )}
        </>
      )}

      {view === 'editor' && (
        <BlogEditor 
          post={editingPost}
          onCancel={() => setView('list')} 
          onSuccess={() => {
            setView('list');
            fetchPosts();
          }} 
        />
      )}
    </div>
  );
}

function BlogEditor({ post, onCancel, onSuccess }: { post?: any, onCancel: () => void, onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: post?.title || '',
    category: post?.category || 'Editorial',
    slug: post?.slug || '',
    shortDescription: post?.shortDescription || '',
    content: post?.content || '',
    status: post?.status || 'Draft',
    images: post?.images || ['', '', '', ''],
    meta: post?.meta || { title: '', description: '', keywords: '' }
  });

  const fileInputs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  const handleImageUpload = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const storageRef = ref(storage, `blog/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      const newImgs = [...formData.images];
      newImgs[idx] = url;
      setFormData(prev => ({ ...prev, images: newImgs }));
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Asset upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!formData.title || !formData.content) return alert('Title and Content are essential.');
    setLoading(true);

    try {
      const data = {
        ...formData,
        author: auth.currentUser?.displayName || 'Zyra Curator',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        updatedAt: serverTimestamp(),
      };

      if (post?.id) {
        await updateDoc(doc(db, 'blogPosts', post.id), data);
      } else {
        await addDoc(collection(db, 'blogPosts'), {
          ...data,
          createdAt: serverTimestamp(),
          views: 0
        });
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving narrative:', error);
      alert('Failed to preserve narrative.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <button onClick={onCancel} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors uppercase text-[10px] font-bold tracking-widest group">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Discard Narrative
        </button>
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 p-1 rounded-xl">
             <button 
              onClick={() => setFormData({...formData, status: 'Draft'})}
              className={cn("px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all", formData.status === 'Draft' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600")}>Draft</button>
             <button 
              onClick={() => setFormData({...formData, status: 'Published'})}
              className={cn("px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all", formData.status === 'Published' ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-slate-400 hover:text-slate-600")}>Published</button>
          </div>
          <button 
            onClick={handlePublish}
            disabled={loading}
            className="px-8 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <Loader2 className="w-3 h-3 animate-spin" />}
            {post?.id ? 'Preserve Changes' : 'Publish Chronicle'}
          </button>
        </div>
      </div>

      <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-sm space-y-12">
        <div className="space-y-4">
          <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400 ml-1">Chronicle Designation (Title)</label>
          <input 
            type="text" 
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="Identity of the narrative..."
            className="w-full bg-slate-50/50 border border-slate-100 rounded-[1.5rem] py-6 px-10 text-3xl font-serif font-bold text-slate-900 focus:bg-white focus:border-indigo-200 transition-all outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-8">
           <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400 ml-1">Creative Category</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full bg-slate-50/50 border border-slate-100 rounded-[1.2rem] py-4 px-6 text-sm font-bold text-slate-700 focus:bg-white transition-all outline-none appearance-none"
              >
                <option value="Editorial">Special Editorial</option>
                <option value="Heels">Heels Focus</option>
                <option value="Sneakers">Sneakers Culture</option>
                <option value="Flats">Flats & Comfort</option>
                <option value="Sandals">Sandal Trends</option>
                <option value="Boots">Boots Heritage</option>
                <option value="Trends">General Trends</option>
              </select>
           </div>
           <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400 ml-1">Archive Segment (Slug)</label>
              <input 
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({...formData, slug: e.target.value})}
                placeholder="slug-identifier"
                className="w-full bg-slate-50/50 border border-slate-100 rounded-[1.2rem] py-4 px-6 text-sm font-bold text-slate-400 focus:bg-white transition-all outline-none"
              />
           </div>
        </div>

        <div className="space-y-6">
           <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400 ml-1">Signature Asset (Hero Image)</label>
           <div className="space-y-4">
              <input type="file" ref={fileInputs[0]} className="hidden" onChange={(e) => handleImageUpload(0, e)} accept="image/*" />
              <div 
                onClick={() => fileInputs[0].current?.click()}
                className="aspect-[21/9] rounded-[3rem] bg-slate-50 border-2 border-dashed border-slate-200 overflow-hidden relative group hover:border-indigo-400 transition-all cursor-pointer">
                {formData.images[0] ? (
                  <img src={formData.images[0]} className="w-full h-full object-cover" alt="Hero Preview" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-slate-400">
                    <ImageIcon className="w-10 h-10" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em]">Signature Image</p>
                  </div>
                )}
              </div>
           </div>
        </div>

        <div className="space-y-6">
           <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400 ml-1">Visual Anthology (3 Additional Images)</label>
           <div className="grid grid-cols-3 gap-6">
              {[1, 2, 3].map((idx) => (
                <div key={idx} className="space-y-3">
                   <input type="file" ref={fileInputs[idx]} className="hidden" onChange={(e) => handleImageUpload(idx, e)} accept="image/*" />
                   <div 
                    onClick={() => fileInputs[idx].current?.click()}
                    className="aspect-[4/5] bg-slate-50 border-2 border-dashed border-slate-100 rounded-2xl overflow-hidden cursor-pointer hover:border-indigo-300 transition-all flex items-center justify-center">
                    {formData.images[idx] ? (
                      <img src={formData.images[idx]} className="w-full h-full object-cover" alt={`Gallery ${idx}`} />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-200" />
                    )}
                  </div>
                </div>
              ))}
           </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400 ml-1">Narrative Abstract (Short Description)</label>
          <textarea 
            rows={3} 
            value={formData.shortDescription}
            onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
            placeholder="A punchy catchline for the archive view..."
            className="w-full bg-slate-50/50 border border-slate-100 rounded-[1.5rem] py-6 px-10 text-lg font-medium text-slate-700 focus:bg-white transition-all outline-none resize-none leading-relaxed"
          />
        </div>

        <div className="space-y-4 quill-editor-wrapper">
          <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400 ml-1">The Soul of the Story (Full Description)</label>
          <ReactQuill 
            theme="snow"
            value={formData.content}
            onChange={(val) => setFormData({...formData, content: val})}
            placeholder="The soul of the story begins here..."
            className="bg-white rounded-3xl overflow-hidden border border-slate-100 min-h-[400px]"
          />
        </div>

        <div className="pt-12 border-t border-slate-50">
           <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400 mb-8 ml-1">Engine Presence (SEO)</h4>
           <div className="grid grid-cols-1 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">Meta Title</label>
                <input 
                  type="text" 
                  value={formData.meta.title}
                  onChange={(e) => setFormData({...formData, meta: {...formData.meta, title: e.target.value}})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm outline-none focus:bg-white transition-all" 
                />
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">Meta Description</label>
                  <textarea 
                    rows={4} 
                    value={formData.meta.description}
                    onChange={(e) => setFormData({...formData, meta: {...formData.meta, description: e.target.value}})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 text-xs outline-none focus:bg-white transition-all" 
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">Search Keywords (comma separated)</label>
                  <textarea 
                    rows={4} 
                    value={formData.meta.keywords}
                    onChange={(e) => setFormData({...formData, meta: {...formData.meta, keywords: e.target.value}})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 text-xs outline-none focus:bg-white transition-all" 
                  />
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
