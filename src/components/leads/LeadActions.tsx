'use client';

import { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MessageCircle,
  Download,
  FileText,
  Users,
  DollarSign,
  Clock,
  Target,
  Zap,
  Copy,
  Check
} from 'lucide-react';

export function LeadActions() {
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);

  const quickStats = [
    {
      label: 'High Priority',
      value: '12',
      icon: Clock,
      color: 'text-red-600 bg-red-50'
    },
    {
      label: 'Ready to Call',
      value: '8',
      icon: Phone,
      color: 'text-green-600 bg-green-50'
    },
    {
      label: 'Email Ready',
      value: '15',
      icon: Mail,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      label: 'Total Value',
      value: '$89K',
      icon: DollarSign,
      color: 'text-purple-600 bg-purple-50'
    }
  ];

  const communicationTemplates = [
    {
      id: 'overdue_payment',
      title: 'Overdue Payment Follow-up',
      type: 'phone',
      template: "Hi {customerName}, this is [Your Name] from [Company]. I'm calling about invoice #{invoiceNumber} for ${amount} that's currently overdue. I wanted to check if there are any issues and see how we can resolve this quickly. When would be a good time to discuss payment options?",
      icon: Phone,
      color: 'bg-green-500'
    },
    {
      id: 'upsell_email',
      title: 'Premium Upsell Email',
      type: 'email',
      template: "Subject: Exclusive Upgrade Opportunity - 20% Off Premium\n\nDear {customerName},\n\nAs one of our valued customers, I wanted to personally reach out with an exclusive opportunity. Based on your usage patterns, our Premium package would be perfect for your needs and could save you significant time and money.\n\nFor the next 7 days, I'm offering you 20% off your first year of Premium - that's a savings of ${savingsAmount}!\n\nKey benefits you'll get:\n• Advanced analytics and reporting\n• Priority customer support\n• Additional integrations\n• Increased usage limits\n\nWould you like to schedule a quick 15-minute call to discuss how Premium can benefit your business?\n\nBest regards,\n[Your Name]",
      icon: Mail,
      color: 'bg-blue-500'
    },
    {
      id: 'reactivation_whatsapp',
      title: 'Customer Reactivation',
      type: 'whatsapp',
      template: "Hi {customerName}! 👋 We miss you at [Company]! I noticed it's been a while since your last order. We have some exciting new products and a special 15% welcome-back discount just for you. Would you like to hear about what's new? 🎉",
      icon: MessageCircle,
      color: 'bg-purple-500'
    }
  ];

  const quickActions = [
    {
      id: 'bulk_email',
      title: 'Send Bulk Email',
      description: 'Send personalized emails to all qualified leads',
      icon: Mail,
      color: 'bg-blue-600 hover:bg-blue-700',
      count: '15 leads'
    },
    {
      id: 'call_list',
      title: 'Generate Call List',
      description: 'Create prioritized calling list with scripts',
      icon: Phone,
      color: 'bg-green-600 hover:bg-green-700',
      count: '8 leads'
    },
    {
      id: 'whatsapp_campaign',
      title: 'WhatsApp Campaign',
      description: 'Send WhatsApp messages to mobile contacts',
      icon: MessageCircle,
      color: 'bg-purple-600 hover:bg-purple-700',
      count: '6 leads'
    },
    {
      id: 'export_crm',
      title: 'Export to CRM',
      description: 'Export leads with all contact information',
      icon: Download,
      color: 'bg-orange-600 hover:bg-orange-700',
      count: 'All leads'
    }
  ];

  const copyTemplate = (template: string, templateId: string) => {
    navigator.clipboard.writeText(template);
    setCopiedTemplate(templateId);
    setTimeout(() => setCopiedTemplate(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          {quickStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center">
                <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center mx-auto mb-2`}>
                  <Icon className="w-6 h-6" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="space-y-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg text-white transition-colors ${action.color}`}
              >
                <Icon className="w-5 h-5" />
                <div className="flex-1 text-left">
                  <p className="font-medium">{action.title}</p>
                  <p className="text-sm opacity-90">{action.description}</p>
                </div>
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                  {action.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Communication Templates */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Message Templates</h3>
        <div className="space-y-4">
          {communicationTemplates.map((template) => {
            const Icon = template.icon;
            const isCopied = copiedTemplate === template.id;
            
            return (
              <div key={template.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-lg ${template.color}`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="font-medium text-gray-900">{template.title}</h4>
                  </div>
                  <button
                    onClick={() => copyTemplate(template.template, template.id)}
                    className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3 h-3 text-green-600" />
                        <span className="text-green-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                
                <div className="bg-gray-50 rounded-md p-3">
                  <p className="text-sm text-gray-700 whitespace-pre-line">
                    {template.template.length > 200 
                      ? `${template.template.substring(0, 200)}...` 
                      : template.template
                    }
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Revenue Tracker */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center space-x-3 mb-3">
          <Target className="w-6 h-6" />
          <h3 className="text-lg font-semibold">Revenue Opportunity</h3>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-green-100">Total Potential:</span>
            <span className="text-2xl font-bold">$156,000</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-green-100">High Priority:</span>
            <span className="text-lg font-semibold">$89,000</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-green-100">Conversion Rate:</span>
            <span className="text-lg font-semibold">35%</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-sm text-green-100 mb-3">
            Expected revenue if 35% of leads convert:
          </p>
          <p className="text-3xl font-bold">$54,600</p>
        </div>
      </div>

      {/* Performance Tips */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Zap className="w-5 h-5 text-yellow-500" />
          <h3 className="text-lg font-semibold text-gray-900">Performance Tips</h3>
        </div>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p>Call high-priority leads within 24 hours for best conversion rates</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
            <p>Personalize email templates with specific customer context</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
            <p>Follow up overdue payments with a phone call, then email</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
            <p>Track response rates and adjust templates accordingly</p>
          </div>
        </div>
      </div>
    </div>
  );
}