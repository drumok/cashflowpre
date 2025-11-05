import { SalesRecord, Customer, Invoice, Lead } from '@/types';

// Overdue Payment Recovery - Rule-based (5K-25K revenue potential)
export function generateOverduePaymentLeads(invoices: Invoice[]): Lead[] {
  const overdueInvoices = invoices.filter(invoice => 
    invoice.status === 'overdue' || 
    (invoice.status === 'pending' && invoice.dueDate < new Date())
  );

  return overdueInvoices
    .filter(invoice => invoice.amount >= 1000) // Focus on significant amounts
    .sort((a, b) => b.amount - a.amount) // Prioritize by amount
    .slice(0, 20) // Limit to top 20
    .map((invoice, index) => ({
      id: `overdue_${invoice.id}`,
      type: 'overdue_payment_recovery' as const,
      contact: {
        name: `Customer ${invoice.customerId}`,
        email: `customer${invoice.customerId}@example.com`,
        phone: `+1-555-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
        context: `Invoice #${invoice.id} overdue by ${Math.floor((Date.now() - invoice.dueDate.getTime()) / (1000 * 60 * 60 * 24))} days`,
        revenueValue: invoice.amount
      },
      score: Math.min(100, 60 + (invoice.amount / 1000) * 2), // Higher score for larger amounts
      revenueRange: {
        min: Math.floor(invoice.amount * 0.8),
        max: Math.floor(invoice.amount * 1.2)
      },
      urgency: (invoice.amount > 10000 ? 'high' : invoice.amount > 5000 ? 'medium' : 'low') as 'high' | 'medium' | 'low',
      context: `Overdue payment of $${invoice.amount.toLocaleString()} - ${Math.floor((Date.now() - invoice.dueDate.getTime()) / (1000 * 60 * 60 * 24))} days past due`,
      generatedAt: new Date()
    }));
}

// Repeat Customer Reactivation - Recency Analysis (3K-15K potential)
export function generateReactivationLeads(customers: Customer[]): Lead[] {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000);
  const oneYearAgo = new Date(now.getTime() - 12 * 30 * 24 * 60 * 60 * 1000);

  const inactiveCustomers = customers.filter(customer => 
    customer.lastPurchase < sixMonthsAgo && 
    customer.lastPurchase > oneYearAgo && // Not too old
    customer.totalSpent > 2000 // Had significant value
  );

  return inactiveCustomers
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 15)
    .map((customer, index) => ({
      id: `reactivation_${customer.id}`,
      type: 'repeat_customer_reactivation' as const,
      contact: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        context: `Last purchase ${Math.floor((now.getTime() - customer.lastPurchase.getTime()) / (1000 * 60 * 60 * 24))} days ago`,
        revenueValue: customer.totalSpent
      },
      score: Math.min(100, 40 + (customer.totalSpent / 1000) * 3),
      revenueRange: {
        min: Math.floor(customer.averageOrderValue * 0.8),
        max: Math.floor(customer.averageOrderValue * 2.5)
      },
      urgency: (customer.totalSpent > 10000 ? 'high' : 'medium') as 'high' | 'medium' | 'low',
      context: `Inactive for ${Math.floor((now.getTime() - customer.lastPurchase.getTime()) / (1000 * 60 * 60 * 24))} days - $${customer.totalSpent.toLocaleString()} lifetime value`,
      generatedAt: new Date()
    }));
}

// Top Customer Upsell - Pareto Analysis (8K-40K potential)
export function generateUpsellLeads(customers: Customer[]): Lead[] {
  // Find top 20% of customers by value
  const sortedCustomers = customers.sort((a, b) => b.totalSpent - a.totalSpent);
  const topCustomerCount = Math.max(1, Math.floor(customers.length * 0.2));
  const topCustomers = sortedCustomers.slice(0, topCustomerCount);

  const now = new Date();
  const threeMonthsAgo = new Date(now.getTime() - 3 * 30 * 24 * 60 * 60 * 1000);

  return topCustomers
    .filter(customer => customer.lastPurchase > threeMonthsAgo) // Recent activity
    .slice(0, 10)
    .map((customer, index) => ({
      id: `upsell_${customer.id}`,
      type: 'top_customer_upsell' as const,
      contact: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        context: `Top ${Math.floor((index + 1) / topCustomerCount * 100)}% customer by value`,
        revenueValue: customer.totalSpent
      },
      score: Math.min(100, 70 + (customer.totalSpent / 10000) * 10),
      revenueRange: {
        min: Math.floor(customer.averageOrderValue * 2),
        max: Math.floor(customer.averageOrderValue * 5)
      },
      urgency: (customer.totalSpent > 50000 ? 'high' : 'medium') as 'high' | 'medium' | 'low',
      context: `Top customer with $${customer.totalSpent.toLocaleString()} lifetime value - perfect for premium upsell`,
      generatedAt: new Date()
    }));
}

