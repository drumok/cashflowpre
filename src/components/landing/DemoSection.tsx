'use client';

import { motion } from 'framer-motion';
import { Play, Upload, BarChart3, Users, Phone } from 'lucide-react';

export function DemoSection() {
  const demoSteps = [
    {
      icon: Upload,
      title: 'Upload Your Data',
      description: 'Simply upload your sales, customer, or invoice data'
    },
    {
      icon: BarChart3,
      title: 'Get Insights',
      description: 'Our AI analyzes your data and generates actionable insights'
    },
    {
      icon: Users,
      title: 'Find Leads',
      description: 'Identify high-value leads with contact information'
    },
    {
      icon: Phone,
      title: 'Take Action',
      description: 'Use one-click communication tools to contact leads'
    }
  ];

  return (
    <section id="demo" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            See How It Works
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            From data upload to revenue generation in 4 simple steps
          </p>
          
          <motion.button
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Play className="w-5 h-5 mr-2" />
            Try with Demo Data
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {demoSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}