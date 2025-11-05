import { SalesRecord } from '@/types';

interface ProductPerformanceResult {
  topProducts: Array<{
    product: string;
    totalRevenue: number;
    totalSales: number;
    averageOrderValue: number;
    rank: number;
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
  performanceMetrics: {
    totalProducts: number;
    topPerformerRevenue: number;
    bottomPerformerRevenue: number;
    revenueConcentration: number; // % of revenue from top 20% products
  };
}

export async function runProductPerformance(salesData: SalesRecord[]): Promise<ProductPerformanceResult> {
  const productData = aggregateProductData(salesData);
  const rankedProducts = rankProductsByPerformance(productData);
  const performanceMetrics = calculatePerformanceMetrics(rankedProducts);
  
  const insights = generateProductInsights(rankedProducts, performanceMetrics);
  const recommendations = generateProductRecommendations(rankedProducts, performanceMetrics);

  return {
    topProducts: rankedProducts,
    insights,
    recommendations,
    performanceMetrics
  };
}

function aggregateProductData(salesData: SalesRecord[]) {
  const productMap = new Map<string, {
    totalRevenue: number;
    totalSales: number;
    orders: number;
  }>();

  salesData.forEach(record => {
    const productName = record.product || 'Unknown Product';
    const existing = productMap.get(productName);
    
    if (existing) {
      existing.totalRevenue += record.amount;
      existing.totalSales += 1;
      existing.orders += 1;
    } else {
      productMap.set(productName, {
        totalRevenue: record.amount,
        totalSales: 1,
        orders: 1
      });
    }
  });

  return Array.from(productMap.entries()).map(([product, data]) => ({
    product,
    totalRevenue: data.totalRevenue,
    totalSales: data.totalSales,
    averageOrderValue: data.totalRevenue / data.orders,
    orders: data.orders
  }));
}

function rankProductsByPerformance(productData: Array<{
  product: string;
  totalRevenue: number;
  totalSales: number;
  averageOrderValue: number;
  orders: number;
}>) {
  // Rank by total revenue (primary metric)
  const rankedProducts = productData
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .map((product, index) => ({
      product: product.product,
      totalRevenue: product.totalRevenue,
      totalSales: product.totalSales,
      averageOrderValue: product.averageOrderValue,
      rank: index + 1
    }));

  return rankedProducts;
}

function calculatePerformanceMetrics(rankedProducts: Array<{
  product: string;
  totalRevenue: number;
  totalSales: number;
  averageOrderValue: number;
  rank: number;
}>) {
  const totalProducts = rankedProducts.length;
  const totalRevenue = rankedProducts.reduce((sum, p) => sum + p.totalRevenue, 0);
  
  const topPerformerRevenue = rankedProducts.length > 0 ? rankedProducts[0].totalRevenue : 0;
  const bottomPerformerRevenue = rankedProducts.length > 0 
    ? rankedProducts[rankedProducts.length - 1].totalRevenue 
    : 0;

  // Calculate revenue concentration (80/20 rule)
  const top20PercentCount = Math.max(1, Math.ceil(totalProducts * 0.2));
  const top20PercentRevenue = rankedProducts
    .slice(0, top20PercentCount)
    .reduce((sum, p) => sum + p.totalRevenue, 0);
  
  const revenueConcentration = totalRevenue > 0 
    ? (top20PercentRevenue / totalRevenue) * 100 
    : 0;

  return {
    totalProducts,
    topPerformerRevenue,
    bottomPerformerRevenue,
    revenueConcentration: Math.round(revenueConcentration * 100) / 100
  };
}

function generateProductInsights(
  rankedProducts: Array<{
    product: string;
    totalRevenue: number;
    totalSales: number;
    averageOrderValue: number;
    rank: number;
  }>,
  performanceMetrics: any
): string[] {
  const insights = [];
  
  insights.push(`${performanceMetrics.totalProducts} products analyzed`);
  
  if (rankedProducts.length > 0) {
    const topProduct = rankedProducts[0];
    insights.push(`Top performer: ${topProduct.product} ($${topProduct.totalRevenue.toLocaleString()} revenue)`);
    
    const topProductShare = (topProduct.totalRevenue / rankedProducts.reduce((sum, p) => sum + p.totalRevenue, 0)) * 100;
    insights.push(`Top product generates ${topProductShare.toFixed(1)}% of total revenue`);
  }
  
  insights.push(`Top 20% of products generate ${performanceMetrics.revenueConcentration}% of revenue`);
  
  // Identify underperformers
  const totalRevenue = rankedProducts.reduce((sum, p) => sum + p.totalRevenue, 0);
  const averageRevenue = totalRevenue / rankedProducts.length;
  const underperformers = rankedProducts.filter(p => p.totalRevenue < averageRevenue * 0.5);
  
  if (underperformers.length > 0) {
    insights.push(`${underperformers.length} products are significantly underperforming (below 50% of average)`);
  }
  
  // High AOV products
  const highAOVProducts = rankedProducts.filter(p => p.averageOrderValue > averageRevenue / rankedProducts.length * 2);
  if (highAOVProducts.length > 0) {
    insights.push(`${highAOVProducts.length} products have high average order values - focus on promotion`);
  }
  
  return insights;
}

function generateProductRecommendations(
  rankedProducts: Array<{
    product: string;
    totalRevenue: number;
    totalSales: number;
    averageOrderValue: number;
    rank: number;
  }>,
  performanceMetrics: any
) {
  const recommendations = [];
  
  // Focus on top performers
  const topPerformers = rankedProducts.slice(0, Math.min(3, rankedProducts.length));
  if (topPerformers.length > 0) {
    const topRevenue = topPerformers.reduce((sum, p) => sum + p.totalRevenue, 0);
    
    recommendations.push({
      title: 'Double Down on Top Performers',
      description: `Your top ${topPerformers.length} products generate significant revenue. Increase marketing and inventory focus.`,
      priority: 'high' as const,
      revenueImpact: Math.round(topRevenue * 0.2), // 20% potential increase
      contacts: [
        {
          name: 'Product Manager',
          email: 'product@company.com',
          context: `Focus on top products: ${topPerformers.map(p => p.product).join(', ')}`
        },
        {
          name: 'Marketing Manager',
          email: 'marketing@company.com',
          context: 'Increase marketing spend on top-performing products'
        }
      ]
    });
  }
  
  // Address underperformers
  const totalRevenue = rankedProducts.reduce((sum, p) => sum + p.totalRevenue, 0);
  const averageRevenue = totalRevenue / rankedProducts.length;
  const underperformers = rankedProducts.filter(p => p.totalRevenue < averageRevenue * 0.3);
  
  if (underperformers.length > 0) {
    const underperformerRevenue = underperformers.reduce((sum, p) => sum + p.totalRevenue, 0);
    
    recommendations.push({
      title: 'Review Underperforming Products',
      description: `${underperformers.length} products are significantly underperforming. Consider discontinuation or repositioning.`,
      priority: 'medium' as const,
      revenueImpact: Math.round(underperformerRevenue * 0.5), // Potential cost savings
      contacts: [
        {
          name: 'Product Manager',
          email: 'product@company.com',
          context: `Review underperformers: ${underperformers.slice(0, 3).map(p => p.product).join(', ')}`
        },
        {
          name: 'Operations Manager',
          email: 'ops@company.com',
          context: 'Analyze inventory and operational costs for underperforming products'
        }
      ]
    });
  }
  
  // High AOV opportunity
  const sortedByAOV = [...rankedProducts].sort((a, b) => b.averageOrderValue - a.averageOrderValue);
  const highAOVProducts = sortedByAOV.slice(0, Math.min(3, sortedByAOV.length));
  
  if (highAOVProducts.length > 0 && highAOVProducts[0].averageOrderValue > averageRevenue) {
    recommendations.push({
      title: 'Promote High-Value Products',
      description: `Products with high average order values identified. Focus sales efforts on these premium offerings.`,
      priority: 'medium' as const,
      revenueImpact: Math.round(highAOVProducts.reduce((sum, p) => sum + p.totalRevenue, 0) * 0.15),
      contacts: [
        {
          name: 'Sales Manager',
          email: 'sales@company.com',
          context: `Promote high-AOV products: ${highAOVProducts.map(p => `${p.product} ($${p.averageOrderValue.toLocaleString()} AOV)`).join(', ')}`
        }
      ]
    });
  }
  
  // Product portfolio optimization
  if (performanceMetrics.revenueConcentration > 80) {
    recommendations.push({
      title: 'Diversify Product Portfolio',
      description: `${performanceMetrics.revenueConcentration}% of revenue comes from top products. Consider diversification to reduce risk.`,
      priority: 'low' as const,
      revenueImpact: Math.round(totalRevenue * 0.1),
      contacts: [
        {
          name: 'Product Strategy Manager',
          email: 'strategy@company.com',
          context: 'Develop strategy to diversify product portfolio and reduce concentration risk'
        }
      ]
    });
  }
  
  return recommendations;
}