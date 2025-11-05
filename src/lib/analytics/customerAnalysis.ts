import { Customer, SalesRecord } from '@/types';

interface CustomerAnalysisResult {
  segments: Array<{
    name: string;
    customers: Customer[];
    characteristics: string[];
    averageValue: number;
    count: number;
  }>;
  insights: string[];
  recommendations: Array<{
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    revenueImpact: number;
    contacts: Array<{
      name: string;
      email?: string;
      phone?: string;
      context: string;
    }>;
  }>;
  topCustomers: Customer[];
  atRiskCustomers: Customer[];
}

export async function runCustomerAnalysis(salesData: SalesRecord[]): Promise<CustomerAnalysisResult> {
  const customers = aggregateCustomerData(salesData);
  const segments = segmentCustomers(customers);
  const topCustomers = getTopCustomers(customers, 10);
  const atRiskCustomers = getAtRiskCustomers(customers);
  
  const insights = generateCustomerInsights(segments, topCustomers, atRiskCustomers);
  const recommendations = generateCustomerRecommendations(segments, topCustomers, atRiskCustomers);

  return {
    segments,
    insights,
    recommendations,
    topCustomers,
    atRiskCustomers
  };
}

function aggregateCustomerData(salesData: SalesRecord[]): Customer[] {
  const customerMap = new Map<string, {
    name: string;
    email?: string;
    phone?: string;
    totalSpent: number;
    purchases: SalesRecord[];
  }>();

  salesData.forEach(record => {
    const key = record.customerName.toLowerCase();
    const existing = customerMap.get(key);
    
    if (existing) {
      existing.totalSpent += record.amount;
      existing.purchases.push(record);
      // Update contact info if available
      if (record.customerEmail) existing.email = record.customerEmail;
      if (record.customerPhone) existing.phone = record.customerPhone;
    } else {
      customerMap.set(key, {
        name: record.customerName,
        email: record.customerEmail,
        phone: record.customerPhone,
        totalSpent: record.amount,
        purchases: [record]
      });
    }
  });

  return Array.from(customerMap.values()).map((data, index) => {
    const sortedPurchases = data.purchases.sort((a, b) => b.date.getTime() - a.date.getTime());
    
    return {
      id: `customer_${index + 1}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      totalSpent: data.totalSpent,
      lastPurchase: sortedPurchases[0].date,
      purchaseCount: data.purchases.length,
      averageOrderValue: data.totalSpent / data.purchases.length
    };
  });
}

function segmentCustomers(customers: Customer[]) {
  // Simple RFM-like segmentation
  const segments = [
    {
      name: 'VIP Customers',
      customers: [] as Customer[],
      characteristics: ['High value', 'Frequent purchases', 'Recent activity'],
      averageValue: 0,
      count: 0
    },
    {
      name: 'Loyal Customers',
      customers: [] as Customer[],
      characteristics: ['Regular purchases', 'Good value', 'Consistent'],
      averageValue: 0,
      count: 0
    },
    {
      name: 'Potential Customers',
      customers: [] as Customer[],
      characteristics: ['Recent purchases', 'Growing value', 'Opportunity'],
      averageValue: 0,
      count: 0
    },
    {
      name: 'At-Risk Customers',
      customers: [] as Customer[],
      characteristics: ['Declining activity', 'Long time since purchase', 'Needs attention'],
      averageValue: 0,
      count: 0
    }
  ];

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

  customers.forEach(customer => {
    const daysSinceLastPurchase = (now.getTime() - customer.lastPurchase.getTime()) / (1000 * 60 * 60 * 24);
    
    if (customer.totalSpent > 10000 && customer.purchaseCount >= 5 && daysSinceLastPurchase <= 60) {
      segments[0].customers.push(customer); // VIP
    } else if (customer.purchaseCount >= 3 && daysSinceLastPurchase <= 90) {
      segments[1].customers.push(customer); // Loyal
    } else if (customer.lastPurchase > thirtyDaysAgo) {
      segments[2].customers.push(customer); // Potential
    } else {
      segments[3].customers.push(customer); // At-Risk
    }
  });

  // Calculate averages
  segments.forEach(segment => {
    segment.count = segment.customers.length;
    segment.averageValue = segment.customers.length > 0 
      ? segment.customers.reduce((sum, c) => sum + c.totalSpent, 0) / segment.customers.length
      : 0;
  });

  return segments;
}

function getTopCustomers(customers: Customer[], limit: number): Customer[] {
  return customers
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, limit);
}

function getAtRiskCustomers(customers: Customer[]): Customer[] {
  const now = new Date();
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  
  return customers
    .filter(customer => 
      customer.lastPurchase < ninetyDaysAgo && 
      customer.totalSpent > 1000 // Only high-value at-risk customers
    )
    .sort((a, b) => b.totalSpent - a.totalSpent);
}

function generateCustomerInsights(
  segments: any[],
  topCustomers: Customer[],
  atRiskCustomers: Customer[]
): string[] {
  const insights = [];
  
  const totalCustomers = segments.reduce((sum, s) => sum + s.count, 0);
  insights.push(`Total customers analyzed: ${totalCustomers}`);
  
  const vipSegment = segments[0];
  if (vipSegment.count > 0) {
    const vipRevenue = vipSegment.customers.reduce((sum: number, c: Customer) => sum + c.totalSpent, 0);
    const vipPercentage = (vipRevenue / topCustomers.reduce((sum, c) => sum + c.totalSpent, 0)) * 100;
    insights.push(`VIP customers (${vipSegment.count}) generate ${vipPercentage.toFixed(1)}% of revenue`);
  }
  
  if (topCustomers.length > 0) {
    const topCustomer = topCustomers[0];
    insights.push(`Top customer: ${topCustomer.name} ($${topCustomer.totalSpent.toLocaleString()})`);
  }
  
  if (atRiskCustomers.length > 0) {
    const atRiskValue = atRiskCustomers.reduce((sum, c) => sum + c.totalSpent, 0);
    insights.push(`${atRiskCustomers.length} high-value customers at risk ($${atRiskValue.toLocaleString()} total value)`);
  }
  
  const loyalSegment = segments[1];
  if (loyalSegment.count > 0) {
    insights.push(`${loyalSegment.count} loyal customers with average value of $${loyalSegment.averageValue.toLocaleString()}`);
  }
  
  return insights;
}

function generateCustomerRecommendations(
  segments: any[],
  topCustomers: Customer[],
  atRiskCustomers: Customer[]
) {
  const recommendations = [];
  
  // VIP Customer Recommendations
  const vipSegment = segments[0];
  if (vipSegment.count > 0) {
    recommendations.push({
      title: 'VIP Customer Retention Program',
      description: `Launch exclusive program for ${vipSegment.count} VIP customers to maintain loyalty and increase spend.`,
      priority: 'high' as const,
      revenueImpact: Math.round(vipSegment.averageValue * vipSegment.count * 0.2),
      contacts: vipSegment.customers.slice(0, 3).map((customer: Customer) => ({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        context: `VIP customer - $${customer.totalSpent.toLocaleString()} lifetime value`
      }))
    });
  }
  
  // At-Risk Customer Recovery
  if (atRiskCustomers.length > 0) {
    const topAtRisk = atRiskCustomers.slice(0, 5);
    recommendations.push({
      title: 'Urgent: At-Risk Customer Recovery',
      description: `${atRiskCustomers.length} high-value customers haven't purchased recently. Immediate outreach required.`,
      priority: 'high' as const,
      revenueImpact: Math.round(topAtRisk.reduce((sum, c) => sum + c.averageOrderValue, 0) * 0.3),
      contacts: topAtRisk.map(customer => ({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        context: `At-risk customer - last purchase ${Math.floor((Date.now() - customer.lastPurchase.getTime()) / (1000 * 60 * 60 * 24))} days ago`
      }))
    });
  }
  
  // Upsell Opportunities
  const loyalSegment = segments[1];
  if (loyalSegment.count > 0) {
    const upsellCandidates = loyalSegment.customers
      .filter((c: Customer) => c.averageOrderValue < loyalSegment.averageValue * 1.5)
      .slice(0, 5);
      
    if (upsellCandidates.length > 0) {
      recommendations.push({
        title: 'Loyal Customer Upsell Campaign',
        description: `Target ${upsellCandidates.length} loyal customers with premium offerings to increase order value.`,
        priority: 'medium' as const,
        revenueImpact: Math.round(upsellCandidates.reduce((sum: number, c: Customer) => sum + c.averageOrderValue, 0) * 0.4),
        contacts: upsellCandidates.map((customer: Customer) => ({
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          context: `Upsell opportunity - current AOV $${customer.averageOrderValue.toLocaleString()}`
        }))
      });
    }
  }
  
  return recommendations;
}