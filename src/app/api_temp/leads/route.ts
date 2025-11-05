import { NextRequest, NextResponse } from 'next/server';

// Static export compatible

export async function POST(request: NextRequest) {
  try {
    const { leadType, data, userId } = await request.json();

    if (!leadType || !data || !userId) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Mock lead generation for now
    const leads = [
      {
        id: '1',
        type: leadType,
        contact: {
          name: 'Sample Lead',
          email: 'lead@example.com',
          phone: '+1-555-0123'
        },
        score: 85,
        revenueRange: { min: 5000, max: 15000 },
        urgency: 'high',
        generatedAt: new Date().toISOString()
      }
    ];

    // Store leads in database (Firestore)
    // TODO: Implement database storage

    return NextResponse.json({
      success: true,
      data: leads,
      message: 'Leads generated successfully'
    });

  } catch (error) {
    console.error('Leads API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const leadType = searchParams.get('leadType');
    const priority = searchParams.get('priority');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // TODO: Implement database retrieval
    // For now, return mock data
    const mockLeads = [
      {
        id: '1',
        type: 'overdue_payment_recovery',
        contact: {
          name: 'Sarah Johnson',
          email: 'sarah@company.com',
          phone: '+1-555-0123',
          context: 'Invoice #1234 overdue by 45 days - high-value customer'
        },
        score: 95,
        revenueRange: { min: 12000, max: 18000 },
        urgency: 'high',
        generatedAt: new Date().toISOString(),
        actions: [
          {
            type: 'phone',
            label: 'Call Now',
            template: 'Hi Sarah, this is regarding invoice #1234 which is 45 days overdue. Can we discuss payment options?'
          },
          {
            type: 'email',
            label: 'Send Email',
            template: 'Dear Sarah, We wanted to follow up on invoice #1234...'
          },
          {
            type: 'whatsapp',
            label: 'WhatsApp',
            template: 'Hi Sarah! Quick follow-up on invoice #1234. When can we expect payment?'
          }
        ]
      },
      {
        id: '2',
        type: 'top_customer_upsell',
        contact: {
          name: 'Michael Chen',
          email: 'michael@techcorp.com',
          phone: '+1-555-0456',
          context: 'Top 5% customer, ready for premium package upgrade'
        },
        score: 88,
        revenueRange: { min: 25000, max: 40000 },
        urgency: 'high',
        generatedAt: new Date().toISOString(),
        actions: [
          {
            type: 'phone',
            label: 'Call Now',
            template: 'Hi Michael, based on your usage patterns, I think our premium package would be perfect for you...'
          }
        ]
      },
      {
        id: '3',
        type: 'repeat_customer_reactivation',
        contact: {
          name: 'Emma Davis',
          email: 'emma@startup.io',
          phone: '+1-555-0789',
          context: 'Last purchase 6 months ago, seasonal buying pattern'
        },
        score: 72,
        revenueRange: { min: 8000, max: 15000 },
        urgency: 'medium',
        generatedAt: new Date().toISOString(),
        actions: [
          {
            type: 'email',
            label: 'Send Email',
            template: 'Hi Emma, we miss you! Here\'s a special offer to welcome you back...'
          }
        ]
      }
    ];

    let filteredLeads = mockLeads;

    if (leadType) {
      filteredLeads = filteredLeads.filter(lead => lead.type === leadType);
    }

    if (priority) {
      filteredLeads = filteredLeads.filter(lead => lead.urgency === priority);
    }

    return NextResponse.json({ success: true, data: filteredLeads });

  } catch (error) {
    console.error('Leads GET API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}