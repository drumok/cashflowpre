import { SalesRecord } from '@/types';

interface ForecastResult {
  forecast: Array<{
    month: string;
    predicted: number;
    confidence: number;
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
  trend: 'increasing' | 'decreasing' | 'stable';
  growthRate: number;
}

export async function runSalesForecasting(salesData: SalesRecord[]): Promise<ForecastResult> {
  // Simple linear regression for sales forecasting
  const monthlyData = aggregateByMonth(salesData);
  const forecast = generateLinearForecast(monthlyData, 3); // 3 months ahead
  
  const trend = calculateTrend(monthlyData);
  const growthRate = calculateGrowthRate(monthlyData);
  
  const insights = generateInsights(monthlyData, forecast, trend, growthRate);
  const recommendations = generateRecommendations(forecast, trend, growthRate);

  return {
    forecast,
    insights,
    recommendations,
    trend,
    growthRate
  };
}

function aggregateByMonth(salesData: SalesRecord[]) {
  const monthlyTotals = new Map<string, number>();
  
  salesData.forEach(record => {
    const monthKey = record.date.toISOString().substring(0, 7); // YYYY-MM
    const current = monthlyTotals.get(monthKey) || 0;
    monthlyTotals.set(monthKey, current + record.amount);
  });

  return Array.from(monthlyTotals.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, total]) => ({ month, total }));
}

function generateLinearForecast(monthlyData: Array<{month: string, total: number}>, monthsAhead: number) {
  if (monthlyData.length < 2) {
    // Not enough data for forecasting
    return [];
  }

  // Simple linear regression
  const n = monthlyData.length;
  const x = monthlyData.map((_, i) => i);
  const y = monthlyData.map(d => d.total);
  
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  const forecast = [];
  const lastMonth = new Date(monthlyData[monthlyData.length - 1].month + '-01');
  
  for (let i = 1; i <= monthsAhead; i++) {
    const futureMonth = new Date(lastMonth);
    futureMonth.setMonth(futureMonth.getMonth() + i);
    
    const predicted = slope * (n + i - 1) + intercept;
    const confidence = Math.max(0.6, 1 - (i * 0.1)); // Decreasing confidence over time
    
    forecast.push({
      month: futureMonth.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
      predicted: Math.max(0, Math.round(predicted)),
      confidence
    });
  }
  
  return forecast;
}

function calculateTrend(monthlyData: Array<{month: string, total: number}>): 'increasing' | 'decreasing' | 'stable' {
  if (monthlyData.length < 2) return 'stable';
  
  const recent = monthlyData.slice(-3); // Last 3 months
  const older = monthlyData.slice(-6, -3); // Previous 3 months
  
  if (recent.length === 0 || older.length === 0) return 'stable';
  
  const recentAvg = recent.reduce((sum, d) => sum + d.total, 0) / recent.length;
  const olderAvg = older.reduce((sum, d) => sum + d.total, 0) / older.length;
  
  const changePercent = ((recentAvg - olderAvg) / olderAvg) * 100;
  
  if (changePercent > 5) return 'increasing';
  if (changePercent < -5) return 'decreasing';
  return 'stable';
}

function calculateGrowthRate(monthlyData: Array<{month: string, total: number}>): number {
  if (monthlyData.length < 2) return 0;
  
  const firstHalf = monthlyData.slice(0, Math.floor(monthlyData.length / 2));
  const secondHalf = monthlyData.slice(Math.floor(monthlyData.length / 2));
  
  const firstAvg = firstHalf.reduce((sum, d) => sum + d.total, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, d) => sum + d.total, 0) / secondHalf.length;
  
  return ((secondAvg - firstAvg) / firstAvg) * 100;
}

function generateInsights(
  monthlyData: Array<{month: string, total: number}>, 
  forecast: Array<{month: string, predicted: number, confidence: number}>,
  trend: string,
  growthRate: number
): string[] {
  const insights = [];
  
  if (monthlyData.length > 0) {
    const currentMonth = monthlyData[monthlyData.length - 1];
    insights.push(`Current month revenue: $${currentMonth.total.toLocaleString()}`);
  }
  
  if (forecast.length > 0) {
    const nextMonth = forecast[0];
    insights.push(`Next month forecast: $${nextMonth.predicted.toLocaleString()} (${Math.round(nextMonth.confidence * 100)}% confidence)`);
  }
  
  insights.push(`Sales trend: ${trend} with ${growthRate.toFixed(1)}% growth rate`);
  
  if (trend === 'increasing') {
    insights.push('Strong upward momentum detected - consider scaling operations');
  } else if (trend === 'decreasing') {
    insights.push('Declining trend identified - immediate action recommended');
  }
  
  const totalForecast = forecast.reduce((sum, f) => sum + f.predicted, 0);
  insights.push(`Total forecasted revenue (next ${forecast.length} months): $${totalForecast.toLocaleString()}`);
  
  return insights;
}

function generateRecommendations(
  forecast: Array<{month: string, predicted: number, confidence: number}>,
  trend: string,
  growthRate: number
) {
  const recommendations = [];
  
  if (trend === 'increasing' && growthRate > 10) {
    recommendations.push({
      title: 'Scale Operations for Growth',
      description: 'Strong growth trend detected. Consider increasing inventory, staff, and marketing budget.',
      priority: 'high' as const,
      revenueImpact: Math.round(forecast.reduce((sum, f) => sum + f.predicted, 0) * 0.15),
      contacts: [
        {
          name: 'Operations Manager',
          email: 'ops@company.com',
          context: 'Coordinate scaling operations for projected growth'
        },
        {
          name: 'Finance Director',
          email: 'finance@company.com',
          context: 'Approve budget increase for growth initiatives'
        }
      ]
    });
  }
  
  if (trend === 'decreasing') {
    recommendations.push({
      title: 'Urgent: Address Declining Sales',
      description: 'Sales are trending downward. Implement retention campaigns and review pricing strategy.',
      priority: 'high' as const,
      revenueImpact: Math.round(forecast.reduce((sum, f) => sum + f.predicted, 0) * 0.25),
      contacts: [
        {
          name: 'Sales Director',
          email: 'sales@company.com',
          context: 'Implement immediate sales recovery strategies'
        },
        {
          name: 'Marketing Manager',
          email: 'marketing@company.com',
          context: 'Launch customer retention and acquisition campaigns'
        }
      ]
    });
  }
  
  if (forecast.length > 0) {
    const peakMonth = forecast.reduce((max, current) => 
      current.predicted > max.predicted ? current : max
    );
    
    recommendations.push({
      title: `Prepare for ${peakMonth.month} Peak`,
      description: `${peakMonth.month} shows highest revenue potential. Ensure adequate resources and inventory.`,
      priority: 'medium' as const,
      revenueImpact: Math.round(peakMonth.predicted * 0.1),
      contacts: [
        {
          name: 'Supply Chain Manager',
          email: 'supply@company.com',
          context: `Prepare inventory for ${peakMonth.month} peak demand`
        }
      ]
    });
  }
  
  return recommendations;
}