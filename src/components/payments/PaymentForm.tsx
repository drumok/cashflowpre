'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SUBSCRIPTION_PLANS, CURRENCY_PRICING } from '@/lib/subscription-plans';
import { CreditCard, Lock, CheckCircle } from 'lucide-react';

declare global {
  interface Window {
    braintree: any;
  }
}

interface PaymentFormProps {
  planId: string;
  onSuccess: (subscription: any) => void;
  onError: (error: string) => void;
}

export default function PaymentForm({ planId, onSuccess, onError }: PaymentFormProps) {
  const { user, getIdToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [clientToken, setClientToken] = useState<string | null>(null);
  const [dropinInstance, setDropinInstance] = useState<any>(null);
  const [currency, setCurrency] = useState('USD');

  const plan = Object.values(SUBSCRIPTION_PLANS).find(p => p.id === planId);
  const pricing = CURRENCY_PRICING[currency as keyof typeof CURRENCY_PRICING];

  useEffect(() => {
    // Detect user's currency based on locale
    const userLocale = navigator.language;
    const currencyMap: { [key: string]: string } = {
      'en-US': 'USD', 'en-CA': 'CAD', 'en-GB': 'GBP', 'en-AU': 'USD',
      'es-ES': 'EUR', 'es-MX': 'USD', 'es-AR': 'USD',
      'pt-BR': 'BRL', 'fr-FR': 'EUR', 'de-DE': 'EUR', 'it-IT': 'EUR',
      'hi-IN': 'INR', 'zh-CN': 'CNY', 'ja-JP': 'JPY', 'ar-SA': 'SAR',
      'ko-KR': 'KRW', 'ru-RU': 'RUB', 'id-ID': 'IDR', 'tr-TR': 'TRY',
      'nl-NL': 'EUR', 'pl-PL': 'PLN', 'th-TH': 'THB', 'vi-VN': 'VND',
      'uk-UA': 'UAH'
    };
    
    const detectedCurrency = currencyMap[userLocale] || 'USD';
    setCurrency(detectedCurrency);
  }, []);

  useEffect(() => {
    if (user) {
      fetchClientToken();
    }
  }, [user]);

  useEffect(() => {
    if (clientToken) {
      initializeBraintree();
    }
  }, [clientToken]);

  const fetchClientToken = async () => {
    try {
      const token = await getIdToken();
      const response = await fetch('/api/payments/client-token', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch client token');
      }

      const data = await response.json();
      setClientToken(data.clientToken);
    } catch (error) {
      console.error('Error fetching client token:', error);
      onError('Failed to initialize payment form');
    }
  };

  const initializeBraintree = async () => {
    try {
      // Load Braintree script if not already loaded
      if (!window.braintree) {
        await loadBraintreeScript();
      }

      // Create Drop-in UI
      const instance = await window.braintree.dropin.create({
        authorization: clientToken,
        container: '#braintree-drop-in-div',
        card: {
          cardholderName: {
            required: true
          }
        },
        paypal: {
          flow: 'checkout',
          amount: pricing?.[planId === 'pro' ? 'pro' : 'proPLus'] || plan?.price || 0,
          currency: currency,
        },
        googlePay: {
          merchantId: process.env.NEXT_PUBLIC_BRAINTREE_MERCHANT_ID,
          transactionInfo: {
            totalPriceStatus: 'FINAL',
            totalPrice: (pricing?.[planId === 'pro' ? 'pro' : 'proPLus'] || plan?.price || 0).toString(),
            currencyCode: currency,
          },
        },
      });

      setDropinInstance(instance);
    } catch (error) {
      console.error('Error initializing Braintree:', error);
      onError('Failed to initialize payment form');
    }
  };

  const loadBraintreeScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.braintree) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://js.braintreegateway.com/web/dropin/1.33.0/js/dropin.min.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Braintree script'));
      document.head.appendChild(script);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dropinInstance || !user) {
      onError('Payment form not ready');
      return;
    }

    setLoading(true);

    try {
      // Request payment method from Drop-in
      const { nonce } = await dropinInstance.requestPaymentMethod();

      // Create subscription
      const token = await getIdToken();
      const response = await fetch('/api/payments/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          paymentMethodNonce: nonce,
          planId: planId,
          currency: currency,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Payment failed');
      }

      const data = await response.json();
      onSuccess(data.subscription);

    } catch (error: any) {
      console.error('Payment error:', error);
      onError(error.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  if (!plan) {
    return <div>Invalid plan selected</div>;
  }

  const displayPrice = pricing?.[planId === 'pro' ? 'pro' : 'proPLus'] || plan.price;
  const currencySymbol = pricing?.symbol || '$';

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Subscribe to {plan.name}
        </h3>
        <div className="text-3xl font-bold text-blue-600 mb-2">
          {currencySymbol}{displayPrice.toLocaleString()}<span className="text-lg text-gray-500">/month</span>
        </div>
        <div className="text-sm text-gray-600">
          {plan.features.analysisRuns} analysis runs • {plan.features.users} users • {plan.features.storage} storage
        </div>
      </div>

      {/* Currency Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Currency
        </label>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {Object.entries(CURRENCY_PRICING).map(([curr, data]) => (
            <option key={curr} value={curr}>
              {curr} ({data.symbol})
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Braintree Drop-in Container */}
        <div id="braintree-drop-in-div" className="mb-6"></div>

        {/* Security Notice */}
        <div className="flex items-center justify-center mb-4 text-sm text-gray-600">
          <Lock className="w-4 h-4 mr-2" />
          <span>Secured by Braintree & PayPal</span>
        </div>

        {/* Features List */}
        <div className="mb-6 space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
            <span>{plan.features.dataUpload} data upload limit</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
            <span>{plan.features.analysisRuns} analysis runs per month</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
            <span>{plan.features.users} team members</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
            <span>{plan.features.storage} cloud storage</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
            <span>{plan.features.support} support</span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !clientToken}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            <>
              <CreditCard className="w-5 h-5 inline mr-2" />
              Subscribe Now
            </>
          )}
        </button>
      </form>

      <div className="mt-4 text-xs text-gray-500 text-center">
        You can cancel anytime. No setup fees or hidden charges.
      </div>
    </div>
  );
}