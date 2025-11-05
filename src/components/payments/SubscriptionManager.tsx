'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SUBSCRIPTION_PLANS } from '@/lib/subscription-plans';
import { CreditCard, Calendar, Users, HardDrive, AlertCircle, CheckCircle } from 'lucide-react';

interface SubscriptionManagerProps {
  userSubscription: any;
  onUpdate: () => void;
}

export default function SubscriptionManager({ userSubscription, onUpdate }: SubscriptionManagerProps) {
  const { getIdToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const currentPlan = Object.values(SUBSCRIPTION_PLANS).find(
    p => p.id === userSubscription?.planId
  ) || SUBSCRIPTION_PLANS.FREE;

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.')) {
      return;
    }

    setLoading(true);
    try {
      const token = await getIdToken();
      const response = await fetch('/api/payments/cancel', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cancel subscription');
      }

      alert('Subscription canceled successfully. You will retain access until the end of your billing period.');
      onUpdate();
    } catch (error: any) {
      alert('Error canceling subscription: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradeSubscription = async (newPlanId: string) => {
    setLoading(true);
    try {
      const token = await getIdToken();
      const response = await fetch('/api/payments/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ newPlanId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upgrade subscription');
      }

      alert('Subscription upgraded successfully!');
      setShowUpgradeModal(false);
      onUpdate();
    } catch (error: any) {
      alert('Error upgrading subscription: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'canceled': return 'text-red-600 bg-red-100';
      case 'past_due': return 'text-yellow-600 bg-yellow-100';
      case 'expired': return 'text-gray-600 bg-gray-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Subscription Management</h2>

      {/* Current Plan */}
      <div className="border rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Current Plan</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(userSubscription?.status || 'free')}`}>
            {userSubscription?.status || 'Free'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">{currentPlan.name}</h4>
            <div className="text-2xl font-bold text-blue-600">
              ${currentPlan.price}<span className="text-sm text-gray-500">/month</span>
            </div>
          </div>

          {userSubscription?.nextBillingDate && (
            <div>
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <Calendar className="w-4 h-4 mr-2" />
                Next Billing Date
              </div>
              <div className="font-medium">
                {formatDate(userSubscription.nextBillingDate)}
              </div>
            </div>
          )}
        </div>

        {/* Plan Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <HardDrive className="w-6 h-6 mx-auto mb-1 text-gray-400" />
            <div className="text-sm font-medium">{currentPlan.features.dataUpload}</div>
            <div className="text-xs text-gray-500">Data Upload</div>
          </div>
          <div className="text-center">
            <CheckCircle className="w-6 h-6 mx-auto mb-1 text-gray-400" />
            <div className="text-sm font-medium">{currentPlan.features.analysisRuns}</div>
            <div className="text-xs text-gray-500">Analysis Runs</div>
          </div>
          <div className="text-center">
            <Users className="w-6 h-6 mx-auto mb-1 text-gray-400" />
            <div className="text-sm font-medium">{currentPlan.features.users}</div>
            <div className="text-xs text-gray-500">Team Members</div>
          </div>
          <div className="text-center">
            <HardDrive className="w-6 h-6 mx-auto mb-1 text-gray-400" />
            <div className="text-sm font-medium">{currentPlan.features.storage}</div>
            <div className="text-xs text-gray-500">Storage</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          {currentPlan.id === 'free' && (
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <CreditCard className="w-4 h-4 inline mr-2" />
              Upgrade Plan
            </button>
          )}

          {currentPlan.id === 'pro' && (
            <>
              <button
                onClick={() => handleUpgradeSubscription('pro_plus')}
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                Upgrade to Pro Plus
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={loading}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                Cancel Subscription
              </button>
            </>
          )}

          {currentPlan.id === 'pro_plus' && userSubscription?.status === 'active' && (
            <button
              onClick={handleCancelSubscription}
              disabled={loading}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              Cancel Subscription
            </button>
          )}
        </div>
      </div>

      {/* Usage Warnings */}
      {userSubscription?.status === 'past_due' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
            <div>
              <h4 className="font-medium text-yellow-800">Payment Past Due</h4>
              <p className="text-sm text-yellow-700">
                Your payment is past due. Please update your payment method to continue using premium features.
              </p>
            </div>
          </div>
        </div>
      )}

      {userSubscription?.status === 'canceled' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <div>
              <h4 className="font-medium text-red-800">Subscription Canceled</h4>
              <p className="text-sm text-red-700">
                Your subscription has been canceled. You will retain access until {formatDate(userSubscription.nextBillingDate)}.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Choose Your Plan</h3>
            
            <div className="space-y-3">
              {Object.values(SUBSCRIPTION_PLANS).filter(plan => plan.id !== 'free').map((plan) => (
                <div
                  key={plan.id}
                  className="border rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors"
                  onClick={() => handleUpgradeSubscription(plan.id)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{plan.name}</h4>
                      <p className="text-sm text-gray-600">
                        {plan.features.analysisRuns} runs • {plan.features.users} users
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-blue-600">${plan.price}</div>
                      <div className="text-sm text-gray-500">/month</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}