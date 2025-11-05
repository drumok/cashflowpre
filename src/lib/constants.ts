import { Language, Currency } from '@/types';

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', rtl: true },
];

export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
  { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE' },
  { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', locale: 'zh-CN' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'hi-IN' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', locale: 'pt-BR' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', locale: 'en-CA' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU' },
  { code: 'SAR', symbol: 'ر.س', name: 'Saudi Riyal', locale: 'ar-SA' },
];

export const SUBSCRIPTION_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    limits: {
      maxDataUpload: 5, // MB
      maxAnalysisRuns: 5,
      maxStorage: 0, // GB
      maxTeamMembers: 1,
    },
    features: [
      '5MB data upload',
      '5 analysis runs per month',
      '1 user',
      'Basic analytics',
      'Email support',
    ],
  },
  pro: {
    name: 'Pro',
    price: 99,
    limits: {
      maxDataUpload: 1000, // MB
      maxAnalysisRuns: 2000,
      maxStorage: 50, // GB
      maxTeamMembers: 3, // 1 admin + 2 members
    },
    features: [
      '1GB data upload',
      '2000 analysis runs per month',
      '1 admin + 2 team members',
      '50GB cloud storage',
      'All analytics & lead generation',
      'WhatsApp & email integration',
      'Priority support',
    ],
  },
  pro_plus: {
    name: 'Pro Plus',
    price: 199,
    limits: {
      maxDataUpload: 5000, // MB
      maxAnalysisRuns: 5000,
      maxStorage: 100, // GB
      maxTeamMembers: 4, // 1 admin + 3 members
    },
    features: [
      '5GB data upload',
      '5000 analysis runs per month',
      '1 admin + 3 team members',
      '100GB cloud storage',
      'All analytics & lead generation',
      'WhatsApp & email integration',
      'Advanced export capabilities',
      'Priority support',
      'Custom integrations',
    ],
  },
} as const;

export const ANALYTICS_TYPES = {
  sales_forecasting: {
    name: 'Sales Forecasting',
    description: 'Predict future sales using linear regression',
    icon: '📈',
    color: 'bg-blue-500',
  },
  customer_analysis: {
    name: 'Customer Analysis',
    description: 'Segment customers by behavior and value',
    icon: '👥',
    color: 'bg-green-500',
  },
  cash_flow_prediction: {
    name: 'Cash Flow Prediction',
    description: 'Forecast cash flow using moving averages',
    icon: '💰',
    color: 'bg-yellow-500',
  },
  payment_analysis: {
    name: 'Payment Analysis',
    description: 'Analyze payment patterns and delays',
    icon: '💳',
    color: 'bg-purple-500',
  },
  product_performance: {
    name: 'Product Performance',
    description: 'Rank products by sales and profitability',
    icon: '📦',
    color: 'bg-red-500',
  },
  seasonal_trends: {
    name: 'Seasonal Trends',
    description: 'Identify seasonal patterns in sales',
    icon: '📅',
    color: 'bg-indigo-500',
  },
  customer_retention: {
    name: 'Customer Retention',
    description: 'Identify at-risk customers',
    icon: '🔄',
    color: 'bg-pink-500',
  },
  profitability_analysis: {
    name: 'Profitability Analysis',
    description: 'Calculate profit margins and ROI',
    icon: '📊',
    color: 'bg-teal-500',
  },
} as const;

export const LEAD_TYPES = {
  overdue_payment_recovery: {
    name: 'Overdue Payment Recovery',
    description: 'Customers with overdue payments',
    icon: '⚠️',
    color: 'bg-red-500',
    revenueRange: { min: 5000, max: 25000 },
  },
  repeat_customer_reactivation: {
    name: 'Repeat Customer Reactivation',
    description: 'Inactive customers ready for reactivation',
    icon: '🔄',
    color: 'bg-orange-500',
    revenueRange: { min: 3000, max: 15000 },
  },
  top_customer_upsell: {
    name: 'Top Customer Upsell',
    description: 'High-value customers for upselling',
    icon: '⭐',
    color: 'bg-yellow-500',
    revenueRange: { min: 8000, max: 40000 },
  },
  new_customer_prospects: {
    name: 'New Customer Prospects',
    description: 'Potential new customers',
    icon: '🎯',
    color: 'bg-green-500',
    revenueRange: { min: 2000, max: 12000 },
  },
  seasonal_opportunity: {
    name: 'Seasonal Opportunity',
    description: 'Seasonal sales opportunities',
    icon: '🌟',
    color: 'bg-blue-500',
    revenueRange: { min: 1000, max: 8000 },
  },
} as const;

export const COMMUNICATION_TEMPLATES = {
  overdue_payment: {
    whatsapp: "Hi {customerName}, this is a friendly reminder about your outstanding invoice of {amount}. We'd appreciate your prompt payment. Thank you!",
    email: {
      subject: "Payment Reminder - Invoice #{invoiceNumber}",
      body: "Dear {customerName},\n\nWe hope this message finds you well. We wanted to remind you about the outstanding payment for invoice #{invoiceNumber} in the amount of {amount}.\n\nPlease let us know if you have any questions or if there's anything we can do to assist you.\n\nBest regards,\n{companyName}",
    },
  },
  customer_reactivation: {
    whatsapp: "Hi {customerName}! We miss you! Here's a special offer just for you: {offer}. Let's reconnect!",
    email: {
      subject: "We Miss You! Special Offer Inside",
      body: "Dear {customerName},\n\nWe noticed it's been a while since your last purchase, and we wanted to reach out with a special offer just for you.\n\n{offer}\n\nWe'd love to have you back and continue serving you.\n\nBest regards,\n{companyName}",
    },
  },
  upsell_opportunity: {
    whatsapp: "Hi {customerName}! Based on your recent purchases, we think you'd love {product}. Special pricing available!",
    email: {
      subject: "Exclusive Offer for Our Valued Customer",
      body: "Dear {customerName},\n\nAs one of our valued customers, we wanted to share an exclusive opportunity with you.\n\nBased on your purchase history, we believe {product} would be perfect for your needs.\n\nSpecial pricing: {specialPrice}\n\nBest regards,\n{companyName}",
    },
  },
} as const;