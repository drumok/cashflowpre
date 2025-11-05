import { SalesRecord } from '@/types';

interface CashFlowResult {
  predictions: Array<{
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
  trend: 'improving' | 'declining' | 'stable';
  averageMonthlyFlow: number;
}

export async function runCashFlowPrediction(salesData: SalesRecord[]): Promise<CashFlowResult> {
  // Group sales by month for cash flow analysis
  const monthlyData = aggregateByMonth(salesData);
  const predictions = generateMovingAveragePredictions(monthlyData, 3);
  
  const trend = calculateCashFlowTrend(monthlyData);
  const averageMonthlyFlow = calculateAverageFlow(monthlyData);
  
  const insights = generateCashFlowInsights(monthlyData, predictions, trend, averageMonthlyFlow);
  const recommendations = generateCashFlowRecommendations(predictions, trend, averageMonthlyFlow);

  return {
    predictions,
    insights,
    recommendations,
    trend,
    averageMonthlyFlow
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

function generateMovingAveragePredictions(monthlyData: Array<{month: string, total: number}>, monthsAhead: number) {
  if (monthlyData.length < 3) {
    return [];
  }

  const windowSize = Math.min(3, monthlyData.length);
  const recentData = monthlyData.slice(-windowSize);
  const movingAverage = recentData.reduce((sum, d) => sum + d.total, 0) / windowSize;
  
  const predictions = [];
  const lastMonth = new Date(monthlyData[monthlyData.length - 1].month + '-01');
  
  for (let i = 1; i <= monthsAhead; i++) {
    const futureMonth = new Date(lastMonth);
    futureMonth.setMonth(futureMonth.getMonth() + i);
    
    // Add some variance based on historical volatility
    const variance = calculateVariance(recentData);
    const confidence = Math.max(0.6, 1 - (variance / movingAverage) * 0.5);
    
    predictions.push({
      month: futureMonth.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
      predicted: Math.max(0, Math.round(movingAverage)),
      confidence
    });
  }
  
  return predictions;
}

function calculateVariance(data: Array<{month: string, total: number}>) {
  const mean = data.reduce((sum, d) => sum + d.total, 0) / data.length;
  const variance = data.reduce((sum, d) => sum + Math.pow(d.total - mean, 2), 0) / data.length;
  return Math.sqrt(variance);
}

function calculateCashFlowTrend(monthlyData: Array<{month: string, total: number}>): 'improving' | 'declining' | 'stable' {
  if (monthlyData.length < 3) return 'stable';
  
  const recent = monthlyData.slice(-3);
  const older = monthlyData.slice(-6, -3);
  
  if (recent.length === 0 || older.length === 0) return 'stable';
  
  const recentAvg = recent.reduce((sum, d) => sum + d.total, 0) / recent.length;
  const olderAvg = older.reduce((sum, d) => sum + d.total, 0) / older.length;
  
  const changePercent = ((recentAvg - olderAvg) / olderAvg) * 100;
  
  if (changePercent > 10) return 'improving';
  if (changePercent < -10) return 'declining';
  return 'stable';
}

function calculateAverageFlow(monthlyData: Array<{month: string, total: number}>) {
  if (monthlyData.length === 0) return 0;
  return monthlyData.reduce((sum, d) => sum + d.total, 0) / monthlyData.length;
}

function generateCashFlowInsights(
  monthlyData: Array<{month: string, total: number}>,
  predictions: Array<{month: string, predicted: number, confidence: number}>,
  trend: string,
  averageMonthlyFlow: number
): string[] {
  const insights = [];
  
  insights.push(`Average monthly cash flow: $${averageMonthlyFlow.toLocaleString()}`);
  
  if (predictions.length > 0) {
    const nextMonth = predictions[0];
    insights.push(`Next month prediction: $${nextMonth.predicted.toLocaleString()} (${Math.round(nextMonth.confidence * 100)}% confidence)`);
  }
  
  insights.push(`Cash flow trend: ${trend}`);
  
  if (trend === 'declining') {
    insights.push('Warning: Cash flow is declining - immediate action recommended');
  } else if (trend === 'improving') {
    insights.push('Positive: Cash flow is improving - consider scaling operations');
  }
  
  const totalPredicted = predictions.reduce((sum, p) => sum + p.predicted, 0);
  insights.push(`Total predicted cash flow (next ${predictions.length} months): $${totalPredicted.toLocaleString()}`);
  
  return insights;
}

function generateCashFlowRecommendations(
  predictions: Array<{month: string, predicted: number, confidence: number}>,
  trend: string,
  averageMonthlyFlow: number
) {
  const recommendations = [];
  
  if (trend === 'declining') {
    recommendations.push({
      title: 'Urgent: Address Cash Flow Decline',
      description: 'Cash flow is trending downward. Implement immediate cost reduction and revenue acceleration strategies.',
      priority: 'high' as const,
      revenueImpact: Math.round(averageMonthlyFlow * 0.3),
      contacts: [
        {
          name: 'CFO/Finance Manager',
          email: 'finance@company.com',
          context: 'Review cash flow projections and implement cost controls'
        },
        {
          name: 'Sales Director',
          email: 'sales@company.com',
          context: 'Accelerate revenue collection and new sales'
        }
      ]
    });
  }
  
  if (trend === 'improving' && averageMonthlyFlow > 50000) {
    recommendations.push({
      title: 'Scale Operations for Growth',
      description: 'Strong cash flow trend detected. Consider investing in growth opportunities.',
      priority: 'medium' as const,
      revenueImpact: Math.round(averageMonthlyFlow * 0.2),
      contacts: [
        {
          name: 'Operations Manager',
          email: 'ops@company.com',
          context: 'Plan operational scaling for sustained growth'
        }
      ]
    });
  }
  
  // Cash flow optimization recommendation
  const lowestMonth = predictions.reduce((min, current) => 
    current.predicted < min.predicted ? current : min, predictions[0]
  );
  
  if (lowestMonth && lowestMonth.predicted < averageMonthlyFlow * 0.7) {
    recommendations.push({
      title: `Prepare for ${lowestMonth.month} Cash Flow Dip`,
      description: `${lowestMonth.month} shows lower predicted cash flow. Ensure adequate reserves.`,
      priority: 'medium' as const,
      revenueImpact: Math.round(averageMonthlyFlow - lowestMonth.predicted),
      contacts: [
        {
          name: 'Finance Manager',
          email: 'finance@company.com',
          context: `Prepare cash reserves for ${lowestMonth.month} shortfall`
        }
      ]
    });
  }
  
  return recommendations;
}