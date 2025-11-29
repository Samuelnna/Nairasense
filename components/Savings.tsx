
import React, { useState, useEffect } from 'react';
import { PiggyBank, Target, Lock, TrendingUp, Plus, ArrowRight, Wallet, X, CheckCircle, ShieldCheck, ChevronRight, Calendar, AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { UserProfile } from '../types';

interface SavingsProps {
  user: UserProfile;
}

interface SavingsPlan {
  id: number;
  name: string;
  type: 'Target' | 'AutoSave' | 'Lock';
  target: number;
  current: number;
  color: string;
  icon: any;
  interest: string;
  startDate: string;
  maturityDate?: string;
}

export const Savings: React.FC<SavingsProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'plans'>('overview');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showQuickSaveModal, setShowQuickSaveModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SavingsPlan | null>(null);
  
  // Notification State
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Form States
  const [newPlanData, setNewPlanData] = useState({ name: '', type: 'Target', target: '', amount: '' });
  const [transactionAmount, setTransactionAmount] = useState('');
  const [targetPlanId, setTargetPlanId] = useState<string>('');

  // Initial Data
  const [plans, setPlans] = useState<SavingsPlan[]>([
    { 
      id: 1, 
      name: 'Rent 2024', 
      type: 'Target', 
      target: 2000000, 
      current: 850000, 
      color: 'bg-blue-100 text-blue-600', 
      icon: Target,
      interest: '8% p.a',
      startDate: '2023-01-15'
    },
    { 
      id: 2, 
      name: 'Emergency Fund', 
      type: 'AutoSave', 
      target: 500000, 
      current: 125000, 
      color: 'bg-emerald-100 text-emerald-600', 
      icon: ShieldCheck,
      interest: '10% p.a',
      startDate: '2023-06-01'
    },
    { 
      id: 3, 
      name: 'Fixed Deposit (90 Days)', 
      type: 'Lock', 
      target: 1000000, 
      current: 1000000, 
      color: 'bg-purple-100 text-purple-600', 
      icon: Lock,
      interest: '15% p.a',
      startDate: '2023-09-10',
      maturityDate: '2023-12-10'
    },
  ]);

  const totalSavings = plans.reduce((acc, curr) => acc + curr.current, 0);

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const type = newPlanData.type as 'Target' | 'AutoSave' | 'Lock';
      const colors = {
        'Target': 'bg-blue-100 text-blue-600',
        'AutoSave': 'bg-emerald-100 text-emerald-600',
        'Lock': 'bg-purple-100 text-purple-600'
      };
      const icons = {
        'Target': Target,
        'AutoSave': PiggyBank,
        'Lock': Lock
      };

      const newPlan: SavingsPlan = {
        id: plans.length + 1,
        name: newPlanData.name,
        type: type,
        target: Number(newPlanData.target),
        current: Number(newPlanData.amount),
        color: colors[type],
        icon: icons[type],
        interest: type === 'Lock' ? '14% p.a' : '9% p.a',
        startDate: new Date().toISOString().split('T')[0]
      };

      setPlans([...plans, newPlan]);
      setIsLoading(false);
      setShowCreateModal(false);
      setNewPlanData({ name: '', type: 'Target', target: '', amount: '' });
      setSuccessMsg(`"${newPlan.name}" created successfully!`);
      setTimeout(() => setSuccessMsg(''), 3000);
      setActiveTab('plans');
    }, 1500);
  };

  const handleQuickSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const amount = Number(transactionAmount);
      const planId = Number(targetPlanId);

      setPlans(plans.map(p => {
        if (p.id === planId) {
          return { ...p, current: p.current + amount };
        }
        return p;
      }));

      setIsLoading(false);
      setShowQuickSaveModal(false);
      setTransactionAmount('');
      setTargetPlanId('');
      setSuccessMsg(`₦${amount.toLocaleString()} added successfully!`);
      setTimeout(() => setSuccessMsg(''), 3000);
    }, 1500);
  };

  const handleTopUpPlan = (amount: number) => {
    if (!selectedPlan) return;
    setIsLoading(true);
    setTimeout(() => {
      setPlans(plans.map(p => p.id === selectedPlan.id ? { ...p, current: p.current + amount } : p));
      if (selectedPlan) setSelectedPlan({ ...selectedPlan, current: selectedPlan.current + amount });
      setIsLoading(false);
      setSuccessMsg(`Plan topped up with ₦${amount.toLocaleString()}`);
      setTimeout(() => setSuccessMsg(''), 3000);
    }, 1000);
  };

  const handleWithdrawPlan = () => {
    if (!selectedPlan) return;
    if (selectedPlan.type === 'Lock') {
      alert("This plan is locked until maturity. Early withdrawal attracts a 20% penalty.");
      return;
    }
    // Logic for withdrawal would go here
    alert("Withdrawal request processed sent to your wallet.");
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 relative">
      {/* Success Toast */}
      {successMsg && (
        <div className="fixed top-24 right-6 bg-emerald-600 text-white px-6 py-4 rounded-xl shadow-lg z-50 flex items-center animate-fade-in-up">
          <CheckCircle className="w-6 h-6 mr-3" />
          <div>
            <h4 className="font-bold text-sm">Success</h4>
            <p className="text-xs opacity-90">{successMsg}</p>
          </div>
        </div>
      )}

      {/* Header Stats */}
      <div className="bg-emerald-900 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl transition-all">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600 rounded-full blur-3xl opacity-20 -mr-16 -mt-16"></div>
        <div className="relative z-10">
          <p className="text-emerald-200 mb-1 text-sm font-medium">Total Savings Balance</p>
          <h2 className="text-4xl font-bold mb-6 tracking-tight">₦{totalSavings.toLocaleString()}</h2>
          
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => {
                setTargetPlanId(plans[0]?.id.toString());
                setShowQuickSaveModal(true);
              }}
              className="bg-white text-emerald-900 px-6 py-2.5 rounded-lg font-bold hover:bg-emerald-50 transition-colors flex items-center shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" /> Quick Save
            </button>
            <button className="bg-emerald-800 text-emerald-100 px-6 py-2.5 rounded-lg font-bold hover:bg-emerald-700 transition-colors border border-emerald-700/50">
              Withdraw
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-4 shadow-sm">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
            activeTab === 'overview' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('plans')}
          className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
            activeTab === 'plans' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          My Plans <span className="ml-2 bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs">{plans.length}</span>
        </button>
      </div>

      {/* Tab Content: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create New Plan Card */}
          <div 
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 text-white flex flex-col justify-between min-h-[200px] cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all group relative overflow-hidden"
          >
             <div className="relative z-10">
               <div className="bg-white/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-emerald-500 transition-colors">
                 <Plus className="w-6 h-6 text-white" />
               </div>
               <h3 className="text-xl font-bold mb-2">Create New Plan</h3>
               <p className="text-slate-400 text-sm">Start a personal target, fixed lock, or automate your daily savings.</p>
             </div>
             <div className="relative z-10 flex items-center text-emerald-400 font-bold text-sm mt-4">
               Get Started <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
             </div>
             {/* Decorative blob */}
             <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-colors"></div>
          </div>

          {/* Interest Rate Promo */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between min-h-[200px] hover:border-orange-200 transition-colors">
             <div>
               <div className="bg-orange-50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                 <TrendingUp className="w-6 h-6 text-orange-500" />
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-2">Up to 15% p.a. Interest</h3>
               <p className="text-slate-500 text-sm">Lock your funds for 90 days or more and earn competitive returns on your savings.</p>
             </div>
             <Button variant="outline" className="mt-4 self-start text-orange-600 border-orange-200 hover:bg-orange-50">View Rates</Button>
          </div>
          
          {/* Recent Activity Mini List */}
          <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
               <h3 className="font-bold text-slate-900">Recent Savings Activity</h3>
               <button className="text-xs text-emerald-600 font-bold hover:underline">View All</button>
            </div>
            <div className="space-y-4">
               {[1,2,3].map((_, i) => (
                 <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors border-b border-slate-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-100 p-2 rounded-full text-emerald-600">
                        <Wallet className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 text-sm">AutoSave Deposit</p>
                        <p className="text-xs text-slate-500">Today, 9:00 AM</p>
                      </div>
                    </div>
                    <span className="font-bold text-emerald-600 text-sm">+₦5,000</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: PLANS */}
      {activeTab === 'plans' && (
        <div className="space-y-4">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const progress = (plan.current / plan.target) * 100;
            return (
              <div 
                key={plan.id} 
                onClick={() => setSelectedPlan(plan)}
                className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group"
              >
                 <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4">
                       <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${plan.color}`}>
                          <Icon className="w-6 h-6" />
                       </div>
                       <div>
                          <h4 className="font-bold text-slate-900 text-lg group-hover:text-emerald-700 transition-colors">{plan.name}</h4>
                          <div className="flex items-center gap-2">
                             <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded">{plan.type}</span>
                             <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded">{plan.interest}</span>
                          </div>
                       </div>
                    </div>
                    <span className="font-bold text-slate-900 text-lg">₦{plan.current.toLocaleString()}</span>
                 </div>
                 
                 <div className="mb-2">
                    <div className="flex justify-between text-xs mb-1 text-slate-600">
                       <span>Progress</span>
                       <span className="font-medium">{Math.round(progress)}% of ₦{plan.target.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                       <div 
                         className={`h-3 rounded-full transition-all duration-1000 ${progress >= 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} 
                         style={{ width: `${Math.min(progress, 100)}%` }}
                       ></div>
                    </div>
                 </div>
                 
                 <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-50">
                    <span className="text-xs text-slate-400 flex items-center">
                       <Calendar className="w-3 h-3 mr-1" /> Created: {plan.startDate}
                    </span>
                    <button className="text-sm font-bold text-emerald-600 flex items-center group-hover:underline">
                       Manage Plan <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                 </div>
              </div>
            );
          })}
          
          <button 
            onClick={() => setShowCreateModal(true)}
            className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-medium hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all flex items-center justify-center group"
          >
             <Plus className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" /> Create New Savings Plan
          </button>
        </div>
      )}

      {/* --- MODALS --- */}

      {/* 1. Create Plan Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreateModal(false)}></div>
          <div className="bg-white rounded-2xl w-full max-w-md relative z-10 shadow-2xl animate-fade-in-up overflow-hidden">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
               <h3 className="font-bold text-slate-900 text-lg">Create Savings Plan</h3>
               <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-700 p-1 hover:bg-slate-200 rounded-full transition-colors">
                 <X className="w-5 h-5" />
               </button>
             </div>
             
             <form onSubmit={handleCreatePlan} className="p-6 space-y-4">
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Plan Name</label>
                   <input 
                     type="text" 
                     required
                     placeholder="e.g. New Car, Wedding, School Fees"
                     value={newPlanData.name}
                     onChange={(e) => setNewPlanData({...newPlanData, name: e.target.value})}
                     className="w-full rounded-lg border-slate-300 border p-3 focus:ring-emerald-500 focus:border-emerald-500"
                   />
                </div>
                
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Plan Type</label>
                   <div className="grid grid-cols-3 gap-2">
                      {['Target', 'AutoSave', 'Lock'].map(type => (
                         <button
                           type="button"
                           key={type}
                           onClick={() => setNewPlanData({...newPlanData, type})}
                           className={`py-2 px-1 rounded-lg text-sm font-medium border ${
                             newPlanData.type === type 
                               ? 'bg-emerald-50 border-emerald-500 text-emerald-700' 
                               : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                           }`}
                         >
                           {type}
                         </button>
                      ))}
                   </div>
                   <p className="text-xs text-slate-500 mt-2">
                     {newPlanData.type === 'Target' && 'Save towards a specific goal at your own pace.'}
                     {newPlanData.type === 'AutoSave' && 'Automatically save a fixed amount daily/weekly.'}
                     {newPlanData.type === 'Lock' && 'Lock funds for a period to earn higher interest.'}
                   </p>
                </div>

                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Target Amount (₦)</label>
                   <input 
                     type="number" 
                     required
                     min="1000"
                     value={newPlanData.target}
                     onChange={(e) => setNewPlanData({...newPlanData, target: e.target.value})}
                     className="w-full rounded-lg border-slate-300 border p-3 focus:ring-emerald-500 focus:border-emerald-500"
                   />
                </div>

                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Starting Balance (Optional)</label>
                   <input 
                     type="number" 
                     min="0"
                     value={newPlanData.amount}
                     onChange={(e) => setNewPlanData({...newPlanData, amount: e.target.value})}
                     className="w-full rounded-lg border-slate-300 border p-3 focus:ring-emerald-500 focus:border-emerald-500"
                   />
                </div>

                <Button type="submit" isLoading={isLoading} className="w-full py-3 text-lg mt-2">
                  Create Plan
                </Button>
             </form>
          </div>
        </div>
      )}

      {/* 2. Quick Save Modal */}
      {showQuickSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowQuickSaveModal(false)}></div>
          <div className="bg-white rounded-2xl w-full max-w-md relative z-10 shadow-2xl animate-fade-in-up">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
               <h3 className="font-bold text-slate-900 text-lg">Top Up Savings</h3>
               <button onClick={() => setShowQuickSaveModal(false)} className="text-slate-400 hover:text-slate-700">
                 <X className="w-5 h-5" />
               </button>
             </div>
             
             <form onSubmit={handleQuickSave} className="p-6 space-y-6">
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Select Plan to Credit</label>
                   <select
                     value={targetPlanId}
                     onChange={(e) => setTargetPlanId(e.target.value)}
                     className="w-full rounded-lg border-slate-300 border p-3 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                   >
                     {plans.map(p => (
                       <option key={p.id} value={p.id}>{p.name} (Bal: ₦{p.current.toLocaleString()})</option>
                     ))}
                   </select>
                </div>

                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Amount to Save</label>
                   <div className="relative">
                     <span className="absolute left-3 top-3.5 text-slate-400 font-bold">₦</span>
                     <input 
                       type="number" 
                       required
                       min="100"
                       placeholder="0.00"
                       value={transactionAmount}
                       onChange={(e) => setTransactionAmount(e.target.value)}
                       className="w-full rounded-lg border-slate-300 border p-3 pl-8 text-xl font-bold focus:ring-emerald-500 focus:border-emerald-500 text-emerald-700"
                     />
                   </div>
                </div>

                <div className="flex gap-2">
                   {[1000, 2000, 5000, 10000].map(amt => (
                      <button 
                        key={amt}
                        type="button"
                        onClick={() => setTransactionAmount(amt.toString())}
                        className="flex-1 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-colors"
                      >
                        +{amt.toLocaleString()}
                      </button>
                   ))}
                </div>

                <Button type="submit" isLoading={isLoading} className="w-full py-3 text-lg">
                  Confirm Transaction
                </Button>
             </form>
          </div>
        </div>
      )}

      {/* 3. Plan Details / Manage Modal */}
      {selectedPlan && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedPlan(null)}></div>
           <div className="bg-white rounded-2xl w-full max-w-lg relative z-10 shadow-2xl animate-fade-in-up flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className={`p-6 ${selectedPlan.color.split(' ')[0]} rounded-t-2xl relative overflow-hidden`}>
                 <div className="relative z-10 flex justify-between items-start">
                    <div>
                       <div className="flex items-center gap-2 mb-2">
                         <div className="bg-white/30 p-1.5 rounded-lg backdrop-blur-sm">
                            <selectedPlan.icon className="w-5 h-5" />
                         </div>
                         <span className="font-bold text-sm uppercase tracking-wider opacity-80">{selectedPlan.type} Plan</span>
                       </div>
                       <h2 className="text-3xl font-bold">{selectedPlan.name}</h2>
                    </div>
                    <button onClick={() => setSelectedPlan(null)} className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors text-current">
                       <X className="w-5 h-5" />
                    </button>
                 </div>
                 <div className="mt-6 flex justify-between items-end relative z-10">
                    <div>
                      <p className="text-sm opacity-80">Current Balance</p>
                      <p className="text-2xl font-bold">₦{selectedPlan.current.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-sm opacity-80">Interest Rate</p>
                       <p className="font-bold">{selectedPlan.interest}</p>
                    </div>
                 </div>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto">
                 <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2 text-slate-600">
                       <span>Progress to Goal</span>
                       <span className="font-bold">{(selectedPlan.current / selectedPlan.target * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden border border-slate-200">
                       <div 
                         className="h-full bg-emerald-500 rounded-full transition-all" 
                         style={{ width: `${Math.min((selectedPlan.current / selectedPlan.target * 100), 100)}%` }}
                       ></div>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 text-right">Target: ₦{selectedPlan.target.toLocaleString()}</p>
                 </div>

                 <div className="grid grid-cols-2 gap-4 mb-6">
                    <button 
                      onClick={() => handleTopUpPlan(5000)}
                      disabled={isLoading}
                      className="flex flex-col items-center justify-center p-4 rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                    >
                       <Plus className="w-6 h-6 mb-2" />
                       <span className="font-bold">Top Up ₦5,000</span>
                    </button>
                    <button 
                      onClick={handleWithdrawPlan}
                      className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                       <Wallet className="w-6 h-6 mb-2 text-slate-400" />
                       <span className="font-bold">Withdraw</span>
                    </button>
                 </div>

                 <div>
                    <h4 className="font-bold text-slate-800 mb-3 text-sm">Recent Transactions</h4>
                    <div className="space-y-3">
                       <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                <Plus className="w-4 h-4" />
                             </div>
                             <div>
                                <p className="text-sm font-bold text-slate-700">Quick Save</p>
                                <p className="text-xs text-slate-400">Today, 10:45 AM</p>
                             </div>
                          </div>
                          <span className="text-emerald-600 font-bold text-sm">+₦5,000</span>
                       </div>
                       <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                <Plus className="w-4 h-4" />
                             </div>
                             <div>
                                <p className="text-sm font-bold text-slate-700">Deposit</p>
                                <p className="text-xs text-slate-400">Yesterday, 4:20 PM</p>
                             </div>
                          </div>
                          <span className="text-emerald-600 font-bold text-sm">+₦2,500</span>
                       </div>
                    </div>
                 </div>

                 {selectedPlan.type === 'Lock' && (
                    <div className="mt-6 p-3 bg-amber-50 text-amber-700 rounded-lg text-xs flex items-start">
                       <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                       <p>Funds are locked until {selectedPlan.maturityDate}. Early liquidation will incur a penalty fee of 2.5%.</p>
                    </div>
                 )}
              </div>
           </div>
         </div>
      )}
    </div>
  );
};
