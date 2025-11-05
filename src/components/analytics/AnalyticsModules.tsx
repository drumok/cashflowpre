'use client';

import { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  CreditCard,
  Package,
  Calendar,
  UserCheck,
  PieChart,
  Play,
  CheckCircle,
  Clock
} from 'lucide-react';

interface AnalyticsModule {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  status: 'idle' | 'running' | 'completed';
  revenueImpact?: number;
  insights?: string[];
}

export function AnalyticsModules() {
  const [modules, setModules] = useState<AnalyticsModule[]>([
    {
      id: 'sales_forecasting',
      title: 'Sales Forecasting',
      description: 'Linear Regression analysis of sales trends and future predictions',
      icon: TrendingUp,
      color: 'bg-blue-500',
      status: 'idle'
    },
    {
      id: 'customer_analysis',
      title: 'Customer Analysis',
      description: 'Simple clustering to group customers by behavior and value',
      icon: Users,
      color: 'bg-green-500',
      status: 'idle'
    },
    {
      id: 'cash_flow_prediction',
      title: 'Cash Flow Prediction',
      description: 'Moving average analysis of income and expense patterns',
      icon: DollarSign,
      color: 'bg-purple-500',
      status: 'idle'
    },
    {
      id: 'payment_analysis',
      title: 'Payment Analysis',
      description: 'Statistical analysis of invoice and payment patterns',
      icon: CreditCard,
      color: 'bg-orange-500',
      status: 'idle'
    },
    {
      id: 'product_performance',
      title: 'Product Performance',
      description: 'Ranking algorithm to identify top and underperforming products',
      icon: Package,
      color: 'bg-red-500',
      status: 'idle'
    },
    {
      id: 'seasonal_trends',
      title: 'Seasonal Trends',
      description: 'Time series analysis to identify seasonal business patterns',
      icon: Calendar,
      color: 'bg-indigo-500',
      status: 'idle'
    },
    {
      id: 'customer_retention',
      title: 'Customer Retention',
      description: 'Rule-based logic to identify at-risk customers',
      icon: UserCheck,
      color: 'bg-pink-500',
      status: 'idle'
    },
    {
      id: 'profitability_analysis',
      title: 'Profitability Analysis',
      description: 'Simple math calculations for revenue optimization',
      icon: PieChart,
      color: 'bg-teal-500',
      status: 'idle'
    }
  ]);

  const runAnalysis = async (moduleId: string) => {
    // Update status to running
    setModules(prev => prev.map(module => 
      module.id === moduleId 
        ? { ...module, status: 'running' as const }
        : module
    ));

    // Simulate API call
    setTimeout(() => {
      setModules(prev => prev.map(module => 
        module.id === moduleId 
          ? { 
              ...module, 
              status: 'completed' as const,
              revenueImpact: Math.floor(Math.random() * 50000) + 10000,
              insights: [
                'Analysis completed successfully',
                'Actionable recommendations generated',
                'Contact information extracted'
              ]
            }
          : module
      ));
    }, 3000);
  };

  const runAllAnalyses = () => {
    modules.forEach(module => {
      if (module.status === 'idle') {
        setTimeout(() => runAnalysis(module.id), Math.random() * 2000);
      }
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return Clock;
      case 'completed': return CheckCircle;
      default: return Play;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-blue-600';
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

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Analytics Modules</h2>
          <p className="text-sm text-gray-600 mt-1">8 Core Models to Transform Your Business Data</p>
        </div>
        <button
          onClick={runAllAnalyses}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Play className="w-4 h-4" />
          <span>Run All Analyses</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modules.map((module) => {
          const Icon = module.icon;
          const StatusIcon = getStatusIcon(module.status);
          
          return (
            <div
              key={module.id}
              className="relative p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all group cursor-pointer"
              onClick={() => module.status === 'idle' && runAnalysis(module.id)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${module.color}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{module.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <StatusIcon className={`w-5 h-5 ${getStatusColor(module.status)}`} />
                  {module.status === 'running' && (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                  )}
                </div>
              </div>

              {/* Results */}
              {module.status === 'completed' && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-green-600">Analysis Complete</span>
                    {module.revenueImpact && (
                      <span className="text-sm font-bold text-green-600">
                        +{formatCurrency(module.revenueImpact)}
                      </span>
                    )}
                  </div>
                  {module.insights && (
                    <ul className="text-xs text-gray-600 space-y-1">
                      {module.insights.map((insight, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Running indicator */}
              {module.status === 'running' && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                    </div>
                    <span className="text-xs text-blue-600">Processing...</span>
                  </div>
                </div>
              )}

              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {modules.filter(m => m.status === 'completed').length}
            </p>
            <p className="text-sm text-gray-600">Completed</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">
              {modules.filter(m => m.status === 'running').length}
            </p>
            <p className="text-sm text-gray-600">Running</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(modules.reduce((sum, m) => sum + (m.revenueImpact || 0), 0))}
            </p>
            <p className="text-sm text-gray-600">Total Impact</p>
          </div>
        </div>
      </div>
    </div>
  );
}