// New Customer Prospects - Simple Scoring (2K-12K potential)
export function generateProspectLeads(existingCustomers: Customer[]): Lead[] {
  // Analyze existing customer patterns to find similar prospects
  const avgOrderValue = existingCustomers.reduce((sum, c) => sum + c.averageOrderValue, 0) / existingCustomers.length;
  const avgTotalSpent = existingCustomers.reduce((sum, c) => sum + c.totalSpent, 0) / existingCustomers.length;

  // Generate mock prospects based on patterns
  const prospects = [];
  const companyTypes = ['Tech Solutions', 'Marketing Agency', 'Consulting Group', 'E-commerce Store', 'Manufacturing Co'];
  
  for (let i = 0; i < 12; i++) {
    const companyType = companyTypes[i % companyTypes.length];
    prospects.push({
      id: `prospect_${i + 1}`,
      type: 'new_customer_prospects' as const,
      contact: {
        name: `Prospect ${i + 1}`,
        email: `prospect${i + 1}@${companyType.toLowerCase().replace(/\s+/g, '')}.com`,
        phone: Math.random() > 0.5 ? `+1-555-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}` : undefined,
        context: `Similar profile to existing customers in ${companyType} sector`,
        revenueValue: avgOrderValue
      },
      score: Math.floor(Math.random() * 40) + 40, // 40-80 score range
      revenueRange: {
        min: Math.floor(avgOrderValue * 0.5),
        max: Math.floor(avgOrderValue * 2)
      },
      urgency: (Math.random() > 0.7 ? 'high' : 'medium') as 'high' | 'medium' | 'low',
      context: `Similar company profile to your top customers - estimated ${Math.floor(avgOrderValue)} initial order value`,
      generatedAt: new Date()
    });
  }

  return prospects;
}

// Seasonal Opportunity - Pattern Recognition (1K-8K potential)
export function generateSeasonalLeads(salesData: SalesRecord[]): Lead[] {
  const now = new Date();
  const currentMonth = now.getMonth();
  
  // Analyze seasonal patterns
  const monthlyData = new Map<number, { total: number, customers: Set<string> }>();
  
  salesData.forEach(record => {
    const month = record.date.getMonth();
    if (!monthlyData.has(month)) {
      monthlyData.set(month, { total: 0, customers: new Set() });
    }
    const data = monthlyData.get(month)!;
    data.total += record.amount;
    data.customers.add(record.customerName);
  });

  // Find customers who typically buy in the current season
  const seasonalCustomers = new Set<string>();
  const currentSeason = Math.floor(currentMonth / 3); // 0=Q1, 1=Q2, 2=Q3, 3=Q4
  
  for (let month = currentSeason * 3; month < (currentSeason + 1) * 3; month++) {
    const data = monthlyData.get(month);
    if (data) {
      data.customers.forEach(customer => seasonalCustomers.add(customer));
    }
  }

  // Generate leads for seasonal customers who haven't purchased recently
  const leads = [];
  let leadId = 1;
  
  for (const customerName of Array.from(seasonalCustomers).slice(0, 8)) {
    const customerRecords = salesData.filter(r => r.customerName === customerName);
    const lastPurchase = Math.max(...customerRecords.map(r => r.date.getTime()));
    const daysSinceLastPurchase = (now.getTime() - lastPurchase) / (1000 * 60 * 60 * 24);
    
    if (daysSinceLastPurchase > 60) { // Haven't purchased in 2+ months
      const avgAmount = customerRecords.reduce((sum, r) => sum + r.amount, 0) / customerRecords.length;
      
      leads.push({
        id: `seasonal_${leadId++}`,
        type: 'seasonal_opportunity' as const,
        contact: {
          name: customerName,
          email: `${customerName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
          phone: Math.random() > 0.3 ? `+1-555-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}` : undefined,
          context: `Seasonal buyer - typically purchases in Q${currentSeason + 1}`,
          revenueValue: avgAmount
        },
        score: Math.floor(Math.random() * 30) + 50,
        revenueRange: {
          min: Math.floor(avgAmount * 0.8),
          max: Math.floor(avgAmount * 1.5)
        },
        urgency: (daysSinceLastPurchase > 120 ? 'high' : 'medium') as 'high' | 'medium' | 'low',
        context: `Seasonal pattern detected - typically buys in Q${currentSeason + 1}, last purchase ${Math.floor(daysSinceLastPurchase)} days ago`,
        generatedAt: new Date()
      });
    }
  }

  return leads;
}