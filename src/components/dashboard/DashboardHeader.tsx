'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  BarChart3, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Bell,
  Search,
  User,
  ChevronDown
} from 'lucide-react';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { useAuth } from '@/contexts/AuthContext';

export function DashboardHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();
  const { user, userProfile, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getSubscriptionBadge = (subscription: string) => {
    switch (subscription) {
      case 'pro':
        return { label: 'Pro', color: 'bg-blue-100 text-blue-800' };
      case 'pro_plus':
        return { label: 'Pro Plus', color: 'bg-purple-100 text-purple-800' };
      default:
        return { label: 'Free', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const subscriptionBadge = getSubscriptionBadge(userProfile?.subscription || 'free');

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Lead Generation', href: '/dashboard/leads', icon: Users },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">SMB Analytics</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Search className="w-5 h-5" />
            </button>

            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Language Selector */}
            <LanguageSelector />

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  {userProfile?.photoURL ? (
                    <img 
                      src={userProfile.photoURL} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {userProfile?.displayName || user?.displayName || 'User'}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${subscriptionBadge.color}`}>
                    {subscriptionBadge.label}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 hidden lg:block" />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">
                      {userProfile?.displayName || user?.displayName || 'User'}
                    </p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                    <div className="mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${subscriptionBadge.color}`}>
                        {subscriptionBadge.label} Plan
                      </span>
                    </div>
                  </div>
                  
                  {/* Usage Stats */}
                  {userProfile?.usageStats && (
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-xs font-medium text-gray-700 mb-2">This Month</p>
                      <div className="space-y-1 text-xs text-gray-600">
                        <div className="flex justify-between">
                          <span>Analytics Runs:</span>
                          <span>{userProfile.usageStats.analyticsRuns}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Leads Generated:</span>
                          <span>{userProfile.usageStats.leadsGenerated}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Data Uploaded:</span>
                          <span>{userProfile.usageStats.dataUploaded}MB</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="py-1">
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="w-4 h-4 mr-3" />
                      Profile Settings
                    </Link>
                    <Link
                      href="/dashboard/billing"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Billing & Plans
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-gray-600"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>

      {/* Click outside to close dropdown */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
}