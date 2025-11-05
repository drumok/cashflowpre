import { Customer, Invoice, SalesRecord, Lead, ContactInfo } from '@/types';

// Overdue Payment Recovery Leads
export function generateOverduePaymentLeads(invoices: Invoice[]): Lead[] {
  const overdueInvoices = invoices.filter(inv => 
    inv.status === 'overdue' || 
    (inv.status === 'pending' && inv.dueDate < new Date())
  );

  return overdueInvoices.map(invoice => {
    const daysPastDue = Math.floor((Date.now() - invoice.dueDate.getTime()) / (1000 * 60 * 60 * 24));
    const urgency = daysPastDue > 30 ? 'high' : daysPastDue > 14 ? 'medium' : 'low';
    const score = Math.min(100, 50 + daysPastDue * 2);

    return {
      id: `overdue_${invoice.id}`,
      type: 'overdue_payment_recovery',
      contact: {
        name: `Customer ${invoice.customerId}`,
        email: undefined,
        phone: undefined,
        context: `${daysPastDue} days overdue`,
        revenueValue: invoice.amount,
      },
      score,
      revenueRange: {
        min: Math.min(5000, invoice.amount * 0.8),
        max: Math.min(25000, invoice.amount),
      },
      urgency,
      context: `Invoice #${invoice.id} - $${invoice.amount.toFixed(0)} overdue by ${daysPastDue} days`,
      generatedAt: new Date(),
    };
  });
}

// Repeat Customer Reactivation Leads
export function generateReactivationLeads(customers: Customer[]): Lead[] {
  const now = new Date();
  const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);

  const inactiveCustomers = customers.filter(customer => 
    customer.lastPurchase < threeMonthsAgo && 
    customer.purchaseCount > 1 && 
    customer.totalSpent > 1000
  );

  return inactiveCustomers.map(customer => {
    const daysSinceLastPurchase = Math.floor((now.getTime() - customer.lastPurchase.getTime()) / (1000 * 60 * 60 * 24));
    const urgency = daysSinceLastPurchase > 180 ? 'high' : daysSinceLastPurchase > 120 ? 'medium' : 'low';
    const score = Math.min(100, Math.max(20, 100 - (daysSinceLastPurchase / 365) * 50));

    const potentialRevenue = customer.averageOrderValue * 0.7; // Conservative estimate

    return {
      id: `reactivation_${customer.id}`,
      type: 'repeat_customer_reactivation',
      contact: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        context: `Last purchase ${daysSinceLastPurchase} days ago`,
        revenueValue: potentialRevenue,
      },
      score,
      revenueRange: {
        min: Math.min(3000, potentialRevenue * 0.5),
        max: Math.min(15000, potentialRevenue * 2),
      },
      urgency,
      context: `Previous customer - ${customer.purchaseCount} purchases, $${customer.totalSpent.toFixed(0)} total value`,
      generatedAt: new Date(),
    };
  });
}

// Top Customer Upsell Leads
export function generateUpsellLeads(customers: Customer[]): Lead[] {
  // Focus on top 20% of customers by value
  const sortedCustomers = customers.sort((a, b) => b.totalSpent - a.totalSpent);
  const topCustomerCount = Math.max(1, Math.floor(customers.length * 0.2));
  const topCustomers = sortedCustomers.slice(0, topCustomerCount);

  return topCustomers.map(customer => {
    const recentPurchase = customer.lastPurchase > new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
    const urgency = recentPurchase ? 'high' : 'medium';
    const score = Math.min(100, (customer.totalSpent / 10000) * 50 + (customer.purchaseCount * 5));

    const upsellPotential = customer.averageOrderValue * 1.5;

    return {
      id: `upsell_${customer.id}`,
      type: 'top_customer_upsell',
      contact: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        context: `Top customer - $${customer.totalSpent.toFixed(0)} total value`,
        revenueValue: upsellPotential,
      },
      score,
      revenueRange: {
        min: Math.min(8000, upsellPotential * 0.8),
        max: Math.min(40000, upsellPotential * 2),
      },
      urgency,
      context: `High-value customer ready for premium offerings - ${customer.purchaseCount} purchases`,
      generatedAt: new Date(),
    };
  });
}

