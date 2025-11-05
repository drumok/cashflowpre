'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3
} from 'lucide-react';

interface AnalyticsMetric {
  id: string;
  title: string;
  value: string;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: any;
  color: string;
}

export function AnalyticsOverview() {
  const [metrics, setMetrics] = useState<AnalyticsMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setMetrics([
        {
          id: '1',
          title: 'Revenue Forecast',
          value: '$125,430',
          change: 12.5,
          changeType: 'increase',
          icon: DollarSign,
          color: 'bg-green-500'
        },
        {
          id: '2',
          title: 'Active Customers',
          value: '2,847',
          change: 8.2,
          changeType: 'increase',
          icon: Users,
          color: 'bg-blue-500'
        },
        {
          id: '3',
          title: 'Monthly Growth',
          value: '18.7%',
          change: 3.1,
          changeType: 'increase',
          icon: TrendingUp,
          color: 'bg-purple-500'
        },
        {
          id: '4',
          title: 'Overdue Payments',
          value: '$23,450',
          change: -5.4,
          changeType: 'decrease',
          icon: Calendar,
          color: 'bg-red-500'
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Analytics Overview</h2>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          View All Analytics →
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const ChangeIcon = metric.changeType === 'increase' ? ArrowUpRight : ArrowDownRight;
          
          return (
            <div
              key={metric.id}
              className="relative p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${metric.color}`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className={`flex items-center text-sm ${
                  metric.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <ChangeIcon className="w-4 h-4 mr-1" />
                  {Math.abs(metric.change)}%
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                <p className="text-sm text-gray-600">{metric.title}</p>
              </div>

              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <BarChart3 className="w-4 h-4" />
            <span>Run Full Analysis</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <TrendingUp className="w-4 h-4" />
            <span>Generate Forecast</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Users className="w-4 h-4" />
            <span>Customer Analysis</span>
          </button>
        </div>
      </div>
    </div>
  );
}