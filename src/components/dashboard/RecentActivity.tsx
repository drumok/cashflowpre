'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Target, 
  Upload, 
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';

interface Activity {
  id: string;
  type: 'analysis' | 'lead_generation' | 'data_upload' | 'export';
  title: string;
  description: string;
  status: 'completed' | 'processing' | 'failed';
  timestamp: Date;
  revenueImpact?: number;
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockActivities: Activity[] = [
        {
          id: '1',
          type: 'analysis',
          title: 'Sales Forecasting Analysis',
          description: 'Q4 2024 sales forecast completed',
          status: 'completed',
          timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
          revenueImpact: 125430
        },
        {
          id: '2',
          type: 'lead_generation',
          title: 'Overdue Payment Recovery',
          description: '12 high-priority leads identified',
          status: 'completed',
          timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
          revenueImpact: 89500
        },
        {
          id: '3',
          type: 'data_upload',
          title: 'Customer Data Upload',
          description: 'October sales data (2,847 records)',
          status: 'processing',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        },
        {
          id: '4',
          type: 'analysis',
          title: 'Customer Retention Analysis',
          description: 'Churn risk assessment',
          status: 'completed',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
          revenueImpact: 67200
        },
        {
          id: '5',
          type: 'export',
          title: 'Lead Contact Export',
          description: 'CSV export of 45 qualified leads',
          status: 'failed',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
        }
      ];

      setActivities(mockActivities);
      setIsLoading(false);
    }, 800);
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'analysis': return BarChart3;
      case 'lead_generation': return Target;
      case 'data_upload': return Upload;
      case 'export': return Download;
      default: return BarChart3;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'processing': return Clock;
      case 'failed': return XCircle;
      default: return AlertCircle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'processing': return 'text-blue-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
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

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => {
          const ActivityIcon = getActivityIcon(activity.type);
          const StatusIcon = getStatusIcon(activity.status);
          
          return (
            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <ActivityIcon className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.title}
                  </p>
                  <StatusIcon className={`w-4 h-4 flex-shrink-0 ${getStatusColor(activity.status)}`} />
                </div>
                
                <p className="text-sm text-gray-600 mb-1">{activity.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {formatTimeAgo(activity.timestamp)}
                  </span>
                  {activity.revenueImpact && (
                    <span className="text-xs font-medium text-green-600">
                      +{formatCurrency(activity.revenueImpact)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Total Revenue Impact Today</span>
          <span className="font-semibold text-green-600">
            +{formatCurrency(activities.reduce((sum, activity) => sum + (activity.revenueImpact || 0), 0))}
          </span>
        </div>
      </div>
    </div>
  );
}