
import React, { useState } from 'react';
import { 
  CreditCard, 
  Plus, 
  Send, 
  Smartphone, 
  Wifi, 
  Zap, 
  Tv, 
  MoreHorizontal, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Copy, 
  Eye, 
  EyeOff,
  CheckCircle,
  X
} from 'lucide-react';
import { UserProfile, Transaction } from '../types';
import { Button } from './Button';

interface WalletProps {
  user: UserProfile;
  transactions: Transaction[];
  initialModal?: ModalType; // Support opening a specific modal on load
}

type ModalType = 'fund' | 'transfer' | 'airtime' | 'data' | 'electricity' | null;

export const Wallet: React.FC<WalletProps> = ({ user, transactions, initialModal = null }) => {
  const [showBalance, setShowBalance] = useState(true);
  const [activeModal, setActiveModal] = useState<ModalType>(initialModal);
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Mock processing function
  const handleProcess = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      setIsLoading(false);
      setActiveModal(null);
      setSuccessMsg(`Transaction successful! ₦${parseInt(amount).toLocaleString()} processed.`);
      setAmount('');
      setRecipient('');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMsg(''), 3000);
    }, 1500);
  };

  const closeModal = () => {
    setActiveModal(null);
    setAmount('');
    setRecipient('');
  };

  return (
    <div className="space-y-8 animate-fade-in relative pb-12">
      {/* Success Notification */}
      {successMsg && (
        <div className="fixed top-24 right-6 bg-emerald-600 text-white px-6 py-4 rounded-xl shadow-lg z-50 flex items-center animate-fade-in-up">
          <CheckCircle className="w-6 h-6 mr-3" />
          <div>
            <h4 className="font-bold text-sm">Success</h4>
            <p className="text-xs opacity-90">{successMsg}</p>
          </div>
        </div>
      )}

      {/* 1. Virtual Card Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden h-64 flex flex-col justify-between group transition-transform hover:scale-[1.01] duration-300">
          {/* Decorative circles */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-12 -left-12 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
          
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm font-medium tracking-wider mb-1">Total Balance</p>
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-bold tracking-tight">
                  {showBalance ? `₦${user.balance.toLocaleString()}` : '••••••••'}
                </h2>
                <button 
                  onClick={() => setShowBalance(!showBalance)} 
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  {showBalance ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="font-bold italic text-xl opacity-80 tracking-widest">VISA</div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-white/10 px-2 py-1 rounded text-xs font-mono tracking-widest text-slate-300">
                1234 5678 9000 4242
              </span>
              <button className="text-emerald-400 hover:text-emerald-300" onClick={() => alert('Card number copied!')}>
                <Copy size={14} />
              </button>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs text-slate-400 uppercase">Card Holder</p>
                <p className="font-medium tracking-wide">{user.name.toUpperCase()}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase">Expires</p>
                <p className="font-medium tracking-wide">12/26</p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Quick Actions */}
        <div className="flex flex-col justify-center space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setActiveModal('fund')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md"
            >
              <div className="bg-white/20 p-2 rounded-full">
                <Plus className="w-6 h-6" />
              </div>
              <span className="font-semibold">Fund Wallet</span>
            </button>

            <button 
              onClick={() => setActiveModal('transfer')}
              className="bg-slate-900 hover:bg-slate-800 text-white p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md"
            >
              <div className="bg-white/20 p-2 rounded-full">
                <Send className="w-6 h-6" />
              </div>
              <span className="font-semibold">Transfer</span>
            </button>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
             <div className="flex items-center justify-between mb-4">
               <h3 className="font-bold text-slate-800 text-sm">Account Details</h3>
               <button className="text-emerald-600 text-xs font-medium hover:underline">Share Details</button>
             </div>
             <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
               <div>
                 <p className="text-xs text-slate-500">Wema Bank</p>
                 <p className="font-bold text-slate-900 font-mono text-lg">9012345678</p>
               </div>
               <button className="p-2 hover:bg-slate-200 rounded-full transition-colors" onClick={() => alert('Account number copied!')}>
                 <Copy className="w-4 h-4 text-slate-500" />
               </button>
             </div>
          </div>
        </div>
      </div>

      {/* 3. Services Grid */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Pay Bills & Utilities</h3>
        <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-4">
          {[
            { id: 'airtime', label: 'Airtime', icon: Smartphone, color: 'text-orange-500', bg: 'bg-orange-50' },
            { id: 'data', label: 'Data', icon: Wifi, color: 'text-blue-500', bg: 'bg-blue-50' },
            { id: 'electricity', label: 'Electricity', icon: Zap, color: 'text-yellow-600', bg: 'bg-yellow-50' },
            { id: 'tv', label: 'Cable TV', icon: Tv, color: 'text-purple-500', bg: 'bg-purple-50' },
            { id: 'betting', label: 'Betting', icon: ArrowUpRight, color: 'text-green-600', bg: 'bg-green-50' },
            { id: 'more', label: 'More', icon: MoreHorizontal, color: 'text-slate-500', bg: 'bg-slate-50' },
          ].map((service) => (
            <button 
              key={service.id}
              onClick={() => ['airtime', 'data', 'electricity'].includes(service.id) ? setActiveModal(service.id as ModalType) : null}
              className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${service.bg} group-hover:scale-110 transition-transform`}>
                <service.icon className={`w-6 h-6 ${service.color}`} />
              </div>
              <span className="text-xs font-medium text-slate-600">{service.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-900">Transaction History</h3>
          <div className="flex gap-2">
            <select className="text-xs border-slate-200 border rounded-lg px-2 py-1 text-slate-600 focus:ring-emerald-500 focus:border-emerald-500">
              <option>All Types</option>
              <option>Credit</option>
              <option>Debit</option>
            </select>
            <Button variant="outline" className="text-xs py-1 px-3 h-auto">Download</Button>
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {transactions.map((t) => (
            <div key={t.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${t.type === 'credit' ? 'bg-emerald-50' : 'bg-red-50'}`}>
                  {t.type === 'credit' ? (
                    <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{t.merchant}</p>
                  <p className="text-xs text-slate-500">{t.date} • {t.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold text-sm ${t.type === 'credit' ? 'text-emerald-600' : 'text-slate-900'}`}>
                  {t.type === 'credit' ? '+' : '-'}₦{t.amount.toLocaleString()}
                </p>
                <p className="text-xs text-slate-400 capitalize">{t.type}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. MODALS */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="bg-white rounded-2xl w-full max-w-md relative z-10 shadow-2xl animate-fade-in-up overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-900 capitalize">
                {activeModal === 'fund' && 'Fund Wallet'}
                {activeModal === 'transfer' && 'Transfer Money'}
                {['airtime', 'data', 'electricity'].includes(activeModal || '') && `Buy ${activeModal}`}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleProcess} className="p-6 space-y-4">
              {activeModal === 'transfer' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Recipient Account / Tag</label>
                  <input 
                    type="text" 
                    required
                    placeholder="@username or Account Number"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full rounded-lg border-slate-300 border p-3 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow"
                  />
                </div>
              )}

              {['airtime', 'data'].includes(activeModal || '') && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    required
                    placeholder="080 000 0000"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full rounded-lg border-slate-300 border p-3 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow"
                  />
                </div>
              )}

              {activeModal === 'electricity' && (
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Meter Number</label>
                   <input 
                     type="text" 
                     required
                     placeholder="0000 0000 0000"
                     value={recipient}
                     onChange={(e) => setRecipient(e.target.value)}
                     className="w-full rounded-lg border-slate-300 border p-3 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow"
                   />
                 </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Amount (₦)</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-slate-400">₦</span>
                  <input 
                    type="number" 
                    required
                    min="100"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full rounded-lg border-slate-300 border p-3 pl-8 text-lg font-semibold focus:ring-emerald-500 focus:border-emerald-500 transition-shadow"
                  />
                </div>
              </div>

              {activeModal === 'fund' && (
                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100 flex items-start gap-3">
                   <div className="p-1 bg-white rounded-full text-emerald-600">
                     <CreditCard className="w-4 h-4" />
                   </div>
                   <div>
                     <p className="text-sm font-bold text-emerald-900">Pay with Card</p>
                     <p className="text-xs text-emerald-700">Secure transaction via Paystack/Flutterwave</p>
                   </div>
                </div>
              )}

              <Button type="submit" isLoading={isLoading} className="w-full py-3 text-lg">
                {activeModal === 'fund' ? 'Add Funds' : 'Pay Now'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
