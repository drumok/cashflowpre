'use client';

import { motion } from 'framer-motion';
import { ANALYTICS_TYPES, LEAD_TYPES } from '@/lib/constants';
import { BarChart3, Target } from 'lucide-react';

export function FeaturesSection() {
  const analyticsFeatures = Object.entries(ANALYTICS_TYPES);
  const leadFeatures = Object.entries(LEAD_TYPES);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Powerful Analytics & Lead Generation
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your business data into immediate revenue opportunities with our 8 core analytics models and 5 lead generation types.
          </p>
        </div>

        {/* Analytics Features */}
        <div className="mb-20">
          <div className="flex items-center justify-center mb-8">
            <BarChart3 className="w-8 h-8 text-blue-600 mr-3" />
            <h3 className="text-2xl font-bold text-gray-900">8 Business Analytics Models</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {analyticsFeatures.map(([key, feature]) => (
              <motion.div
                key={key}
                className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{feature.name}</h4>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Lead Generation Features */}
        <div>
          <div className="flex items-center justify-center mb-8">
            <Target className="w-8 h-8 text-green-600 mr-3" />
            <h3 className="text-2xl font-bold text-gray-900">5 Lead Generation Types</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {leadFeatures.map(([key, feature]) => (
              <motion.div
                key={key}
                className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{feature.name}</h4>
                <p className="text-gray-600 text-sm mb-3">{feature.description}</p>
                <div className="text-sm font-medium text-green-600">
                  ${feature.revenueRange.min.toLocaleString()} - ${feature.revenueRange.max.toLocaleString()}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}