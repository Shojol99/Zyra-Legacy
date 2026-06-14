import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Contact() {
  return (
    <div className="bg-brand-background min-h-screen text-brand-primary">
      <section className="relative py-32 lg:py-48 overflow-hidden bg-brand-accent/30">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.8))] z-0" />
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center relative z-10">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-brand-secondary text-[10px] font-bold uppercase tracking-[0.4em] mb-8"
          >
            Engagement Concierge
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-serif font-bold mb-10 tracking-tighter"
          >
            Initiate Connection
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto font-light leading-relaxed text-sm md:text-base tracking-wide"
          >
            Our curators are standing by to assist with your acquisitions, sizing inquiries, or bespoke styling requirements.
          </motion.p>
        </div>
      </section>

      <section className="py-32 md:py-48 max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32">
          <div className="space-y-20">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-12"
            >
              <h2 className="text-4xl font-serif font-bold tracking-tight">Dispatch Channels</h2>
              <div className="space-y-12">
                <div className="flex items-start group">
                  <div className="p-5 bg-white/5 rounded-2xl border border-white/5 text-brand-secondary mr-8 group-hover:bg-brand-secondary group-hover:text-black transition-all duration-500">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Electronic Correspondence</h4>
                    <p className="text-xl font-serif font-bold tracking-tight text-brand-primary">hello@zyralegecy.com</p>
                    <p className="text-sm text-gray-500 font-light">Response within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="p-5 bg-white/5 rounded-2xl border border-white/5 text-brand-secondary mr-8 group-hover:bg-brand-secondary group-hover:text-black transition-all duration-500">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Telephonic Line</h4>
                    <p className="text-xl font-serif font-bold tracking-tight text-brand-primary">+880 1234-567890</p>
                    <p className="text-sm text-gray-500 font-light">Mon-Sat | 10:00 - 20:00</p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="p-5 bg-white/5 rounded-2xl border border-white/5 text-brand-secondary mr-8 group-hover:bg-brand-secondary group-hover:text-black transition-all duration-500">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Main Headquarters</h4>
                    <p className="text-xl font-serif font-bold tracking-tight text-brand-primary">Plot #24, Uttara Sector 1</p>
                    <p className="text-sm text-gray-500 font-light">Dhaka, Bangladesh</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-12 bg-white text-black rounded-[3rem] relative overflow-hidden group"
            >
              <div className="relative z-10">
                <h3 className="text-3xl font-serif font-bold mb-4 tracking-tighter">Stay Apprised</h3>
                <p className="text-gray-600 text-sm mb-10 leading-relaxed font-medium">Be the first to access the Archives and the upcoming collections of Zyra Legacy.</p>
                <div className="flex flex-wrap gap-6">
                  <button className="text-[10px] font-bold uppercase tracking-widest border border-black/20 px-8 py-4 rounded-full hover:bg-black hover:text-white transition-all duration-500">Instagram</button>
                  <button className="text-[10px] font-bold uppercase tracking-widest border border-black/20 px-8 py-4 rounded-full hover:bg-black hover:text-white transition-all duration-500">Facebook</button>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-secondary/20 blur-3xl rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-brand-accent/40 backdrop-blur-3xl p-12 lg:p-16 rounded-[4rem] border border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.4)] relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-secondary/5 blur-[100px] rounded-full" />
              <h2 className="text-3xl font-serif font-bold mb-12 tracking-tight relative z-10">Inquiry Registry</h2>
              <form className="space-y-10 relative z-10" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] ml-1">Identity</label>
                    <input type="text" className="w-full px-8 py-5 bg-white border border-brand-accent rounded-2xl focus:border-brand-secondary focus:ring-0 transition-all text-sm outline-none font-light tracking-wide placeholder:text-gray-300" placeholder="Your Full Name" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] ml-1">Communication</label>
                    <input type="tel" className="w-full px-8 py-5 bg-white border border-brand-accent rounded-2xl focus:border-brand-secondary focus:ring-0 transition-all text-sm outline-none font-light tracking-wide placeholder:text-gray-300" placeholder="Contact Number" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] ml-1">Email Registry</label>
                  <input type="email" className="w-full px-8 py-5 bg-white border border-brand-accent rounded-2xl focus:border-brand-secondary focus:ring-0 transition-all text-sm outline-none font-light tracking-wide placeholder:text-gray-300" placeholder="email@address.com" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] ml-1">Message Content</label>
                  <textarea rows={5} className="w-full px-8 py-5 bg-white border border-brand-accent rounded-2xl focus:border-brand-secondary focus:ring-0 transition-all text-sm outline-none resize-none font-light tracking-wide placeholder:text-gray-300" placeholder="How may we serve you?"></textarea>
                </div>
                <button className="group relative w-full bg-white text-black py-6 rounded-2xl font-bold tracking-[0.3em] uppercase transition-all duration-700 overflow-hidden shadow-2xl active:scale-95">
                  <span className="relative z-10 flex items-center justify-center">
                    DISPATCH MESSAGE
                    <Send className="ml-4 w-4 h-4 group-hover:translate-x-3 group-hover:-translate-y-3 transition-transform duration-700" />
                  </span>
                  <div className="absolute inset-0 bg-brand-secondary translate-y-full group-hover:translate-y-0 transition-all duration-700" />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
