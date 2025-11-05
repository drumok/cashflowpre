import { NextRequest, NextResponse } from 'next/server';
import { 
  runSalesForecasting,
  runCustomerAnalysis,
  runCashFlowPrediction,
  runPaymentAnalysis,
  runProductPerformance,
  runSeasonalTrends,
  runCustomerRetention,
  runProfitabilityAnalysis
} from '@/lib/analytics';

// Static export compatible

export async function POST(request: NextRequest) {
  try {
    const { analysisType, data, userId } = await request.json();

    if (!analysisType || !data || !userId) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    let result;

    switch (analysisType) {
      case 'sales_forecasting':
        result = await runSalesForecasting(data);
        break;
      case 'customer_analysis':
        result = await runCustomerAnalysis(data);
        break;
      case 'cash_flow_prediction':
        result = await runCashFlowPrediction(data);
        break;
      case 'payment_analysis':
        result = await runPaymentAnalysis(data);
        break;
      case 'product_performance':
        result = await runProductPerformance(data);
        break;
      case 'seasonal_trends':
        result = await runSeasonalTrends(data);
        break;
      case 'customer_retention':
        result = await runCustomerRetention(data);
        break;
      case 'profitability_analysis':
        result = await runProfitabilityAnalysis(data);
        break;
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid analysis type' },
          { status: 400 }
        );
    }

    // Store result in database (Firestore)
    // TODO: Implement database storage

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Analysis completed successfully'
    });

  } catch (error) {
    console.error('Analytics API error:', error);
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
    const analysisId = searchParams.get('analysisId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // TODO: Implement database retrieval
    // For now, return mock data
    const mockResults = [
      {
        id: '1',
        type: 'sales_forecasting',
        status: 'completed',
        createdAt: new Date().toISOString(),
        results: {
          forecast: [
            { month: 'Nov 2024', predicted: 125430, confidence: 0.85 },
            { month: 'Dec 2024', predicted: 142650, confidence: 0.82 },
            { month: 'Jan 2025', predicted: 138920, confidence: 0.78 }
          ],
          insights: [
            'Sales are trending upward with 12.5% growth expected',
            'December shows highest revenue potential',
            'Q1 2025 forecast: $406,000 total revenue'
          ],
          recommendations: [
            {
              title: 'Prepare for December Peak',
              description: 'Increase inventory and staff for expected 14% sales increase',
              priority: 'high',
              revenueImpact: 17200,
              contacts: [
                {
                  name: 'Supply Manager',
                  email: 'supply@company.com',
                  context: 'Coordinate inventory increase'
                }
              ]
            }
          ]
        }
      }
    ];

    if (analysisId) {
      const result = mockResults.find(r => r.id === analysisId);
      if (!result) {
        return NextResponse.json(
          { success: false, error: 'Analysis not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: result });
    }

    return NextResponse.json({ success: true, data: mockResults });

  } catch (error) {
    console.error('Analytics GET API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}