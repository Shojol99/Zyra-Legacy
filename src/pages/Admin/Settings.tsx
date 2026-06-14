import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Globe, 
  CreditCard, 
  Truck, 
  Shield, 
  Bell, 
  Palette, 
  Database,
  Check,
  Save,
  Lock,
  Mail,
  Zap,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';
import { db, storage } from '../../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState<'general' | 'payments' | 'shipping' | 'security'>('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<any>({
    general: {
      siteName: 'Zyra Legacy',
      supportEmail: 'support@zyralegacy.com',
      logo: '',
    },
    payments: {
      cod: true,
      bkash: true,
      nagad: false,
      rocket: false
    },
    shipping: {
      insideDhaka: 70,
      outsideDhaka: 120,
      freeShippingThreshold: 5000,
      isFreeShippingEnabled: false
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    setLoading(true);
    try {
      const docSnap = await getDoc(doc(db, 'settings', 'config'));
      if (docSnap.exists()) {
        setSettings(docSnap.data());
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'config'), {
        ...settings,
        updatedAt: serverTimestamp()
      });
      alert('Parameters preserved successfully.');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to preserve parameters.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSaving(true);
    try {
      const storageRef = ref(storage, `brand/logo_${Date.now()}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setSettings({
        ...settings,
        general: { ...settings.general, logo: url }
      });
    } catch (error) {
      console.error('Logo upload failed:', error);
      alert('Logo upload failed.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">System Parameters</h1>
        <p className="text-slate-500 text-sm">Synchronize the core operational logic of your digital masterpiece.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="space-y-2">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-6 ml-1">Configuration Tiers</h2>
          {[
            { id: 'general', name: 'General Identity', icon: Globe },
            { id: 'payments', name: 'Treasury (Payments)', icon: CreditCard },
            { id: 'shipping', name: 'Logistics Passage', icon: Truck },
            { id: 'security', name: 'Authority System', icon: Shield },
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-2xl transition-all",
                activeTab === tab.id ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "bg-white border border-slate-100 text-slate-600 hover:bg-slate-50"
              )}
            >
              <tab.icon className="w-5 h-5 shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-widest leading-none">{tab.name}</span>
            </button>
          ))}
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm min-h-[600px] flex flex-col">
            <div className="flex-grow space-y-10">
              {activeTab === 'general' && (
                <div className="space-y-10">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                        <Globe className="w-6 h-6" />
                      </div>
                      <div>
                         <h3 className="text-xl font-serif font-bold text-slate-900 tracking-tight">General Identity</h3>
                         <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Brand existence settings</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-50">
                      <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Website Designation</label>
                        <input 
                          type="text" 
                          value={settings.general?.siteName}
                          onChange={e => setSettings({...settings, general: {...settings.general, siteName: e.target.value}})}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-6 text-sm font-bold text-slate-900 outline-none focus:bg-white transition-all shadow-inner" 
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Support Communication (Public)</label>
                        <input 
                          type="email" 
                          value={settings.general?.supportEmail}
                          onChange={e => setSettings({...settings, general: {...settings.general, supportEmail: e.target.value}})}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-6 text-sm font-bold text-slate-900 outline-none focus:bg-white transition-all shadow-inner" 
                        />
                      </div>
                   </div>

                   <div className="space-y-4">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Primary Brand Monolith (Logo)</label>
                      <div className="flex items-center gap-8 p-8 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-inner">
                         <div className="w-24 h-24 bg-white rounded-3xl border border-slate-100 flex items-center justify-center font-serif font-bold text-2xl tracking-tighter text-indigo-900 overflow-hidden">
                            {settings.general?.logo ? (
                              <img src={settings.general.logo} alt="Logo" className="w-full h-full object-contain" />
                            ) : (
                              'ZYRA'
                            )}
                         </div>
                         <div className="space-y-2">
                            <input type="file" id="logoUpload" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                            <label htmlFor="logoUpload" className="cursor-pointer bg-indigo-600 text-white text-[9px] font-bold uppercase tracking-[0.2em] px-6 py-2.5 rounded-full hover:bg-indigo-700 transition-all inline-block">
                              Upload New Emblem
                            </label>
                            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest ml-1">Recommended: 500x500 Transparent PNG</p>
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {activeTab === 'payments' && (
                <div className="space-y-10">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-amber-50 rounded-2xl text-amber-600">
                        <CreditCard className="w-6 h-6" />
                      </div>
                      <div>
                         <h3 className="text-xl font-serif font-bold text-slate-900 tracking-tight">Treasury (Payments)</h3>
                         <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Financial exchange configuration</p>
                      </div>
                   </div>

                   <div className="space-y-4 pt-8 border-t border-slate-50">
                      {[
                        { id: 'cod', name: 'Cash on Delivery', description: 'Enable collection upon delivery' },
                        { id: 'bkash', name: 'bKash Merchant', description: 'Secure integrated mobile wallet' },
                        { id: 'nagad', name: 'Nagad Business', description: 'Institutional digital treasury' },
                        { id: 'rocket', name: 'Rocket Portal', description: 'Alternative financial passage' },
                      ].map((method) => (
                        <div key={method.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                          <div>
                            <p className="text-sm font-bold text-slate-900 tracking-tight">{method.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium tracking-wide">{method.description}</p>
                          </div>
                          <button 
                            onClick={() => setSettings({...settings, payments: {...settings.payments, [method.id]: !settings.payments?.[method.id]}})}
                            className={cn(
                            "w-12 h-6 rounded-full relative transition-all duration-300 shadow-inner border border-slate-200",
                            settings.payments?.[method.id] ? "bg-indigo-600" : "bg-slate-300"
                          )}>
                            <div className={cn(
                              "absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-md",
                              settings.payments?.[method.id] ? "right-1" : "left-1"
                            )} />
                          </button>
                        </div>
                      ))}
                   </div>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="space-y-10">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                        <Truck className="w-6 h-6" />
                      </div>
                      <div>
                         <h3 className="text-xl font-serif font-bold text-slate-900 tracking-tight">Logistics Passage</h3>
                         <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Movement of physical assets</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-50">
                      <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Inside Dhaka Passage (BDT)</label>
                        <input 
                          type="number" 
                          value={settings.shipping?.insideDhaka}
                          onChange={e => setSettings({...settings, shipping: {...settings.shipping, insideDhaka: Number(e.target.value)}})}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-6 text-sm font-bold text-slate-900 outline-none shadow-inner" 
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Outside Dhaka Passage (BDT)</label>
                        <input 
                          type="number" 
                          value={settings.shipping?.outsideDhaka}
                          onChange={e => setSettings({...settings, shipping: {...settings.shipping, outsideDhaka: Number(e.target.value)}})}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-6 text-sm font-bold text-slate-900 outline-none shadow-inner" 
                        />
                      </div>
                   </div>

                   <div className={cn(
                     "p-8 rounded-[2rem] border transition-all duration-500 space-y-4",
                     settings.shipping?.isFreeShippingEnabled ? "bg-indigo-50/50 border-indigo-100" : "bg-slate-50 opacity-60 border-slate-100"
                   )}>
                      <div className="flex items-center gap-3 text-indigo-600">
                         <Zap className={cn("w-5 h-5", settings.shipping?.isFreeShippingEnabled && "fill-indigo-600")} />
                         <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Complementary Logistics (Free)</span>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                         <p className="text-xs text-indigo-900/60 font-medium leading-relaxed max-w-sm">Enable free shipping automatically when order valuation exceeds a specific threshold.</p>
                         <div className="flex items-center gap-4">
                            <input 
                              type="number" 
                              value={settings.shipping?.freeShippingThreshold}
                              onChange={e => setSettings({...settings, shipping: {...settings.shipping, freeShippingThreshold: Number(e.target.value)}})}
                              className="w-24 bg-white border border-indigo-200 rounded-xl py-2 px-4 text-xs font-bold text-indigo-900 outline-none shadow-sm" 
                            />
                            <button 
                              onClick={() => setSettings({...settings, shipping: {...settings.shipping, isFreeShippingEnabled: !settings.shipping?.isFreeShippingEnabled}})}
                              className={cn(
                                "px-6 py-2 rounded-xl text-[8px] font-bold uppercase tracking-widest transition-all",
                                settings.shipping?.isFreeShippingEnabled ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-500"
                              )}
                            >
                              {settings.shipping?.isFreeShippingEnabled ? 'Enabled' : 'Disabled'}
                            </button>
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-10">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-slate-900 rounded-2xl text-white">
                        <Lock className="w-6 h-6" />
                      </div>
                      <div>
                         <h3 className="text-xl font-serif font-bold text-slate-900 tracking-tight">Authority System</h3>
                         <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Access control and security</p>
                      </div>
                   </div>

                   <div className="p-10 border-2 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-4">
                      <Shield className="w-12 h-12 text-slate-200" />
                      <div className="space-y-1">
                        <h4 className="font-bold text-slate-900">Admin Authentication</h4>
                        <p className="text-[10px] text-slate-400 font-medium max-w-xs">Security parameters for administrative access are managed via the primary authority gateway.</p>
                      </div>
                      <button className="bg-slate-50 text-slate-600 border border-slate-100 px-6 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-slate-100 transition-all">Review Protocols</button>
                   </div>
                </div>
              )}
            </div>

            <div className="pt-10 mt-10 border-t border-slate-50 flex items-center justify-between">
               <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                 <Shield className="w-3 h-3" /> Secure Configuration Mode
               </p>
               <button 
                onClick={handleSave}
                disabled={saving}
                className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 disabled:opacity-50"
               >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Parameters
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
