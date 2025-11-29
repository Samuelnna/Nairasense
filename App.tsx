
import React, { useState } from 'react';
import { LayoutDashboard, Wallet, Sparkles, Shield, LogOut, Menu, X, User as UserIcon, Grid, Users, PiggyBank } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { Login } from './components/Login';
import { AIAnalytics } from './components/AIAnalytics';
import { Insurance } from './components/Insurance';
import { Profile } from './components/Profile';
import { Wallet as WalletComponent } from './components/Wallet';
import { Services } from './components/Services';
import { Community } from './components/Community';
import { Savings } from './components/Savings';
import { AppView, UserProfile, Transaction } from './types';

// Mock Data
const MOCK_USER: UserProfile = {
  name: "Adewale Johnson",
  email: "adewale@nairasense.ng",
  balance: 452000,
  savings: 125000,
  riskScore: 85
};

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', date: '2023-10-24', merchant: 'Shoprite Lekki', amount: 45000, type: 'debit', category: 'Groceries' },
  { id: '2', date: '2023-10-23', merchant: 'Uber Ride', amount: 3500, type: 'debit', category: 'Transport' },
  { id: '3', date: '2023-10-22', merchant: 'Transfer from Chioma', amount: 25000, type: 'credit', category: 'Transfer' },
  { id: '4', date: '2023-10-20', merchant: 'Netflix Subscription', amount: 4500, type: 'debit', category: 'Entertainment' },
  { id: '5', date: '2023-10-18', merchant: 'Fuel Station', amount: 15000, type: 'debit', category: 'Transport' },
  { id: '6', date: '2023-10-15', merchant: 'Salary Deposit', amount: 350000, type: 'credit', category: 'Salary' },
  { id: '7', date: '2023-10-12', merchant: 'Chicken Republic', amount: 4500, type: 'debit', category: 'Food' },
  { id: '8', date: '2023-10-10', merchant: 'MTN Data Bundle', amount: 5000, type: 'debit', category: 'Utilities' },
  { id: '9', date: '2023-10-05', merchant: 'Ikeja Electric', amount: 20000, type: 'debit', category: 'Utilities' },
  { id: '10', date: '2023-10-01', merchant: 'Cowrywise Savings', amount: 50000, type: 'debit', category: 'Savings' },
];

export default function App() {
  const [view, setView] = useState<AppView>(AppView.LOGIN);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogin = () => {
    setView(AppView.DASHBOARD);
  };

  const handleLogout = () => {
    setView(AppView.LOGIN);
  };

  const navItems = [
    { id: AppView.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: AppView.SERVICES, label: 'Services', icon: Grid },
    { id: AppView.WALLET, label: 'Wallet', icon: Wallet },
    { id: AppView.SAVINGS, label: 'Savings', icon: PiggyBank },
    { id: AppView.ANALYTICS, label: 'AI Insights', icon: Sparkles },
    { id: AppView.INSURANCE, label: 'Insurance', icon: Shield },
    { id: AppView.COMMUNITY, label: 'Community', icon: Users },
  ];

  if (view === AppView.LOGIN) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <span className="font-bold text-white">N</span>
            </div>
            <span className="text-xl font-bold tracking-tight">NairaSense</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400">
            <X size={24} />
          </button>
        </div>

        <nav className="mt-8 px-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setView(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                  view === item.id 
                    ? 'bg-emerald-600 text-white' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={20} className="mr-3" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
          
          <button
              onClick={() => {
                setView(AppView.PROFILE);
                setIsSidebarOpen(false);
              }}
              className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                view === AppView.PROFILE
                  ? 'bg-emerald-600 text-white' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <UserIcon size={20} className="mr-3" />
              <span className="font-medium">Profile</span>
            </button>
        </nav>

        <div className="absolute bottom-0 w-full p-6 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center text-slate-400 hover:text-white transition-colors w-full"
          >
            <LogOut size={20} className="mr-3" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="mr-4 lg:hidden text-slate-600"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-semibold text-slate-800">
              {view === AppView.PROFILE ? 'My Profile' : navItems.find(n => n.id === view)?.label}
            </h1>
          </div>
          
          <button 
            onClick={() => setView(AppView.PROFILE)}
            className="flex items-center space-x-4 hover:bg-slate-50 p-2 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-slate-900">{MOCK_USER.name}</p>
              <p className="text-xs text-slate-500">Premium Account</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center border-2 border-emerald-500 text-emerald-700 font-bold shadow-sm">
              {MOCK_USER.name.charAt(0)}
            </div>
          </button>
        </header>

        {/* View Content */}
        <div className="p-6 max-w-7xl mx-auto">
          {view === AppView.DASHBOARD && (
            <Dashboard user={MOCK_USER} transactions={MOCK_TRANSACTIONS} onNavigate={setView} />
          )}
          {view === AppView.ANALYTICS && (
            <AIAnalytics transactions={MOCK_TRANSACTIONS} />
          )}
          {view === AppView.INSURANCE && (
            <Insurance user={MOCK_USER} transactions={MOCK_TRANSACTIONS} />
          )}
          {view === AppView.PROFILE && (
            <Profile user={MOCK_USER} />
          )}
          {view === AppView.WALLET && (
            <WalletComponent user={MOCK_USER} transactions={MOCK_TRANSACTIONS} />
          )}
          {view === AppView.SAVINGS && (
            <Savings user={MOCK_USER} />
          )}
          {view === AppView.SERVICES && (
            <Services onNavigate={setView} />
          )}
          {view === AppView.COMMUNITY && (
            <Community />
          )}
        </div>
      </main>
    </div>
  );
}
