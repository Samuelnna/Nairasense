
import React, { useState } from 'react';
import { Shield, HeartPulse, Tractor, Smartphone, Umbrella, Sparkles, Check, ChevronRight, AlertCircle, FileText, Camera, Calendar, CreditCard, Download, ArrowLeft, GraduationCap, Briefcase, Building2, PiggyBank, TrendingUp } from 'lucide-react';
import { Button } from './Button';
import { InsurancePlan, UserProfile, Transaction, InsurancePolicy, Claim } from '../types';
import { recommendInsurancePlan } from '../services/geminiService';

interface InsuranceProps {
  user: UserProfile;
  transactions: Transaction[];
}

// Pre-defined base plans with Providers
const BASE_PLANS: InsurancePlan[] = [
  {
    id: 'health_1',
    name: 'Basic Health Flex',
    provider: 'Hygeia HMO',
    type: 'health',
    basePremium: 1500,
    baseCoverage: 250000,
    description: 'Essential coverage for malaria, typhoid, and basic consultation.',
    features: ['Malaria treatment', 'Telemedicine access', 'Local clinic network']
  },
  {
    id: 'edu_1',
    name: 'Future Scholar',
    provider: 'Leadway Assurance',
    type: 'education',
    basePremium: 5000,
    baseCoverage: 1000000,
    description: 'Guarantees your child\'s education fees if the unexpected happens.',
    features: ['Tuition protection', 'Annual book allowance', 'No medical exam required']
  },
  {
    id: 'agri_1',
    name: 'Agri-Shield',
    provider: 'Leadway Assurance',
    type: 'agriculture',
    basePremium: 3500,
    baseCoverage: 500000,
    description: 'Protect your input costs against flood and drought.',
    features: ['Drought protection', 'Flood coverage', 'Pest control advisory']
  },
  {
    id: 'device_1',
    name: 'Gadget Guard',
    provider: 'AIICO Insurance',
    type: 'device',
    basePremium: 800,
    baseCoverage: 150000,
    description: 'Screen repair and theft protection for mobile devices.',
    features: ['Screen replacement', 'Theft coverage', 'Liquid damage (50%)']
  },
  {
    id: 'life_1',
    name: 'Family Life',
    provider: 'Prudential Zenith',
    type: 'life',
    basePremium: 2000,
    baseCoverage: 2000000,
    description: 'Financial security for dependents.',
    features: ['Accidental death', 'Permanent disability', 'Funeral support']
  },
  {
    id: 'biz_1',
    name: 'SME Cover',
    provider: 'AXA Mansard',
    type: 'business',
    basePremium: 4500,
    baseCoverage: 1500000,
    description: 'Comprehensive protection for small business owners.',
    features: ['Burglary protection', 'Fire damage', 'Public liability']
  }
];

// Mock existing policies
const MOCK_POLICIES: InsurancePolicy[] = [
  {
    id: 'POL-8842-HEA',
    planId: 'health_1',
    planName: 'Basic Health Flex',
    provider: 'Hygeia HMO',
    coverageAmount: 250000,
    premium: 1500,
    startDate: '2023-09-01',
    status: 'Active'
  },
  {
    id: 'POL-2931-DEV',
    planId: 'device_1',
    planName: 'Gadget Guard',
    provider: 'AIICO Insurance',
    coverageAmount: 150000,
    premium: 800,
    startDate: '2022-01-15',
    status: 'Expired'
  }
];

