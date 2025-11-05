declare module 'braintree' {
  export interface BraintreeGateway {
    clientToken: {
      generate: (options?: any) => Promise<{ clientToken: string }>;
    };
    customer: {
      create: (data: any) => Promise<{ success: boolean; customer?: any; message?: string }>;
      find: (customerId: string) => Promise<any>;
    };
    subscription: {
      create: (data: any) => Promise<{ success: boolean; subscription?: any; message?: string }>;
      cancel: (subscriptionId: string) => Promise<{ success: boolean; subscription?: any; message?: string }>;
      update: (subscriptionId: string, data: any) => Promise<{ success: boolean; subscription?: any; message?: string }>;
      find: (subscriptionId: string) => Promise<any>;
    };
    transaction: {
      sale: (data: any) => Promise<{ success: boolean; transaction?: any; message?: string }>;
    };
    webhookNotification: {
      parse: (body: string, signature: string) => any;
    };
  }

  export class BraintreeGateway {
    constructor(config: {
      environment: any;
      merchantId: string;
      publicKey: string;
      privateKey: string;
    });
  }

  export const Environment: {
    Sandbox: any;
    Production: any;
  };

  const braintree: {
    BraintreeGateway: typeof BraintreeGateway;
    Environment: typeof Environment;
  };

  export default braintree;
}