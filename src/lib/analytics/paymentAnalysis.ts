import { Invoice, SalesRecord } from '@/types';

interface PaymentAnalysisResult {
  overduePayments: Array<{
    invoiceId: string;
    customerId: string;
    amount: number;
    daysPastDue: number;
    urgency: 'critical' | 'high' | 'medium';
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
  paymentMetrics: {
    averagePaymentTime: number;
    paymentRate: number;
    totalOverdue: number;
    overdueCount: number;
  };
}

export async function runPaymentAnalysis(invoices: Invoice[]): Promise<PaymentAnalysisResult> {
  const overduePayments = identifyOverduePayments(invoices);
  const paymentMetrics = calculatePaymentMetrics(invoices);
  
  const insights = generatePaymentInsights(overduePayments, paymentMetrics, invoices);
  const recommendations = generatePaymentRecommendations(overduePayments, paymentMetrics);

  return {
    overduePayments,
    insights,
    recommendations,
    paymentMetrics
  };
}

function identifyOverduePayments(invoices: Invoice[]) {
  const now = new Date();
  
  return invoices
    .filter(invoice => 
      invoice.status === 'pending' && invoice.dueDate < now ||
      invoice.status === 'overdue'
    )
    .map(invoice => {
      const daysPastDue = Math.floor((now.getTime() - invoice.dueDate.getTime()) / (1000 * 60 * 60 * 24));
      
      let urgency: 'critical' | 'high' | 'medium' = 'medium';
      if (daysPastDue > 60) urgency = 'critical';
      else if (daysPastDue > 30) urgency = 'high';
      
      return {
        invoiceId: invoice.id,
        customerId: invoice.customerId,
        amount: invoice.amount,
        daysPastDue,
        urgency
      };
    })
    .sort((a, b) => b.daysPastDue - a.daysPastDue); // Sort by most overdue first
}

function calculatePaymentMetrics(invoices: Invoice[]) {
  const paidInvoices = invoices.filter(inv => inv.status === 'paid' && inv.paidDate);
  const overdueInvoices = invoices.filter(inv => 
    inv.status === 'overdue' || 
    (inv.status === 'pending' && inv.dueDate < new Date())
  );
  
  // Calculate average payment time for paid invoices
  const averagePaymentTime = paidInvoices.length > 0 
    ? paidInvoices.reduce((sum, inv) => {
        if (inv.paidDate) {
          return sum + (inv.paidDate.getTime() - inv.issueDate.getTime()) / (1000 * 60 * 60 * 24);
        }
        return sum;
      }, 0) / paidInvoices.length
    : 0;

  const paymentRate = invoices.length > 0 
    ? (paidInvoices.length / invoices.length) * 100 
    : 0;

  const totalOverdue = overdueInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const overdueCount = overdueInvoices.length;

  return {
    averagePaymentTime: Math.round(averagePaymentTime),
    paymentRate: Math.round(paymentRate * 100) / 100,
    totalOverdue,
    overdueCount
  };
}

function generatePaymentInsights(
  overduePayments: any[],
  paymentMetrics: any,
  invoices: Invoice[]
): string[] {
  const insights = [];
  
  insights.push(`${paymentMetrics.overdueCount} overdue invoices totaling $${paymentMetrics.totalOverdue.toLocaleString()}`);
  insights.push(`Average payment time: ${paymentMetrics.averagePaymentTime} days`);
  insights.push(`Payment success rate: ${paymentMetrics.paymentRate}%`);
  
  if (overduePayments.length > 0) {
    const criticalCount = overduePayments.filter(p => p.urgency === 'critical').length;
    const highCount = overduePayments.filter(p => p.urgency === 'high').length;
    
    if (criticalCount > 0) {
      insights.push(`${criticalCount} critical overdue payments (60+ days)`);
    }
    if (highCount > 0) {
      insights.push(`${highCount} high priority overdue payments (30+ days)`);
    }
  }
  
  // Payment trend analysis
  const recentInvoices = invoices.filter(inv => {
    const monthsAgo = new Date();
    monthsAgo.setMonth(monthsAgo.getMonth() - 3);
    return inv.issueDate >= monthsAgo;
  });
  
  const recentOverdueRate = recentInvoices.length > 0 
    ? (recentInvoices.filter(inv => inv.status === 'overdue').length / recentInvoices.length) * 100
    : 0;
    
  if (recentOverdueRate > 20) {
    insights.push(`Warning: Recent overdue rate is ${recentOverdueRate.toFixed(1)}% - above healthy threshold`);
  } else if (recentOverdueRate < 10) {
    insights.push(`Good: Recent overdue rate is ${recentOverdueRate.toFixed(1)}% - within healthy range`);
  }
  
  return insights;
}

function generatePaymentRecommendations(
  overduePayments: any[],
  paymentMetrics: any
) {
  const recommendations = [];
  
  // Critical overdue payments
  const criticalPayments = overduePayments.filter(p => p.urgency === 'critical');
  if (criticalPayments.length > 0) {
    const criticalAmount = criticalPayments.reduce((sum, p) => sum + p.amount, 0);
    
    recommendations.push({
      title: 'URGENT: Critical Overdue Payments',
      description: `${criticalPayments.length} invoices are 60+ days overdue. Immediate collection action required.`,
      priority: 'high' as const,
      revenueImpact: criticalAmount,
      contacts: criticalPayments.slice(0, 5).map(payment => ({
        name: `Customer ${payment.customerId}`,
        email: undefined,
        phone: undefined,
        context: `Critical: $${payment.amount.toLocaleString()} overdue ${payment.daysPastDue} days`
      }))
    });
  }
  
  // High priority payments
  const highPriorityPayments = overduePayments.filter(p => p.urgency === 'high');
  if (highPriorityPayments.length > 0) {
    const highAmount = highPriorityPayments.reduce((sum, p) => sum + p.amount, 0);
    
    recommendations.push({
      title: 'High Priority Payment Collection',
      description: `${highPriorityPayments.length} invoices are 30+ days overdue. Escalate collection efforts.`,
      priority: 'high' as const,
      revenueImpact: highAmount,
      contacts: highPriorityPayments.slice(0, 5).map(payment => ({
        name: `Customer ${payment.customerId}`,
        email: undefined,
        phone: undefined,
        context: `High priority: $${payment.amount.toLocaleString()} overdue ${payment.daysPastDue} days`
      }))
    });
  }
  
  // Payment process improvement
  if (paymentMetrics.averagePaymentTime > 45) {
    recommendations.push({
      title: 'Improve Payment Terms & Processes',
      description: `Average payment time is ${paymentMetrics.averagePaymentTime} days. Consider shorter terms and automated reminders.`,
      priority: 'medium' as const,
      revenueImpact: Math.round(paymentMetrics.totalOverdue * 0.1),
      contacts: [
        {
          name: 'Accounts Receivable Manager',
          email: 'ar@company.com',
          context: 'Implement automated payment reminders and shorter terms'
        },
        {
          name: 'Customer Success Manager',
          email: 'success@company.com',
          context: 'Work with customers on payment process improvements'
        }
      ]
    });
  }
  
  // Early payment incentives
  if (paymentMetrics.paymentRate < 85) {
    recommendations.push({
      title: 'Implement Early Payment Incentives',
      description: `Payment rate is ${paymentMetrics.paymentRate}%. Consider early payment discounts to improve cash flow.`,
      priority: 'medium' as const,
      revenueImpact: Math.round(paymentMetrics.totalOverdue * 0.05),
      contacts: [
        {
          name: 'Finance Director',
          email: 'finance@company.com',
          context: 'Design early payment discount program'
        }
      ]
    });
  }
  
  return recommendations;
}