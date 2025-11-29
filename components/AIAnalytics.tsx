import React, { useState } from 'react';
import { Bot, Sparkles, Globe, User, Users, PieChart as PieIcon, ShieldCheck } from 'lucide-react';
import { Transaction } from '../types';
import { generateFinancialAdvice } from '../services/geminiService';
import { Button } from './Button';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface AIAnalyticsProps {
  transactions: Transaction[];
}

export const AIAnalytics: React.FC<AIAnalyticsProps> = ({ transactions }) => {
  const [activeTab, setActiveTab] = useState<'individual' | 'community' | 'market'>('individual');
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Group transactions by category for visualization
  const categoryData = transactions.reduce((acc, curr) => {
    if (curr.type === 'debit') {
      const existing = acc.find(i => i.name === curr.category);
      if (existing) {
        existing.value += curr.amount;
      } else {
        acc.push({ name: curr.category, value: curr.amount });
      }
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const handleGenerateInsight = async (type: 'individual' | 'community' | 'market') => {
    setLoading(true);
    setActiveTab(type);
    const result = await generateFinancialAdvice(transactions, type);
    setInsight(result);
    setLoading(false);
  };

  // Initial load
  React.useEffect(() => {
    if (!insight) {
      handleGenerateInsight('individual');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Left Panel: Controls & Visuals */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
             <Bot className="w-5 h-5 text-emerald-600 mr-2" />
             AI Analyst Context
           </h3>
           <p className="text-sm text-slate-500 mb-6">
             Select a lens for our Gemini-powered AI to analyze your financial health.
           </p>

           <div className="space-y-3">
             <button
               onClick={() => handleGenerateInsight('individual')}
               className={`w-full text-left p-4 rounded-lg border transition-all ${
                 activeTab === 'individual' 
                   ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500' 
                   : 'border-slate-200 hover:bg-slate-50'
               }`}
             >
               <div className="flex items-center justify-between">
                 <div className="flex items-center">
                   <User className={`w-5 h-5 mr-3 ${activeTab === 'individual' ? 'text-emerald-600' : 'text-slate-400'}`} />
                   <div>
                     <span className={`block font-semibold ${activeTab === 'individual' ? 'text-emerald-900' : 'text-slate-700'}`}>My Habits</span>
                     <span className="text-xs text-slate-500">Spending analysis & budgeting</span>
                   </div>
                 </div>
               </div>
             </button>

             <button
               onClick={() => handleGenerateInsight('community')}
               className={`w-full text-left p-4 rounded-lg border transition-all ${
                 activeTab === 'community' 
                   ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' 
                   : 'border-slate-200 hover:bg-slate-50'
               }`}
             >
               <div className="flex items-center justify-between">
                 <div className="flex items-center">
                   <Users className={`w-5 h-5 mr-3 ${activeTab === 'community' ? 'text-blue-600' : 'text-slate-400'}`} />
                   <div>
                     <span className={`block font-semibold ${activeTab === 'community' ? 'text-blue-900' : 'text-slate-700'}`}>Community Trends</span>
                     <span className="text-xs text-slate-500">Peer comparison & social savings</span>
                   </div>
                 </div>
               </div>
             </button>

             <button
               onClick={() => handleGenerateInsight('market')}
               className={`w-full text-left p-4 rounded-lg border transition-all ${
                 activeTab === 'market' 
                   ? 'border-purple-500 bg-purple-50 ring-1 ring-purple-500' 
                   : 'border-slate-200 hover:bg-slate-50'
               }`}
             >
               <div className="flex items-center justify-between">
                 <div className="flex items-center">
                   <Globe className={`w-5 h-5 mr-3 ${activeTab === 'market' ? 'text-purple-600' : 'text-slate-400'}`} />
                   <div>
                     <span className={`block font-semibold ${activeTab === 'market' ? 'text-purple-900' : 'text-slate-700'}`}>Market Insights</span>
                     <span className="text-xs text-slate-500">Investment sectors & economic news</span>
                   </div>
                 </div>
               </div>
             </button>
           </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 min-h-[300px]">
           <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center">
             <PieIcon className="w-4 h-4 mr-2" />
             Spending Breakdown
           </h3>
           <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `₦${value.toLocaleString()}`} />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* Right Panel: AI Output */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 h-full flex flex-col">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
             <h2 className="text-xl font-bold text-slate-900 flex items-center">
               <Sparkles className="w-5 h-5 text-amber-500 mr-2" />
               Gemini Analysis
             </h2>
             {loading && <span className="text-sm text-emerald-600 animate-pulse font-medium">Processing Transaction Data...</span>}
          </div>
          
          <div className="p-8 flex-1 overflow-y-auto">
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                <div className="h-20 bg-slate-100 rounded w-full mt-6"></div>
              </div>
            ) : (
              <div className="prose prose-slate max-w-none">
                 <div className="whitespace-pre-wrap font-medium text-slate-700 leading-relaxed">
                    {insight}
                 </div>
                 
                 {!insight && (
                   <div className="text-center py-12 text-slate-400">
                     <Bot className="w-12 h-12 mx-auto mb-3 opacity-20" />
                     <p>Select a category to generate insights.</p>
                   </div>
                 )}
              </div>
            )}
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-100 rounded-b-xl">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-sm">
                <p className="font-semibold text-slate-800">Data Privacy Note</p>
                <p className="text-slate-600">Your financial data is analyzed securely. We do not store raw transaction logs on external servers for longer than the session duration. NDPR Compliant.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};