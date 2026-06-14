import React, { useEffect, useState } from 'react';
import { collection, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Link } from 'react-router-dom';
import { CheckCircle, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

export default function SeedData() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [adminStatus, setAdminStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const { user } = useAuth();

  const elevateToAdmin = async () => {
    if (!user) {
      alert('Please login first to elevate your account.');
      return;
    }
    setAdminStatus('loading');
    try {
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        displayName: user.displayName || 'Admin',
        role: 'admin',
        updatedAt: serverTimestamp(),
      }, { merge: true });
      setAdminStatus('success');
    } catch (err) {
      console.error(err);
      setAdminStatus('error');
    }
  };

  const seedBlog = async () => {
    setStatus('loading');
    try {
      const posts = [
        {
          title: "The Architecture of Elegance: A Study in Modern Heels",
          category: "Heels",
          slug: "architecture-of-elegance",
          shortDescription: "Discover how we blend structural engineering with avant-garde aesthetics to create the perfect stiletto.",
          content: `At Zyra Legacy, the creation of a stiletto is an exercise in architectural precision. It is not merely footwear; it is a structural feat designed to empower and elevate. \n\nOur latest collection focuses on 'The Balance of Power'—a design philosophy that ensures weight distribution is optimized for all-day authority. We use carbon-fiber shanks and premium Italian calfskin to achieve a silhouette that is as durable as it is striking. \n\nDhaka's fashion landscape is shifting towards a more curated, legacy-driven approach. Women are no longer just looking for trends; they are looking for investments. This narrative explores the journey of a single pair—from the first sketch in our atelier to the final walk on the cosmopolitan streets.`,
          images: [
            "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1512374382149-43345ad1b4f4?auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&q=80"
          ],
          meta: {
            title: "The Architecture of Elegance | Zyra Legacy Chronicles",
            description: "A masterclass in modern stiletto design and craftsmanship by Zyra Legacy.",
            keywords: "heels, luxury fashion, stiletto architecture, dhaka style"
          },
          author: "Zyra Curator",
          date: "Oct 24, 2025"
        },
        {
          title: "The Concrete Runway: Sneaker Culture in Dhaka",
          category: "Sneakers",
          slug: "concrete-runway-dhaka",
          shortDescription: "Exploring the intersection of high-fashion and urban utility in the modern capital.",
          content: `Sneaker culture has transcended its athletic origins to become a staple of the high-fashion wardrobe. In Dhaka, this transition is marked by a unique blend of heritage and modernity. \n\nAt Zyra Legacy, our sneakers are designed for the woman on the move who refuses to sacrifice elegance for comfort. We integrate memory-foam technology with hand-stitched leather panels to create a piece that feels as good as it looks. \n\nThis chronicle dives into the rising trend of "Athluxury"—where performance meets prestige. We talk to local street-style icons about how they pair our limited-edition drops with everything from power suits to traditional silks.`,
          images: [
            "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80"
          ],
          meta: {
            title: "Sneaker Culture in Dhaka | Zyra Legacy editorial",
            description: "The rise of high-fashion sneakers in urban Dhaka.",
            keywords: "sneakers, street style, luxury casual, urban fashion"
          },
          author: "Style Desk",
          date: "Oct 22, 2025"
        },
        {
          title: "Sandals: The Minimalist Manifesto",
          category: "Sandals",
          slug: "sandals-minimalist-manifesto",
          shortDescription: "Stripping away the noise to reveal the pure essence of luxury comfort.",
          content: `In the heat of the season, minimalism becomes a necessity. Our 'Zenith' sandal collection is a tribute to the beauty of the essential. \n\nUsing a singular strip of supple goat leather and a cushioned mahogany-finish sole, we've created a piece that disappears on the foot while making a profound statement. Luxury is often found in what is not there—the absence of friction, the lack of bulk, the pure line of the silhouette. \n\nThis narrative examines the craftsmanship behind our artisanal sandals, which are handcrafted by masters who have spent decades perfecting the art of the 'invisible shoe'.`,
          images: [
            "https://images.unsplash.com/photo-1520639889413-5d5558c97386?auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1515347619252-60a4bdad8880?auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&q=80"
          ],
          meta: {
            title: "Minimalist Sandals | Zyra Legacy",
            description: "A guide to artisanal minimalist sandals for the modern woman.",
            keywords: "sandals, minimalist fashion, summer luxury, artisanal footwear"
          },
          author: "Boutique Team",
          date: "Oct 20, 2025"
        }
      ];

      for (const post of posts) {
        await addDoc(collection(db, 'blogPosts'), {
          ...post,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-brand-background flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[3rem] p-12 text-center space-y-8 shadow-2xl">
        <h1 className="text-3xl font-serif font-bold text-brand-primary">Chronicle Seeder</h1>
        <p className="text-gray-500 text-sm italic">Press the button below to inject a demo narrative into your archive.</p>
        
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-brand-primary/60">Content Management</h3>
          {status === 'idle' && (
            <button 
              onClick={seedBlog}
              className="w-full py-4 bg-brand-secondary text-brand-primary font-bold uppercase tracking-widest rounded-2xl hover:bg-brand-primary hover:text-white transition-all shadow-lg shadow-brand-secondary/10"
            >
              Inject Demo Posts
            </button>
          )}

          {status === 'loading' && (
            <div className="flex flex-col items-center gap-4 text-brand-secondary py-4">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-[10px] uppercase font-bold tracking-widest">Constructing Narratives...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center gap-4 text-green-500 font-bold py-4">
              <CheckCircle className="w-12 h-12" />
              <p className="uppercase tracking-widest text-xs font-bold">Archives Seeded</p>
            </div>
          )}
        </div>

        <div className="space-y-4 pt-8 border-t border-brand-primary/5">
          <h3 className="text-sm font-bold uppercase tracking-widest text-brand-primary/60">Privilege Management</h3>
          {adminStatus === 'idle' && (
            <button 
              onClick={elevateToAdmin}
              className="w-full py-4 bg-brand-primary text-white font-bold uppercase tracking-widest rounded-2xl hover:bg-brand-secondary hover:text-brand-primary transition-all shadow-xl"
            >
              <span className="flex items-center justify-center gap-3">
                <ShieldCheck className="w-4 h-4" /> Elevate Me to Admin
              </span>
            </button>
          )}

          {adminStatus === 'loading' && (
            <div className="flex flex-col items-center gap-4 text-brand-primary py-4">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-[10px] uppercase font-bold tracking-widest">Verifying Authority...</p>
            </div>
          )}

          {adminStatus === 'success' && (
            <div className="flex flex-col items-center gap-4 text-green-600 font-bold py-4">
              <CheckCircle className="w-12 h-12" />
              <p className="uppercase tracking-widest text-xs font-bold">Authority Granted</p>
            </div>
          )}

          {adminStatus === 'error' && (
            <p className="text-red-500 font-bold uppercase text-[10px] tracking-widest py-4">Verification Fault. Check Firestore Rules.</p>
          )}
        </div>

        <div className="pt-8">
          <Link to="/blog" className="flex items-center justify-center gap-3 text-brand-secondary text-xs uppercase font-bold tracking-widest hover:text-brand-primary transition-colors group">
            View Lexicon <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </Link>
          <Link to="/admin" className="flex items-center justify-center gap-3 text-brand-primary text-[10px] uppercase font-bold tracking-widest mt-6 hover:text-brand-secondary transition-colors group">
            Go to Admin Dashboard <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
