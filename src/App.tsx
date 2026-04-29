/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Menu, 
  X, 
  Home, 
  User, 
  Shield, 
  Info, 
  Settings, 
  Plus, 
  Search, 
  Phone, 
  MessageCircle, 
  MapPin, 
  Trash2, 
  Edit3,
  CheckCircle2,
  XCircle,
  Navigation,
  Lock,
  Globe,
  Moon,
  Sun,
  Bell,
  DollarSign,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  Download
} from 'lucide-react';

const translations: any = {
  en: {
    home: 'Home',
    add: 'Add',
    profile: 'Profile',
    privacy: 'Privacy',
    about: 'About',
    settings: 'Settings',
    search: 'Search local area...',
    available: 'Available',
    booked: 'Booked',
    taken: 'OCCUPIED',
    menu: 'Menu',
    logout: 'Sign Out',
    contact: 'Contact',
    amenities: 'Amenities',
    status: 'Listing Status',
    markBooked: 'Mark as Rented',
    markAvailable: 'Mark as Available',
    edit: 'Edit Listing',
    delete: 'Remove',
    pkr: 'PKR',
    usd: 'USD',
    darkMode: 'Dark Mode',
    notifications: 'Notifications',
    language: 'Language',
    currency: 'Currency',
    all: 'All types',
    homes: 'Residential',
    apartments: 'Apartments',
    shops: 'Commercial',
    rentDreamHome: 'Global Property Marketplace',
    browseDesc: 'Discover premium apartments, houses, and commercial spaces worldwide.',
    addProperty: 'Post a Property',
    searchPlaceholder: 'Search specific address or area...'
  },
  ur: {
    home: 'ہوم',
    add: 'شامل کریں',
    profile: 'پروفائل',
    privacy: 'پرائیویسی',
    about: 'بارے میں',
    settings: 'سیٹنگز',
    search: 'تلاش کریں...',
    available: 'دستیاب',
    booked: 'بُک ہو چکا',
    taken: 'بُک ہے',
    menu: 'مینیو',
    logout: 'لاگ آؤٹ',
    contact: 'رابطہ',
    amenities: 'سہولیات',
    status: 'سٹیٹس',
    markBooked: 'بُک کریں',
    markAvailable: 'دستیاب کریں',
    edit: 'ایڈٹ',
    delete: 'ختم کریں',
    pkr: 'روپیہ',
    usd: 'ڈالر',
    darkMode: 'ڈارک موڈ',
    notifications: 'اطلاعات',
    language: 'زبان',
    currency: 'کرنسی',
    all: 'تمام',
    homes: 'گھر',
    apartments: 'اپارٹمنٹ',
    shops: 'دکان',
    rentDreamHome: 'عالمی پراپرٹی مارکیٹ',
    browseDesc: 'ہزاروں دکانیں، اپارٹمنٹس اور گھر دیکھیں۔',
    addProperty: 'پراپرٹی لگائیں',
    searchPlaceholder: 'کچھ بھی تلاش کریں...'
  }
};
import { motion, AnimatePresence } from 'motion/react';
import { Country, City } from 'country-state-city';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { 
  setDoc,
  doc,
  collection, 
  getCountFromServer,
  serverTimestamp 
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { Property, PropertyType } from './types';
import { propertyService } from './services/propertyService';

// --- UI Components ---

// --- Pages ---

function LoginPage({ onLogin, onClose }: { onLogin: (credentials?: any) => void; onClose: () => void }) {
  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!emailOrPhone || !password) {
      setError('Please fill all fields');
      return;
    }

    if (isRegister && !fullName) {
      setError('Name is required');
      return;
    }

    // Convert phone to email for Firebase
    let finalEmail = emailOrPhone;
    if (/^\d+$/.test(emailOrPhone.replace(/\+/g, ''))) {
      finalEmail = `${emailOrPhone.replace(/\D/g, '')}@mobile.kiraya.app`;
    }

    onLogin({
      type: isRegister ? 'register' : 'login',
      email: finalEmail,
      password,
      fullName
    });
  };
  
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative bg-white p-8 md:p-12 rounded-[3.5rem] shadow-2xl max-w-md w-full text-center space-y-6 overflow-y-auto max-h-[90vh]"
      >
        <button onClick={onClose} className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-full">
          <X size={24} />
        </button>
        <div className="space-y-2">
           <div className="bg-yellow-400 w-20 h-20 rounded-[2rem] mx-auto flex items-center justify-center shadow-2xl shadow-yellow-400/40">
              <Home size={40} className="text-black" />
           </div>
           <h1 className="text-4xl font-black tracking-tighter italic uppercase underline decoration-yellow-400 decoration-8 underline-offset-4">Kiraya</h1>
        </div>
        
        <div className="space-y-4">
           <h2 className="text-2xl font-black tracking-tight">{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
           <p className="text-gray-500 text-sm">Enter your details or use social login to continue.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
           {isRegister && <Input label="Full Name" placeholder="e.g. John Doe" value={fullName} onChange={(e: any) => setFullName(e.target.value)} />}
           <Input label="Email / Phone" placeholder="Enter your email or phone..." value={emailOrPhone} onChange={(e: any) => setEmailOrPhone(e.target.value)} />
           <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={(e: any) => setPassword(e.target.value)} />
           
           {error && <p className="text-red-500 text-xs font-bold uppercase tracking-widest">{error}</p>}
           
           <Button type="submit" className="w-full py-4 font-black uppercase tracking-widest mt-2">
              {isRegister ? 'Sign Up' : 'Sign In'}
           </Button>
        </form>

        <div className="relative">
           <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
           <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-4 text-gray-400 font-bold">OR</span></div>
        </div>

        <Button onClick={() => onLogin()} variant="outline" className="w-full py-4 text-sm active:scale-95 transition-transform">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="google" />
          Continue with Google
        </Button>

        <p className="text-xs font-bold text-gray-500">
          {isRegister ? 'Already have an account?' : 'New user?'} 
          <button onClick={() => setIsRegister(!isRegister)} className="ml-1 text-yellow-600 underline">
            {isRegister ? 'Login' : 'Create Account'}
          </button>
        </p>
        
        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black pt-4 border-t border-gray-50">Mehfooz Access</p>
      </motion.div>
    </div>
  );
}

