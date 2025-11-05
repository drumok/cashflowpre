// Subscription plans configuration (client-safe)
export const SUBSCRIPTION_PLANS = {
  FREE: {
    id: 'free',
    name: 'Free Plan',
    price: 0,
    currency: 'USD',
    braintreePlanId: null,
    features: {
      dataUpload: '5MB',
      analysisRuns: 5,
      users: 1,
      storage: '0GB',
      support: 'Email',
    },
    limits: {
      maxDataUploadMB: 5,
      maxAnalysisRuns: 5,
      maxUsers: 1,
      maxStorageGB: 0,
    }
  },
  PRO: {
    id: 'pro',
    name: 'Pro Plan',
    price: 99,
    currency: 'USD',
    braintreePlanId: 'pro_plan_99',
    features: {
      dataUpload: '1GB',
      analysisRuns: 2000,
      users: 3,
      storage: '50GB',
      support: 'Priority',
    },
    limits: {
      maxDataUploadMB: 1024,
      maxAnalysisRuns: 2000,
      maxUsers: 3,
      maxStorageGB: 50,
    }
  },
  PRO_PLUS: {
    id: 'pro_plus',
    name: 'Pro Plus Plan',
    price: 199,
    currency: 'USD',
    braintreePlanId: 'pro_plus_plan_199',
    features: {
      dataUpload: '5GB',
      analysisRuns: 5000,
      users: 4,
      storage: '100GB',
      support: 'Priority',
    },
    limits: {
      maxDataUploadMB: 5120,
      maxAnalysisRuns: 5000,
      maxUsers: 4,
      maxStorageGB: 100,
    }
  }
};

// Multi-currency pricing (19 currencies)
export const CURRENCY_PRICING = {
  USD: { pro: 99, proPLus: 199, symbol: '$' },
  EUR: { pro: 89, proPLus: 179, symbol: '€' },
  GBP: { pro: 79, proPLus: 159, symbol: '£' },
  JPY: { pro: 14900, proPLus: 29900, symbol: '¥' },
  CNY: { pro: 699, proPLus: 1399, symbol: '¥' },
  INR: { pro: 8299, proPLus: 16599, symbol: '₹' },
  BRL: { pro: 499, proPLus: 999, symbol: 'R$' },
  KRW: { pro: 129000, proPLus: 259000, symbol: '₩' },
  RUB: { pro: 8999, proPLus: 17999, symbol: '₽' },
  IDR: { pro: 1499000, proPLus: 2999000, symbol: 'Rp' },
  TRY: { pro: 2799, proPLus: 5599, symbol: '₺' },
  THB: { pro: 3499, proPLus: 6999, symbol: '฿' },
  VND: { pro: 2399000, proPLus: 4799000, symbol: '₫' },
  UAH: { pro: 3699, proPLus: 7399, symbol: '₴' },
  PLN: { pro: 399, proPLus: 799, symbol: 'zł' },
  SAR: { pro: 369, proPLus: 739, symbol: 'ر.س' },
  AED: { pro: 359, proPLus: 719, symbol: 'د.إ' },
  NLG: { pro: 89, proPLus: 179, symbol: '€' }, // Netherlands uses EUR
  CAD: { pro: 129, proPLus: 259, symbol: 'C$' },
};