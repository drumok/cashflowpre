import { SalesRecord } from '@/types';

interface SeasonalTrendsResult {
  monthlyTrends: Array<{
    month: number;
    monthName: string;
    averageRevenue: number;
    salesCount: number;
    growthRate: number;
    seasonality: 'peak' | 'high' | 'normal' | 'low';
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
  seasonalMetrics: {
    peakMonth: string;
    lowMonth: string;
    seasonalityIndex: number; // How seasonal the business is (0-100)
    predictedNextPeak: string;
  };
}

export async function runSeasonalTrends(salesData: SalesRecord[]): Promise<SeasonalTrendsResult> {
  const monthlyTrends = analyzeMonthlyTrends(salesData);
  const seasonalMetrics = calculateSeasonalMetrics(monthlyTrends);
  
  const insights = generateSeasonalInsights(monthlyTrends, seasonalMetrics);
  const recommendations = generateSeasonalRecommendations(monthlyTrends, seasonalMetrics);

  return {
    monthlyTrends,
    insights,
    recommendations,
    seasonalMetrics
  };
}

function analyzeMonthlyTrends(salesData: SalesRecord[]) {
  // Group sales by month (1-12)
  const monthlyData = new Map<number, { revenue: number; count: number; years: Set<number> }>();
  
  // Initialize all months
  for (let i = 1; i <= 12; i++) {
    monthlyData.set(i, { revenue: 0, count: 0, years: new Set() });
  }
  
  salesData.forEach(record => {
    const month = record.date.getMonth() + 1; // 1-12
    const year = record.date.getFullYear();
    const existing = monthlyData.get(month)!;
    
    existing.revenue += record.amount;
    existing.count += 1;
    existing.years.add(year);
  });

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Calculate averages and trends
  const trends = Array.from(monthlyData.entries()).map(([month, data]) => {
    const yearCount = data.years.size || 1;
    const averageRevenue = data.revenue / yearCount;
    const salesCount = Math.round(data.count / yearCount);
    
    return {
      month,
      monthName: monthNames[month - 1],
      averageRevenue,
      salesCount,
      totalRevenue: data.revenue,
      yearCount
    };
  });

  // Calculate growth rates and seasonality
  const overallAverage = trends.reduce((sum, t) => sum + t.averageRevenue, 0) / 12;
  
  const trendsWithMetrics = trends.map(trend => {
    const growthRate = ((trend.averageRevenue - overallAverage) / overallAverage) * 100;
    
    let seasonality: 'peak' | 'high' | 'normal' | 'low' = 'normal';
    if (growthRate > 25) seasonality = 'peak';
    else if (growthRate > 10) seasonality = 'high';
    else if (growthRate < -25) seasonality = 'low';
    
    return {
      month: trend.month,
      monthName: trend.monthName,
      averageRevenue: Math.round(trend.averageRevenue),
      salesCount: trend.salesCount,
      growthRate: Math.round(growthRate * 100) / 100,
      seasonality
    };
  });

  return trendsWithMetrics;
}

function calculateSeasonalMetrics(monthlyTrends: Array<{
  month: number;
  monthName: string;
  averageRevenue: number;
  salesCount: number;
  growthRate: number;
  seasonality: 'peak' | 'high' | 'normal' | 'low';
}>) {
  // Find peak and low months
  const sortedByRevenue = [...monthlyTrends].sort((a, b) => b.averageRevenue - a.averageRevenue);
  const peakMonth = sortedByRevenue[0].monthName;
  const lowMonth = sortedByRevenue[sortedByRevenue.length - 1].monthName;
  
  // Calculate seasonality index (coefficient of variation)
  const revenues = monthlyTrends.map(t => t.averageRevenue);
  const mean = revenues.reduce((sum, r) => sum + r, 0) / revenues.length;
  const variance = revenues.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / revenues.length;
  const standardDeviation = Math.sqrt(variance);
  const seasonalityIndex = mean > 0 ? Math.round((standardDeviation / mean) * 100) : 0;
  
  // Predict next peak (assuming current peak month repeats)
  const currentMonth = new Date().getMonth() + 1;
  const peakMonthNumber = monthlyTrends.find(t => t.monthName === peakMonth)?.month || 1;
  
  let monthsUntilPeak = peakMonthNumber - currentMonth;
  if (monthsUntilPeak <= 0) monthsUntilPeak += 12;
  
  const nextPeakDate = new Date();
  nextPeakDate.setMonth(nextPeakDate.getMonth() + monthsUntilPeak);
  const predictedNextPeak = nextPeakDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

  return {
    peakMonth,
    lowMonth,
    seasonalityIndex,
    predictedNextPeak
  };
}

function generateSeasonalInsights(
  monthlyTrends: Array<{
    month: number;
    monthName: string;
    averageRevenue: number;
    salesCount: number;
    growthRate: number;
    seasonality: 'peak' | 'high' | 'normal' | 'low';
  }>,
  seasonalMetrics: any
): string[] {
  const insights = [];
  
  insights.push(`Peak sales month: ${seasonalMetrics.peakMonth}`);
  insights.push(`Lowest sales month: ${seasonalMetrics.lowMonth}`);
  insights.push(`Business seasonality index: ${seasonalMetrics.seasonalityIndex}% (higher = more seasonal)`);
  
  if (seasonalMetrics.seasonalityIndex > 30) {
    insights.push('High seasonality detected - significant monthly variations in revenue');
  } else if (seasonalMetrics.seasonalityIndex < 15) {
    insights.push('Low seasonality - relatively stable revenue throughout the year');
  }
  
  insights.push(`Next predicted peak: ${seasonalMetrics.predictedNextPeak}`);
  
  // Identify seasonal patterns
  const peakMonths = monthlyTrends.filter(t => t.seasonality === 'peak' || t.seasonality === 'high');
  const lowMonths = monthlyTrends.filter(t => t.seasonality === 'low');
  
  if (peakMonths.length > 0) {
    insights.push(`Strong months: ${peakMonths.map(m => m.monthName).join(', ')}`);
  }
  
  if (lowMonths.length > 0) {
    insights.push(`Weak months: ${lowMonths.map(m => m.monthName).join(', ')}`);
  }
  
  // Quarter analysis
  const quarters = [
    { name: 'Q1', months: [1, 2, 3] },
    { name: 'Q2', months: [4, 5, 6] },
    { name: 'Q3', months: [7, 8, 9] },
    { name: 'Q4', months: [10, 11, 12] }
  ];
  
  const quarterRevenues = quarters.map(q => ({
    quarter: q.name,
    revenue: monthlyTrends
      .filter(t => q.months.includes(t.month))
      .reduce((sum, t) => sum + t.averageRevenue, 0)
  }));
  
  const bestQuarter = quarterRevenues.reduce((max, current) => 
    current.revenue > max.revenue ? current : max
  );
  
  insights.push(`Strongest quarter: ${bestQuarter.quarter} ($${bestQuarter.revenue.toLocaleString()} avg)`);
  
  return insights;
}

function generateSeasonalRecommendations(
  monthlyTrends: Array<{
    month: number;
    monthName: string;
    averageRevenue: number;
    salesCount: number;
    growthRate: number;
    seasonality: 'peak' | 'high' | 'normal' | 'low';
  }>,
  seasonalMetrics: any
) {
  const recommendations = [];
  
  // Peak season preparation
  const peakMonths = monthlyTrends.filter(t => t.seasonality === 'peak' || t.seasonality === 'high');
  if (peakMonths.length > 0) {
    const peakRevenue = peakMonths.reduce((sum, m) => sum + m.averageRevenue, 0);
    
    recommendations.push({
      title: `Prepare for Peak Season: ${peakMonths.map(m => m.monthName).join(', ')}`,
      description: `Peak months identified. Increase inventory, staff, and marketing budget 2 months in advance.`,
      priority: 'high' as const,
      revenueImpact: Math.round(peakRevenue * 0.15), // 15% potential increase with proper preparation
      contacts: [
        {
          name: 'Operations Manager',
          email: 'ops@company.com',
          context: `Prepare operations for peak months: ${peakMonths.map(m => m.monthName).join(', ')}`
        },
        {
          name: 'Inventory Manager',
          email: 'inventory@company.com',
          context: 'Increase inventory levels before peak season'
        },
        {
          name: 'Marketing Manager',
          email: 'marketing@company.com',
          context: 'Plan peak season marketing campaigns'
        }
      ]
    });
  }
  
  // Low season optimization
  const lowMonths = monthlyTrends.filter(t => t.seasonality === 'low');
  if (lowMonths.length > 0) {
    const lowRevenue = lowMonths.reduce((sum, m) => sum + m.averageRevenue, 0);
    
    recommendations.push({
      title: `Boost Low Season Performance: ${lowMonths.map(m => m.monthName).join(', ')}`,
      description: `Low-performing months identified. Implement promotions, new product launches, or cost reduction strategies.`,
      priority: 'medium' as const,
      revenueImpact: Math.round(lowRevenue * 0.25), // 25% potential improvement
      contacts: [
        {
          name: 'Sales Manager',
          email: 'sales@company.com',
          context: `Plan special promotions for low months: ${lowMonths.map(m => m.monthName).join(', ')}`
        },
        {
          name: 'Product Manager',
          email: 'product@company.com',
          context: 'Consider new product launches during slow periods'
        }
      ]
    });
  }
  
  // Seasonal cash flow management
  if (seasonalMetrics.seasonalityIndex > 30) {
    const totalRevenue = monthlyTrends.reduce((sum, m) => sum + m.averageRevenue, 0);
    
    recommendations.push({
      title: 'Implement Seasonal Cash Flow Management',
      description: `High seasonality (${seasonalMetrics.seasonalityIndex}%) requires careful cash flow planning. Build reserves during peak months.`,
      priority: 'medium' as const,
      revenueImpact: Math.round(totalRevenue * 0.05), // 5% efficiency improvement
      contacts: [
        {
          name: 'CFO/Finance Manager',
          email: 'finance@company.com',
          context: 'Develop seasonal cash flow management strategy'
        },
        {
          name: 'Business Development Manager',
          email: 'bizdev@company.com',
          context: 'Explore counter-seasonal revenue opportunities'
        }
      ]
    });
  }
  
  // Next peak preparation
  const currentMonth = new Date().getMonth() + 1;
  const nextPeakMonth = monthlyTrends.find(t => t.monthName === seasonalMetrics.peakMonth.split(' ')[0]);
  
  if (nextPeakMonth) {
    let monthsUntilPeak = nextPeakMonth.month - currentMonth;
    if (monthsUntilPeak <= 0) monthsUntilPeak += 12;
    
    if (monthsUntilPeak <= 3) {
      recommendations.push({
        title: `Immediate: Next Peak Season in ${monthsUntilPeak} Month(s)`,
        description: `${seasonalMetrics.peakMonth} is approaching. Finalize inventory, staffing, and marketing preparations now.`,
        priority: 'high' as const,
        revenueImpact: Math.round(nextPeakMonth.averageRevenue * 0.2),
        contacts: [
          {
            name: 'Operations Director',
            email: 'operations@company.com',
            context: `Urgent: Peak season ${seasonalMetrics.peakMonth} preparation needed`
          }
        ]
      });
    }
  }
  
  return recommendations;
}