// New Customer Prospects (based on similar customer patterns)
export function generateNewCustomerProspects(customers: Customer[], salesData: SalesRecord[]): Lead[] {
  // Analyze successful customer patterns
  const successfulCustomers = customers.filter(c => c.totalSpent > 2000 && c.purchaseCount > 2);
  
  if (successfulCustomers.length === 0) {
    return [];
  }

  // Find patterns in successful customers
  const avgFirstPurchase = successfulCustomers.reduce((sum, c) => sum + c.averageOrderValue, 0) / successfulCustomers.length;
  
  // Generate prospect leads based on recent single-purchase customers
  const recentSinglePurchaseCustomers = customers.filter(c => 
    c.purchaseCount === 1 && 
    c.lastPurchase > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) &&
    c.totalSpent >= avgFirstPurchase * 0.5
  );

  return recentSinglePurchaseCustomers.slice(0, 10).map(customer => {
    const score = Math.min(100, (customer.totalSpent / avgFirstPurchase) * 60);
    const potentialValue = avgFirstPurchase * 2;

    return {
      id: `prospect_${customer.id}`,
      type: 'new_customer_prospects',
      contact: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        context: `Recent first-time buyer - $${customer.totalSpent.toFixed(0)}`,
        revenueValue: potentialValue,
      },
      score,
      revenueRange: {
        min: Math.min(2000, potentialValue * 0.5),
        max: Math.min(12000, potentialValue * 1.5),
      },
      urgency: 'medium',
      context: `New customer with potential for repeat business`,
      generatedAt: new Date(),
    };
  });
}

// Seasonal Opportunity Leads
export function generateSeasonalOpportunityLeads(salesData: SalesRecord[]): Lead[] {
  const now = new Date();
  const currentMonth = now.getMonth();
  
  // Group sales by month
  const monthlyData = new Map<number, { total: number; customers: Set<string> }>();
  
  salesData.forEach(record => {
    const month = record.date.getMonth();
    if (!monthlyData.has(month)) {
      monthlyData.set(month, { total: 0, customers: new Set() });
    }
    const data = monthlyData.get(month)!;
    data.total += record.amount;
    data.customers.add(record.customerName);
  });

  // Find peak months (months with above-average sales)
  const monthlyTotals = Array.from(monthlyData.values()).map(d => d.total);
  const avgMonthlySales = monthlyTotals.reduce((a, b) => a + b, 0) / monthlyTotals.length;
  
  const peakMonths = Array.from(monthlyData.entries())
    .filter(([month, data]) => data.total > avgMonthlySales * 1.2)
    .map(([month]) => month);

  // Check if we're approaching a peak month
  const upcomingPeakMonths = peakMonths.filter(month => {
    const monthsUntil = (month - currentMonth + 12) % 12;
    return monthsUntil <= 2 && monthsUntil > 0;
  });

  if (upcomingPeakMonths.length === 0) {
    return [];
  }

  // Generate leads for customers who bought during peak months in previous years
  const seasonalCustomers = new Set<string>();
  upcomingPeakMonths.forEach(month => {
    const data = monthlyData.get(month);
    if (data) {
      data.customers.forEach(customer => seasonalCustomers.add(customer));
    }
  });

  return Array.from(seasonalCustomers).slice(0, 15).map((customerName, index) => {
    const score = 60 + Math.random() * 30; // Random score between 60-90
    const potentialRevenue = 1000 + Math.random() * 3000;

    return {
      id: `seasonal_${index}`,
      type: 'seasonal_opportunity',
      contact: {
        name: customerName,
        email: undefined,
        phone: undefined,
        context: `Seasonal buyer - peak month approaching`,
        revenueValue: potentialRevenue,
      },
      score,
      revenueRange: {
        min: Math.min(1000, potentialRevenue * 0.5),
        max: Math.min(8000, potentialRevenue * 1.5),
      },
      urgency: 'medium',
      context: `Customer typically buys during peak season (${upcomingPeakMonths.map(m => new Date(2024, m).toLocaleString('default', { month: 'long' })).join(', ')})`,
      generatedAt: new Date(),
    };
  });
}

// Main function to generate all lead types
export function generateAllLeads(
  customers: Customer[],
  invoices: Invoice[],
  salesData: SalesRecord[]
): { [key: string]: Lead[] } {
  return {
    overdue_payment_recovery: generateOverduePaymentLeads(invoices),
    repeat_customer_reactivation: generateReactivationLeads(customers),
    top_customer_upsell: generateUpsellLeads(customers),
    new_customer_prospects: generateNewCustomerProspects(customers, salesData),
    seasonal_opportunity: generateSeasonalOpportunityLeads(salesData),
  };
}