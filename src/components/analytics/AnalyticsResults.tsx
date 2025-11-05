'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target,
  Phone,
  Mail,
  MessageCircle,
  Download,
  Eye,
  DollarSign
} from 'lucide-react';

interface AnalysisResult {
  id: string;
  type: string;
  title: string;
  status: 'completed' | 'processing' | 'failed';
  revenueImpact: number;
  insights: string[];
  recommendations: Array<{
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    contacts: Array<{
      name: string;
      email?: string;
      phone?: string;
      context: string;
    }>;
  }>;
  createdAt: Date;
}

export function AnalyticsResults() {
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch results
    setTimeout(() => {
      const mockResults: AnalysisResult[] = [
        {
          id: '1',
          type: 'sales_forecasting',
          title: 'Sales Forecasting',
          status: 'completed',
          revenueImpact: 125430,
          insights: [
            'Sales trending upward with 12.5% growth',
            'December shows highest revenue potential',
            'Q1 2025 forecast: $406,000 total revenue'
          ],
          recommendations: [
            {
              title: 'Prepare for December Peak',
              description: 'Increase inventory and staff for expected 14% sales increase',
              priority: 'high',
              contacts: [
                {
                  name: 'Operations Manager',
                  email: 'ops@company.com',
                  context: 'Coordinate inventory increase for December peak'
                }
              ]
            }
          ],
          createdAt: new Date(Date.now() - 1000 * 60 * 15)
        },
        {
          id: '2',
          type: 'customer_analysis',
          title: 'Customer Analysis',
          status: 'completed',
          revenueImpact: 89500,
          insights: [
            'Top 20% customers generate 80% of revenue',
            '15 VIP customers identified',
            '8 high-value customers at risk'
          ],
          recommendations: [
            {
              title: 'VIP Customer Retention',
              description: 'Launch exclusive program for top customers',
              priority: 'high',
              contacts: [
                {
                  name: 'Sarah Johnson',
                  email: 'sarah@company.com',
                  phone: '+1-555-0123',
                  context: 'VIP customer - $45,000 lifetime value'
                },
                {
                  name: 'Michael Chen',
                  email: 'michael@techcorp.com',
                  phone: '+1-555-0456',
                  context: 'VIP customer - $38,000 lifetime value'
                }
              ]
            }
          ],
          createdAt: new Date(Date.now() - 1000 * 60 * 45)
        }
      ];
      
      setResults(mockResults);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sales_forecasting': return TrendingUp;
      case 'customer_analysis': return Users;
      default: return BarChart3;
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

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Analysis Results</h2>
        <button className="flex items-center space-x-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-700">
          <Download className="w-4 h-4" />
          <span>Export All</span>
        </button>
      </div>

      {results.length === 0 ? (
        <div className="text-center py-8">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No analysis results yet</p>
          <p className="text-sm text-gray-500 mt-1">Run an analysis to see results here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((result) => {
            const Icon = getTypeIcon(result.type);
            
            return (
              <div
                key={result.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedResult(result)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{result.title}</h3>
                      <p className="text-sm text-gray-500">{formatTimeAgo(result.createdAt)}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">
                      +{formatCurrency(result.revenueImpact)}
                    </p>
                    <p className="text-sm text-gray-500">Revenue Impact</p>
                  </div>
                </div>

                {/* Key Insights */}
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Key Insights:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {result.insights.slice(0, 2).map((insight, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Top Recommendation */}
                {result.recommendations.length > 0 && (
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-orange-500" />
                        <span className="text-sm font-medium text-gray-700">
                          {result.recommendations[0].title}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(result.recommendations[0].priority)}`}>
                          {result.recommendations[0].priority.toUpperCase()}
                        </span>
                      </div>
                      <button className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700">
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Detailed View Modal */}
      {selectedResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">{selectedResult.title}</h2>
                <button
                  onClick={() => setSelectedResult(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              {/* Revenue Impact */}
              <div className="bg-green-50 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-900">Revenue Impact</span>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  +{formatCurrency(selectedResult.revenueImpact)}
                </p>
              </div>

              {/* Insights */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Key Insights</h3>
                <ul className="space-y-2">
                  {selectedResult.insights.map((insight, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-gray-700">{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Actionable Recommendations</h3>
                <div className="space-y-4">
                  {selectedResult.recommendations.map((rec, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{rec.title}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(rec.priority)}`}>
                          {rec.priority.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{rec.description}</p>
                      
                      {/* Contacts */}
                      {rec.contacts.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Ready to Contact:</h5>
                          <div className="space-y-2">
                            {rec.contacts.map((contact, contactIndex) => (
                              <div key={contactIndex} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <div>
                                  <p className="font-medium text-gray-900">{contact.name}</p>
                                  <p className="text-sm text-gray-600">{contact.context}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {contact.phone && (
                                    <button className="p-1 text-green-600 hover:bg-green-100 rounded">
                                      <Phone className="w-4 h-4" />
                                    </button>
                                  )}
                                  {contact.email && (
                                    <button className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                                      <Mail className="w-4 h-4" />
                                    </button>
                                  )}
                                  {contact.phone && (
                                    <button className="p-1 text-purple-600 hover:bg-purple-100 rounded">
                                      <MessageCircle className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}