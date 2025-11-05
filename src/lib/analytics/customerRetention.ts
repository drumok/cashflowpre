import { Customer, SalesRecord } from '@/types';

interface CustomerRetentionResult {
  retentionMetrics: {
    overallRetentionRate: number;
    averageDaysSinceLastPurchase: number;
    atRiskCustomers: number;
    churnedCustomers: number;
    loyalCustomers: number;
  };
  customerSegments: {
    loyal: Customer[];
    atRisk: Customer[];
    churned: Customer[];
    new: Customer[];
  };
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
}

export async function runCustomerRetention(salesData: SalesRecord[]): Promise<CustomerRetentionResult> {
  const customers = aggregateCustomerData(salesData);
  const customerSegments = segmentCustomersByRetention(customers);
  const retentionMetrics = calculateRetentionMetrics(customers, customerSegments);
  
  const insights = generateRetentionInsights(retentionMetrics, customerSegments);
  const recommendations = generateRetentionRecommendations(customerSegments, retentionMetrics);

  return {
    retentionMetrics,
    customerSegments,
    insights,
    recommendations
  };
}

function aggregateCustomerData(salesData: SalesRecord[]): Customer[] {
  const customerMap = new Map<string, {
    name: string;
    email?: string;
    phone?: string;
    totalSpent: number;
    purchases: SalesRecord[];
    firstPurchase: Date;
    lastPurchase: Date;
  }>();

  salesData.forEach(record => {
    const key = record.customerName.toLowerCase();
    const existing = customerMap.get(key);
    
    if (existing) {
      existing.totalSpent += record.amount;
      existing.purchases.push(record);
      if (record.date > existing.lastPurchase) existing.lastPurchase = record.date;
      if (record.date < existing.firstPurchase) existing.firstPurchase = record.date;
      // Update contact info if available
      if (record.customerEmail) existing.email = record.customerEmail;
      if (record.customerPhone) existing.phone = record.customerPhone;
    } else {
      customerMap.set(key, {
        name: record.customerName,
        email: record.customerEmail,
        phone: record.customerPhone,
        totalSpent: record.amount,
        purchases: [record],
        firstPurchase: record.date,
        lastPurchase: record.date
      });
    }
  });

  return Array.from(customerMap.values()).map((data, index) => ({
    id: `customer_${index + 1}`,
    name: data.name,
    email: data.email,
    phone: data.phone,
    totalSpent: data.totalSpent,
    lastPurchase: data.lastPurchase,
    purchaseCount: data.purchases.length,
    averageOrderValue: data.totalSpent / data.purchases.length
  }));
}

function segmentCustomersByRetention(customers: Customer[]) {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
  const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

  const segments = {
    loyal: [] as Customer[],
    atRisk: [] as Customer[],
    churned: [] as Customer[],
    new: [] as Customer[]
  };

  customers.forEach(customer => {
    const daysSinceLastPurchase = (now.getTime() - customer.lastPurchase.getTime()) / (1000 * 60 * 60 * 24);
    const daysSinceFirstPurchase = (now.getTime() - customer.lastPurchase.getTime()) / (1000 * 60 * 60 * 24);
    
    // New customers (first purchase within 30 days)
    if (customer.lastPurchase > thirtyDaysAgo && customer.purchaseCount <= 2) {
      segments.new.push(customer);
    }
    // Loyal customers (multiple purchases, recent activity)
    else if (customer.purchaseCount >= 3 && customer.lastPurchase > ninetyDaysAgo) {
      segments.loyal.push(customer);
    }
    // At-risk customers (haven't purchased in 90-180 days, but were active)
    else if (customer.lastPurchase < ninetyDaysAgo && customer.lastPurchase > sixMonthsAgo && customer.totalSpent > 500) {
      segments.atRisk.push(customer);
    }
    // Churned customers (no purchase in 6+ months)
    else if (customer.lastPurchase < sixMonthsAgo) {
      segments.churned.push(customer);
    }
    // Default to at-risk for edge cases
    else {
      segments.atRisk.push(customer);
    }
  });

  return segments;
}

function calculateRetentionMetrics(customers: Customer[], segments: any) {
  const totalCustomers = customers.length;
  const activeCustomers = segments.loyal.length + segments.new.length;
  const overallRetentionRate = totalCustomers > 0 ? (activeCustomers / totalCustomers) * 100 : 0;
  
  const now = new Date();
  const totalDaysSinceLastPurchase = customers.reduce((sum, customer) => {
    return sum + (now.getTime() - customer.lastPurchase.getTime()) / (1000 * 60 * 60 * 24);
  }, 0);
  
  const averageDaysSinceLastPurchase = totalCustomers > 0 
    ? Math.round(totalDaysSinceLastPurchase / totalCustomers) 
    : 0;

  return {
    overallRetentionRate: Math.round(overallRetentionRate * 100) / 100,
    averageDaysSinceLastPurchase,
    atRiskCustomers: segments.atRisk.length,
    churnedCustomers: segments.churned.length,
    loyalCustomers: segments.loyal.length
  };
}

