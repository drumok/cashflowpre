'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Play, TrendingUp, Users, DollarSign } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 hero-gradient"></div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 right-20 w-16 h-16 bg-white/10 rounded-full"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-40 left-20 w-12 h-12 bg-white/10 rounded-full"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-8"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <TrendingUp size={16} className="mr-2" />
            Turn Your Business Data Into Revenue Today
          </motion.div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            <span className="block">Transform Your</span>
            <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
              SMB Data
            </span>
            <span className="block">Into Revenue</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Get immediate actionable insights with contact information and one-click communication tools. 
            No complex setup required.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <motion.div
              className="flex items-center space-x-2 text-white/90"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Users size={20} />
              <span className="font-semibold">280M+ SMBs</span>
            </motion.div>
            <motion.div
              className="flex items-center space-x-2 text-white/90"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <DollarSign size={20} />
              <span className="font-semibold">$25K Avg Impact</span>
            </motion.div>
            <motion.div
              className="flex items-center space-x-2 text-white/90"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <TrendingUp size={20} />
              <span className="font-semibold">10 Languages</span>
            </motion.div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/auth/signup"
                className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-lg"
              >
                Start Free Analysis
                <ArrowRight size={20} className="ml-2" />
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="#demo"
                className="inline-flex items-center px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/30 transition-colors border border-white/30"
              >
                <Play size={20} className="mr-2" />
                Watch Demo
              </Link>
            </motion.div>
          </div>

          {/* Trust Indicators */}
          <motion.div
            className="mt-16 text-white/70 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <p className="mb-4">Trusted by SMBs worldwide</p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="w-20 h-8 bg-white/20 rounded"></div>
              <div className="w-20 h-8 bg-white/20 rounded"></div>
              <div className="w-20 h-8 bg-white/20 rounded"></div>
              <div className="w-20 h-8 bg-white/20 rounded"></div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
        </div>
      </motion.div>
    </section>
  );
}