
import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  ShieldCheck, 
  Users,
  ArrowUpRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { UserProfile, Transaction, AppView } from '../types';
import { ChatWidget } from './ChatWidget';

interface DashboardProps {
  user: UserProfile;
  transactions: Transaction[];
  onNavigate: (view: AppView) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, transactions, onNavigate }) => {
  // Process data for the chart (balance history simulation)
  const chartData = transactions.slice().reverse().map((t, index) => ({
    name: t.date.split('-').slice(1).join('/'), // MM/DD
    amount: t.amount,
    balance: user.balance - (index * 5000) + (Math.random() * 10000) // Mock historical balance
  }));

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* AI Chat Widget */}
      <ChatWidget />

      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Balance</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-2">₦{user.balance.toLocaleString()}</h3>
              <p className="text-sm text-emerald-600 mt-2 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" /> +12.5% from last month
              </p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg">
              <Wallet className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Savings</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-2">₦{user.savings.toLocaleString()}</h3>
              <p className="text-sm text-emerald-600 mt-2 flex items-center">
                <Users className="w-4 h-4 mr-1" /> Target: ₦{(user.savings * 1.5).toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Credit Risk Score</p>
              <div className="flex items-end gap-2">
                <h3 className="text-3xl font-bold text-slate-900 mt-2">{user.riskScore}</h3>
                <span className="mb-1 text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">Excellent</span>
              </div>
              <p className="text-sm text-slate-500 mt-2">
                Eligible for Low-Interest Loans
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h4 className="text-lg font-semibold text-slate-800 mb-6">Cash Flow Analytics</h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  formatter={(value: number) => [`₦${value.toLocaleString()}`, 'Balance']}
                />
                <Area type="monotone" dataKey="balance" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorBalance)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions & Community */}
        <div className="flex flex-col gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex-1">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-lg font-semibold text-slate-800">Recent Activity</h4>
              <button 
                onClick={() => onNavigate(AppView.WALLET)}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                View All
              </button>
            </div>
            <div className="space-y-4">
              {transactions.slice(0, 4).map((t) => (
                <div key={t.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${t.type === 'credit' ? 'bg-emerald-100' : 'bg-red-100'}`}>
                      {t.type === 'credit' ? (
                        <TrendingUp className={`w-4 h-4 ${t.type === 'credit' ? 'text-emerald-600' : 'text-red-600'}`} />
                      ) : (
                        <TrendingDown className={`w-4 h-4 ${t.type === 'credit' ? 'text-emerald-600' : 'text-red-600'}`} />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{t.merchant}</p>
                      <p className="text-xs text-slate-500">{t.date}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${t.type === 'credit' ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {t.type === 'credit' ? '+' : '-'}₦{t.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
             <div className="flex items-start gap-4">
                <div className="bg-white p-3 rounded-full shadow-sm">
                   <Users className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                   <h5 className="text-base font-bold text-indigo-900">Community Challenge</h5>
                   <p className="text-xs text-indigo-700 mt-1 leading-relaxed">
                     Join 2,400 others in the "No-Spend Weekend" challenge to save approx ₦15,000.
                   </p>
                   <button 
                    onClick={() => onNavigate(AppView.COMMUNITY)}
                    className="mt-3 text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center bg-white px-3 py-1.5 rounded-lg border border-indigo-200 shadow-sm"
                   >
                     Join Now <ArrowUpRight className="w-3 h-3 ml-1" />
                   </button>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};
