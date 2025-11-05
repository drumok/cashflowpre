'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  Star,
  Zap,
  Target,
  Phone,
  Mail,
  MessageCircle,
  AlertTriangle,
  Sparkles,
  Timer,
  Award
} from 'lucide-react';

export default function HomePage() {
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 45, seconds: 30 });
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Countdown timer for FOMO
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Rotating testimonials
  const testimonials = [
    { name: "Sarah Chen", company: "TechStart Solutions", text: "Increased revenue by 340% in just 3 months!", revenue: "$45K" },
    { name: "Mike Rodriguez", company: "Local Retail Pro", text: "Found $28K in missed opportunities instantly!", revenue: "$28K" },
    { name: "Lisa Thompson", company: "Service Plus LLC", text: "Recovered $52K from overdue payments!", revenue: "$52K" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-yellow-400 to-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-gradient-to-br from-green-400 to-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center group">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <span className="ml-3 text-2xl font-bold text-white">SMB Analytics</span>
            </div>
            
            {/* FOMO Timer */}
            <div className="hidden md:flex items-center bg-red-500/20 border border-red-400 rounded-full px-4 py-2 animate-pulse">
              <Timer className="w-4 h-4 text-red-400 mr-2" />
              <span className="text-red-400 font-semibold text-sm">
                Limited Time: {String(timeLeft.hours).padStart(2, '0')}:
                {String(timeLeft.minutes).padStart(2, '0')}:
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/auth/login" className="text-white/80 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link 
                href="/auth/signup" 
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-full hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* FOMO Badge */}
          <div className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-3 rounded-full font-bold text-sm mb-8 animate-bounce shadow-lg">
            <Sparkles className="w-4 h-4 mr-2" />
            🔥 2,847 SMBs grew their revenue this week!
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 leading-tight">
            Turn Your Business Data Into
            <span className="block bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent animate-pulse">
              Instant Cash Flow
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
            Stop leaving money on the table! Our AI finds hidden revenue in your existing data. 
            <span className="text-yellow-400 font-semibold"> Average SMB recovers $25,000 in first 30 days.</span>
          </p>

          {/* Social Proof Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full px-6 py-3 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <Users className="w-6 h-6 text-green-400 mr-2" />
              <span className="text-white font-semibold">280M+ SMBs Analyzed</span>
            </div>
            <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full px-6 py-3 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <DollarSign className="w-6 h-6 text-yellow-400 mr-2" />
              <span className="text-white font-semibold">$2.3B+ Revenue Generated</span>
            </div>
            <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full px-6 py-3 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <Clock className="w-6 h-6 text-blue-400 mr-2" />
              <span className="text-white font-semibold">Results in 24 Hours</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link
              href="/auth/signup"
              className="group bg-gradient-to-r from-green-500 to-emerald-600 text-white px-12 py-6 rounded-full text-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-110 shadow-2xl hover:shadow-green-500/25 flex items-center"
            >
              <Zap className="w-6 h-6 mr-3 group-hover:animate-spin" />
              Get My $25K Analysis FREE
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
            </Link>
            
            <div className="text-center">
              <p className="text-white/80 text-sm">✅ No Credit Card Required</p>
              <p className="text-white/80 text-sm">✅ 5-Minute Setup</p>
            </div>
          </div>

          {/* Live Testimonial Carousel */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-2xl mx-auto border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <blockquote className="text-white text-lg mb-4 italic">
              "{testimonials[currentTestimonial].text}"
            </blockquote>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <p className="text-white font-semibold">{testimonials[currentTestimonial].name}</p>
                <p className="text-white/70 text-sm">{testimonials[currentTestimonial].company}</p>
                <p className="text-green-400 font-bold text-xl mt-2">+{testimonials[currentTestimonial].revenue}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Urgency Section */}
      <section className="relative z-10 bg-gradient-to-r from-red-600 to-pink-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <AlertTriangle className="w-8 h-8 text-yellow-300 mr-3 animate-pulse" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Your Competitors Are Already Using This!
            </h2>
          </div>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            While you're reading this, 127 SMBs just discovered hidden revenue streams. 
            Don't let them get ahead - <span className="font-bold text-yellow-300">your data is waiting to make you money!</span>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-6 hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="text-white font-bold text-lg mb-2">Instant Results</h3>
              <p className="text-white/80">See revenue opportunities in 24 hours, not months</p>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-6 hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-white font-bold text-lg mb-2">Zero Risk</h3>
              <p className="text-white/80">Free trial with guaranteed results or money back</p>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-6 hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
              <div className="text-4xl mb-3">🚀</div>
              <h3 className="text-white font-bold text-lg mb-2">Easy Setup</h3>
              <p className="text-white/80">Upload your data, get results - no technical skills needed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 bg-white/5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              8 Ways We'll Grow Your Business
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Our AI analyzes your business data and finds money you didn't know you had
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: "📈", title: "Sales Forecasting", desc: "Predict next month's revenue with 94% accuracy", value: "+$15K avg" },
              { icon: "👥", title: "Customer Recovery", desc: "Win back lost customers automatically", value: "+$8K avg" },
              { icon: "💰", title: "Cash Flow Boost", desc: "Optimize payment timing and collections", value: "+$12K avg" },
              { icon: "⚠️", title: "Overdue Recovery", desc: "Collect overdue payments faster", value: "+$18K avg" },
              { icon: "🎯", title: "Upsell Opportunities", desc: "Find customers ready to buy more", value: "+$22K avg" },
              { icon: "📊", title: "Profit Optimization", desc: "Identify your most profitable products", value: "+$9K avg" },
              { icon: "🔄", title: "Retention Boost", desc: "Keep customers from leaving", value: "+$14K avg" },
              { icon: "📅", title: "Seasonal Planning", desc: "Maximize seasonal opportunities", value: "+$11K avg" }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:rotate-1 border border-white/20 hover:border-white/40"
              >
                <div className="text-4xl mb-4 group-hover:animate-bounce">{feature.icon}</div>
                <h3 className="text-white font-bold text-lg mb-3">{feature.title}</h3>
                <p className="text-white/80 text-sm mb-4">{feature.desc}</p>
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-bold inline-block">
                  {feature.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section with FOMO */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-red-500/20 border border-red-400 rounded-full px-6 py-3 mb-6 animate-pulse">
              <Timer className="w-5 h-5 text-red-400 mr-2" />
              <span className="text-red-400 font-bold">Limited Time Offer - 73% OFF!</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Start Making Money Today
            </h2>
            <p className="text-xl text-white/80">
              Join 15,000+ SMBs already growing with our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Free Trial</h3>
                <div className="text-5xl font-bold text-white mb-2">$0</div>
                <p className="text-white/70">Perfect to get started</p>
              </div>
              <ul className="space-y-4 mb-8">
                {["5MB data upload", "Basic revenue analysis", "Email support", "1 user account"].map((feature, i) => (
                  <li key={i} className="flex items-center text-white/80">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link 
                href="/auth/signup"
                className="w-full bg-white/20 text-white py-3 rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 block text-center"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Pro Plan - Most Popular */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-8 border-2 border-yellow-400 relative transform scale-105 shadow-2xl">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-2 rounded-full font-bold text-sm flex items-center">
                  <Award className="w-4 h-4 mr-2" />
                  MOST POPULAR
                </div>
              </div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Pro Growth</h3>
                <div className="flex items-center justify-center mb-2">
                  <span className="text-2xl text-white/60 line-through mr-2">$299</span>
                  <div className="text-5xl font-bold text-white">$99</div>
                </div>
                <p className="text-white/70">Most businesses choose this</p>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "1GB data upload", 
                  "All 8 revenue models", 
                  "Lead generation tools", 
                  "WhatsApp & Email integration",
                  "Priority support",
                  "3 team members"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center text-white">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link 
                href="/auth/signup"
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 block text-center text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Get Pro Now - Save $200!
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
                <div className="text-5xl font-bold text-white mb-2">$199</div>
                <p className="text-white/70">For growing businesses</p>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "5GB data upload", 
                  "Advanced AI models", 
                  "Custom integrations", 
                  "Dedicated support",
                  "Unlimited team members",
                  "White-label options"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center text-white/80">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link 
                href="/auth/signup"
                className="w-full bg-white/20 text-white py-3 rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 block text-center"
              >
                Go Enterprise
              </Link>
            </div>
          </div>

          {/* Money Back Guarantee */}
          <div className="text-center mt-12">
            <div className="inline-flex items-center bg-green-500/20 border border-green-400 rounded-full px-8 py-4">
              <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
              <span className="text-green-400 font-bold text-lg">
                30-Day Money-Back Guarantee - Find Revenue or Get 100% Refund!
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative z-10 bg-gradient-to-r from-purple-600 to-pink-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Don't Wait - Your Money Is Waiting!
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Every day you wait is money left on the table. Join the SMBs already growing their revenue.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <Link
              href="/auth/signup"
              className="group bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-12 py-6 rounded-full text-xl font-bold hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 transform hover:scale-110 shadow-2xl flex items-center"
            >
              <Sparkles className="w-6 h-6 mr-3 group-hover:animate-spin" />
              Start My Free Analysis Now
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-white/80">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
              <span>Setup in 5 minutes</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
              <span>Results in 24 hours</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
              <span>No credit card required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-black/50 backdrop-blur-md py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <span className="ml-3 text-2xl font-bold text-white">SMB Analytics Platform</span>
            </div>
            <p className="text-white/60 mb-8 max-w-2xl mx-auto">
              Helping small and medium businesses unlock hidden revenue streams through intelligent data analysis.
            </p>
            <div className="flex justify-center space-x-8 mb-8">
              <Link href="/privacy" className="text-white/60 hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-white/60 hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/contact" className="text-white/60 hover:text-white transition-colors">Contact Us</Link>
            </div>
            <div className="flex justify-center space-x-6">
              <div className="flex items-center text-white/60">
                <Phone className="w-4 h-4 mr-2" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center text-white/60">
                <Mail className="w-4 h-4 mr-2" />
                <span>hello@smbanalytics.com</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}