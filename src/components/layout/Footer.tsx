'use client';

import Link from 'next/link';
import { BarChart3, Mail, Phone, MapPin, Globe } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">SMB Analytics</span>
            </div>
            <p className="text-gray-400 mb-4">
              Transform your SMB data into immediate revenue opportunities with AI-powered analytics and lead generation.
            </p>
            <div className="flex items-center space-x-2 text-gray-400">
              <Globe className="w-4 h-4" />
              <span>Available in 10 languages</span>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Product</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="#features" className="hover:text-white transition-colors">Analytics</Link></li>
              <li><Link href="#features" className="hover:text-white transition-colors">Lead Generation</Link></li>
              <li><Link href="#demo" className="hover:text-white transition-colors">Demo</Link></li>
              <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
            
            <div className="mt-6 space-y-2">
              <div className="flex items-center space-x-2 text-gray-400">
                <Mail className="w-4 h-4" />
                <span>support@smbanalytics.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} SMB Analytics. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <span className="text-gray-400 text-sm">Serving 280M+ SMBs worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
}