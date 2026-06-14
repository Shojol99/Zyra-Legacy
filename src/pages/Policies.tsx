import React from 'react';
import { motion } from 'motion/react';

const PolicyLayout = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="bg-brand-background min-h-screen py-32 lg:py-48 text-brand-primary">
    <div className="max-w-4xl mx-auto px-4 md:px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-16"
      >
        <div className="text-center space-y-4">
          <p className="text-brand-secondary text-[10px] font-bold uppercase tracking-[0.5em]">Zyra Legal Manifesto</p>
          <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tighter">{title}</h1>
          <div className="w-24 h-0.5 bg-brand-secondary mx-auto mt-8" />
        </div>
        
        <div className="bg-brand-accent/40 backdrop-blur-3xl p-10 md:p-16 rounded-[4rem] border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-secondary/5 blur-[100px] rounded-full" />
          <div className="prose prose-invert prose-brand font-light leading-relaxed tracking-wide relative z-10 max-w-none text-gray-300">
            {children}
          </div>
        </div>
      </motion.div>
    </div>
  </div>
);

export const PrivacyPolicy = () => (
  <PolicyLayout title="Privacy Integrity">
    <h2 className="text-2xl font-serif font-bold text-white mb-6">Introduction</h2>
    <p className="mb-8 font-light">
      At Zyra Legacy, we hold your personal narrative with the highest regard. This manifesto outlines how your data is curated, protected, and honored when you engage with the Zyra ecosystem.
    </p>
    <h3 className="text-xl font-serif font-bold text-white mb-4">Engagement Data</h3>
    <p className="mb-8 font-light">
      We collect identity markers including your registry email, delivery destinations, and telephonic lines solely to facilitate your acquisition journey. We do not engage in the commerce of your personal history.
    </p>
    <h3 className="text-xl font-serif font-bold text-white mb-4">Digital Preservation</h3>
    <p className="mb-8 font-light">
      Your cipher keys and personal identifiers are stored within encrypted vaults. We employ SSL-tier protocols to ensure that your interaction with our digital storefront remains a private affair.
    </p>
  </PolicyLayout>
);

export const TermsConditions = () => (
  <PolicyLayout title="Constitutional Terms">
    <h2 className="text-2xl font-serif font-bold text-white mb-6">Registry Agreement</h2>
    <p className="mb-8 font-light">
      By accessing the Zyra Legacy estate, you enter into a binding agreement with the brand. You represent that your engagement is conducted with integrity and within the bounds of legal frameworks.
    </p>
    <h3 className="text-xl font-serif font-bold text-white mb-4">Intellectual Sovereignty</h3>
    <p className="mb-8 font-light">
      All visual assets, architectural designs, and brand signatures are the exclusive property of Zyra Legacy. Reproduction or unauthorized dissemination of these assets is strictly prohibited under the Integrity Clause.
    </p>
    <h3 className="text-xl font-serif font-bold text-white mb-4">Order Limits</h3>
    <p className="mb-8 font-light">
      We reserve the authority to restrict acquisitions for any individual suspected of non-genuine interaction or intent to redistribute boutique items for commercial gain.
    </p>
  </PolicyLayout>
);

export const ShippingPolicy = () => (
  <PolicyLayout title="Global Passage">
    <h2 className="text-2xl font-serif font-bold text-white mb-6">Delivery Logistics</h2>
    <p className="mb-8 font-light">
      Our "White Glove Delivery" ensures that your acquisitions are handled with the utmost reverence. We prioritize local passages within 48 to 72 hours for Dhaka City.
    </p>
    <h3 className="text-xl font-serif font-bold text-white mb-4">Regional Reach</h3>
    <p className="mb-8 font-light">
      Domestic passage to Chittagong, Sylhet, and other major divisions is conducted via priority logistics partners, ensuring arrival within 3 to 5 business cycles.
    </p>
    <h3 className="text-xl font-serif font-bold text-white mb-4">Order Protection</h3>
    <p className="mb-8 font-light">
      Every shipment is insured against the misfortunes of transit. If an item arrives with compromised integrity, notify our concierge department immediately.
    </p>
  </PolicyLayout>
);

export const ReturnsPolicy = () => (
  <PolicyLayout title="Aquisition Recourse">
    <h2 className="text-2xl font-serif font-bold text-white mb-6">Return Manifesto</h2>
    <p className="mb-8 font-light">
      Should your acquisition fail to resonate with your personal style, we offer a 7-day recourse window. All items must be returned in their original sanctuary (packaging), unworn and unaltered.
    </p>
    <h3 className="text-xl font-serif font-bold text-white mb-4">Recourse Process</h3>
    <p className="mb-8 font-light">
      Initiate the process by engaging our concierge. Once the item's integrity is verified, we shall issue a credit toward your next legacy acquisition.
    </p>
    <h3 className="text-xl font-serif font-bold text-white mb-4">Exemptions</h3>
    <p className="mb-8 font-light">
      Bespoke or personalized items are considered final acquisitions and are not eligible for recourse except in cases of manufacturing compromise.
    </p>
  </PolicyLayout>
);
