
import React, { useState } from 'react';
import { 
  Smartphone, Wifi, Zap, Tv, CreditCard, 
  Users, Plane, Gamepad, ShoppingBag, 
  ShieldCheck, GraduationCap, Building2, ChevronRight, Globe, PiggyBank, Target, Lock, X, Search, MapPin, Calendar, CheckCircle, Truck, ShoppingCart
} from 'lucide-react';
import { AppView } from '../types';
import { Button } from './Button';

interface ServicesProps {
  onNavigate: (view: AppView) => void;
}

type ServiceType = 'school' | 'betting' | 'travel' | 'marketplace' | 'gov' | null;

export const Services: React.FC<ServicesProps> = ({ onNavigate }) => {
  const [activeService, setActiveService] = useState<ServiceType>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  
  // Generic Form State
  const [formData, setFormData] = useState<any>({});

  const handleOpenService = (type: ServiceType) => {
    setActiveService(type);
    setFormData({});
    setSuccess('');
  };

  const handleClose = () => {
    setActiveService(null);
    setFormData({});
    setSuccess('');
  };

  const simulateProcessing = (msg: string) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(msg);
      // Auto close after success
      setTimeout(() => {
        if(activeService !== 'marketplace') handleClose(); // Keep marketplace open to shop more
        setSuccess('');
      }, 2500);
    }, 1500);
  };

  const categories = [
    {
      title: 'Wealth & Savings',
      items: [
        { label: 'My Savings', icon: PiggyBank, color: 'text-emerald-600', bg: 'bg-emerald-50', action: () => onNavigate(AppView.SAVINGS) },
        { label: 'Target Plan', icon: Target, color: 'text-blue-600', bg: 'bg-blue-50', action: () => onNavigate(AppView.SAVINGS) },
        { label: 'Fixed Deposit', icon: Lock, color: 'text-purple-600', bg: 'bg-purple-50', action: () => onNavigate(AppView.SAVINGS) },
      ]
    },
    {
      title: 'Bills & Utilities',
      items: [
        { label: 'Buy Airtime', icon: Smartphone, color: 'text-orange-500', bg: 'bg-orange-50', action: () => onNavigate(AppView.WALLET) },
        { label: 'Buy Data', icon: Wifi, color: 'text-blue-500', bg: 'bg-blue-50', action: () => onNavigate(AppView.WALLET) },
        { label: 'Electricity', icon: Zap, color: 'text-yellow-600', bg: 'bg-yellow-50', action: () => onNavigate(AppView.WALLET) },
        { label: 'Cable TV', icon: Tv, color: 'text-purple-500', bg: 'bg-purple-50', action: () => onNavigate(AppView.WALLET) },
        { label: 'Internet', icon: Globe, color: 'text-cyan-500', bg: 'bg-cyan-50', action: () => onNavigate(AppView.WALLET) },
      ]
    },
    {
      title: 'Financial Services',
      items: [
        { label: 'Insurance', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50', action: () => onNavigate(AppView.INSURANCE) },
        { label: 'Virtual Card', icon: CreditCard, color: 'text-slate-600', bg: 'bg-slate-50', action: () => onNavigate(AppView.WALLET) },
        { label: 'School Fees', icon: GraduationCap, color: 'text-indigo-600', bg: 'bg-indigo-50', action: () => handleOpenService('school') },
        { label: 'Betting', icon: Gamepad, color: 'text-green-600', bg: 'bg-green-50', action: () => handleOpenService('betting') },
      ]
    },
    {
      title: 'Lifestyle',
      items: [
        { label: 'Travel', icon: Plane, color: 'text-sky-600', bg: 'bg-sky-50', action: () => handleOpenService('travel') },
        { label: 'Marketplace', icon: ShoppingBag, color: 'text-amber-600', bg: 'bg-amber-50', action: () => handleOpenService('marketplace') },
        { label: 'Gov Payments', icon: Building2, color: 'text-slate-600', bg: 'bg-slate-100', action: () => handleOpenService('gov') },
      ]
    }
  ];

  /* --- RENDER FUNCTIONS FOR MODALS --- */

  const renderSchoolFees = () => (
    <div className="space-y-4">
      <div className="bg-indigo-50 p-4 rounded-lg flex items-start gap-3">
        <GraduationCap className="w-6 h-6 text-indigo-600 flex-shrink-0" />
        <p className="text-xs text-indigo-800">Securely pay tuition for registered institutions. Receipts are generated instantly.</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Select Institution</label>
        <select className="w-full rounded-lg border-slate-300 border p-3 bg-white">
          <option>-- Select School --</option>
          <option>University of Lagos (UNILAG)</option>
          <option>Covenant University</option>
          <option>Corona Secondary School</option>
          <option>Greensprings School</option>
          <option>Lagos State Polytechnic</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Student ID / Matric No</label>
        <input 
          type="text" 
          placeholder="e.g. 19/0842" 
          className="w-full rounded-lg border-slate-300 border p-3 focus:ring-indigo-500 focus:border-indigo-500" 
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Amount (₦)</label>
        <input 
          type="number" 
          placeholder="0.00" 
          className="w-full rounded-lg border-slate-300 border p-3 focus:ring-indigo-500 focus:border-indigo-500 font-bold" 
        />
      </div>

      <Button 
        isLoading={loading} 
        onClick={() => simulateProcessing("Tuition payment successful! Receipt sent to email.")} 
        className="w-full bg-indigo-600 hover:bg-indigo-700"
      >
        Pay School Fees
      </Button>
    </div>
  );

  const renderBetting = () => (
    <div className="space-y-4">
       <div className="bg-green-50 p-4 rounded-lg flex items-start gap-3">
        <Gamepad className="w-6 h-6 text-green-600 flex-shrink-0" />
        <p className="text-xs text-green-800">Fund your betting wallets instantly. Zero transaction fees.</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-2">
        {['Bet9ja', 'SportyBet', '1xBet', 'NairaBet', 'BetKing', 'Merrybet'].map(provider => (
          <button 
            key={provider}
            onClick={() => setFormData({...formData, provider})}
            className={`p-2 rounded-lg border text-xs font-bold transition-colors ${
              formData.provider === provider 
                ? 'bg-green-600 text-white border-green-600' 
                : 'bg-white border-slate-200 text-slate-600 hover:bg-green-50'
            }`}
          >
            {provider}
          </button>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">User ID</label>
        <input 
          type="text" 
          placeholder="Your User ID" 
          className="w-full rounded-lg border-slate-300 border p-3 focus:ring-green-500 focus:border-green-500" 
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Amount (₦)</label>
        <input 
          type="number" 
          placeholder="Min 100" 
          className="w-full rounded-lg border-slate-300 border p-3 focus:ring-green-500 focus:border-green-500 font-bold" 
        />
      </div>

      <Button 
        isLoading={loading} 
        onClick={() => simulateProcessing(`Funded ${formData.provider || 'Wallet'} Successfully!`)} 
        className="w-full bg-green-600 hover:bg-green-700"
        disabled={!formData.provider}
      >
        Top Up Wallet
      </Button>
    </div>
  );

  const renderGov = () => (
    <div className="space-y-4">
      <div className="bg-slate-100 p-4 rounded-lg flex items-start gap-3">
        <Building2 className="w-6 h-6 text-slate-600 flex-shrink-0" />
        <p className="text-xs text-slate-800">Official Treasury Single Account (TSA) & State Revenue Payments.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Select Agency/Type</label>
        <select className="w-full rounded-lg border-slate-300 border p-3 bg-white">
          <option>-- Select Payment Type --</option>
          <option>LIRS (Lagos State Tax)</option>
          <option>FRSC (Drivers License)</option>
          <option>Nigeria Immigration (Passport)</option>
          <option>JAMB / WAEC E-Pin</option>
          <option>Federal High Court</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Remita RRR / Ref Number</label>
        <input 
          type="text" 
          placeholder="XXXX-XXXX-XXXX" 
          className="w-full rounded-lg border-slate-300 border p-3 focus:ring-slate-500 focus:border-slate-500 font-mono" 
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Amount (₦)</label>
        <input 
          type="number" 
          placeholder="0.00" 
          className="w-full rounded-lg border-slate-300 border p-3 focus:ring-slate-500 focus:border-slate-500 font-bold" 
        />
      </div>

      <Button 
        isLoading={loading} 
        onClick={() => simulateProcessing("Govt Payment Successful! Receipt generated.")} 
        className="w-full bg-slate-800 hover:bg-slate-900"
      >
        Make Payment
      </Button>
    </div>
  );

  const renderTravel = () => (
    <div className="space-y-4">
       {/* Tabs */}
       <div className="flex bg-slate-100 rounded-lg p-1 mb-4">
          <button className="flex-1 py-1.5 text-sm font-bold rounded-md bg-white shadow-sm text-sky-600">Flights</button>
          <button className="flex-1 py-1.5 text-sm font-bold rounded-md text-slate-500 hover:text-slate-700">Bus</button>
          <button className="flex-1 py-1.5 text-sm font-bold rounded-md text-slate-500 hover:text-slate-700">Train</button>
       </div>

       <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">From</label>
            <div className="relative">
               <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
               <input type="text" defaultValue="Lagos (LOS)" className="w-full pl-9 p-2 rounded-lg border border-slate-300 text-sm font-medium" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">To</label>
            <div className="relative">
               <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
               <input type="text" placeholder="City or Airport" className="w-full pl-9 p-2 rounded-lg border border-slate-300 text-sm font-medium" />
            </div>
          </div>
       </div>

       <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Departure</label>
            <div className="relative">
               <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
               <input type="date" className="w-full pl-9 p-2 rounded-lg border border-slate-300 text-sm font-medium" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Passengers</label>
            <input type="number" defaultValue="1" className="w-full p-2 rounded-lg border border-slate-300 text-sm font-medium" />
          </div>
       </div>

       <Button 
         isLoading={loading} 
         onClick={() => simulateProcessing("Searching for best fares... (Demo: Booking Confirmed)")} 
         className="w-full bg-sky-600 hover:bg-sky-700 mt-2"
       >
         Search Flights
       </Button>

       <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-xs font-bold text-slate-400 mb-2">Popular Routes</p>
          <div className="space-y-2">
             <div className="flex justify-between items-center p-3 border border-slate-100 rounded-lg hover:bg-sky-50 cursor-pointer">
                <div className="flex items-center gap-2">
                  <Plane className="w-4 h-4 text-sky-500" />
                  <span className="text-sm font-medium">Lagos to Abuja</span>
                </div>
                <span className="text-xs font-bold text-emerald-600">From ₦85,000</span>
             </div>
             <div className="flex justify-between items-center p-3 border border-slate-100 rounded-lg hover:bg-sky-50 cursor-pointer">
                <div className="flex items-center gap-2">
                  <Plane className="w-4 h-4 text-sky-500" />
                  <span className="text-sm font-medium">Lagos to Port Harcourt</span>
                </div>
                <span className="text-xs font-bold text-emerald-600">From ₦92,000</span>
             </div>
          </div>
       </div>
    </div>
  );

  const renderMarketplace = () => {
    const products = [
      { id: 1, name: "Bag of Rice (50kg)", price: 75000, img: "🌾" },
      { id: 2, name: "Samsung A54 5G", price: 420000, img: "📱" },
      { id: 3, name: "Vegetable Oil (5L)", price: 18500, img: "🛢️" },
      { id: 4, name: "Generator 3.5KVA", price: 350000, img: "⚡" },
      { id: 5, name: "Baby Diapers (Pack)", price: 8500, img: "👶" },
      { id: 6, name: "Sneakers", price: 25000, img: "👟" },
    ];

    return (
      <div>
         <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {['All', 'Food', 'Electronics', 'Fashion', 'Home'].map(cat => (
              <button key={cat} className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold hover:bg-amber-100 hover:text-amber-700 whitespace-nowrap">
                {cat}
              </button>
            ))}
         </div>

         <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto">
            {products.map(p => (
              <div key={p.id} className="border border-slate-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                 <div className="h-24 bg-slate-50 rounded-md flex items-center justify-center text-4xl mb-2">
                    {p.img}
                 </div>
                 <h4 className="font-bold text-slate-800 text-sm truncate">{p.name}</h4>
                 <p className="text-emerald-600 font-bold text-sm mb-2">₦{p.price.toLocaleString()}</p>
                 <Button 
                   variant="outline" 
                   className="w-full text-xs h-8 border-amber-200 text-amber-700 hover:bg-amber-50"
                   onClick={() => simulateProcessing(`Added ${p.name} to cart!`)}
                 >
                   Add to Cart
                 </Button>
              </div>
            ))}
         </div>

         <div className="mt-4 bg-amber-50 p-3 rounded-lg flex justify-between items-center cursor-pointer hover:bg-amber-100 transition-colors">
            <div className="flex items-center gap-2 text-amber-800">
               <ShoppingCart className="w-5 h-5" />
               <span className="text-sm font-bold">2 Items in Cart</span>
            </div>
            <span className="font-bold text-amber-900">₦93,500</span>
         </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 relative">
      <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold mb-2">Service Hub</h2>
        <p className="text-slate-300">One-stop shop for all your payments, savings, lifestyle needs, and community activities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Featured Card - Community */}
        <div 
          onClick={(e) => {
             e.preventDefault();
             e.stopPropagation();
             onNavigate(AppView.COMMUNITY);
          }}
          className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl p-6 text-white cursor-pointer hover:shadow-lg transition-all transform hover:-translate-y-1 relative overflow-hidden group"
          role="button"
          tabIndex={0}
        >
          <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-4 translate-y-4 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
             <Users size={120} />
          </div>
          <div className="relative z-10 pointer-events-none">
            <h3 className="text-xl font-bold mb-1">Community Challenges</h3>
            <p className="text-pink-100 text-sm mb-4">Join the "Detty December" savings group now!</p>
            <div className="pointer-events-none">
                <button className="bg-white text-pink-600 px-4 py-2 rounded-lg text-sm font-bold flex items-center shadow-sm hover:bg-pink-50 transition-colors pointer-events-auto">
                Join Now <ChevronRight className="w-4 h-4 ml-1" />
                </button>
            </div>
          </div>
        </div>

        {/* Featured Card - Insurance */}
        <div 
           onClick={() => onNavigate(AppView.INSURANCE)}
           className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-6 text-white cursor-pointer hover:shadow-lg transition-all transform hover:-translate-y-1 relative overflow-hidden group"
        >
          <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-4 translate-y-4 group-hover:scale-110 transition-transform duration-500">
             <ShieldCheck size={120} />
          </div>
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-1">Get Insured</h3>
            <p className="text-emerald-100 text-sm mb-4">Protect your health, gadgets, and future.</p>
            <button className="bg-white text-emerald-600 px-4 py-2 rounded-lg text-sm font-bold flex items-center shadow-sm hover:bg-emerald-50 transition-colors">
               View Plans <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>

      {categories.map((category, idx) => (
        <div key={idx}>
          <h3 className="text-lg font-bold text-slate-800 mb-4">{category.title}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {category.items.map((item, i) => (
              <button 
                key={i}
                onClick={item.action}
                className="flex flex-col items-center justify-center bg-white p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all group h-32 text-center"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${item.bg} group-hover:scale-110 transition-transform`}>
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <span className="text-sm font-medium text-slate-700">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* SERVICE MODAL */}
      {activeService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose}></div>
          <div className="bg-white rounded-2xl w-full max-w-md relative z-10 shadow-2xl animate-fade-in-up overflow-hidden max-h-[90vh] flex flex-col">
             
             {/* Modal Header */}
             <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
               <div className="flex items-center gap-3">
                 {activeService === 'school' && <div className="p-2 bg-indigo-100 rounded-full"><GraduationCap className="w-5 h-5 text-indigo-600"/></div>}
                 {activeService === 'betting' && <div className="p-2 bg-green-100 rounded-full"><Gamepad className="w-5 h-5 text-green-600"/></div>}
                 {activeService === 'gov' && <div className="p-2 bg-slate-200 rounded-full"><Building2 className="w-5 h-5 text-slate-600"/></div>}
                 {activeService === 'travel' && <div className="p-2 bg-sky-100 rounded-full"><Plane className="w-5 h-5 text-sky-600"/></div>}
                 {activeService === 'marketplace' && <div className="p-2 bg-amber-100 rounded-full"><ShoppingBag className="w-5 h-5 text-amber-600"/></div>}
                 
                 <h3 className="font-bold text-slate-900 text-lg capitalize">
                    {activeService === 'school' && 'Pay School Fees'}
                    {activeService === 'betting' && 'Fund Betting Wallet'}
                    {activeService === 'gov' && 'Govt Payments'}
                    {activeService === 'travel' && 'Travel & Booking'}
                    {activeService === 'marketplace' && 'NairaSense Market'}
                 </h3>
               </div>
               <button onClick={handleClose} className="text-slate-400 hover:text-slate-700 p-1 hover:bg-slate-200 rounded-full transition-colors">
                 <X className="w-5 h-5" />
               </button>
             </div>
             
             {/* Modal Body */}
             <div className="p-6 overflow-y-auto">
                {success ? (
                   <div className="flex flex-col items-center justify-center py-8 text-center animate-fade-in">
                      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4 text-emerald-600">
                         <CheckCircle className="w-8 h-8" />
                      </div>
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Success!</h4>
                      <p className="text-slate-500">{success}</p>
                   </div>
                ) : (
                  <>
                    {activeService === 'school' && renderSchoolFees()}
                    {activeService === 'betting' && renderBetting()}
                    {activeService === 'gov' && renderGov()}
                    {activeService === 'travel' && renderTravel()}
                    {activeService === 'marketplace' && renderMarketplace()}
                  </>
                )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
