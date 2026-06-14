import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface BlogPost {
  id: string;
  title: string;
  shortDescription: string;
  date: string;
  author: string;
  images: string[];
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const DEFAULT_POSTS: BlogPost[] = [
    {
      id: "architecture-of-elegance",
      title: "The Architecture of Elegance: A Study in Modern Heels",
      shortDescription: "Discover how we blend structural engineering with avant-garde aesthetics to create the perfect stiletto for the global woman.",
      date: "Oct 24, 2025",
      author: "Zyra Curator",
      images: ["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80"],
      meta: {
        title: "The Architecture of Elegance | Zyra Legacy Chronicles",
        description: "A masterclass in modern stiletto design and craftsmanship by Zyra Legacy. Explore how engineering meets high fashion.",
        keywords: "heels, luxury fashion, stiletto architecture, dhaka luxury style, designer footwear"
      }
    } as any,
    {
      id: "sustainable-sophistication",
      title: "Sustainable Sophistication: The Future of Luxury",
      shortDescription: "Exploring the intersection of eco-conscious craftsmanship and the timeless allure of premium Italian leathers.",
      date: "Oct 22, 2025",
      author: "Ethics Desk",
      images: ["https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80"],
      meta: {
        title: "Sustainable Sophistication | Eco-Luxury Footwear",
        description: "How Zyra Legacy is pioneering responsible luxury through sustainable material sourcing and artisanal techniques.",
        keywords: "sustainable luxury, eco-friendly fashion, ethical sourcing, italian leather, artisanal craft"
      }
    } as any,
    {
      id: "urban-zenith-sandals",
      title: "Urban Zenith: The Minimalist Manifesto for Sandals",
      shortDescription: "Stripping away the noise to reveal the pure essence of luxury comfort for the cosmopolitan summer.",
      date: "Oct 20, 2025",
      author: "Style Editorial",
      images: ["https://images.unsplash.com/photo-1520639889413-5d5558c97386?auto=format&fit=crop&q=80"],
      meta: {
        title: "Urban Zenith Sandals | Minimalist Luxury Footwear",
        description: "The definitive guide to minimalist sandal design, focusing on the beauty of simplicity and premium materials.",
        keywords: "minimalist sandals, summer footwear, luxury sandals, modern fashion, premium comfort"
      }
    } as any
  ];

  useEffect(() => {
    async function fetchPosts() {
      try {
        const q = query(collection(db, 'blogPosts'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedPosts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as BlogPost[];
        
        if (fetchedPosts.length > 0) {
          setPosts(fetchedPosts);
        } else {
          setPosts(DEFAULT_POSTS);
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        setPosts(DEFAULT_POSTS);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  return (
    <div className="bg-brand-background min-h-screen py-20 lg:py-32 text-brand-primary">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-24 space-y-4">
          <motion.p 
            className="text-brand-secondary text-[10px] font-bold uppercase tracking-[0.5em]"
          >
            Editorial Archives
          </motion.p>
          <motion.h1 
            className="text-6xl md:text-8xl font-serif font-bold tracking-tighter"
          >
            The Lexicon
          </motion.h1>
          <motion.p 
            className="text-gray-400 font-light tracking-widest uppercase text-xs"
          >
            Curated narratives on fashion, style, and legacy
          </motion.p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-2 border-brand-secondary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center space-y-8">
            <div className="w-24 h-24 rounded-full bg-brand-accent/30 flex items-center justify-center text-brand-secondary border border-brand-secondary/20">
               <Calendar className="w-10 h-10" />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-serif font-bold">The Archive is Silent</h2>
              <p className="text-gray-500 max-w-sm mx-auto italic">Our curated narratives are currently being written. Inject our initial demo gallery to see the archive in its full glory.</p>
            </div>
            <Link to="/seed-data" className="px-12 py-5 bg-brand-primary text-brand-background font-bold text-[10px] uppercase tracking-[0.4em] rounded-sm hover:bg-brand-secondary transition-all">
              Seed Demo Gallery
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {posts.map((post, i) => (
              <article 
                key={post.id}
                className="group flex flex-col h-full bg-brand-accent/30 rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl hover:border-brand-secondary/30 transition-all duration-700"
              >
                <div className="aspect-[16/10] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-1000 relative">
                  <img src={post.images?.[0] || 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80'} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-background to-transparent opacity-60" />
                </div>
                <div className="p-10 flex flex-col flex-grow space-y-6">
                  <div className="flex items-center gap-6 text-[9px] font-bold uppercase tracking-widest text-gray-500">
                    <span className="flex items-center"><Calendar className="w-3 h-3 mr-2 text-brand-secondary" /> {post.date}</span>
                    <span className="flex items-center"><User className="w-3 h-3 mr-2 text-brand-secondary" /> {post.author}</span>
                  </div>
                  <h2 className="text-2xl font-serif font-bold tracking-tight leading-tight group-hover:text-brand-secondary transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-400 text-sm font-light leading-relaxed tracking-wide line-clamp-3">
                    {post.shortDescription}
                  </p>
                  <div className="pt-4 mt-auto">
                    <Link to={`/blog/${post.id}`} className="inline-flex items-center text-[10px] uppercase font-bold tracking-[0.3em] text-brand-secondary group/btn">
                      Read Narrative
                      <ArrowRight className="w-4 h-4 ml-4 group-hover/btn:translate-x-3 transition-transform duration-500" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
