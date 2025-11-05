#!/bin/bash

# SMB Analytics Platform Setup Script
# This script sets up the development environment

set -e

echo "🚀 Setting up SMB Analytics Platform development environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Copy environment file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📋 Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "⚠️  Please update .env.local with your actual configuration values"
fi

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "🔥 Installing Firebase CLI..."
    npm install -g firebase-tools
fi

# Check if Google Cloud CLI is installed
if ! command -v gcloud &> /dev/null; then
    echo "⚠️  Google Cloud CLI is not installed. Please install it for deployment:"
    echo "   https://cloud.google.com/sdk/docs/install"
fi

# Make scripts executable
chmod +x scripts/*.sh

echo "✅ Setup completed successfully!"
echo ""
echo "🎯 Next steps:"
echo "1. Update .env.local with your Firebase, GCP, and Braintree credentials"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Visit http://localhost:3000 to see your SMB Analytics Platform"
echo ""
echo "📚 For detailed setup instructions, see README.md"
echo "🌍 Ready to serve 280+ million SMBs worldwide! 🚀"