// Core business types
export interface BusinessData {
  id: string;
  userId: string;
  name: string;
  uploadedAt: Date;
  processedAt?: Date;
  status: 'uploaded' | 'processing' | 'completed' | 'error';
  fileSize: number;
  recordCount: number;
}

export interface SalesRecord {
  id: string;
  date: Date;
  amount: number;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  product?: string;
  category?: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  totalSpent: number;
  lastPurchase: Date;
  purchaseCount: number;
  averageOrderValue: number;
}

export interface Invoice {
  id: string;
  customerId: string;
  amount: number;
  issueDate: Date;
  dueDate: Date;
  paidDate?: Date;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
}

// Analytics results
export interface AnalyticsResult {
  id: string;
  type: AnalyticsType;
  businessDataId: string;
  results: any;
  insights: string[];
  recommendations: ActionableRecommendation[];
  createdAt: Date;
  revenueImpact?: number;
}

export type AnalyticsType = 
  | 'sales_forecasting'
  | 'customer_analysis'
  | 'cash_flow_prediction'
  | 'payment_analysis'
  | 'product_performance'
  | 'seasonal_trends'
  | 'customer_retention'
  | 'profitability_analysis';

export interface ActionableRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  revenueImpact: number;
  contacts: ContactInfo[];
  actions: CommunicationAction[];
  urgency: 'immediate' | 'this_week' | 'this_month';
}

export interface ContactInfo {
  name: string;
  email?: string;
  phone?: string;
  context: string;
  revenueValue: number;
}

export interface CommunicationAction {
  type: 'whatsapp' | 'email' | 'phone' | 'csv_export';
  label: string;
  template?: string;
  data?: any;
}

// Lead generation types
export interface Lead {
  id: string;
  type: LeadType;
  contact: ContactInfo;
  score: number;
  revenueRange: {
    min: number;
    max: number;
  };
  urgency: 'high' | 'medium' | 'low';
  context: string;
  generatedAt: Date;
}

export type LeadType = 
  | 'overdue_payment_recovery'
  | 'repeat_customer_reactivation'
  | 'top_customer_upsell'
  | 'new_customer_prospects'
  | 'seasonal_opportunity';

// User and subscription types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'member';
  language: string;
  currency: string;
  timezone: string;
  createdAt: Date;
  lastLoginAt?: Date;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: 'free' | 'pro' | 'pro_plus';
  status: 'active' | 'cancelled' | 'past_due';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  usage: UsageMetrics;
  limits: PlanLimits;
}

export interface UsageMetrics {
  dataUploaded: number; // MB
  analysisRuns: number;
  storageUsed: number; // GB
  teamMembers: number;
}

export interface PlanLimits {
  maxDataUpload: number; // MB
  maxAnalysisRuns: number;
  maxStorage: number; // GB
  maxTeamMembers: number;
}

// Internationalization types
export interface Currency {
  code: string;
  symbol: string;
  name: string;
  locale: string;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  rtl?: boolean;
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}