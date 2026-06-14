import { motion } from 'motion/react';

export default function About() {
  return (
    <div className="bg-brand-background text-brand-primary">
      {/* Hero */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1512374382149-43345ad1b4f4?auto=format&fit=crop&q=80" 
            className="w-full h-full object-cover brightness-[0.4]"
            alt="About Zyra Legecy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-brand-background" />
        </motion.div>
        
        <div className="relative text-center px-4 max-w-4xl">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-brand-secondary text-[10px] md:text-xs font-bold tracking-[0.5em] uppercase mb-8"
          >
            Distinctive Origin
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-6xl md:text-8xl font-serif font-bold mb-10 tracking-tighter"
          >
            The Legacy
          </motion.h1>
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="w-32 h-0.5 bg-brand-secondary mx-auto mb-10 origin-center"
          />
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-gray-400 text-sm md:text-base font-light tracking-widest uppercase"
          >
            Defined by Elegance, Refined by History
          </motion.p>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-px h-16 bg-gradient-to-b from-brand-secondary to-transparent" />
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-20 md:py-48 max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8 md:space-y-12 max-w-3xl"
          >
            <div className="space-y-4">
              <span className="text-brand-secondary font-bold text-[10px] tracking-[0.4em] uppercase block">The Ethos</span>
              <h2 className="text-4xl md:text-7xl font-serif font-bold leading-tight tracking-tighter text-center">Empowering the Modern Matriarch</h2>
            </div>
            
            <div className="space-y-6 md:space-y-8 text-gray-400 leading-relaxed font-light text-base md:text-lg">
              <p>
                Founded in the heart of Dhaka, Zyra Legacy was born from an obsession with the perfect silhouette. We believe footwear is the foundation of authority—a silent declaration of identity.
              </p>
              <p>
                Our artisans don't just craft shoes; they engineer confidence. Every curve, every material, and every stitch is selected to honor the complexity of the modern woman.
              </p>
              <p className="italic text-brand-secondary/80 font-serif text-xl md:text-2xl">
                "We don't follow trends; we define the standards of timeless sophistication."
              </p>
            </div>

            <div className="flex justify-center gap-12 md:gap-20 pt-8 border-t border-brand-primary/5">
              <div>
                <p className="text-4xl md:text-6xl font-serif font-bold text-brand-primary mb-1">2020</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold font-sans">Inception</p>
              </div>
              <div>
                <p className="text-4xl md:text-6xl font-serif font-bold text-brand-primary mb-1">50k+</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold font-sans">Served</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-32 md:py-48 bg-brand-accent/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20" />
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-24 space-y-4"
          >
            <span className="text-brand-secondary font-bold text-[10px] tracking-[0.4em] uppercase">Core Pillars</span>
            <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-tight">Standard of Excellence</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            {[
              { title: 'Quality Imperative', desc: 'Sourcing only the most exquisite hides and sustainable synthetics for a silhouette that endures.' },
              { title: 'Affordable Luxury', desc: 'Dismantling the gatekeeping of high fashion to provide premier access to all.' },
              { title: 'Unrivaled Service', desc: 'Your journey doesn’t end at the acquisition; it begins with our bespoke support.' },
            ].map((value, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
                className="group p-12 bg-brand-background/40 backdrop-blur-xl rounded-[2.5rem] border border-white/5 hover:border-brand-secondary/50 transition-all duration-700 shadow-2xl space-y-8"
              >
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-brand-secondary transition-all duration-500">
                  <span className="text-brand-secondary group-hover:text-black font-serif text-2xl font-bold">0{i+1}</span>
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-serif font-bold group-hover:text-brand-secondary transition-colors">{value.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed font-light tracking-wide">{value.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
