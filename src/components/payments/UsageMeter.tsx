'use client';

import { useAuth } from '@/contexts/AuthContext';
import { SUBSCRIPTION_PLANS } from '@/lib/subscription-plans';
import { BarChart3, Upload, Users, HardDrive, AlertTriangle } from 'lucide-react';

interface UsageMeterProps {
  userSubscription: any;
  usage: any;
}

export default function UsageMeter({ userSubscription, usage }: UsageMeterProps) {
  const currentPlan = Object.values(SUBSCRIPTION_PLANS).find(
    p => p.id === userSubscription?.planId
  ) || SUBSCRIPTION_PLANS.FREE;

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === 0) return 0;
    return Math.min((used / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 MB';
    const k = 1024;
    const sizes = ['MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const usageData = [
    {
      label: 'Analysis Runs',
      icon: BarChart3,
      used: usage?.analyticsRuns || 0,
      limit: currentPlan.limits.maxAnalysisRuns,
      unit: 'runs',
    },
    {
      label: 'Data Upload',
      icon: Upload,
      used: usage?.dataUploadedMB || 0,
      limit: currentPlan.limits.maxDataUploadMB,
      unit: 'MB',
      formatter: formatBytes,
    },
    {
      label: 'Team Members',
      icon: Users,
      used: usage?.activeUsers || 1,
      limit: currentPlan.limits.maxUsers,
      unit: 'users',
    },
    {
      label: 'Storage Used',
      icon: HardDrive,
      used: usage?.storageUsedGB || 0,
      limit: currentPlan.limits.maxStorageGB,
      unit: 'GB',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Usage Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {usageData.map((item, index) => {
          const percentage = getUsagePercentage(item.used, item.limit);
          const isNearLimit = percentage >= 80;
          const Icon = item.icon;

          return (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Icon className="w-5 h-5 text-gray-600 mr-2" />
                  <span className="font-medium text-gray-900">{item.label}</span>
                </div>
                {isNearLimit && (
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                )}
              </div>

              <div className="mb-2">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>
                    {item.formatter ? item.formatter(item.used) : `${item.used.toLocaleString()} ${item.unit}`}
                  </span>
                  <span>
                    {item.limit === 0 ? 'Unlimited' : 
                     item.formatter ? item.formatter(item.limit) : `${item.limit.toLocaleString()} ${item.unit}`}
                  </span>
                </div>
                
                {item.limit > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getUsageColor(percentage)}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                )}
              </div>

              {item.limit > 0 && (
                <div className="text-xs text-gray-500">
                  {percentage.toFixed(1)}% used
                  {isNearLimit && (
                    <span className="text-yellow-600 ml-2">• Near limit</span>
                  )}
                </div>
              )}

              {/* Upgrade suggestion for near-limit usage */}
              {isNearLimit && currentPlan.id === 'free' && (
                <div className="mt-2 text-xs text-blue-600">
                  Consider upgrading for higher limits
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Usage Reset Information */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">Usage Reset</h3>
        <p className="text-sm text-blue-700">
          {currentPlan.id === 'free' 
            ? 'Usage limits reset monthly on your account creation date.'
            : `Usage limits reset on your billing date: ${userSubscription?.nextBillingDate ? 
                new Date(userSubscription.nextBillingDate.toDate()).toLocaleDateString() : 'N/A'}`
          }
        </p>
      </div>

      {/* Plan Comparison */}
      {currentPlan.id === 'free' && (
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <h3 className="font-medium text-gray-900 mb-2">Need More Resources?</h3>
          <p className="text-sm text-gray-600 mb-3">
            Upgrade to Pro for 2,000 analysis runs, 1GB uploads, and priority support.
          </p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors">
            View Plans
          </button>
        </div>
      )}
    </div>
  );
}