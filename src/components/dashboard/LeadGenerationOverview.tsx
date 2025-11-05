'use client';

import { useState, useEffect } from 'react';
import { 
  Target, 
  Phone, 
  Mail, 
  MessageCircle,
  DollarSign,
  Clock,
  Users,
  TrendingUp
} from 'lucide-react';

interface Lead {
  id: string;
  type: string;
  contact: {
    name: string;
    phone?: string;
    email?: string;
  };
  revenueRange: {
    min: number;
    max: number;
  };
  urgency: 'high' | 'medium' | 'low';
  context: string;
}

export function LeadGenerationOverview() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLeads: 0,
    totalRevenuePotential: 0,
    highPriorityLeads: 0,
    readyToContact: 0
  });

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockLeads: Lead[] = [
        {
          id: '1',
          type: 'Overdue Payment Recovery',
          contact: {
            name: 'Sarah Johnson',
            phone: '+1-555-0123',
            email: 'sarah@company.com'
          },
          revenueRange: { min: 12000, max: 18000 },
          urgency: 'high',
          context: 'Invoice #1234 overdue by 45 days - high-value customer'
        },
        {
          id: '2',
          type: 'Top Customer Upsell',
          contact: {
            name: 'Michael Chen',
            phone: '+1-555-0456',
            email: 'michael@techcorp.com'
          },
          revenueRange: { min: 25000, max: 40000 },
          urgency: 'high',
          context: 'Top 5% customer, ready for premium package upgrade'
        },
        {
          id: '3',
          type: 'Repeat Customer Reactivation',
          contact: {
            name: 'Emma Davis',
            phone: '+1-555-0789',
            email: 'emma@startup.io'
          },
          revenueRange: { min: 8000, max: 15000 },
          urgency: 'medium',
          context: 'Last purchase 6 months ago, seasonal buying pattern'
        },
        {
          id: '4',
          type: 'New Customer Prospects',
          contact: {
            name: 'David Wilson',
            email: 'david@newbiz.com'
          },
          revenueRange: { min: 5000, max: 12000 },
          urgency: 'medium',
          context: 'Similar profile to top customers, high conversion potential'
        }
      ];

      setLeads(mockLeads);
      setStats({
        totalLeads: mockLeads.length,
        totalRevenuePotential: mockLeads.reduce((sum, lead) => sum + lead.revenueRange.max, 0),
        highPriorityLeads: mockLeads.filter(lead => lead.urgency === 'high').length,
        readyToContact: mockLeads.filter(lead => lead.contact.phone || lead.contact.email).length
      });
      setIsLoading(false);
    }, 1200);
  }, []);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
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
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
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
        <h2 className="text-xl font-semibold text-gray-900">Lead Generation</h2>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          View All Leads →
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <Target className="w-6 h-6 text-blue-600 mx-auto mb-1" />
          <p className="text-2xl font-bold text-blue-900">{stats.totalLeads}</p>
          <p className="text-sm text-blue-700">Total Leads</p>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-1" />
          <p className="text-2xl font-bold text-green-900">{formatCurrency(stats.totalRevenuePotential)}</p>
          <p className="text-sm text-green-700">Revenue Potential</p>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <Clock className="w-6 h-6 text-red-600 mx-auto mb-1" />
          <p className="text-2xl font-bold text-red-900">{stats.highPriorityLeads}</p>
          <p className="text-sm text-red-700">High Priority</p>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <Users className="w-6 h-6 text-purple-600 mx-auto mb-1" />
          <p className="text-2xl font-bold text-purple-900">{stats.readyToContact}</p>
          <p className="text-sm text-purple-700">Ready to Contact</p>
        </div>
      </div>

      {/* Top Leads */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Top Priority Leads</h3>
        {leads.slice(0, 3).map((lead) => (
          <div
            key={lead.id}
            className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium text-gray-900">{lead.contact.name}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getUrgencyColor(lead.urgency)}`}>
                    {lead.urgency.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{lead.type}</p>
                <p className="text-sm text-gray-500">{lead.context}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-600">
                  {formatCurrency(lead.revenueRange.min)} - {formatCurrency(lead.revenueRange.max)}
                </p>
              </div>
            </div>
            
            {/* Contact Actions */}
            <div className="flex items-center space-x-2 mt-3">
              {lead.contact.phone && (
                <button className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors text-sm">
                  <Phone className="w-3 h-3" />
                  <span>Call</span>
                </button>
              )}
              {lead.contact.email && (
                <button className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm">
                  <Mail className="w-3 h-3" />
                  <span>Email</span>
                </button>
              )}
              {lead.contact.phone && (
                <button className="flex items-center space-x-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors text-sm">
                  <MessageCircle className="w-3 h-3" />
                  <span>WhatsApp</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Target className="w-4 h-4" />
            <span>Generate New Leads</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <TrendingUp className="w-4 h-4" />
            <span>Export Contact List</span>
          </button>
        </div>
      </div>
    </div>
  );
}