'use client';

import { 
  Upload, 
  BarChart3, 
  Target, 
  FileText, 
  Download,
  Zap,
  TrendingUp,
  Users
} from 'lucide-react';

export function QuickActions() {
  const actions = [
    {
      id: 'upload',
      title: 'Upload Data',
      description: 'Upload your business data for analysis',
      icon: Upload,
      color: 'bg-blue-500 hover:bg-blue-600',
      href: '/dashboard/analytics'
    },
    {
      id: 'analyze',
      title: 'Run Analysis',
      description: 'Generate insights from your data',
      icon: BarChart3,
      color: 'bg-purple-500 hover:bg-purple-600',
      href: '/dashboard/analytics'
    },
    {
      id: 'leads',
      title: 'Generate Leads',
      description: 'Find new revenue opportunities',
      icon: Target,
      color: 'bg-green-500 hover:bg-green-600',
      href: '/dashboard/leads'
    },
    {
      id: 'export',
      title: 'Export Results',
      description: 'Download your analysis results',
      icon: Download,
      color: 'bg-orange-500 hover:bg-orange-600',
      href: '#'
    }
  ];

  const quickStats = [
    {
      label: 'Data Uploads',
      value: '12',
      icon: Upload,
      color: 'text-blue-600'
    },
    {
      label: 'Analyses Run',
      value: '47',
      icon: Zap,
      color: 'text-purple-600'
    },
    {
      label: 'Leads Generated',
      value: '156',
      icon: Target,
      color: 'text-green-600'
    },
    {
      label: 'Revenue Impact',
      value: '$89K',
      icon: TrendingUp,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="space-y-3">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:shadow-md transition-all group"
              >
                <div className={`p-2 rounded-lg ${action.color} transition-colors`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {action.title}
                  </p>
                  <p className="text-sm text-gray-500">{action.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Usage Stats */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage This Month</h3>
        <div className="space-y-4">
          {quickStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                  <span className="text-sm text-gray-600">{stat.label}</span>
                </div>
                <span className="font-semibold text-gray-900">{stat.value}</span>
              </div>
            );
          })}
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Plan Usage</span>
            <span>47 / 2000 runs</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '2.35%' }}></div>
          </div>
        </div>
      </div>

      {/* Upgrade Prompt */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center space-x-3 mb-3">
          <Zap className="w-6 h-6" />
          <h3 className="text-lg font-semibold">Unlock More Power</h3>
        </div>
        <p className="text-blue-100 text-sm mb-4">
          Upgrade to Pro for unlimited analyses, team collaboration, and advanced features.
        </p>
        <button className="w-full bg-white text-blue-600 font-medium py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors">
          Upgrade Now
        </button>
      </div>
    </div>
  );
}