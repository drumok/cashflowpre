'use client';

import { useState, useEffect } from 'react';
import { 
  Phone, 
  Mail, 
  MessageCircle,
  Download,
  Filter,
  Search,
  Star,
  Clock,
  AlertTriangle,
  TrendingUp,
  User,
  Target,
  DollarSign
} from 'lucide-react';

interface Lead {
  id: string;
  type: string;
  contact: {
    name: string;
    email?: string;
    phone?: string;
    company?: string;
  };
  score: number;
  revenueRange: {
    min: number;
    max: number;
  };
  urgency: 'high' | 'medium' | 'low';
  context: string;
  generatedAt: Date;
  actions: Array<{
    type: 'phone' | 'email' | 'whatsapp';
    label: string;
    template?: string;
  }>;
}

export function LeadsList() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    // Simulate API call to fetch leads
    setTimeout(() => {
      const mockLeads: Lead[] = [
        {
          id: '1',
          type: 'Overdue Payment Recovery',
          contact: {
            name: 'Sarah Johnson',
            email: 'sarah@techcorp.com',
            phone: '+1-555-0123',
            company: 'TechCorp Solutions'
          },
          score: 95,
          revenueRange: { min: 12000, max: 18000 },
          urgency: 'high',
          context: 'Invoice #1234 overdue by 45 days - historically reliable customer with $45K lifetime value',
          generatedAt: new Date(Date.now() - 1000 * 60 * 15),
          actions: [
            { type: 'phone', label: 'Call Now', template: 'Hi Sarah, following up on invoice #1234...' },
            { type: 'email', label: 'Send Email', template: 'Dear Sarah, We wanted to follow up...' },
            { type: 'whatsapp', label: 'WhatsApp', template: 'Hi Sarah! Quick follow-up on invoice #1234...' }
          ]
        },
        {
          id: '2',
          type: 'Top Customer Upsell',
          contact: {
            name: 'Michael Chen',
            email: 'michael@innovate.io',
            phone: '+1-555-0456',
            company: 'Innovate Labs'
          },
          score: 88,
          revenueRange: { min: 25000, max: 40000 },
          urgency: 'high',
          context: 'Top 5% customer ($78K lifetime value) - perfect fit for premium package based on usage patterns',
          generatedAt: new Date(Date.now() - 1000 * 60 * 30),
          actions: [
            { type: 'phone', label: 'Call Now', template: 'Hi Michael, I have an exclusive offer...' },
            { type: 'email', label: 'Send Email', template: 'Dear Michael, As one of our valued customers...' }
          ]
        },
        {
          id: '3',
          type: 'Customer Reactivation',
          contact: {
            name: 'Emma Davis',
            email: 'emma@startup.co',
            phone: '+1-555-0789',
            company: 'StartupCo'
          },
          score: 72,
          revenueRange: { min: 8000, max: 15000 },
          urgency: 'medium',
          context: 'Last purchase 6 months ago - seasonal buying pattern suggests high reactivation potential',
          generatedAt: new Date(Date.now() - 1000 * 60 * 45),
          actions: [
            { type: 'email', label: 'Send Email', template: 'Hi Emma, we miss you! Here\'s a special offer...' },
            { type: 'whatsapp', label: 'WhatsApp', template: 'Hi Emma! We have a special comeback offer...' }
          ]
        },
        {
          id: '4',
          type: 'New Customer Prospects',
          contact: {
            name: 'David Wilson',
            email: 'david@newbiz.com',
            company: 'NewBiz Ventures'
          },
          score: 65,
          revenueRange: { min: 5000, max: 12000 },
          urgency: 'medium',
          context: 'Similar profile to top customers - high conversion potential based on industry and company size',
          generatedAt: new Date(Date.now() - 1000 * 60 * 60),
          actions: [
            { type: 'email', label: 'Send Email', template: 'Dear David, I\'d like to introduce our solution...' }
          ]
        },
        {
          id: '5',
          type: 'Seasonal Opportunity',
          contact: {
            name: 'Lisa Rodriguez',
            email: 'lisa@retail.com',
            phone: '+1-555-0321',
            company: 'Retail Plus'
          },
          score: 58,
          revenueRange: { min: 3000, max: 8000 },
          urgency: 'low',
          context: 'Seasonal pattern indicates Q4 purchasing - perfect timing for holiday campaign outreach',
          generatedAt: new Date(Date.now() - 1000 * 60 * 90),
          actions: [
            { type: 'phone', label: 'Call Now', template: 'Hi Lisa, with the holidays approaching...' },
            { type: 'email', label: 'Send Email', template: 'Dear Lisa, Holiday season is here...' }
          ]
        }
      ];

      setLeads(mockLeads);
      setFilteredLeads(mockLeads);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = leads;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(lead => 
        lead.contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.contact.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by urgency
    if (selectedUrgency !== 'all') {
      filtered = filtered.filter(lead => lead.urgency === selectedUrgency);
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(lead => lead.type === selectedType);
    }

    setFilteredLeads(filtered);
  }, [leads, searchTerm, selectedUrgency, selectedType]);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    if (type.includes('Overdue')) return AlertTriangle;
    if (type.includes('Upsell')) return TrendingUp;
    if (type.includes('Reactivation')) return Clock;
    if (type.includes('Prospects')) return User;
    return Star;
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

  const exportLeads = () => {
    const csvContent = [
      ['Name', 'Company', 'Email', 'Phone', 'Type', 'Urgency', 'Revenue Min', 'Revenue Max', 'Context'],
      ...filteredLeads.map(lead => [
        lead.contact.name,
        lead.contact.company || '',
        lead.contact.email || '',
        lead.contact.phone || '',
        lead.type,
        lead.urgency,
        lead.revenueRange.min,
        lead.revenueRange.max,
        lead.context
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads-export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
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
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Generated Leads</h2>
          <p className="text-sm text-gray-600 mt-1">
            {filteredLeads.length} leads with {formatCurrency(filteredLeads.reduce((sum, lead) => sum + lead.revenueRange.max, 0))} total potential
          </p>
        </div>
        <button
          onClick={exportLeads}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <select
          value={selectedUrgency}
          onChange={(e) => setSelectedUrgency(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Urgency</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Types</option>
          <option value="Overdue Payment Recovery">Overdue Payments</option>
          <option value="Top Customer Upsell">Customer Upsell</option>
          <option value="Customer Reactivation">Reactivation</option>
          <option value="New Customer Prospects">New Prospects</option>
          <option value="Seasonal Opportunity">Seasonal</option>
        </select>
      </div>

      {/* Leads List */}
      <div className="space-y-4">
        {filteredLeads.map((lead) => {
          const TypeIcon = getTypeIcon(lead.type);
          
          return (
            <div
              key={lead.id}
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <TypeIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{lead.contact.name}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getUrgencyColor(lead.urgency)}`}>
                        {lead.urgency.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500">Score: {lead.score}</span>
                    </div>
                    <p className="text-sm text-gray-600">{lead.contact.company}</p>
                    <p className="text-sm text-blue-600 font-medium">{lead.type}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">
                    {formatCurrency(lead.revenueRange.min)} - {formatCurrency(lead.revenueRange.max)}
                  </p>
                  <p className="text-xs text-gray-500">{formatTimeAgo(lead.generatedAt)}</p>
                </div>
              </div>

              {/* Context */}
              <p className="text-sm text-gray-700 mb-4 bg-gray-50 p-3 rounded-lg">
                {lead.context}
              </p>

              {/* Contact Info & Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  {lead.contact.email && (
                    <span className="flex items-center space-x-1">
                      <Mail className="w-4 h-4" />
                      <span>{lead.contact.email}</span>
                    </span>
                  )}
                  {lead.contact.phone && (
                    <span className="flex items-center space-x-1">
                      <Phone className="w-4 h-4" />
                      <span>{lead.contact.phone}</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {lead.actions.map((action, index) => {
                    const ActionIcon = action.type === 'phone' ? Phone : 
                                     action.type === 'email' ? Mail : MessageCircle;
                    const actionColor = action.type === 'phone' ? 'bg-green-100 text-green-700 hover:bg-green-200' :
                                       action.type === 'email' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' :
                                       'bg-purple-100 text-purple-700 hover:bg-purple-200';
                    
                    return (
                      <button
                        key={index}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-md transition-colors text-sm font-medium ${actionColor}`}
                        title={action.template}
                      >
                        <ActionIcon className="w-3 h-3" />
                        <span>{action.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredLeads.length === 0 && (
        <div className="text-center py-8">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No leads found matching your criteria</p>
          <p className="text-sm text-gray-500 mt-1">Try adjusting your filters or generate new leads</p>
        </div>
      )}
    </div>
  );
}