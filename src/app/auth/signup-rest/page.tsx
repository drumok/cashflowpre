'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FirebaseRestAuth } from '@/lib/firebase-rest';
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff, Sparkles, CheckCircle } from 'lucide-react';

export default function SignUpRestPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!formData.agreeToTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }

    setLoading(true);

    try {
      console.log('Starting REST API signup...');
      
      // Create user account using REST API
      const authResult = await FirebaseRestAuth.signUp({
        email: formData.email,
        password: formData.password,
        displayName: `${formData.firstName} ${formData.lastName}`
      });

      console.log('User created successfully:', authResult.localId);

      // Store user data in localStorage temporarily
      localStorage.setItem('firebase_auth', JSON.stringify({
        idToken: authResult.idToken,
        refreshToken: authResult.refreshToken,
        localId: authResult.localId,
        email: authResult.email,
        expiresIn: authResult.expiresIn
      }));

      // Store user profile data
      localStorage.setItem('user_profile', JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        companyName: formData.companyName,
        plan: 'free',
        createdAt: new Date().toISOString()
      }));

      console.log('User data stored successfully');

      // Show success message
      setError('');
      alert('Account created successfully! Redirecting to dashboard...');

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error: any) {
      console.error('REST API signup error:', error);
      
      // Handle specific Firebase REST API errors
      const errorMessage = error.message || 'Unknown error';
      
      if (errorMessage.includes('EMAIL_EXISTS')) {
        setError('An account with this email already exists');
      } else if (errorMessage.includes('WEAK_PASSWORD')) {
        setError('Password is too weak');
      } else if (errorMessage.includes('INVALID_EMAIL')) {
        setError('Invalid email address');
      } else if (errorMessage.includes('OPERATION_NOT_ALLOWED')) {
        setError('Email/password accounts are not enabled. Please contact support.');
      } else {
        setError(`Failed to create account: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-yellow-400 to-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Back Button */}
        <Link 
          href="/"
          className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Signup Form */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Start Your Free Trial</h1>
            <p className="text-white/80">Join 15,000+ SMBs growing their revenue</p>
            <p className="text-yellow-400 text-sm mt-2">🔧 Using REST API (Backup Method)</p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-400 rounded-lg p-4 mb-6">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  First Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="John"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Last Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="john@company.com"
                  required
                />
              </div>
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Company Name (Optional)
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Your Company LLC"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-12 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-12 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className="mt-1 w-4 h-4 text-green-500 bg-white/10 border-white/20 rounded focus:ring-green-500"
                required
              />
              <label className="ml-3 text-white/80 text-sm">
                I agree to the{' '}
                <Link href="/terms" className="text-green-400 hover:text-green-300 underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-green-400 hover:text-green-300 underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-lg font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              ) : (
                <>
                  <CheckCircle className="w-6 h-6 mr-2" />
                  Create My Free Account
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-white/80">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-green-400 hover:text-green-300 font-semibold">
                Sign In
              </Link>
            </p>
            <p className="text-white/60 text-sm mt-2">
              Having issues? Try the{' '}
              <Link href="/auth/signup" className="text-blue-400 hover:text-blue-300 underline">
                standard signup
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}