const Button = ({ children, onClick, variant = 'primary', className = '', ...props }: any) => {
  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer";
  const variants: any = {
    primary: "bg-yellow-400 text-black hover:bg-yellow-500",
    secondary: "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50",
    outline: "border-2 border-yellow-400 text-black hover:bg-yellow-50",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };
  
  return (
    <button onClick={onClick} className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Input = ({ label, ...props }: any) => (
  <div className="flex flex-col gap-1 w-full">
    {label && <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>}
    <input 
      className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all font-sans" 
      {...props} 
    />
  </div>
);

const Select = ({ label, children, ...props }: any) => (
  <div className="flex flex-col gap-1 w-full">
    {label && <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>}
    <select 
      className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all font-sans cursor-pointer" 
      {...props} 
    >
      {children}
    </select>
  </div>
);

// --- Pages ---

function ProfilePage({ properties, onEdit, onDelete, user, onLogout, onToggleAvailability, t, onImageOpen }: any) {
  return (
    <div className="space-y-8 pb-20">
      <div className="bg-yellow-400 p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-10 p-8 opacity-10">
          <Settings size={160} />
        </div>
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 rounded-[2rem] bg-white p-2 shadow-lg border-2 border-white">
              <img src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.displayName}`} alt="profile" className="w-full h-full rounded-2xl" referrerPolicy="no-referrer" />
            </div>
            <div className="text-center md:text-left space-y-1">
              <h2 className="text-4xl font-black tracking-tighter text-black">{user.displayName}</h2>
              <p className="text-black/60 font-semibold uppercase tracking-widest text-sm">{user.email}</p>
              <div className="flex items-center justify-center md:justify-start gap-2 pt-2">
                <span className="bg-black/10 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <CheckCircle2 size={12} /> Verified Seller
                </span>
              </div>
            </div>
          </div>
          <Button variant="secondary" onClick={onLogout} className="bg-white/20 border-black/10 hover:bg-white/40 text-black">
            Logout
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-2xl font-black tracking-tight">Your <span className="text-yellow-600">Postings</span></h3>
            <p className="text-gray-500 text-sm">Manage your properties and active listings.</p>
          </div>
          <div className="bg-gray-100 px-4 py-2 rounded-full text-sm font-bold text-gray-500">
            {properties.length} Total
          </div>
        </div>

        {properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p: Property) => (
              <PropertyCard 
                key={p.id} 
                property={p} 
                isProfile 
                onEdit={() => onEdit(p)} 
                onDelete={() => onDelete(p.id)} 
                onToggleAvailability={onToggleAvailability}
                t={t}
                onImageOpen={onImageOpen}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-20 text-center space-y-4">
             <p className="text-gray-500 font-medium">You haven't posted any properties yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StaticPage({ title, content }: any) {
  return (
    <div className="max-w-2xl mx-auto py-12 text-center space-y-6">
      <h1 className="text-4xl font-black tracking-tight">{title}</h1>
      <div className="h-1 w-20 bg-yellow-400 mx-auto rounded-full" />
      <p className="text-lg text-gray-600 leading-relaxed">{content}</p>
      <Button variant="secondary" onClick={() => window.location.reload()}>Back to Home</Button>
    </div>
  );
}

function InstallAppModal({ onClose }: any) {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative bg-white p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl max-w-lg w-full space-y-8"
      >
        <button onClick={onClose} className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-full">
          <X size={24} />
        </button>

        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-yellow-400 rounded-3xl mx-auto flex items-center justify-center shadow-xl shadow-yellow-400/20">
            <Smartphone size={40} className="text-black" />
          </div>
          <h2 className="text-3xl font-black tracking-tighter uppercase italic">Install Mobile App</h2>
          <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest leading-relaxed">
            No need for a bulky APK! You can install our High-Speed Web App directly from your browser.
          </p>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 flex items-start gap-4">
            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center flex-shrink-0 font-black text-yellow-500">1</div>
            <div>
              <p className="font-black text-sm uppercase tracking-tight mb-1">Android Users (Chrome)</p>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">Click the <span className="font-bold text-black font-mono">⋮ (3 dots)</span> at the top right and select <span className="text-yellow-600 font-bold italic">"Install App"</span> or <span className="text-yellow-600 font-bold italic">"Add to Home Screen"</span>.</p>
            </div>
          </div>

          <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 flex items-start gap-4">
            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center flex-shrink-0 font-black text-yellow-500">2</div>
            <div>
              <p className="font-black text-sm uppercase tracking-tight mb-1">iPhone Users (Safari)</p>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">Tap the <span className="font-bold text-black italic">Share</span> button and select <span className="text-yellow-600 font-bold italic">"Add to Home Screen"</span> from the list.</p>
            </div>
          </div>
        </div>

        <Button onClick={onClose} className="w-full py-5 text-lg font-black italic tracking-tighter">GOT IT!</Button>
      </motion.div>
    </div>
  );
}

function ImageGalleryModal({ images, activeIndex, onClose }: any) {
  const [current, setCurrent] = useState(activeIndex);
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-black/98"
    >
      <button onClick={onClose} className="absolute top-4 right-4 md:top-10 md:right-10 p-4 text-white hover:bg-white/10 rounded-full z-20 transition-colors">
        <X size={32} className="md:w-10 md:h-10" />
      </button>
      
      <div className="w-full flex-1 flex items-center justify-center p-4 relative group">
        <AnimatePresence mode="wait">
          <motion.img 
            key={current}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            src={images[current]} 
            className="max-w-full max-h-full sm:max-h-[80vh] object-contain shadow-[0_0_100px_rgba(255,255,255,0.05)] rounded-lg md:rounded-2xl"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>

        {images.length > 1 && (
          <>
            <button 
              onClick={() => setCurrent((prev: number) => (prev > 0 ? prev - 1 : images.length - 1))}
              className="absolute left-2 md:left-10 top-1/2 -translate-y-1/2 p-4 md:p-6 text-white hover:bg-white/10 rounded-full transition-all group/btn"
            >
              <ChevronLeft size={40} className="md:w-[60px] md:h-[60px] stroke-[3] group-hover/btn:scale-110 transition-transform" />
            </button>
            <button 
              onClick={() => setCurrent((prev: number) => (prev < images.length - 1 ? prev + 1 : 0))}
              className="absolute right-2 md:right-10 top-1/2 -translate-y-1/2 p-4 md:p-6 text-white hover:bg-white/10 rounded-full transition-all group/btn"
            >
              <ChevronRight size={40} className="md:w-[60px] md:h-[60px] stroke-[3] group-hover/btn:scale-110 transition-transform" />
            </button>
          </>
        )}
      </div>

      <div className="w-full bg-black/40 backdrop-blur-xl p-4 md:p-8 flex items-center justify-center gap-2 md:gap-4 overflow-x-auto no-scrollbar">
        {images.map((img: string, i: number) => (
          <button 
            key={i} 
            onClick={() => setCurrent(i)}
            className={`flex-shrink-0 w-16 h-16 md:w-24 md:h-24 rounded-xl md:rounded-2xl overflow-hidden border-2 md:border-4 transition-all duration-300 ${current === i ? 'border-yellow-400 scale-110 shadow-2xl shadow-yellow-400/20' : 'border-transparent opacity-40 hover:opacity-100'}`}
          >
            <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </button>
        ))}
      </div>
    </motion.div>
  );
}

// --- Cards & Modals ---

function PropertyCard({ property: p, isProfile, onEdit, onDelete, onAction, onToggleAvailability, t, onImageOpen }: any) {
  const [currentImg, setCurrentImg] = useState(0);
  const images = (p.imageUrls && p.imageUrls.length > 0) ? p.imageUrls : [p.imageUrl || 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=800'];

  const handleAction = (e: React.MouseEvent, type: string) => {
    if (!onAction(type)) {
      e.preventDefault();
    }
  };

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${p.address}, ${p.area}, ${p.city}, ${p.country}`)}`;

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="group bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl transition-all overflow-hidden flex flex-col relative"
    >
      <div 
        className="relative h-48 md:h-72 overflow-hidden cursor-zoom-in"
        onClick={() => onImageOpen && onImageOpen(images, currentImg)}
      >
        <img 
          src={images[currentImg]} 
          alt={p.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
          <span className="px-5 py-2 bg-yellow-400 text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-2xl">
            {p.type}
          </span>
          <span className={`px-5 py-2 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-2xl ${p.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}>
            {p.isAvailable ? t.available : t.booked}
          </span>
        </div>

        {p.isAvailable === false && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px] z-[5]">
            <div className="bg-red-600 text-white px-8 py-4 rounded-[2rem] font-black text-2xl uppercase tracking-tighter shadow-2xl rotate-[-10deg]">
              {t.taken}
            </div>
          </div>
        )}

        {images.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, idx) => (
              <button 
                key={idx} 
                onClick={(e) => { e.stopPropagation(); setCurrentImg(idx); }}
                className={`w-2 h-2 rounded-full transition-all ${idx === currentImg ? 'bg-yellow-400 w-5' : 'bg-white/60'}`}
              />
            ))}
          </div>
        )}

        <div className="absolute top-6 right-6">
          <a 
            href={googleMapsUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center text-red-500 shadow-xl hover:bg-red-500 hover:text-white transition-all active:scale-90"
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <MapPin size={28} fill="currentColor" fillOpacity={0.2} />
            </motion.div>
          </a>
        </div>
      </div>

      <div className="p-5 md:p-8 space-y-4 md:space-y-6 flex-1 flex flex-col">
        <div className="space-y-3 md:space-y-4">
          <div className="space-y-1">
             <span className="text-[10px] md:text-sm font-black text-[#8B4513] uppercase tracking-[0.2em]">{p.area}</span>
             <h4 className="text-2xl md:text-5xl font-black tracking-tighter text-green-600 leading-none group-hover:text-green-700 transition-colors uppercase">{p.city}</h4>
          </div>
          
          <div className="space-y-1 pt-2 border-t border-gray-50">
             <p className="text-sm md:text-base font-bold text-red-500 leading-tight line-clamp-2">{p.address}</p>
             <h3 className="text-base md:text-xl font-bold tracking-tight text-gray-800 pt-1 md:pt-2">{p.title}</h3>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 md:gap-2 pt-1 md:pt-2">
          <span className="px-3 md:px-4 py-1.5 md:py-2 bg-gray-50 text-[10px] md:text-[11px] font-black uppercase tracking-widest rounded-xl md:rounded-2xl border border-gray-100">{p.rooms} Rooms</span>
          <span className="px-3 md:px-4 py-1.5 md:py-2 bg-gray-50 text-[10px] md:text-[11px] font-black uppercase tracking-widest rounded-xl md:rounded-2xl border border-gray-100">{p.bathrooms} Baths</span>
          <span className="px-3 md:px-4 py-1.5 md:py-2 bg-gray-50 text-[10px] md:text-[11px] font-black uppercase tracking-widest rounded-xl md:rounded-2xl border border-gray-100">{p.stories} Story</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge active={p.hasGas} label="Gas" />
          <Badge active={p.hasElectricity} label="Electric" />
        </div>

        <div className="flex items-center justify-between pt-4 md:pt-6 border-t border-gray-50 mt-auto">
           <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{p.language}</span>
           <div className="text-right">
              <span className="block text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">Rent Per Month</span>
              <span className="text-xl md:text-2xl font-black text-yellow-600">{p.currency} {p.price || 'Free'}</span>
           </div>
        </div>


        <div className="flex-1" />

        <div className="pt-4 border-t border-gray-50">
          {!isProfile ? (
            <div className="grid grid-cols-2 gap-3">
              <a href={`tel:${p.phone}`} onClick={(e) => handleAction(e, 'call')} className="flex-1">
                <Button variant="primary" className="w-full text-xs font-black uppercase tracking-widest py-3">
                  <Phone size={14} /> Call
                </Button>
              </a>
              <a href={`https://wa.me/${p.whatsapp.replace(/\+/g, '')}`} onClick={(e) => handleAction(e, 'whatsapp')} target="_blank" rel="noopener noreferrer" className="flex-1 text-center">
                <Button variant="outline" className="w-full text-xs font-black uppercase tracking-widest py-3 hover:bg-green-50 border-green-200 text-green-700">
                  <MessageCircle size={14} /> WhatsApp
                </Button>
              </a>
            </div>
          ) : (
            <div className="space-y-3">
              <Button 
                onClick={() => onToggleAvailability(p.id, !p.isAvailable)} 
                variant={p.isAvailable ? "secondary" : "primary"}
                className={`w-full py-3 text-xs font-black uppercase tracking-widest ${p.isAvailable ? 'bg-red-50 text-red-600 border-red-200' : 'bg-green-400 text-black'}`}
              >
                {p.isAvailable ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
                {p.isAvailable ? t.markBooked : t.markAvailable}
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button onClick={onEdit} variant="outline" className="w-full py-3 text-xs font-black uppercase tracking-widest">
                  <Edit3 size={14} /> {t.edit}
                </Button>
                <Button onClick={onDelete} variant="danger" className="w-full py-3 text-xs font-black uppercase tracking-widest">
                  <Trash2 size={14} /> {t.delete}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

const Badge = ({ active, label }: any) => (
  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
    active ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-500 border-red-100'
  }`}>
    {active ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
    {label}
  </div>
);

function LocationSelector({ selectedCountry, selectedCity, onCountryChange, onCityChange, onLanguageChange }: any) {
  const countries = Country.getAllCountries();
  const cities = selectedCountry ? City.getCitiesOfCountry(selectedCountry) : [];

  return (
    <>
      <Select 
        label="Country" 
        value={selectedCountry} 
        onChange={(e: any) => {
          const val = e.target.value;
          onCountryChange(val);
          // Auto-Language logic: If Pakistan is selected, switch to Urdu. For others, default to English.
          if (val === 'PK') {
            onLanguageChange && onLanguageChange('ur');
          } else {
            onLanguageChange && onLanguageChange('en');
          }
        }}
      >
        <option value="">Select Country</option>
        {countries.map(c => <option key={c.isoCode} value={c.isoCode}>{c.name}</option>)}
      </Select>
      <Select 
        label="City" 
        value={selectedCity} 
        onChange={(e: any) => onCityChange(e.target.value)}
        disabled={!selectedCountry}
      >
        <option value="">All Cities</option>
        {cities?.map((c, i) => <option key={i} value={c.name}>{c.name}</option>)}
      </Select>
    </>
  );
}

function PropertyModal({ onClose, onSave, editingProperty }: any) {
  const [formData, setFormData] = useState({
    title: editingProperty?.title || '',
    type: (editingProperty?.type || 'Home') as PropertyType,
    stories: (editingProperty?.stories || 'Single') as any,
    rooms: editingProperty?.rooms || '1',
    bathrooms: editingProperty?.bathrooms || '1',
    country: editingProperty?.country || '',
    city: editingProperty?.city || '',
    area: editingProperty?.area || '',
    address: editingProperty?.address || '',
    hasGas: editingProperty?.hasGas ?? true,
    hasElectricity: editingProperty?.hasElectricity ?? true,
    phone: editingProperty?.phone || '',
    whatsapp: editingProperty?.whatsapp || '',
    currency: editingProperty?.currency || '',
    language: editingProperty?.language || '',
    imageUrls: editingProperty?.imageUrls || [] as string[],
    isAvailable: editingProperty?.isAvailable ?? true,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 500) { // Limit to 0.5MB for stability on some networks
        alert("Image bohot badi hai, meharbani karke choti image (under 500kb) use karein.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImages = [...formData.imageUrls];
        newImages[index] = reader.result as string;
        setFormData({ ...formData, imageUrls: newImages });
      };
      reader.readAsDataURL(file);
    }
  };

  const languageMap: Record<string, string> = {
    'PK': 'Urdu',
    'US': 'English',
    'GB': 'English',
    'IN': 'Hindi',
    'AE': 'Arabic',
    'SA': 'Arabic',
    'DE': 'German',
    'FR': 'French',
    'CA': 'English',
    'AU': 'English',
  };

  const handleCountryChange = (isoCode: string) => {
    const countryData = Country.getCountryByCode(isoCode);
    const phoneCode = countryData?.phonecode ? `+${countryData.phonecode}` : '';
    const currency = countryData?.currency || '';
    const language = languageMap[isoCode] || 'English';

    setFormData({
      ...formData,
      country: isoCode,
      city: '',
      phone: phoneCode,
      whatsapp: phoneCode,
      currency: currency,
      language: language
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.country || !formData.city || !formData.phone) {
      alert("Please fill all required fields");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Property Modal Content */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="relative bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h3 className="text-2xl font-black tracking-tight">{editingProperty ? 'Edit' : 'Add'} <span className="text-yellow-500">Property</span></h3>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Enter details to list your unit</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Property Title" required value={formData.title} onChange={(e: any) => setFormData({...formData, title: e.target.value})} />
            <Select label="Property Type" value={formData.type} onChange={(e: any) => setFormData({...formData, type: e.target.value as PropertyType})}>
              <option value="Home">Home</option>
              <option value="Shop">Shop</option>
              <option value="Apartment">Apartment</option>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Select label="Structure" value={formData.stories} onChange={(e: any) => setFormData({...formData, stories: e.target.value})}>
              <option value="Single">Single Story</option>
              <option value="Double">Double Story</option>
            </Select>
            <Input label="Rooms" type="number" value={formData.rooms} onChange={(e: any) => setFormData({...formData, rooms: e.target.value})} />
            <Input label="Bathrooms" type="number" value={formData.bathrooms} onChange={(e: any) => setFormData({...formData, bathrooms: e.target.value})} />
          </div>

          <div className="space-y-4">
            <p className="text-[10px] font-black text-yellow-600 uppercase tracking-[0.2em]">Upload Property Photos (Max 3)</p>
            <div className="grid grid-cols-3 gap-4">
              {[0, 1, 2].map((idx) => (
                <label key={idx} className="relative aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] flex flex-col items-center justify-center cursor-pointer overflow-hidden group hover:border-yellow-400 transition-all">
                  {formData.imageUrls[idx] ? (
                    <>
                      <img src={formData.imageUrls[idx]} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Plus size={24} className="text-white rotate-45" />
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-1">
                      <Plus size={20} className="mx-auto text-gray-300 group-hover:text-yellow-400 transition-colors" />
                      <span className="text-[7px] font-black text-gray-400 uppercase mt-1 block">Photo {idx + 1}</span>
                    </div>
                  )}
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, idx)} />
                </label>
              ))}
            </div>
            <p className="text-[10px] text-gray-400 font-bold">Tip: High quality images lead to faster responses.</p>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] font-black text-yellow-600 uppercase tracking-[0.2em]">Location Details</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LocationSelector 
                selectedCountry={formData.country}
                selectedCity={formData.city}
                onCountryChange={handleCountryChange}
                onCityChange={(val: string) => setFormData({...formData, city: val})}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="Area Name" required value={formData.area} onChange={(e: any) => setFormData({...formData, area: e.target.value})} />
              <Input label="Currency" value={formData.currency} onChange={(e: any) => setFormData({...formData, currency: e.target.value})} />
              <Input label="Language" value={formData.language} onChange={(e: any) => setFormData({...formData, language: e.target.value})} />
            </div>
            <Input label="Address" required value={formData.address} onChange={(e: any) => setFormData({...formData, address: e.target.value})} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
               <p className="text-[10px] font-black text-yellow-600 uppercase tracking-[0.2em]">Amenities</p>
               <div className="flex gap-4">
                 <label className="flex items-center gap-2 cursor-pointer">
                   <input type="checkbox" checked={formData.hasGas} onChange={(e) => setFormData({...formData, hasGas: e.target.checked})} className="w-5 h-5 text-yellow-400 border-gray-300 rounded" />
                   <span className="text-sm font-bold">Gas</span>
                 </label>
                 <label className="flex items-center gap-2 cursor-pointer">
                   <input type="checkbox" checked={formData.hasElectricity} onChange={(e) => setFormData({...formData, hasElectricity: e.target.checked})} className="w-5 h-5 text-yellow-400 border-gray-300 rounded" />
                   <span className="text-sm font-bold">Electricity</span>
                 </label>
               </div>
            </div>
            <div className="space-y-4">
               <p className="text-[10px] font-black text-yellow-600 uppercase tracking-[0.2em]">Listing Status</p>
               <div className="flex gap-4">
                 <label className="flex items-center gap-2 cursor-pointer">
                   <input type="checkbox" checked={formData.isAvailable} onChange={(e) => setFormData({...formData, isAvailable: e.target.checked})} className="w-5 h-5 text-green-500 border-gray-300 rounded" />
                   <span className={`text-sm font-black uppercase ${formData.isAvailable ? 'text-green-600' : 'text-red-500'}`}>
                     {formData.isAvailable ? 'Available' : 'Booked'}
                   </span>
                 </label>
               </div>
            </div>
          </div>

          <div className="space-y-4">
             <p className="text-[10px] font-black text-yellow-600 uppercase tracking-[0.2em]">Contact</p>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Phone" required value={formData.phone} onChange={(e: any) => setFormData({...formData, phone: e.target.value})} />
                <Input label="WhatsApp" required value={formData.whatsapp} onChange={(e: any) => setFormData({...formData, whatsapp: e.target.value})} />
             </div>
          </div>

          <div className="sticky bottom-0 bg-white pt-4 pb-6 border-t border-gray-50 flex gap-4">
            <Button variant="secondary" onClick={onClose} type="button" className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1">Save Property</Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// --- Main Application ---

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState({ country: '', city: '', area: '' });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeGallery, setActiveGallery] = useState<{images: string[], index: number} | null>(null);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  // Admin logic
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [adminStats, setAdminStats] = useState({ users: 0, posts: 0 });
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminCodeInput, setAdminCodeInput] = useState('');
  const [adminError, setAdminError] = useState('');

  const handleAdminVerify = async () => {
    if (adminCodeInput === 'Fast723424') {
      setIsAdminAuthenticated(true);
      setAdminError('');
      // Fetch stats
      try {
        const usersColl = collection(db, 'users');
        const propertiesColl = collection(db, 'properties');
        const [userSnap, propSnap] = await Promise.all([
          getCountFromServer(usersColl),
          getCountFromServer(propertiesColl)
        ]);
        setAdminStats({
          users: userSnap.data().count,
          posts: propSnap.data().count
        });
      } catch (err) {
        console.error("Stats fetch failed", err);
      }
    } else {
      setAdminError('Invalid Admin Code! Please try again.');
    }
  };

  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [lang, setLang] = useState<'en' | 'ur'>('en');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [currency, setCurrency] = useState('PKR');

  const t = translations[lang];

  useEffect(() => {
    // Sync Dark Mode with body class
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setIsLoading(false);
    });

    const unsubscribeProps = propertyService.subscribeProperties((newProps) => {
      setProperties(newProps);
      setConnectionError(null);
    });

    propertyService.testConnection().catch((err) => {
      console.error("Test connection failed", err);
      // We don't necessarily block UI on test failure
    });

    // Catch the unhandled errors from propertyService.handleFirestoreError
    const handleGlobalError = (event: ErrorEvent) => {
      if (event.message.includes('Missing or insufficient permissions')) {
        setConnectionError("Firestore Permission Denied. Please ensure you have created a 'Firestore Database' in your Firebase Console for this project.");
      }
    };

    window.addEventListener('error', handleGlobalError);

    return () => {
      unsubscribeAuth();
      unsubscribeProps();
      window.removeEventListener('error', handleGlobalError);
    };
  }, []);

  const filteredProperties = useMemo(() => {
    const query = searchQuery.area.toLowerCase();
    
    // 1. Filter results
    const filtered = properties.filter(p => {
      const matchCountry = !searchQuery.country || p.country === searchQuery.country;
      const matchCity = !searchQuery.city || p.city === searchQuery.city;
      
      // If there's a search query, it should match ANY of these fields
      const matchGlobal = !query || (
        p.area.toLowerCase().includes(query) ||
        p.city.toLowerCase().includes(query) ||
        p.country.toLowerCase().includes(query) ||
        p.title.toLowerCase().includes(query) ||
        p.address.toLowerCase().includes(query)
      );

      return matchCountry && matchCity && matchGlobal;
    });

    // 2. Sort by relevance (Exact match first, then starts with, then contains)
    if (!query) return filtered;

    return [...filtered].sort((a, b) => {
      const getScore = (p: Property) => {
        let score = 0;
        const cityLower = p.city.toLowerCase();
        const areaLower = p.area.toLowerCase();
        const titleLower = p.title.toLowerCase();

        // High priority: Exact matches
        if (cityLower === query || areaLower === query) score += 100;
        
        // Medium priority: Starts with
        if (cityLower.startsWith(query)) score += 50;
        if (areaLower.startsWith(query)) score += 40;
        if (titleLower.startsWith(query)) score += 30;

        // Low priority: Includes
        if (cityLower.includes(query)) score += 10;
        if (areaLower.includes(query)) score += 5;
        
        return score;
      };

      return getScore(b) - getScore(a);
    });
  }, [properties, searchQuery]);

  const requireAuth = (callback: () => void) => {
    if (user) {
      callback();
      return true;
    } else {
      setIsLoginModalOpen(true);
      return false;
    }
  };

  const handleLogin = async (credentials?: any) => {
    try {
      let userRes;
      if (credentials) {
        if (credentials.type === 'register') {
          userRes = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
          await updateProfile(userRes.user, { displayName: credentials.fullName });
        } else {
          userRes = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
        }
      } else {
        const provider = new GoogleAuthProvider();
        userRes = await signInWithPopup(auth, provider);
      }

      // Save user to Firestore for counts
      if (userRes?.user) {
        await setDoc(doc(db, 'users', userRes.user.uid), {
          uid: userRes.user.uid,
          email: userRes.user.email,
          displayName: userRes.user.displayName,
          photoURL: userRes.user.photoURL,
          lastLogin: serverTimestamp()
        }, { merge: true });
      }

      setIsLoginModalOpen(false);
    } catch (error: any) {
      console.error("Login failed", error);
      alert(error.message || "Login failed");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentPage('home');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const navItems = [
    { id: 'home', icon: Home, label: t.home },
    { id: 'profile', icon: User, label: t.profile, protected: true },
    { id: 'privacy', icon: Shield, label: t.privacy },
    { id: 'about', icon: Info, label: t.about },
    { id: 'settings', icon: Settings, label: t.settings },
  ];

  const handleSaveProperty = async (propData: any) => {
    if (!user) return;
    
    try {
      if (editingProperty) {
        await propertyService.updateProperty(editingProperty.id, propData);
      } else {
        const docId = await propertyService.saveProperty({
          ...propData,
          ownerEmail: user.email || '',
          ownerUid: user.uid,
          isAvailable: propData.isAvailable ?? true,
          imageUrls: propData.imageUrls?.length > 0 ? propData.imageUrls : [`https://picsum.photos/seed/${Math.random()}/800/600`]
        });
        if (!docId) throw new Error("Could not save property to database.");
      }
      setIsAddModalOpen(false);
      setEditingProperty(null);
    } catch (error: any) {
      console.error("Save failed", error);
      alert("MASLA: Post save nahi hui. Meharbani karke internet check karein ya dobara koshish karein. Error: " + error.message);
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      await propertyService.deleteProperty(deleteId);
      setDeleteId(null);
    }
  };

  const handleToggleAvailability = async (id: string, isAvailable: boolean) => {
    await propertyService.updateProperty(id, { isAvailable });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-400">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-12 h-12 border-4 border-black border-t-transparent rounded-full" />
      </div>
    );
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'profile':
        return user ? (
          <ProfilePage 
            properties={properties.filter(p => p.ownerUid === user.uid)} 
            onEdit={(p: any) => { setEditingProperty(p); setIsAddModalOpen(true); }} 
            onDelete={setDeleteId} 
            user={user} 
            onLogout={handleLogout}
            onToggleAvailability={handleToggleAvailability}
            t={t}
            onImageOpen={(images: string[], index: number) => setActiveGallery({ images, index })}
          />
        ) : null;
      case 'privacy':
        return (
          <div className="max-w-4xl mx-auto py-12 px-6">
            <h1 className="text-4xl font-black mb-8 italic uppercase tracking-tighter">Privacy Policy</h1>
            <div className="space-y-6 text-gray-600 leading-relaxed font-medium">
              <section>
                <h2 className="text-xl font-black text-black uppercase mb-2">1. Data Collection</h2>
                <p>We collect minimal data required for property listing: your email, name (via Google Auth), and contact details provided in listings. This app adheres to international data protection standards and Pakistani digital privacy norms.</p>
              </section>
              <section>
                <h2 className="text-xl font-black text-black uppercase mb-2">2. Local & Global Compliance</h2>
                <p>Your data is processed securely via Google Firebase. We do not sell your personal information to third parties. For international users, we respect standard data rights regarding access and deletion.</p>
              </section>
              <section>
                <h2 className="text-xl font-black text-black uppercase mb-2">3. Property Content</h2>
                <p>Users are responsible for the accuracy of their listings. RENTAL HUB acts as a platform to connect owners and tenants.</p>
              </section>
              <section>
                <h2 className="text-xl font-black text-black uppercase mb-2">4. Support</h2>
                <p>For any privacy concerns or data removal requests, contact us at <span className="text-black font-bold">pkr723424@gmail.com</span>.</p>
              </section>
            </div>
          </div>
        );
      case 'about':
        return (
          <div className="max-w-4xl mx-auto py-12 px-4 md:px-6 text-center space-y-12">
            <div className="bg-yellow-400 p-8 md:p-12 rounded-[2rem] md:rounded-[3.5rem] shadow-2xl">
              <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-4">RENTAL HUB</h1>
              <p className="text-lg md:text-xl font-bold opacity-80 uppercase tracking-widest">Global Property Solutions</p>
            </div>
            <div className="space-y-8 text-base md:text-lg font-medium text-gray-600">
              <p>RENTAL HUB is a premier digital marketplace designed to simplify property renting and listing. Whether you are searching for a cozy apartment, a spacious house, or a commercial shop, we bring everything to your fingertips.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                  <p className="text-4xl mb-2">🏠</p>
                  <p className="font-black uppercase text-xs">Easy Listing</p>
                </div>
                <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                  <p className="text-4xl mb-2">📍</p>
                  <p className="font-black uppercase text-xs">Global Search</p>
                </div>
                <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                  <p className="text-4xl mb-2">💬</p>
                  <p className="font-black uppercase text-xs">Direct Contact</p>
                </div>
              </div>
              <p>Contact us for partnerships: <span className="text-black font-black">pkr723424@gmail.com</span></p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="max-w-4xl mx-auto py-12 px-6">
            <h1 className="text-4xl font-black mb-8 italic uppercase tracking-tighter">{t.settings}</h1>
            <div className="space-y-4">
              {[
                { 
                  label: t.darkMode, 
                  desc: 'Enable black/dark theme for your eyes', 
                  value: isDarkMode ? 'Enabled' : 'Disabled', 
                  icon: <Moon size={20} />,
                  action: () => setIsDarkMode(!isDarkMode)
                },
                { 
                  label: t.notifications, 
                  desc: 'Get alerts for new properties', 
                  value: isNotificationsEnabled ? 'Enabled' : 'Disabled', 
                  icon: <Bell size={20} />,
                  action: () => setIsNotificationsEnabled(!isNotificationsEnabled)
                },
                { 
                  label: t.language, 
                  desc: 'Change application language', 
                  value: lang === 'en' ? 'English' : 'Urdu', 
                  icon: <Globe size={20} />,
                  action: () => setLang(lang === 'en' ? 'ur' : 'en')
                },
                { 
                  label: t.currency, 
                  desc: 'Switch between global currencies', 
                  value: currency, 
                  icon: <DollarSign size={20} />,
                  action: () => setCurrency(currency === 'PKR' ? 'USD' : 'PKR')
                },
              ].map((s, i) => (
                <div 
                  key={i} 
                  onClick={s.action}
                  className="flex items-center justify-between p-8 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 hover:border-yellow-400 transition-all cursor-pointer group shadow-sm active:scale-[0.98]"
                >
                  <div className="flex items-center gap-6">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl text-gray-500 group-hover:text-yellow-500 transition-colors">
                      {s.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-black uppercase text-black dark:text-white">{s.label}</h3>
                      <p className="text-gray-400 font-bold text-sm tracking-tight">{s.desc}</p>
                    </div>
                  </div>
                  <span className={`px-6 py-2 rounded-full text-xs font-black uppercase border transition-colors ${s.value.includes('Enabled') || s.value === 'English' || s.value === 'PKR' ? 'bg-yellow-400 border-yellow-400 text-black' : 'bg-white text-black border-gray-100'}`}>
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                   <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">{t.rentDreamHome}</h1>
                   <p className="text-gray-500 font-medium mt-2 text-sm md:text-base">{t.browseDesc}</p>
                </div>
                <Button onClick={() => requireAuth(() => setIsAddModalOpen(true))} className="w-full md:w-auto px-8 py-5 shadow-xl shadow-yellow-400/30 font-black italic uppercase tracking-tighter">
                  <Plus size={20} /> {t.addProperty}
                </Button>
             </div>

             <div className="bg-white p-4 md:p-6 rounded-[2rem] border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
                <LocationSelector 
                  selectedCountry={searchQuery.country}
                  selectedCity={searchQuery.city}
                  onCountryChange={(val: any) => setSearchQuery({...searchQuery, country: val, city: ''})}
                  onCityChange={(val: any) => setSearchQuery({...searchQuery, city: val})}
                  onLanguageChange={(l: string) => setLang(l)}
                />
                <Input 
                  label={t.search}
                  placeholder={t.searchPlaceholder}
                  value={searchQuery.area}
                  onChange={(e: any) => setSearchQuery({...searchQuery, area: e.target.value})}
                />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
               {filteredProperties.map(p => (
                 <PropertyCard 
                   key={p.id} 
                   property={p} 
                   onAction={(type: string) => requireAuth(() => {})} 
                   onToggleAvailability={handleToggleAvailability}
                   t={t}
                   onImageOpen={(images: string[], index: number) => setActiveGallery({ images, index })}
                 />
               ))}
               {filteredProperties.length === 0 && (
                 <div className="col-span-full py-20 text-center text-gray-400">
                    <Search size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="text-lg font-bold">No properties match your search</p>
                 </div>
               )}
             </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans selection:bg-yellow-200">
      {connectionError && (
        <div className="bg-red-500 text-white px-6 py-2 text-center text-xs font-bold uppercase tracking-widest sticky top-0 z-[100] animate-pulse">
          {connectionError}
        </div>
      )}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100 px-2 md:px-6 py-2 md:py-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5 md:gap-4">
          <button onClick={() => setIsDrawerOpen(true)} className="p-1.5 hover:bg-gray-100 rounded-xl transition-all"><Menu size={18} className="md:w-6 md:h-6" /></button>
          <div className="flex items-center gap-1 md:gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
             <div className="bg-yellow-400 p-1 md:p-2 rounded-lg shadow-sm"><Home size={16} className="md:w-5 md:h-5" /></div>
             <div className="flex flex-col md:flex-row md:items-center leading-tight md:leading-none">
                <span className="font-black text-base md:text-2xl tracking-tighter uppercase italic text-black">Rental</span>
                <span className="font-black text-base md:text-2xl tracking-tighter uppercase italic text-yellow-500 md:ml-1">Hub</span>
             </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 md:gap-4">
           <button 
             onClick={() => setIsInstallModalOpen(true)}
             className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-yellow-400 hover:text-black rounded-xl transition-all active:scale-95 border border-gray-100 dark:border-gray-800 shadow-sm"
             title="Download App"
           >
             <Smartphone size={16} className="md:w-5 md:h-5" />
           </button>

           <button 
             onClick={() => setLang(lang === 'en' ? 'ur' : 'en')}
             className="flex items-center justify-center w-8 h-8 md:w-auto md:px-4 md:py-2 hover:bg-gray-100 rounded-xl transition-all border border-gray-100 group"
           >
             <Globe size={16} className="text-gray-400 group-hover:text-yellow-500" />
             <span className="font-black text-[10px] uppercase tracking-widest hidden md:inline ml-2">
               {lang === 'en' ? 'Urdu' : 'English'}
             </span>
           </button>
           {user ? (
            <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
               <div className="hidden md:block text-right">
                  <p className="text-xs font-bold">{user.displayName}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Online</p>
               </div>
               <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-yellow-400 cursor-pointer overflow-hidden bg-gray-100 shadow-sm ring-2 ring-yellow-400/20" onClick={() => setCurrentPage('profile')}>
                 <img src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.displayName}`} alt="avatar" className="w-full h-full object-cover" />
               </div>
            </div>
           ) : (
             <Button onClick={() => setIsLoginModalOpen(true)} variant="outline" className="text-[10px] md:text-xs font-black uppercase tracking-widest px-3 md:px-6 py-2">
                Login
             </Button>
           )}
        </div>
      </nav>

      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div 
              initial={{opacity:0}} 
              animate={{opacity:1}} 
              exit={{opacity:0}} 
              onClick={() => setIsDrawerOpen(false)} 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[50]" 
            />
            <motion.div 
              initial={{x:'-100%'}} 
              animate={{x:0}} 
              exit={{x:'-100%'}} 
              transition={{type:'spring', damping:35, stiffness:400}} 
              className="fixed inset-y-0 left-0 w-80 bg-white z-[60] shadow-2xl flex flex-col p-6"
            >
               <div className="flex items-center justify-between mb-8">
                  <span className="font-black text-2xl tracking-tighter uppercase italic">{t.menu}</span>
                  <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={24} /></button>
               </div>
               <div className="space-y-2 flex-1">
                  {navItems.map(item => (
                    <button 
                      key={item.id} 
                      onClick={() => {
                        if ((item as any).protected) {
                          requireAuth(() => {
                            setCurrentPage(item.id);
                            setIsDrawerOpen(false);
                          });
                        } else {
                          setCurrentPage(item.id);
                          setIsDrawerOpen(false);
                        }
                      }} 
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${currentPage === item.id ? 'bg-yellow-400 font-bold shadow-lg shadow-yellow-400/20' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                      <item.icon size={20} />
                      {item.label}
                    </button>
                  ))}
               </div>
               
               {!user && (
                 <div className="pt-6 border-t border-gray-100 mt-auto">
                    <Button onClick={() => { setIsDrawerOpen(false); setIsLoginModalOpen(true); }} className="w-full">
                       Login to Account
                    </Button>
                 </div>
               )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-2 md:px-6 py-6 md:py-10">
        {renderContent()}
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-20 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8 opacity-80">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-400 p-3 rounded-2xl shadow-lg shadow-yellow-400/20">
            <Home size={24} className="text-black" />
          </div>
          <div className="flex flex-col md:flex-row md:items-center leading-none">
            <span className="font-black tracking-tighter text-2xl italic uppercase text-black">Rental</span>
            <span className="font-black tracking-tighter text-2xl italic uppercase text-yellow-500 md:ml-1">Hub</span>
          </div>
        </div>
        
        <p className="text-gray-400 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-center md:text-right">
          © <span 
            onClick={() => setIsAdminPanelOpen(true)} 
            className="cursor-help hover:text-yellow-500 transition-colors"
          >2026 ADMIN PANEL</span> RESERVED. GLOBAL DATA PROTECTION.
        </p>
      </footer>

      <AnimatePresence>
        {isAdminPanelOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsAdminPanelOpen(false)} />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white p-6 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl max-w-lg w-full text-center space-y-8 overflow-y-auto max-h-[90vh]"
            >
              <button onClick={() => setIsAdminPanelOpen(false)} className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-full">
                <X size={24} />
              </button>

              {!isAdminAuthenticated ? (
                <div className="space-y-6">
                  <div className="w-20 h-20 bg-gray-100 rounded-[2rem] mx-auto flex items-center justify-center">
                    <Lock size={40} className="text-gray-400" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black tracking-tighter uppercase italic">Admin Access</h2>
                    <p className="text-gray-400 text-sm font-bold mt-2">Secure access for authorized personnel only.</p>
                  </div>
                  <div className="space-y-4">
                    <input 
                      type="password" 
                      placeholder="Enter Admin Access Code..."
                      value={adminCodeInput}
                      onChange={(e) => setAdminCodeInput(e.target.value)}
                      className="w-full py-4 px-6 bg-gray-50 border-2 border-gray-100 rounded-2xl font-black text-center text-2xl tracking-widest outline-none focus:border-yellow-400 transition-all"
                    />
                    {adminError && <p className="text-red-500 text-xs font-black uppercase">{adminError}</p>}
                    <Button onClick={handleAdminVerify} className="w-full py-4">Verify Admin</Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="w-20 h-20 bg-green-100 rounded-[2rem] mx-auto flex items-center justify-center">
                    <CheckCircle2 size={40} className="text-green-500" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black tracking-tighter uppercase italic">Management</h2>
                    <p className="text-gray-400 text-sm font-bold mt-2">Oversee all platform properties and user counts.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex flex-col items-center gap-2">
                      <span className="text-3xl font-black text-yellow-500">{adminStats.posts || properties.length}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Posts</span>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex flex-col items-center gap-2">
                      <span className="text-3xl font-black text-yellow-500">{adminStats.users}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Real Users</span>
                    </div>
                  </div>
                  
                  <div className="max-h-[40vh] overflow-y-auto space-y-2 text-left pr-2 custom-scrollbar">
                    {properties.map(p => (
                      <div key={p.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-3">
                           <img src={p.imageUrls?.[0] || 'https://via.placeholder.com/100'} className="w-12 h-12 object-cover rounded-xl" />
                           <div>
                              <p className="font-black text-xs uppercase tracking-tight">{p.city}</p>
                              <p className="text-[10px] font-bold text-gray-400">{p.ownerEmail}</p>
                           </div>
                        </div>
                        <button 
                          onClick={() => {
                            if(confirm("DANGER: Are you sure you want to permanently delete this listing?")) {
                              propertyService.deleteProperty(p.id);
                            }
                          }}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <Button onClick={() => setIsAdminAuthenticated(false)} variant="secondary" className="w-full">Admin Logout</Button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isLoginModalOpen && <LoginPage onLogin={handleLogin} onClose={() => setIsLoginModalOpen(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {isAddModalOpen && (
          <PropertyModal 
            onClose={() => {setIsAddModalOpen(false); setEditingProperty(null)}} 
            onSave={handleSaveProperty} 
            editingProperty={editingProperty} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
             <motion.div initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.9, opacity:0}} className="relative bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center space-y-6">
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto"><Trash2 size={40} /></div>
                <div>
                   <h3 className="text-2xl font-black tracking-tight">Delete Listing?</h3>
                   <p className="text-gray-500">This action cannot be undone.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <Button variant="secondary" onClick={() => setDeleteId(null)}>No</Button>
                   <Button variant="danger" onClick={handleDelete}>Yes, Delete</Button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isInstallModalOpen && (
          <InstallAppModal onClose={() => setIsInstallModalOpen(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeGallery && (
          <ImageGalleryModal 
            images={activeGallery.images} 
            activeIndex={activeGallery.index} 
            onClose={() => setActiveGallery(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
