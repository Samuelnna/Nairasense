
export enum AppView {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  WALLET = 'WALLET',
  SAVINGS = 'SAVINGS',
  ANALYTICS = 'ANALYTICS',
  INSURANCE = 'INSURANCE',
  PROFILE = 'PROFILE',
  SERVICES = 'SERVICES',
  COMMUNITY = 'COMMUNITY',
}

export interface Transaction {
  id: string;
  date: string;
  merchant: string;
  amount: number;
  type: 'debit' | 'credit';
  category: string;
}

export interface InsurancePlan {
  id: string;
  name: string;
  provider: string; // Insurance Company Name
  basePremium: number; // Monthly base
  baseCoverage: number;
  type: 'health' | 'agriculture' | 'device' | 'life' | 'education' | 'business';
  description: string;
  features: string[];
}

export interface UserProfile {
  name: string;
  email: string;
  balance: number;
  savings: number;
  riskScore: number; // 0-100
}

export interface InsurancePolicy {
  id: string;
  planId: string;
  planName: string;
  provider: string;
  coverageAmount: number;
  premium: number;
  startDate: string;
  status: 'Active' | 'Expired';
}

export interface Claim {
  id: string;
  policyId: string;
  date: string;
  description: string;
  amount: number;
  status: 'Pending' | 'Approved' | 'Reviewing';
}

export interface TransactionPreview {
  type: 'transfer' | 'airtime' | 'data' | 'electricity';
  amount: number;
  recipient: string; // Account Name or Phone Number
  description?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  transactionPreview?: TransactionPreview;
}

export interface Challenge {
  id: string;
  title: string;
  category: 'Savings' | 'Investment' | 'Spending';
  description: string;
  participants: number;
  targetAmount: number;
  currentAmount: number; // For the user or total pool
  daysLeft: number;
  joined: boolean;
  imageColor: string;
}
