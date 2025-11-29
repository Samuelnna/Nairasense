import React, { useState } from 'react';
import { User, Mail, Phone, Shield, Bell, CreditCard, Save } from 'lucide-react';
import { UserProfile } from '../types';
import { Button } from './Button';

interface ProfileProps {
  user: UserProfile;
}

export const Profile: React.FC<ProfileProps> = ({ user }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: '+234 800 000 0000',
    address: 'Lagos, Nigeria'
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
        setSaving(false);
        alert('Profile updated successfully!');
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
            <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Avatar Section */}
                <div className="flex flex-col items-center space-y-4 w-full md:w-auto">
                    <div className="w-32 h-32 rounded-full bg-emerald-100 border-4 border-white shadow-lg flex items-center justify-center text-4xl font-bold text-emerald-700 relative">
                        {user.name.charAt(0)}
                        <span className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></span>
                    </div>
                    <button className="text-sm text-emerald-600 font-medium hover:text-emerald-700 hover:underline">
                        Change Photo
                    </button>
                </div>

                {/* Form Section */}
                <div className="flex-1 w-full">
                    <h2 className="text-2xl font-bold text-slate-900 mb-1">Personal Details</h2>
                    <p className="text-slate-500 text-sm mb-6">Manage your account information</p>
                    
                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <input 
                                        name="name"
                                        type="text" 
                                        value={formData.name} 
                                        onChange={handleChange}
                                        className="pl-10 block w-full rounded-lg border-slate-300 border p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 transition-shadow"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <input 
                                        name="email"
                                        type="email" 
                                        value={formData.email} 
                                        onChange={handleChange}
                                        className="pl-10 block w-full rounded-lg border-slate-300 border p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 transition-shadow"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <input 
                                        name="phone"
                                        type="text" 
                                        value={formData.phone} 
                                        onChange={handleChange}
                                        className="pl-10 block w-full rounded-lg border-slate-300 border p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 transition-shadow"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Credit Risk Score</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Shield className="h-4 w-4 text-emerald-500" />
                                    </div>
                                    <input 
                                        type="text" 
                                        value={`${user.riskScore}/100 - Excellent`} 
                                        readOnly
                                        className="pl-10 block w-full rounded-lg border-emerald-200 bg-emerald-50 border p-2.5 text-sm text-emerald-800 font-semibold cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100 flex justify-end">
                            <Button type="submit" isLoading={saving}>
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        {/* Additional Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                        <Bell className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-slate-900">Notifications</h3>
                </div>
                <div className="space-y-4">
                    <label className="flex items-center justify-between cursor-pointer group">
                        <span className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors">Transaction Alerts</span>
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500" />
                    </label>
                    <label className="flex items-center justify-between cursor-pointer group">
                        <span className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors">Weekly AI Insights</span>
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500" />
                    </label>
                    <label className="flex items-center justify-between cursor-pointer group">
                        <span className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors">Marketing & Offers</span>
                        <input type="checkbox" className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500" />
                    </label>
                </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                        <CreditCard className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-slate-900">Payment Methods</h3>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-slate-100 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-6 bg-slate-300 rounded flex items-center justify-center text-[10px] text-white font-bold">VISA</div>
                            <span className="text-sm font-medium text-slate-700">**** 4242</span>
                        </div>
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-medium">Primary</span>
                    </div>
                    <Button variant="outline" className="w-full text-sm py-2">
                        Add New Card
                    </Button>
                </div>
            </div>
        </div>
    </div>
  );
};