export const Insurance: React.FC<InsuranceProps> = ({ user, transactions }) => {
  const [activeTab, setActiveTab] = useState<'market' | 'policies' | 'claims' | 'savings'>('market');
  const [selectedPlan, setSelectedPlan] = useState<InsurancePlan | null>(null);
  const [viewingPolicy, setViewingPolicy] = useState<InsurancePolicy | null>(null);
  const [builderStep, setBuilderStep] = useState(1);
  const [coverageMultiplier, setCoverageMultiplier] = useState(1); // 1 = base, 2 = double
  
  // AI State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<{ text: string; type: string } | null>(null);

  // Claims State
  const [activeClaimPolicy, setActiveClaimPolicy] = useState<string>('');
  const [claimDescription, setClaimDescription] = useState('');
  const [claimSubmitting, setClaimSubmitting] = useState(false);
  const [claimsList, setClaimsList] = useState<Claim[]>([]);

  const getIcon = (type: string, size = 'md') => {
    const className = size === 'lg' ? "w-10 h-10" : "w-6 h-6";
    const typeLower = type.toLowerCase();
    
    if (typeLower.includes('health')) return <HeartPulse className={`${className} text-rose-500`} />;
    if (typeLower.includes('agri')) return <Tractor className={`${className} text-green-600`} />;
    if (typeLower.includes('device') || typeLower.includes('gadget')) return <Smartphone className={`${className} text-blue-500`} />;
    if (typeLower.includes('edu') || typeLower.includes('scholar')) return <GraduationCap className={`${className} text-amber-500`} />;
    if (typeLower.includes('biz') || typeLower.includes('sme')) return <Briefcase className={`${className} text-slate-700`} />;
    return <Umbrella className={`${className} text-purple-500`} />;
  };

  const handleAiAnalyze = async () => {
    setAiLoading(true);
    const result = await recommendInsurancePlan(transactions, user);
    setAiRecommendation(result);
    setAiLoading(false);
  };

  const openBuilder = (plan: InsurancePlan) => {
    setSelectedPlan(plan);
    setBuilderStep(1);
    setCoverageMultiplier(1);
  };

  const handlePurchase = () => {
    // In a real app, this would call an API
    alert(`Success! You have purchased ${selectedPlan?.name} from ${selectedPlan?.provider}.`);
    setSelectedPlan(null);
    setActiveTab('policies');
  };

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setClaimSubmitting(true);
    setTimeout(() => {
      const newClaim: Claim = {
        id: `clm_${Math.random().toString(36).substr(2, 9)}`,
        policyId: activeClaimPolicy,
        date: new Date().toISOString().split('T')[0],
        description: claimDescription,
        amount: 0, // Pending assessment
        status: 'Reviewing'
      };
      setClaimsList([...claimsList, newClaim]);
      setClaimSubmitting(false);
      setClaimDescription('');
      setActiveClaimPolicy('');
      alert("Claim submitted successfully! AI is reviewing your evidence.");
    }, 1500);
  };

  const handleRenewPolicy = (policy: InsurancePolicy) => {
    alert(`Renewing ${policy.planName}... Redirecting to payment.`);
  };

  // Filter plans for Savings section
  const savingsPlans = BASE_PLANS.filter(p => ['education', 'life'].includes(p.type));

  return (
    <div className="space-y-6 animate-fade-in min-h-screen pb-12">
      {/* Navigation */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-4 shadow-sm overflow-x-auto">
        <button
          onClick={() => { setActiveTab('market'); setSelectedPlan(null); setViewingPolicy(null); }}
          className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'market' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Marketplace
        </button>
        <button
          onClick={() => { setActiveTab('savings'); setSelectedPlan(null); setViewingPolicy(null); }}
          className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 whitespace-nowrap flex items-center ${
            activeTab === 'savings' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <PiggyBank className="w-4 h-4 mr-2" /> Savings Plans
        </button>
        <button
          onClick={() => { setActiveTab('policies'); setSelectedPlan(null); setViewingPolicy(null); }}
          className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'policies' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          My Policies
        </button>
        <button
          onClick={() => { setActiveTab('claims'); setSelectedPlan(null); setViewingPolicy(null); }}
          className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'claims' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          File a Claim
        </button>
      </div>

      {/* SAVINGS PLANS VIEW */}
      {activeTab === 'savings' && !selectedPlan && (
        <>
           <div className="bg-indigo-900 rounded-2xl p-8 text-white relative overflow-hidden shadow-lg">
             <div className="relative z-10 max-w-2xl">
                <h2 className="text-2xl font-bold mb-2 flex items-center">
                  <TrendingUp className="w-6 h-6 mr-2 text-indigo-400" />
                  Savings + Protection
                </h2>
                <p className="text-indigo-100 text-sm mb-4">
                  These specialized plans help you build wealth for the future (Children's Education, Retirement) while providing life insurance coverage. 
                  Get returns on your premiums if no claims are made!
                </p>
             </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {savingsPlans.map((plan) => (
                <div key={plan.id} className="bg-white rounded-xl p-6 border border-slate-200 hover:border-indigo-300 shadow-sm hover:shadow-lg transition-all cursor-pointer group" onClick={() => openBuilder(plan)}>
                  <div className="flex justify-between items-start mb-4">
                     <div className="bg-indigo-50 w-14 h-14 rounded-full flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                       {getIcon(plan.type)}
                     </div>
                     <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">
                       {plan.type.toUpperCase()}
                     </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <p className="text-slate-500 text-sm mb-4">{plan.description}</p>
                  
                  <div className="space-y-2 mb-6">
                     <div className="flex items-center text-sm text-slate-600">
                        <Check className="w-4 h-4 text-emerald-500 mr-2" />
                        <span>Guaranteed Payout</span>
                     </div>
                     <div className="flex items-center text-sm text-slate-600">
                        <Check className="w-4 h-4 text-emerald-500 mr-2" />
                        <span>Tax Free Returns</span>
                     </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div>
                      <span className="text-xs text-slate-400">Monthly Contribution</span>
                      <div className="font-bold text-slate-900">₦{plan.basePremium.toLocaleString()}</div>
                    </div>
                    <Button variant="outline" className="text-indigo-600 border-indigo-200 hover:bg-indigo-50">View Details</Button>
                  </div>
                </div>
              ))}
           </div>
        </>
      )}

      {/* MARKETPLACE VIEW */}
      {activeTab === 'market' && !selectedPlan && (
        <>
          {/* AI Banner */}
          <div className="bg-gradient-to-r from-emerald-900 to-slate-900 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg">
            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <div className="max-w-xl">
                  <h2 className="text-2xl font-bold mb-2 flex items-center">
                    <Sparkles className="w-5 h-5 text-amber-400 mr-2" />
                    AI Insurance Advisor
                  </h2>
                  <p className="text-emerald-100 text-sm mb-4">
                    Not sure what you need? Our AI analyzes your transaction history and financial goals to recommend the perfect safety net.
                  </p>
                  
                  {aiRecommendation ? (
                    <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20 animate-fade-in">
                       <p className="text-amber-300 font-bold mb-1 uppercase text-xs tracking-wider">Top Recommendation</p>
                       <p className="text-white mb-3 text-sm">{aiRecommendation.text}</p>
                       <Button 
                        variant="secondary" 
                        className="bg-white text-slate-900 hover:bg-emerald-50 text-xs py-1.5"
                        onClick={() => {
                           const plan = BASE_PLANS.find(p => p.type === aiRecommendation.type);
                           if (plan) openBuilder(plan);
                        }}
                       >
                         View Recommended Plan
                       </Button>
                    </div>
                  ) : (
                    <Button 
                      onClick={handleAiAnalyze}
                      isLoading={aiLoading}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white border-none"
                    >
                      Analyze My Needs
                    </Button>
                  )}
                </div>
                <Shield className="hidden md:block w-32 h-32 text-emerald-800 opacity-20" />
              </div>
            </div>
          </div>

          <h3 className="text-lg font-bold text-slate-800 mt-6 mb-4">Explore Products</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BASE_PLANS.map((plan) => (
              <div key={plan.id} className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg hover:border-emerald-200 transition-all group cursor-pointer flex flex-col justify-between" onClick={() => openBuilder(plan)}>
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                      {getIcon(plan.type)}
                    </div>
                    <div className="bg-slate-100 px-2 py-1 rounded text-[10px] font-bold text-slate-600 uppercase tracking-wide flex items-center">
                      <Building2 className="w-3 h-3 mr-1" />
                      {plan.provider}
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-900 text-lg mb-1">{plan.name}</h4>
                  <p className="text-slate-500 text-sm mb-4 leading-relaxed">{plan.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {plan.features.slice(0, 2).map((feat, i) => (
                      <span key={i} className="text-[10px] bg-slate-50 text-slate-600 px-2 py-1 rounded-md border border-slate-100">
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div>
                    <span className="text-xs text-slate-400 uppercase font-semibold">Starts at</span>
                    <div className="font-bold text-slate-900">₦{plan.basePremium.toLocaleString()}<span className="text-xs font-normal text-slate-400">/mo</span></div>
                  </div>
                  <button className="text-emerald-600 font-medium text-sm flex items-center hover:underline">
                    View Offer <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* PRODUCT BUILDER VIEW */}
      {selectedPlan && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row min-h-[500px]">
          {/* Left: Configuration */}
          <div className="flex-1 p-8">
            <button onClick={() => setSelectedPlan(null)} className="text-sm text-slate-500 hover:text-slate-800 mb-6 flex items-center">
               <ArrowLeft className="w-4 h-4 mr-1" /> Back to Marketplace
            </button>
            
            <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-4">
                 <div className="bg-emerald-50 p-3 rounded-xl">
                   {getIcon(selectedPlan.type, 'lg')}
                 </div>
                 <div>
                   <h2 className="text-2xl font-bold text-slate-900">{selectedPlan.name}</h2>
                   <div className="flex items-center text-sm text-slate-500">
                     <Building2 className="w-4 h-4 mr-1" />
                     Provided by <span className="font-semibold text-slate-700 ml-1">{selectedPlan.provider}</span>
                   </div>
                 </div>
               </div>
            </div>

            <div className="space-y-8">
               {/* Coverage Slider */}
               <div>
                 <div className="flex justify-between mb-2">
                   <label className="text-sm font-semibold text-slate-700">Coverage Limit</label>
                   <span className="text-emerald-600 font-bold">₦{(selectedPlan.baseCoverage * coverageMultiplier).toLocaleString()}</span>
                 </div>
                 <input 
                   type="range" 
                   min="0.5" 
                   max="3" 
                   step="0.5" 
                   value={coverageMultiplier}
                   onChange={(e) => setCoverageMultiplier(parseFloat(e.target.value))}
                   className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                 />
                 <div className="flex justify-between mt-1 text-xs text-slate-400">
                   <span>Basic</span>
                   <span>Standard</span>
                   <span>Premium</span>
                 </div>
               </div>

               {/* Included Features */}
               <div>
                 <h4 className="text-sm font-semibold text-slate-700 mb-3">Policy Highlights</h4>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                   {selectedPlan.features.map((feature, i) => (
                     <div key={i} className="flex items-start p-3 bg-slate-50 rounded-lg border border-slate-100">
                       <Check className="w-4 h-4 text-emerald-500 mr-2 mt-0.5" />
                       <span className="text-sm text-slate-700">{feature}</span>
                     </div>
                   ))}
                   {coverageMultiplier > 1.5 && (
                     <div className="flex items-start p-3 bg-emerald-50 rounded-lg border border-emerald-100 animate-fade-in">
                       <Check className="w-4 h-4 text-emerald-600 mr-2 mt-0.5" />
                       <span className="text-sm text-emerald-800 font-medium">Priority Claims Processing</span>
                     </div>
                   )}
                 </div>
               </div>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="w-full md:w-80 bg-slate-50 p-8 border-l border-slate-200 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-6">Quote Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Base Premium</span>
                  <span className="font-medium">₦{selectedPlan.basePremium.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Tier Multiplier</span>
                  <span className="font-medium">x{coverageMultiplier}</span>
                </div>
                {coverageMultiplier > 2 && (
                  <div className="flex justify-between text-sm text-emerald-600">
                    <span>High Value Discount</span>
                    <span>-10%</span>
                  </div>
                )}
                <div className="border-t border-slate-200 pt-4 flex justify-between items-center">
                  <span className="font-bold text-slate-900">Total Monthly</span>
                  <span className="text-2xl font-bold text-slate-900">
                    ₦{Math.round(selectedPlan.basePremium * coverageMultiplier * (coverageMultiplier > 2 ? 0.9 : 1)).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
               <Button onClick={handlePurchase} className="w-full justify-center">
                 Purchase Policy
               </Button>
               <p className="text-xs text-center text-slate-400">
                 Provider: {selectedPlan.provider}
                 <br/>
                 T&C apply. Recurring billing via wallet.
               </p>
            </div>
          </div>
        </div>
      )}

      {/* MY POLICIES VIEW */}
      {activeTab === 'policies' && !viewingPolicy && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">Your Portfolio</h3>
            <span className="text-sm text-slate-500">{MOCK_POLICIES.length} policies found</span>
          </div>

          {MOCK_POLICIES.length > 0 ? (
             MOCK_POLICIES.map(policy => (
               <div key={policy.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${policy.status === 'Active' ? 'bg-emerald-50' : 'bg-slate-100'}`}>
                          {getIcon(policy.planName)}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-lg">{policy.planName}</h4>
                          <p className="text-sm text-slate-500 flex items-center">
                            <span className="font-mono mr-2">{policy.id}</span>
                            <span className="text-slate-300">|</span>
                            <span className="ml-2 flex items-center text-xs font-semibold text-slate-600">
                               <Building2 className="w-3 h-3 mr-1" />
                               {policy.provider}
                            </span>
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        policy.status === 'Active' 
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}>
                        {policy.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4 border-t border-slate-50">
                       <div>
                         <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Coverage</p>
                         <div className="flex items-center text-slate-900 font-semibold">
                           <Shield className="w-4 h-4 text-emerald-500 mr-2" />
                           ₦{policy.coverageAmount.toLocaleString()}
                         </div>
                       </div>
                       <div>
                         <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Premium</p>
                         <div className="flex items-center text-slate-900 font-semibold">
                            <CreditCard className="w-4 h-4 text-emerald-500 mr-2" />
                            ₦{policy.premium.toLocaleString()}<span className="text-xs text-slate-400 ml-1">/mo</span>
                         </div>
                       </div>
                       <div>
                         <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Start Date</p>
                         <div className="flex items-center text-slate-900 font-semibold">
                            <Calendar className="w-4 h-4 text-emerald-500 mr-2" />
                            {policy.startDate}
                         </div>
                       </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-slate-50 flex justify-end">
                      <Button variant="outline" onClick={() => setViewingPolicy(policy)} className="text-sm">
                        View Details
                      </Button>
                    </div>
                  </div>
               </div>
             ))
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
               <Shield className="w-12 h-12 text-slate-300 mx-auto mb-4" />
               <p className="text-slate-500">No policies found. Visit the marketplace to get started.</p>
               <Button variant="outline" className="mt-4" onClick={() => setActiveTab('market')}>
                 Browse Marketplace
               </Button>
            </div>
          )}
        </div>
      )}

      {/* POLICY DETAILS VIEW */}
      {activeTab === 'policies' && viewingPolicy && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
           {/* Header */}
           <div className="bg-slate-900 text-white p-8">
              <button 
                onClick={() => setViewingPolicy(null)} 
                className="text-slate-400 hover:text-white mb-6 flex items-center text-sm transition-colors"
              >
                 <ArrowLeft className="w-4 h-4 mr-2" /> Back to List
              </button>
              <div className="flex justify-between items-start">
                 <div className="flex items-center gap-4">
                    <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                       {getIcon(viewingPolicy.planName, 'lg')}
                    </div>
                    <div>
                       <h2 className="text-2xl font-bold mb-1">{viewingPolicy.planName}</h2>
                       <p className="text-slate-300 flex items-center gap-2 mb-2">
                         ID: <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-sm">{viewingPolicy.id}</span>
                       </p>
                       <div className="inline-flex items-center bg-emerald-900/50 text-emerald-100 text-xs px-2 py-1 rounded border border-emerald-800">
                         <Building2 className="w-3 h-3 mr-1" />
                         Provided by {viewingPolicy.provider}
                       </div>
                    </div>
                 </div>
                 <div className={`px-4 py-2 rounded-lg font-bold ${
                    viewingPolicy.status === 'Active' ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300'
                 }`}>
                    {viewingPolicy.status}
                 </div>
              </div>
           </div>

           {/* Certificate Content */}
           <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 <div className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Policy Details</h3>
                    
                    <div className="grid grid-cols-2 gap-y-6">
                       <div>
                          <p className="text-sm text-slate-500 mb-1">Policy Holder</p>
                          <p className="font-medium text-slate-900">{user.name}</p>
                       </div>
                       <div>
                          <p className="text-sm text-slate-500 mb-1">Effective Date</p>
                          <p className="font-medium text-slate-900">{viewingPolicy.startDate}</p>
                       </div>
                       <div>
                          <p className="text-sm text-slate-500 mb-1">Coverage Amount</p>
                          <p className="font-medium text-slate-900 text-lg">₦{viewingPolicy.coverageAmount.toLocaleString()}</p>
                       </div>
                       <div>
                          <p className="text-sm text-slate-500 mb-1">Monthly Premium</p>
                          <p className="font-medium text-slate-900 text-lg">₦{viewingPolicy.premium.toLocaleString()}</p>
                       </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                       <h4 className="font-semibold text-slate-800 mb-2 flex items-center text-sm">
                          <Check className="w-4 h-4 text-emerald-500 mr-2" />
                          Coverage Includes
                       </h4>
                       <ul className="space-y-2 pl-6 list-disc text-sm text-slate-600 marker:text-emerald-300">
                          {/* Mocking features based on plan name for demo since features aren't in Policy object yet */}
                          <li>Primary benefit coverage up to limit</li>
                          <li>24/7 Support access via {viewingPolicy.provider}</li>
                          <li>Digital claims processing</li>
                       </ul>
                    </div>
                 </div>

                 <div className="space-y-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">Actions</h3>
                      <div className="space-y-3">
                         <button className="w-full flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all group text-left">
                            <div className="flex items-center">
                               <div className="bg-slate-100 p-2 rounded-lg group-hover:bg-white text-slate-600 group-hover:text-emerald-600 transition-colors">
                                 <FileText className="w-5 h-5" />
                               </div>
                               <div className="ml-3">
                                  <span className="block font-semibold text-slate-800">Policy Document</span>
                                  <span className="text-xs text-slate-500">View full terms and conditions from {viewingPolicy.provider}</span>
                               </div>
                            </div>
                            <Download className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
                         </button>

                         <button className="w-full flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all group text-left">
                            <div className="flex items-center">
                               <div className="bg-slate-100 p-2 rounded-lg group-hover:bg-white text-slate-600 group-hover:text-emerald-600 transition-colors">
                                 <CreditCard className="w-5 h-5" />
                               </div>
                               <div className="ml-3">
                                  <span className="block font-semibold text-slate-800">Payment History</span>
                                  <span className="text-xs text-slate-500">Download receipts and invoices</span>
                               </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
                         </button>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100">
                       {viewingPolicy.status === 'Active' ? (
                          <div className="flex gap-3">
                             <Button 
                               variant="outline" 
                               className="flex-1"
                               onClick={() => alert("Certificate downloaded!")}
                             >
                                <Download className="w-4 h-4 mr-2" /> Certificate
                             </Button>
                             <Button 
                               className="flex-1"
                               onClick={() => {
                                 setViewingPolicy(null);
                                 setActiveTab('claims');
                                 setActiveClaimPolicy(viewingPolicy.id);
                               }}
                             >
                                File a Claim
                             </Button>
                          </div>
                       ) : (
                          <Button 
                             className="w-full"
                             onClick={() => handleRenewPolicy(viewingPolicy)}
                          >
                             Renew Policy Now
                          </Button>
                       )}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* CLAIMS VIEW */}
      {activeTab === 'claims' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Claim Form */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
               <AlertCircle className="w-5 h-5 text-amber-500 mr-2" />
               File a New Claim
             </h3>
             
             <form onSubmit={handleClaimSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Select Policy</label>
                  <select 
                    required
                    className="w-full rounded-lg border-slate-300 border p-2 text-sm"
                    value={activeClaimPolicy}
                    onChange={(e) => setActiveClaimPolicy(e.target.value)}
                  >
                    <option value="">-- Select a policy --</option>
                    {MOCK_POLICIES.map(p => (
                      <option key={p.id} value={p.id} disabled={p.status !== 'Active'}>
                        {p.planName} ({p.provider}) {p.status !== 'Active' ? '- Expired' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Incident Description</label>
                  <textarea 
                    required
                    rows={4}
                    className="w-full rounded-lg border-slate-300 border p-2 text-sm"
                    placeholder="Describe what happened, when, and where..."
                    value={claimDescription}
                    onChange={(e) => setClaimDescription(e.target.value)}
                  />
                </div>

                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Evidence Upload</label>
                   <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer">
                      <Camera className="w-8 h-8 text-slate-400 mb-2" />
                      <p className="text-xs text-slate-500">Tap to take a photo or upload document</p>
                   </div>
                </div>

                <Button type="submit" isLoading={claimSubmitting} className="w-full">
                  Submit Claim
                </Button>
             </form>
          </div>

          {/* Claims History */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Claims</h3>
            <div className="space-y-4">
              {claimsList.length === 0 && (
                <div className="bg-slate-50 p-8 rounded-xl text-center border border-slate-200 border-dashed">
                  <p className="text-slate-400 text-sm">No claims history</p>
                </div>
              )}
              {claimsList.map((claim) => (
                <div key={claim.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                   <div className="flex justify-between items-start mb-2">
                     <span className="text-xs font-mono text-slate-400">{claim.id}</span>
                     <span className={`text-xs px-2 py-1 rounded font-bold ${
                       claim.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                       claim.status === 'Reviewing' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                     }`}>
                       {claim.status}
                     </span>
                   </div>
                   <p className="text-sm font-medium text-slate-900 mb-1">{claim.description}</p>
                   <p className="text-xs text-slate-500">{claim.date}</p>
                   
                   {claim.status === 'Reviewing' && (
                     <div className="mt-3 bg-blue-50 p-2 rounded text-xs text-blue-700 flex items-center">
                       <Sparkles className="w-3 h-3 mr-1" />
                       AI Fraud Detection in progress...
                     </div>
                   )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