function generateRetentionInsights(retentionMetrics: any, segments: any): string[] {
  const insights = [];
  
  insights.push(`Overall customer retention rate: ${retentionMetrics.overallRetentionRate}%`);
  insights.push(`${retentionMetrics.loyalCustomers} loyal customers identified`);
  insights.push(`${retentionMetrics.atRiskCustomers} customers at risk of churning`);
  insights.push(`${retentionMetrics.churnedCustomers} customers have churned (6+ months inactive)`);
  
  if (retentionMetrics.overallRetentionRate < 70) {
    insights.push('Warning: Low retention rate - immediate action needed');
  } else if (retentionMetrics.overallRetentionRate > 85) {
    insights.push('Excellent: High retention rate - maintain current strategies');
  }
  
  insights.push(`Average days since last purchase: ${retentionMetrics.averageDaysSinceLastPurchase} days`);
  
  // Segment-specific insights
  if (segments.atRisk.length > 0) {
    const atRiskValue = segments.atRisk.reduce((sum: number, c: Customer) => sum + c.totalSpent, 0);
    insights.push(`At-risk customers represent $${atRiskValue.toLocaleString()} in lifetime value`);
  }
  
  if (segments.loyal.length > 0) {
    const loyalValue = segments.loyal.reduce((sum: number, c: Customer) => sum + c.totalSpent, 0);
    const avgLoyalValue = loyalValue / segments.loyal.length;
    insights.push(`Loyal customers average $${avgLoyalValue.toLocaleString()} lifetime value`);
  }
  
  return insights;
}

function generateRetentionRecommendations(segments: any, retentionMetrics: any) {
  const recommendations = [];
  
  // At-risk customer recovery
  if (segments.atRisk.length > 0) {
    const atRiskValue = segments.atRisk.reduce((sum: number, c: Customer) => sum + c.totalSpent, 0);
    const topAtRisk = segments.atRisk
      .sort((a: Customer, b: Customer) => b.totalSpent - a.totalSpent)
      .slice(0, 10);
    
    recommendations.push({
      title: 'URGENT: Re-engage At-Risk Customers',
      description: `${segments.atRisk.length} high-value customers are at risk of churning. Launch immediate win-back campaign.`,
      priority: 'high' as const,
      revenueImpact: Math.round(atRiskValue * 0.3), // 30% recovery potential
      contacts: topAtRisk.map((customer: Customer) => ({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        context: `At-risk: $${customer.totalSpent.toLocaleString()} LTV, last purchase ${Math.floor((Date.now() - customer.lastPurchase.getTime()) / (1000 * 60 * 60 * 24))} days ago`
      }))
    });
  }
  
  // Loyal customer nurturing
  if (segments.loyal.length > 0) {
    const loyalValue = segments.loyal.reduce((sum: number, c: Customer) => sum + c.totalSpent, 0);
    const topLoyal = segments.loyal
      .sort((a: Customer, b: Customer) => b.totalSpent - a.totalSpent)
      .slice(0, 5);
    
    recommendations.push({
      title: 'Nurture Loyal Customer Relationships',
      description: `${segments.loyal.length} loyal customers identified. Implement VIP program and exclusive offers to maintain loyalty.`,
      priority: 'high' as const,
      revenueImpact: Math.round(loyalValue * 0.15), // 15% upsell potential
      contacts: topLoyal.map((customer: Customer) => ({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        context: `Loyal customer: $${customer.totalSpent.toLocaleString()} LTV, ${customer.purchaseCount} purchases`
      }))
    });
  }
  
  // Churned customer win-back
  if (segments.churned.length > 0) {
    const churnedValue = segments.churned.reduce((sum: number, c: Customer) => sum + c.totalSpent, 0);
    const highValueChurned = segments.churned
      .filter((c: Customer) => c.totalSpent > 1000)
      .sort((a: Customer, b: Customer) => b.totalSpent - a.totalSpent)
      .slice(0, 10);
    
    if (highValueChurned.length > 0) {
      recommendations.push({
        title: 'Win-Back High-Value Churned Customers',
        description: `${highValueChurned.length} high-value customers have churned. Launch targeted win-back campaign with special offers.`,
        priority: 'medium' as const,
        revenueImpact: Math.round(highValueChurned.reduce((sum: number, c: Customer) => sum + c.averageOrderValue, 0) * 0.2), // 20% win-back rate
        contacts: highValueChurned.map((customer: Customer) => ({
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          context: `Churned: $${customer.totalSpent.toLocaleString()} LTV, inactive for ${Math.floor((Date.now() - customer.lastPurchase.getTime()) / (1000 * 60 * 60 * 24))} days`
        }))
      });
    }
  }
  
  // New customer onboarding
  if (segments.new.length > 0) {
    const newCustomerValue = segments.new.reduce((sum: number, c: Customer) => sum + c.totalSpent, 0);
    
    recommendations.push({
      title: 'Optimize New Customer Onboarding',
      description: `${segments.new.length} new customers identified. Implement onboarding sequence to increase retention and repeat purchases.`,
      priority: 'medium' as const,
      revenueImpact: Math.round(newCustomerValue * 2), // Potential to double their value
      contacts: [
        {
          name: 'Customer Success Manager',
          email: 'success@company.com',
          context: `Design onboarding program for ${segments.new.length} new customers`
        },
        {
          name: 'Marketing Manager',
          email: 'marketing@company.com',
          context: 'Create new customer nurture email sequence'
        }
      ]
    });
  }
  
  // Overall retention improvement
  if (retentionMetrics.overallRetentionRate < 75) {
    recommendations.push({
      title: 'Implement Comprehensive Retention Strategy',
      description: `Retention rate is ${retentionMetrics.overallRetentionRate}%. Develop loyalty program, improve customer service, and create retention campaigns.`,
      priority: 'high' as const,
      revenueImpact: Math.round((segments.loyal.length + segments.atRisk.length) * 500), // Estimated improvement value
      contacts: [
        {
          name: 'Customer Experience Manager',
          email: 'cx@company.com',
          context: 'Develop comprehensive customer retention strategy'
        },
        {
          name: 'Product Manager',
          email: 'product@company.com',
          context: 'Improve product experience to increase retention'
        }
      ]
    });
  }
  
  return recommendations;
}