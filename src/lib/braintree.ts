import braintree, { BraintreeGateway } from 'braintree';

// Lazy initialization of Braintree gateway
let gateway: BraintreeGateway | null = null;

function getGateway() {
  if (!gateway) {
    // Check if we have the required environment variables
    if (!process.env.BRAINTREE_MERCHANT_ID || 
        !process.env.BRAINTREE_PUBLIC_KEY || 
        !process.env.BRAINTREE_PRIVATE_KEY ||
        process.env.BRAINTREE_MERCHANT_ID === 'placeholder') {
      throw new Error('Braintree configuration is missing or incomplete');
    }

    gateway = new BraintreeGateway({
      environment: process.env.BRAINTREE_ENVIRONMENT === 'sandbox' 
        ? braintree.Environment.Sandbox 
        : braintree.Environment.Production,
      merchantId: process.env.BRAINTREE_MERCHANT_ID,
      publicKey: process.env.BRAINTREE_PUBLIC_KEY,
      privateKey: process.env.BRAINTREE_PRIVATE_KEY,
    });
  }
  return gateway;
}

// Import subscription plans from shared location
import { SUBSCRIPTION_PLANS, CURRENCY_PRICING } from './subscription-plans';

// Re-export for server-side use
export { SUBSCRIPTION_PLANS, CURRENCY_PRICING };

// Braintree client token generation
export async function generateClientToken(customerId?: string) {
  try {
    const btGateway = getGateway();
    const response = await btGateway.clientToken.generate({
      customerId: customerId,
    });
    return response.clientToken;
  } catch (error) {
    console.error('Error generating client token:', error);
    throw new Error('Failed to generate payment token');
  }
}

// Create Braintree customer
export async function createCustomer(customerData: {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}) {
  try {
    const btGateway = getGateway();
    const response = await btGateway.customer.create({
      id: customerData.id,
      firstName: customerData.firstName,
      lastName: customerData.lastName,
      email: customerData.email,
    });

    if (response.success) {
      return response.customer;
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    console.error('Error creating customer:', error);
    throw new Error('Failed to create customer');
  }
}

// Create subscription
export async function createSubscription(data: {
  paymentMethodToken: string;
  planId: string;
  customerId: string;
}) {
  try {
    const btGateway = getGateway();
    const response = await btGateway.subscription.create({
      paymentMethodToken: data.paymentMethodToken,
      planId: data.planId,
    });

    if (response.success) {
      return response.subscription;
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw new Error('Failed to create subscription');
  }
}

// Cancel subscription
export async function cancelSubscription(subscriptionId: string) {
  try {
    const btGateway = getGateway();
    const response = await btGateway.subscription.cancel(subscriptionId);
    
    if (response.success) {
      return response.subscription;
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw new Error('Failed to cancel subscription');
  }
}

// Update subscription
export async function updateSubscription(subscriptionId: string, planId: string) {
  try {
    const btGateway = getGateway();
    const response = await btGateway.subscription.update(subscriptionId, {
      planId: planId,
      prorate: true,
    });

    if (response.success) {
      return response.subscription;
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw new Error('Failed to update subscription');
  }
}

// Process one-time payment
export async function processPayment(data: {
  amount: string;
  paymentMethodNonce: string;
  customerId?: string;
}) {
  try {
    const btGateway = getGateway();
    const response = await btGateway.transaction.sale({
      amount: data.amount,
      paymentMethodNonce: data.paymentMethodNonce,
      customerId: data.customerId,
      options: {
        submitForSettlement: true,
      },
    });

    if (response.success) {
      return response.transaction;
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    throw new Error('Failed to process payment');
  }
}

// Get subscription details
export async function getSubscription(subscriptionId: string) {
  try {
    const btGateway = getGateway();
    const response = await btGateway.subscription.find(subscriptionId);
    return response;
  } catch (error) {
    console.error('Error fetching subscription:', error);
    throw new Error('Failed to fetch subscription');
  }
}

// Get customer details
export async function getCustomer(customerId: string) {
  try {
    const btGateway = getGateway();
    const response = await btGateway.customer.find(customerId);
    return response;
  } catch (error) {
    console.error('Error fetching customer:', error);
    throw new Error('Failed to fetch customer');
  }
}

export default getGateway;