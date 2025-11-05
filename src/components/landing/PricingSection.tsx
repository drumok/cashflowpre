'use client';

import { motion } from 'framer-motion';
import { Check, Star } from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '@/lib/constants';

export function PricingSection() {
  const plans = Object.entries(SUBSCRIPTION_PLANS);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600">
            Choose the plan that fits your business needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map(([key, plan]) => (
            <motion.div
              key={key}
              className={`relative p-8 bg-white rounded-2xl shadow-lg ${
                key === 'pro' ? 'ring-2 ring-blue-600 scale-105' : ''
              }`}
              whileHover={{ scale: key === 'pro' ? 1.05 : 1.02 }}
            >
              {key === 'pro' && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                    <Star className="w-4 h-4" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-gray-900 mb-1">
                  ${plan.price}
                  <span className="text-lg font-normal text-gray-600">/month</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                  key === 'pro'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {key === 'free' ? 'Start Free' : 'Get Started'}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}