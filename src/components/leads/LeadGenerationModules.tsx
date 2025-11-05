'use client';

import { useState } from 'react';
import { 
  AlertTriangle, 
  RotateCcw, 
  TrendingUp, 
  Target,
  Calendar,
  Play,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import { LEAD_TYPES } from '@/lib/constants';

interface LeadModule {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  revenueRange: { min: number; max: number };
  status: 'idle' | 'generating' | 'completed';
  leadsGenerated?: number;
  revenueImpact?: number;
}

export function LeadGenerationModules() {
  const [modules, setModules] = useState<LeadModule[]>([
    {
      id: 'overdue_payment_recovery',
      title: 'Overdue Payment Recovery',
      description: 'Identify customers with overdue payments and high recovery potential',
      icon: AlertTriangle,
      color: 'bg-red-500',
      revenueRange: { min: 5000, max: 25000 },
      status: 'idle'
    },
    {
      id: 'repeat_customer_reactivation',
      title: 'Customer Reactivation',
      description: 'Find inactive customers ready for re-engagement campaigns',
      icon: RotateCcw,
      color: 'bg-orange-500',
      revenueRange: { min: 3000, max: 15000 },
      status: 'idle'
    },
    {
      id: 'top_customer_upsell',
      title: 'Top Customer Upsell',
      description: 'Identify high-value customers for premium product upselling',
      icon: TrendingUp,
      color: 'bg-green-500',
      revenueRange: { min: 8000, max: 40000 },
      status: 'idle'
    },
    {
      id: 'new_customer_prospects',
      title: 'New Customer Prospects',
      description: 'Score and prioritize potential new customers based on patterns',
      icon: Target,
      color: 'bg-blue-500',
      revenueRange: { min: 2000, max: 12000 },
      status: 'idle'
    },
    {
      id: 'seasonal_opportunity',
      title: 'Seasonal Opportunities',
      description: 'Detect seasonal patterns and upcoming sales opportunities',
      icon: Calendar,
      color: 'bg-purple-500',
      revenueRange: { min: 1000, max: 8000 },
      status: 'idle'
    }
  ]);

  const generateLeads = async (moduleId: string) => {
    // Update status to generating
    setModules(prev => prev.map(module => 
      module.id === moduleId 
        ? { ...module, status: 'generating' as const }
        : module
    ));

    // Simulate API call to generate leads
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadType: moduleId,
          data: { /* mock data */ },
          userId: 'demo-user'
        })
      });

      const result = await response.json();

      // Simulate processing time
      setTimeout(() => {
        setModules(prev => prev.map(module => 
          module.id === moduleId 
            ? { 
                ...module, 
                status: 'completed' as const,
                leadsGenerated: Math.floor(Math.random() * 20) + 5,
                revenueImpact: Math.floor(Math.random() * (module.revenueRange.max - module.revenueRange.min)) + module.revenueRange.min
              }
            : module
        ));
      }, 2000);

    } catch (error) {
      console.error('Lead generation failed:', error);
      setModules(prev => prev.map(module => 
        module.id === moduleId 
          ? { ...module, status: 'idle' as const }
          : module
      ));
    }
  };

  const generateAllLeads = () => {
    modules.forEach(module => {
      if (module.status === 'idle') {
        setTimeout(() => generateLeads(module.id), Math.random() * 1000);
      }
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'generating': return Clock;
      case 'completed': return CheckCircle;
      default: return Play;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'generating': return 'text-blue-600';
      case 'completed': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalLeadsGenerated = modules.reduce((sum, m) => sum + (m.leadsGenerated || 0), 0);
  const totalRevenueImpact = modules.reduce((sum, m) => sum + (m.revenueImpact || 0), 0);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Lead Generation Modules</h2>
          <p className="text-sm text-gray-600 mt-1">5 Core Lead Types with Revenue Potential</p>
        </div>
        <button
          onClick={generateAllLeads}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Target className="w-4 h-4" />
          <span>Generate All Leads</span>
        </button>
      </div>

      {/* Summary Stats */}
      {totalLeadsGenerated > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-green-50 rounded-lg">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{totalLeadsGenerated}</p>
            <p className="text-sm text-green-700">Total Leads</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenueImpact)}</p>
            <p className="text-sm text-green-700">Revenue Potential</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {modules.filter(m => m.status === 'completed').length}
            </p>
            <p className="text-sm text-green-700">Modules Complete</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {modules.map((module) => {
          const Icon = module.icon;
          const StatusIcon = getStatusIcon(module.status);
          
          return (
            <div
              key={module.id}
              className="relative p-6 border border-gray-200 rounded-lg hover:shadow-md transition-all group cursor-pointer"
              onClick={() => module.status === 'idle' && generateLeads(module.id)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg ${module.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{module.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <StatusIcon className={`w-5 h-5 ${getStatusColor(module.status)}`} />
                  {module.status === 'generating' && (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                  )}
                </div>
              </div>

              {/* Revenue Range */}
              <div className="mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  <span>Revenue Potential: {formatCurrency(module.revenueRange.min)} - {formatCurrency(module.revenueRange.max)}</span>
                </div>
              </div>

              {/* Results */}
              {module.status === 'completed' && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Leads Generated</p>
                      <p className="text-xl font-bold text-green-600">{module.leadsGenerated}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Revenue Impact</p>
                      <p className="text-xl font-bold text-green-600">
                        {formatCurrency(module.revenueImpact || 0)}
                      </p>
                    </div>
                  </div>
                  
                  <button className="mt-3 w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    View {module.leadsGenerated} Leads →
                  </button>
                </div>
              )}

              {/* Generating indicator */}
              {module.status === 'generating' && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                    </div>
                    <span className="text-xs text-blue-600 font-medium">Analyzing...</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Scanning customer data and identifying opportunities...</p>
                </div>
              )}

              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-blue-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Target className="w-4 h-4" />
            <span>Export All Leads</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <DollarSign className="w-4 h-4" />
            <span>Revenue Report</span>
          </button>
        </div>
      </div>
    </div>
  );
}