import { SalesRecord } from '@/types';

interface ProfitabilityAnalysisResult {
  profitabilityMetrics: {
    totalRevenue: number;
    estimatedCosts: number;
    grossProfit: number;
    profitMargin: number;
    averageOrderProfit: number;
  };
  productProfitability: Array<{
    product: string;
    revenue: number;
    estimatedCost: number;
    profit: number;
    margin: number;
    profitability: 'high' | 'medium' | 'low' | 'negative';
  }>;
  customerProfitability: Array<{
    customer: string;
    revenue: number;
    estimatedCost: number;
    profit: number;
    margin: number;
    profitability: 'high' | 'medium' | 'low' | 'negative';
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
}

export async function runProfitabilityAnalysis(salesData: SalesRecord[]): Promise<ProfitabilityAnalysisResult> {
  const profitabilityMetrics = calculateOverallProfitability(salesData);
  const productProfitability = analyzeProductProfitability(salesData);
  const customerProfitability = analyzeCustomerProfitability(salesData);
  
  const insights = generateProfitabilityInsights(profitabilityMetrics, productProfitability, customerProfitability);
  const recommendations = generateProfitabilityRecommendations(profitabilityMetrics, productProfitability, customerProfitability);

  return {
    profitabilityMetrics,
    productProfitability,
    customerProfitability,
    insights,
    recommendations
  };
}

function calculateOverallProfitability(salesData: SalesRecord[]) {
  const totalRevenue = salesData.reduce((sum, record) => sum + record.amount, 0);
  
  // Estimate costs using industry averages (since we don't have actual cost data)
  // This is a simplified approach - in reality, costs would be provided or calculated more precisely
  const estimatedCostRatio = 0.65; // Assume 65% cost ratio (35% gross margin) as SMB average
  const estimatedCosts = totalRevenue * estimatedCostRatio;
  
  const grossProfit = totalRevenue - estimatedCosts;
  const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
  const averageOrderProfit = salesData.length > 0 ? grossProfit / salesData.length : 0;

  return {
    totalRevenue: Math.round(totalRevenue),
    estimatedCosts: Math.round(estimatedCosts),
    grossProfit: Math.round(grossProfit),
    profitMargin: Math.round(profitMargin * 100) / 100,
    averageOrderProfit: Math.round(averageOrderProfit)
  };
}

function analyzeProductProfitability(salesData: SalesRecord[]) {
  const productMap = new Map<string, { revenue: number; count: number }>();
  
  salesData.forEach(record => {
    const product = record.product || 'Unknown Product';
    const existing = productMap.get(product);
    
    if (existing) {
      existing.revenue += record.amount;
      existing.count += 1;
    } else {
      productMap.set(product, { revenue: record.amount, count: 1 });
    }
  });

  return Array.from(productMap.entries()).map(([product, data]) => {
    // Estimate product-specific cost ratios based on revenue patterns
    let costRatio = 0.65; // Default
    
    // Higher revenue products might have better margins due to economies of scale
    if (data.revenue > 50000) costRatio = 0.55;
    else if (data.revenue > 20000) costRatio = 0.60;
    else if (data.revenue < 5000) costRatio = 0.75; // Lower volume = higher cost ratio
    
    const estimatedCost = data.revenue * costRatio;
    const profit = data.revenue - estimatedCost;
    const margin = data.revenue > 0 ? (profit / data.revenue) * 100 : 0;
    
    let profitability: 'high' | 'medium' | 'low' | 'negative' = 'medium';
    if (margin > 40) profitability = 'high';
    else if (margin > 20) profitability = 'medium';
    else if (margin > 0) profitability = 'low';
    else profitability = 'negative';
    
    return {
      product,
      revenue: Math.round(data.revenue),
      estimatedCost: Math.round(estimatedCost),
      profit: Math.round(profit),
      margin: Math.round(margin * 100) / 100,
      profitability
    };
  }).sort((a, b) => b.profit - a.profit);
}

function analyzeCustomerProfitability(salesData: SalesRecord[]) {
  const customerMap = new Map<string, { revenue: number; count: number }>();
  
  salesData.forEach(record => {
    const customer = record.customerName;
    const existing = customerMap.get(customer);
    
    if (existing) {
      existing.revenue += record.amount;
      existing.count += 1;
    } else {
      customerMap.set(customer, { revenue: record.amount, count: 1 });
    }
  });

  return Array.from(customerMap.entries()).map(([customer, data]) => {
    // Estimate customer acquisition and service costs
    let costRatio = 0.65; // Base cost
    
    // Loyal customers (multiple orders) have lower service costs
    if (data.count > 5) costRatio = 0.55;
    else if (data.count > 2) costRatio = 0.60;
    else costRatio = 0.75; // New customers have higher acquisition costs
    
    const estimatedCost = data.revenue * costRatio;
    const profit = data.revenue - estimatedCost;
    const margin = data.revenue > 0 ? (profit / data.revenue) * 100 : 0;
    
    let profitability: 'high' | 'medium' | 'low' | 'negative' = 'medium';
    if (margin > 40) profitability = 'high';
    else if (margin > 20) profitability = 'medium';
    else if (margin > 0) profitability = 'low';
    else profitability = 'negative';
    
    return {
      customer,
      revenue: Math.round(data.revenue),
      estimatedCost: Math.round(estimatedCost),
      profit: Math.round(profit),
      margin: Math.round(margin * 100) / 100,
      profitability
    };
  }).sort((a, b) => b.profit - a.profit);
}

function generateProfitabilityInsights(
  profitabilityMetrics: any,
  productProfitability: any[],
  customerProfitability: any[]
): string[] {
  const insights = [];
  
  insights.push(`Total revenue: $${profitabilityMetrics.totalRevenue.toLocaleString()}`);
  insights.push(`Estimated gross profit: $${profitabilityMetrics.grossProfit.toLocaleString()}`);
  insights.push(`Overall profit margin: ${profitabilityMetrics.profitMargin}%`);
  
  if (profitabilityMetrics.profitMargin > 40) {
    insights.push('Excellent: High profit margins - strong business model');
  } else if (profitabilityMetrics.profitMargin > 25) {
    insights.push('Good: Healthy profit margins - room for optimization');
  } else if (profitabilityMetrics.profitMargin > 10) {
    insights.push('Moderate: Profit margins need improvement');
  } else {
    insights.push('Warning: Low profit margins - immediate action needed');
  }
  
  // Product insights
  const highProfitProducts = productProfitability.filter(p => p.profitability === 'high');
  const lowProfitProducts = productProfitability.filter(p => p.profitability === 'low' || p.profitability === 'negative');
  
  if (highProfitProducts.length > 0) {
    insights.push(`${highProfitProducts.length} high-profit products identified`);
    insights.push(`Top profit product: ${highProfitProducts[0].product} (${highProfitProducts[0].margin}% margin)`);
  }
  
  if (lowProfitProducts.length > 0) {
    insights.push(`${lowProfitProducts.length} low-profit products need attention`);
  }
  
  // Customer insights
  const highProfitCustomers = customerProfitability.filter(c => c.profitability === 'high');
  const lowProfitCustomers = customerProfitability.filter(c => c.profitability === 'low' || c.profitability === 'negative');
  
  if (highProfitCustomers.length > 0) {
    insights.push(`${highProfitCustomers.length} high-profit customers identified`);
    const topCustomer = customerProfitability[0];
    insights.push(`Most profitable customer: ${topCustomer.customer} ($${topCustomer.profit.toLocaleString()} profit)`);
  }
  
  if (lowProfitCustomers.length > 0) {
    insights.push(`${lowProfitCustomers.length} low-profit customers may need service optimization`);
  }
  
  return insights;
}

function generateProfitabilityRecommendations(
  profitabilityMetrics: any,
  productProfitability: any[],
  customerProfitability: any[]
) {
  const recommendations = [];
  
  // Focus on high-profit products
  const highProfitProducts = productProfitability.filter(p => p.profitability === 'high');
  if (highProfitProducts.length > 0) {
    const highProfitRevenue = highProfitProducts.reduce((sum, p) => sum + p.profit, 0);
    
    recommendations.push({
      title: 'Scale High-Profit Products',
      description: `${highProfitProducts.length} products show excellent margins. Increase marketing and sales focus on these profitable offerings.`,
      priority: 'high' as const,
      revenueImpact: Math.round(highProfitRevenue * 0.3), // 30% potential increase
      contacts: [
        {
          name: 'Product Manager',
          email: 'product@company.com',
          context: `Focus on high-margin products: ${highProfitProducts.slice(0, 3).map(p => `${p.product} (${p.margin}%)`).join(', ')}`
        },
        {
          name: 'Sales Manager',
          email: 'sales@company.com',
          context: 'Prioritize selling high-profit products'
        }
      ]
    });
  }
  
  // Address low-profit products
  const lowProfitProducts = productProfitability.filter(p => p.profitability === 'low' || p.profitability === 'negative');
  if (lowProfitProducts.length > 0) {
    const lowProfitLoss = lowProfitProducts.reduce((sum, p) => sum + Math.abs(p.profit), 0);
    
    recommendations.push({
      title: 'Optimize or Discontinue Low-Profit Products',
      description: `${lowProfitProducts.length} products have poor margins. Review pricing, costs, or consider discontinuation.`,
      priority: 'high' as const,
      revenueImpact: Math.round(lowProfitLoss * 0.5), // 50% potential improvement
      contacts: [
        {
          name: 'Product Manager',
          email: 'product@company.com',
          context: `Review low-margin products: ${lowProfitProducts.slice(0, 3).map(p => `${p.product} (${p.margin}%)`).join(', ')}`
        },
        {
          name: 'Operations Manager',
          email: 'ops@company.com',
          context: 'Analyze cost reduction opportunities for underperforming products'
        }
      ]
    });
  }
  
  // Optimize customer profitability
  const highProfitCustomers = customerProfitability.filter(c => c.profitability === 'high');
  if (highProfitCustomers.length > 0) {
    const highProfitValue = highProfitCustomers.reduce((sum, c) => sum + c.profit, 0);
    
    recommendations.push({
      title: 'Nurture High-Profit Customers',
      description: `${highProfitCustomers.length} customers generate excellent margins. Implement VIP program and increase engagement.`,
      priority: 'high' as const,
      revenueImpact: Math.round(highProfitValue * 0.2), // 20% potential increase
      contacts: highProfitCustomers.slice(0, 5).map(customer => ({
        name: customer.customer,
        email: undefined,
        phone: undefined,
        context: `High-profit customer: $${customer.profit.toLocaleString()} profit (${customer.margin}% margin)`
      }))
    });
  }
  
  // Overall margin improvement
  if (profitabilityMetrics.profitMargin < 30) {
    recommendations.push({
      title: 'Implement Margin Improvement Strategy',
      description: `Current margin is ${profitabilityMetrics.profitMargin}%. Focus on cost reduction, pricing optimization, and operational efficiency.`,
      priority: 'high' as const,
      revenueImpact: Math.round(profitabilityMetrics.totalRevenue * 0.05), // 5% margin improvement
      contacts: [
        {
          name: 'CFO/Finance Manager',
          email: 'finance@company.com',
          context: 'Develop comprehensive margin improvement strategy'
        },
        {
          name: 'Operations Director',
          email: 'operations@company.com',
          context: 'Identify cost reduction opportunities across operations'
        },
        {
          name: 'Pricing Manager',
          email: 'pricing@company.com',
          context: 'Review and optimize pricing strategy for better margins'
        }
      ]
    });
  }
  
  // Cost optimization
  const totalCosts = profitabilityMetrics.estimatedCosts;
  recommendations.push({
    title: 'Optimize Operational Costs',
    description: `Estimated costs are $${totalCosts.toLocaleString()}. Identify cost reduction opportunities to improve profitability.`,
    priority: 'medium' as const,
    revenueImpact: Math.round(totalCosts * 0.1), // 10% cost reduction potential
    contacts: [
      {
        name: 'Operations Manager',
        email: 'ops@company.com',
        context: 'Conduct comprehensive cost analysis and optimization'
      },
      {
        name: 'Procurement Manager',
        email: 'procurement@company.com',
        context: 'Negotiate better supplier terms and reduce material costs'
      }
    ]
  });
  
  return recommendations;
}