import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, User, ArrowLeft, ArrowRight, Share2, Tag } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Helmet } from 'react-helmet-async';

interface BlogPost {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  date: string;
  author: string;
  category: string;
  images: string[];
  meta?: {
    title?: string;
    description?: string;
    keywords?: string;
  };
}

export default function BlogPostDetail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  const DEFAULT_POSTS: BlogPost[] = [
    {
      id: "architecture-of-elegance",
      title: "The Architecture of Elegance: A Study in Modern Heels",
      category: "Heels",
      shortDescription: "Discover how we blend structural engineering with avant-garde aesthetics to create the perfect stiletto for the global woman.",
      content: "At Zyra Legacy, the creation of a stiletto is an exercise in architectural precision. It is not merely footwear; it is a structural feat designed to empower and elevate. \n\nOur latest collection focuses on 'The Balance of Power'—a design philosophy that ensures weight distribution is optimized for all-day authority. We use carbon-fiber shanks and premium Italian calfskin to achieve a silhouette that is as durable as it is striking. \n\nDhaka's fashion landscape is shifting towards a more curated, legacy-driven approach. Women are no longer just looking for trends; they are looking for investments. This narrative explores the journey of a single pair—from the first sketch in our atelier to the final walk on the cosmopolitan streets.",
      date: "Oct 24, 2025",
      author: "Zyra Curator",
      images: [
        "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1512374382149-43345ad1b4f4?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&q=80"
      ],
      meta: {
        title: "The Architecture of Elegance | Zyra Legacy Chronicles",
        description: "A masterclass in modern stiletto design and craftsmanship by Zyra Legacy. Explore how engineering meets high fashion.",
        keywords: "heels, luxury fashion, stiletto architecture, dhaka luxury style, designer footwear"
      }
    },
    {
      id: "sustainable-sophistication",
      title: "Sustainable Sophistication: The Future of Luxury",
      category: "Ethics",
      shortDescription: "Exploring the intersection of eco-conscious craftsmanship and the timeless allure of premium Italian leathers.",
      content: "Luxury is evolving. The modern woman demands not only beauty but also responsibility. At Zyra, we believe the two are inextricably linked. \n\nOur 'Gaia' initiative focuses on sourcing leathers from tanneries that utilize closed-loop water systems and natural vegetable dyes. But sustainability isn't just about materials—it's about longevity. By crafting pieces that last decades rather than seasons, we are honoring the legacy of the earth. \n\nThis chronicle takes you inside our artisan workshops, where every stitch is a commitment to a better future. We speak with our master craftsmen about the challenges of working with organic materials and the immense satisfaction of creating a product that values both the wearer and the world.",
      date: "Oct 22, 2025",
      author: "Ethics Desk",
      images: [
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80"
      ],
      meta: {
        title: "Sustainable Sophistication | Eco-Luxury Footwear",
        description: "How Zyra Legacy is pioneering responsible luxury through sustainable material sourcing and artisanal techniques.",
        keywords: "sustainable luxury, eco-friendly fashion, ethical sourcing, italian leather, artisanal craft"
      }
    },
    {
      id: "urban-zenith-sandals",
      title: "Urban Zenith: The Minimalist Manifesto for Sandals",
      category: "Style",
      shortDescription: "Stripping away the noise to reveal the pure essence of luxury comfort for the cosmopolitan summer.",
      content: "Minimalism is not the absence of something; it is the perfect amount of everything. In the high summer of Dhaka, our 'Zenith' sandals embody this philosophy. \n\nWe've stripped away the unnecessary buckles and heavy hardware to focus on the pure line of the foot. The result is a silhouette that elongates the leg and provides a sense of effortless freedom. Custom-molded footbeds provide ergonomic support, ensuring that 'minimal' never means 'uncomfortable.' \n\nIn this editorial, we explore how to style the minimalist look for the city. From pairing sandals with oversized linen trousers to sleek midi dresses, the Zenith is the ultimate versatile companion for the modern urbanite.",
      date: "Oct 20, 2025",
      author: "Style Editorial",
      images: [
        "https://images.unsplash.com/photo-1520639889413-5d5558c97386?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1515347619252-60a4bdad8880?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&q=80"
      ],
      meta: {
        title: "Urban Zenith Sandals | Minimalist Luxury Footwear",
        description: "The definitive guide to minimalist sandal design, focusing on the beauty of simplicity and premium materials.",
        keywords: "minimalist sandals, summer footwear, luxury sandals, modern fashion, premium comfort"
      }
    }
  ];

  useEffect(() => {
    async function fetchPost() {
      if (!id) return;
      try {
        const docRef = doc(db, 'blogPosts', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() } as BlogPost);
        } else {
          // Fallback to defaults
          const defaultPost = DEFAULT_POSTS.find(p => p.id === id);
          if (defaultPost) {
            setPost(defaultPost);
          }
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        // Fallback to defaults on error too
        const defaultPost = DEFAULT_POSTS.find(p => p.id === id);
        if (defaultPost) {
          setPost(defaultPost);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-background flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-brand-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-brand-background flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-serif font-bold text-brand-primary mb-6 text-[clamp(2rem,5vw,3rem)]">Narrative Not Found</h1>
        <Link to="/blog" className="text-brand-secondary uppercase text-xs tracking-widest font-bold flex items-center">
          <ArrowLeft className="w-4 h-4 mr-3" /> Back to Lexicon
        </Link>
      </div>
    );
  }

  // Map blog category to shop link
  const getShopLink = (cat: string) => {
    const validCategories = ['Heels', 'Sneakers', 'Flats', 'Sandals', 'Boots'];
    const found = validCategories.find(c => cat.toLowerCase().includes(c.toLowerCase()));
    return found ? `/shop?category=${found}` : '/shop';
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen text-brand-primary font-sans selection:bg-brand-secondary selection:text-white">
      <Helmet>
        <title>{post.meta?.title || `${post.title} | Zyra Legacy`}</title>
        <meta name="description" content={post.meta?.description || post.shortDescription} />
        <meta name="keywords" content={post.meta?.keywords} />
      </Helmet>

      {/* Hero Header */}
      <header className="relative pt-32 pb-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="flex items-center gap-6 text-[10px] uppercase font-bold tracking-[0.5em] text-brand-secondary">
              <span className="px-4 py-1.5 border border-brand-secondary/20 rounded-full">{post.category}</span>
              <span className="flex items-center gap-2 group cursor-default">
                <Calendar className="w-3 h-3 text-slate-300" /> {post.date}
              </span>
            </div>
            
            <h1 className="text-5xl md:text-8xl font-serif font-bold tracking-tighter leading-[0.9] max-w-5xl">
              {post.title}
            </h1>

            <div className="w-20 h-px bg-brand-primary/10" />

            <p className="text-gray-500 text-lg md:text-xl font-light italic max-w-2xl leading-relaxed">
              {post.shortDescription}
            </p>
          </div>
        </div>
      </header>

      {/* Visual Anthology - Grid 1 */}
      <section className="px-4 md:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:items-center">
          <div 
            className="lg:col-span-7 aspect-[16/10] bg-slate-100 rounded-[3rem] overflow-hidden shadow-2xl relative group"
          >
            <img src={post.images[0]} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3s]" />
            <div className="absolute inset-0 bg-brand-primary/5 group-hover:opacity-0 transition-opacity" />
          </div>
          
          <div 
            className="lg:col-span-5 aspect-square lg:aspect-[4/5] bg-slate-100 rounded-[3rem] overflow-hidden shadow-xl lg:-ml-20 lg:mt-20 z-10 relative group"
          >
            <img src={post.images[1] || post.images[0]} alt="Post detail" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s]" />
            <div className="absolute bottom-10 left-10 p-6 bg-white/90 backdrop-blur-md rounded-2xl border border-white/20 shadow-sm max-w-[200px]">
               <p className="text-[10px] font-bold uppercase tracking-widest text-brand-secondary mb-1">Perspective 02</p>
               <p className="text-[10px] text-gray-500 italic">Signature architecture from our latest curation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Narrative */}
      <section className="py-24 md:py-40 px-4 md:px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 lg:gap-24">
             <div className="md:w-1/4 pt-4">
                <div className="sticky top-40 space-y-12">
                   <div className="space-y-4">
                      <h4 className="text-[9px] uppercase font-bold tracking-[0.4em] text-brand-secondary">Curated By</h4>
                      <p className="text-sm font-serif font-bold italic">{post.author}</p>
                   </div>
                   <div className="space-y-4">
                      <h4 className="text-[9px] uppercase font-bold tracking-[0.4em] text-brand-secondary">Social Signature</h4>
                      <div className="flex gap-4">
                         <button className="p-2 bg-white rounded-full border border-slate-100 text-slate-400 hover:text-brand-secondary transition-colors"><Share2 className="w-4 h-4" /></button>
                      </div>
                   </div>
                </div>
             </div>

             <div className="md:w-3/4">
                <div className="prose prose-brand prose-2xl max-w-none">
                   <div className="whitespace-pre-line text-brand-primary/80 font-light leading-[1.8] tracking-wide text-lg md:text-2xl font-serif first-letter:text-7xl first-letter:font-bold first-letter:text-brand-secondary first-letter:mr-3 first-letter:float-left first-letter:mt-3">
                      {post.content}
                   </div>
                </div>

                {/* Additional Images Asymmetric Grid */}
                <div className="mt-20 lg:mt-32 grid grid-cols-2 gap-8 lg:-mr-40 relative">
                   <motion.div 
                     whileHover={{ y: -10 }}
                     className="aspect-[4/5] bg-slate-100 rounded-[2.5rem] overflow-hidden shadow-xl"
                   >
                     <img src={post.images[2] || post.images[0]} alt="Detail 3" className="w-full h-full object-cover" />
                   </motion.div>
                   <motion.div 
                     whileHover={{ y: 10 }}
                     className="aspect-[4/5] bg-slate-100 rounded-[2.5rem] overflow-hidden shadow-xl mt-12 lg:mt-24"
                   >
                     <img src={post.images[3] || post.images[1] || post.images[0]} alt="Detail 4" className="w-full h-full object-cover" />
                   </motion.div>
                </div>

                {/* Tag Cloud */}
                {post.meta?.keywords && (
                  <div className="mt-24 md:mt-48 pt-12 border-t border-brand-primary/5 flex flex-wrap gap-3">
                    {post.meta.keywords.split(',').map((tag) => (
                      <span key={tag} className="flex items-center px-6 py-2 bg-white border border-slate-100 rounded-full text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400 hover:border-brand-secondary/30 transition-colors">
                        <Tag className="w-3 h-3 mr-3 text-brand-secondary/40" /> {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
             </div>
          </div>
        </div>
      </section>

      {/* Modern CTA Section */}
      <section className="py-20 lg:py-40 bg-brand-primary text-brand-background relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-brand-secondary/10 -skew-x-12 translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10 text-center space-y-12">
          <div className="space-y-4">
             <p className="text-[10px] uppercase tracking-[0.5em] text-brand-secondary font-bold">End of Narrative</p>
             <h2 className="text-4xl md:text-7xl font-serif font-bold tracking-tighter max-w-4xl mx-auto">
               Ready to Define <br /> <span className="italic text-brand-secondary">Your Own Legacy?</span>
             </h2>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
             <Link 
               to={getShopLink(post.category)} 
               className="group flex items-center justify-center gap-6 px-16 py-6 bg-brand-secondary text-brand-primary font-bold text-xs uppercase tracking-[0.4em] rounded-sm hover:bg-white transition-all duration-700"
             >
               Shop {post.category} Collection
               <ArrowRight className="w-4 h-4 group-hover:translate-x-3 transition-transform" />
             </Link>
          </div>
        </div>
      </section>

      {/* Post Navigation */}
      <footer className="py-12 border-t border-brand-primary/5 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex justify-between items-center font-bold text-[10px] uppercase tracking-widest">
           <Link to="/blog" className="flex items-center gap-4 text-slate-400 hover:text-brand-primary transition-colors group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" /> Back to Archive
           </Link>
           <span className="text-slate-200">The Zyra Chronicle</span>
        </div>
      </footer>
    </div>
  );
}
