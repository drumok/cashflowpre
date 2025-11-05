#!/bin/bash

# SMB Analytics Platform Deployment Script
# This script deploys the application to Google Cloud Platform

set -e

echo "🚀 Starting deployment of SMB Analytics Platform..."

# Check if required environment variables are set
if [ -z "$GCP_PROJECT_ID" ]; then
    echo "❌ Error: GCP_PROJECT_ID environment variable is not set"
    exit 1
fi

# Set project
echo "📋 Setting GCP project to $GCP_PROJECT_ID"
gcloud config set project $GCP_PROJECT_ID

# Build and deploy using Cloud Build
echo "🏗️  Building and deploying with Cloud Build..."
gcloud builds submit --config cloudbuild.yaml

# Get the service URL
echo "🌐 Getting service URL..."
SERVICE_URL=$(gcloud run services describe smb-analytics-platform --region=us-central1 --format="value(status.url)")

echo "✅ Deployment completed successfully!"
echo "🌍 Your SMB Analytics Platform is now live at: $SERVICE_URL"

# Optional: Run health check
echo "🔍 Running health check..."
if curl -f "$SERVICE_URL/api/health" > /dev/null 2>&1; then
    echo "✅ Health check passed!"
else
    echo "⚠️  Health check failed - please verify the deployment"
fi

echo "🎉 Deployment complete! Your global SMB analytics platform is ready to serve 280+ million SMBs worldwide!"