
import React, { useState } from 'react';
import { Users, TrendingUp, Trophy, ArrowRight, Target, Plus, UserPlus, MessageCircle, Check } from 'lucide-react';
import { Button } from './Button';
import { Challenge } from '../types';

export const Community: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'challenges' | 'leaderboard'>('challenges');
  const [copied, setCopied] = useState(false);

  // Mock Data as State to allow updates
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: '1',
      title: 'Detty December Stash',
      category: 'Savings',
      description: 'Save ₦500 daily to have a blast in December without debt.',
      participants: 1240,
      targetAmount: 50000,
      currentAmount: 15000,
      daysLeft: 45,
      joined: true,
      imageColor: 'bg-purple-100 text-purple-600'
    },
    {
      id: '2',
      title: 'No-Spend Weekend',
      category: 'Spending',
      description: 'Spend ₦0 on non-essentials this weekend. Cooking at home only!',
      participants: 3400,
      targetAmount: 0,
      currentAmount: 0,
      daysLeft: 3,
      joined: false,
      imageColor: 'bg-red-100 text-red-600'
    },
    {
      id: '3',
      title: 'Lagos Rent Circle',
      category: 'Investment',
      description: 'A digitized Ajo (contribution) club for annual rent payments.',
      participants: 12,
      targetAmount: 1500000,
      currentAmount: 450000,
      daysLeft: 120,
      joined: false,
      imageColor: 'bg-emerald-100 text-emerald-600'
    }
  ]);

  const leaderboard = [
    { rank: 1, name: 'Chioma A.', points: 4500, saved: '₦450,000' },
    { rank: 2, name: 'Tunde B.', points: 4200, saved: '₦410,000' },
    { rank: 3, name: 'You', points: 3800, saved: '₦350,000' },
    { rank: 4, name: 'Musa Y.', points: 3650, saved: '₦320,000' },
  ];

  const handleJoinToggle = (id: string) => {
    setChallenges(prev => prev.map(c => {
      if (c.id === id) {
        const newStatus = !c.joined;
        // Mock API interaction
        if (newStatus) {
           alert(`Welcome to the "${c.title}"! Your wallet will be debited according to the schedule.`);
        } else {
           if(confirm(`Are you sure you want to leave "${c.title}"?`)) {
             return { ...c, joined: false, participants: c.participants - 1 };
           }
           return c;
        }
        return { ...c, joined: true, participants: c.participants + 1 };
      }
      return c;
    }));
  };

  const handleCreateCircle = () => {
    alert("Create Circle Feature:\n\nThis will allow you to set up a private 'Ajo' (contribution club) with your friends. You can set the contribution amount, frequency, and payout order.\n\nComing to the next update!");
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText("NS-ADE-2024");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleViewDashboard = (title: string) => {
    alert(`Opening detailed dashboard for ${title}...\n(This would navigate to a detailed analytics view for this specific challenge)`);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Hero Header */}
      <div className="bg-indigo-900 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full blur-3xl opacity-20 -mr-16 -mt-16"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">Community Hub</h2>
          <p className="text-indigo-200 max-w-xl mb-6">
            Join 15,000+ Nigerians achieving financial freedom together. 
            Participate in challenges, join contribution circles (Ajo), and earn rewards.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
              <span className="block text-2xl font-bold">₦45.2M</span>
              <span className="text-xs text-indigo-300">Total Community Savings</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
              <span className="block text-2xl font-bold">245</span>
              <span className="text-xs text-indigo-300">Active Circles</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('challenges')}
          className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
            activeTab === 'challenges' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Active Challenges
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
            activeTab === 'leaderboard' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Leaderboard
        </button>
      </div>

      {activeTab === 'challenges' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main List */}
          <div className="lg:col-span-2 space-y-6">
             <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800">Discover Challenges</h3>
                <Button variant="outline" className="text-xs" onClick={handleCreateCircle}>
                  <Plus className="w-4 h-4 mr-1" /> Create Circle
                </Button>
             </div>

             <div className="space-y-4">
               {challenges.map(challenge => (
                 <div key={challenge.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                       <div className="flex gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${challenge.imageColor}`}>
                             <Trophy className="w-6 h-6" />
                          </div>
                          <div>
                             <h4 className="font-bold text-slate-900 text-lg">{challenge.title}</h4>
                             <p className="text-sm text-slate-500">{challenge.description}</p>
                          </div>
                       </div>
                       <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                         challenge.category === 'Savings' ? 'bg-purple-100 text-purple-700' : 
                         challenge.category === 'Investment' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                       }`}>
                         {challenge.category}
                       </span>
                    </div>

                    {/* Progress for Joined Challenges */}
                    {challenge.joined && (
                      <div className="mb-4 bg-slate-50 p-3 rounded-lg animate-fade-in">
                        <div className="flex justify-between text-xs mb-1">
                           <span className="text-slate-600">Your Progress</span>
                           <span className="font-bold text-slate-900">
                             ₦{challenge.currentAmount.toLocaleString()} / ₦{challenge.targetAmount > 0 ? challenge.targetAmount.toLocaleString() : 'N/A'}
                           </span>
                        </div>
                        {challenge.targetAmount > 0 && (
                          <div className="w-full bg-slate-200 rounded-full h-2">
                             <div 
                               className="bg-indigo-600 h-2 rounded-full transition-all duration-1000" 
                               style={{ width: `${(challenge.currentAmount / challenge.targetAmount) * 100}%` }}
                             ></div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                       <div className="flex items-center text-xs text-slate-500 space-x-4">
                          <span className="flex items-center">
                            <Users className="w-4 h-4 mr-1" /> {challenge.participants.toLocaleString()} joined
                          </span>
                          <span className="flex items-center">
                            <Target className="w-4 h-4 mr-1" /> {challenge.daysLeft} days left
                          </span>
                       </div>
                       
                       {challenge.joined ? (
                         <div className="flex gap-2">
                           <Button variant="outline" className="text-sm h-8 px-3" onClick={() => handleJoinToggle(challenge.id)}>
                             Leave
                           </Button>
                           <Button variant="secondary" className="text-sm h-8 px-4" onClick={() => handleViewDashboard(challenge.title)}>
                             View Dashboard
                           </Button>
                         </div>
                       ) : (
                         <Button className="text-sm h-8 px-4" onClick={() => handleJoinToggle(challenge.id)}>
                           Join Challenge
                         </Button>
                       )}
                    </div>
                 </div>
               ))}
             </div>
          </div>

          {/* Sidebar Widgets */}
          <div className="space-y-6">
             {/* AI Insight Card */}
             <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl border border-indigo-100">
                <div className="flex items-center gap-2 mb-3">
                   <TrendingUp className="w-5 h-5 text-indigo-600" />
                   <h4 className="font-bold text-indigo-900">AI Insight</h4>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                   Based on your spending in "Food", you could save an extra <strong>₦12,500</strong> this month by joining the <em>Cooking Challenge</em>.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full justify-center text-xs bg-white"
                  onClick={() => handleViewDashboard("Cooking Challenge")}
                >
                   View Challenge
                </Button>
             </div>

             {/* Invite Friends */}
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full mb-4">
                   <UserPlus className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 mb-1">Refer & Earn</h4>
                <p className="text-sm text-slate-500 mb-4">
                   Invite friends to a Savings Circle and earn ₦500 when they make their first contribution.
                </p>
                <div className="flex gap-2">
                   <input 
                     type="text" 
                     value="NS-ADE-2024" 
                     readOnly 
                     className="bg-slate-50 border border-slate-200 rounded px-3 py-1 text-sm flex-1 font-mono text-slate-600 focus:outline-none"
                   />
                   <Button className="px-3 w-20" onClick={handleCopyCode}>
                     {copied ? <Check className="w-4 h-4" /> : 'Copy'}
                   </Button>
                </div>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
           <div className="p-6 border-b border-slate-100">
             <h3 className="font-bold text-slate-900">Top Savers this Month</h3>
             <p className="text-sm text-slate-500">Compete to win monthly cash prizes!</p>
           </div>
           <div className="divide-y divide-slate-100">
              {leaderboard.map((user, index) => (
                <div key={index} className={`flex items-center justify-between p-4 ${user.rank === 3 ? 'bg-indigo-50' : 'hover:bg-slate-50'}`}>
                   <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 flex items-center justify-center font-bold rounded-full ${
                        user.rank === 1 ? 'bg-amber-100 text-amber-600' :
                        user.rank === 2 ? 'bg-slate-200 text-slate-600' :
                        user.rank === 3 ? 'bg-orange-100 text-orange-600' : 'text-slate-400'
                      }`}>
                        {user.rank}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                           {user.name.charAt(0)}
                        </div>
                        <div>
                           <p className="font-bold text-slate-900">{user.name}</p>
                           <p className="text-xs text-slate-500">{user.points} pts</p>
                        </div>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="font-bold text-emerald-600">{user.saved}</p>
                      <p className="text-xs text-slate-400">Saved</p>
                   </div>
                </div>
              ))}
           </div>
           <div className="p-4 bg-slate-50 text-center">
              <Button variant="outline" className="text-sm" onClick={() => alert('Full leaderboard functionality available in Premium.')}>
                View Full Rankings
              </Button>
           </div>
        </div>
      )}
    </div>
  );
};
