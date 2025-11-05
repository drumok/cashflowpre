#!/bin/bash

# SMB Analytics Platform - GCP Deployment Script
# This script deploys your app to Google Cloud Run

echo "🚀 SMB Analytics Platform - GCP Deployment"
echo "==========================================="

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Google Cloud CLI is not installed"
    echo "Please install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Set project variables
PROJECT_ID="rare-sound-469106-n6"
SERVICE_NAME="smb-analytics-platform"
REGION="us-central1"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo "📋 Deployment Configuration:"
echo "Project ID: $PROJECT_ID"
echo "Service Name: $SERVICE_NAME"
echo "Region: $REGION"
echo "Image: $IMAGE_NAME"
echo ""

# Authenticate with Google Cloud (if needed)
echo "🔐 Checking Google Cloud authentication..."
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "Please authenticate with Google Cloud:"
    gcloud auth login
fi

# Set the project
echo "🎯 Setting project to $PROJECT_ID..."
gcloud config set project $PROJECT_ID

# Enable required APIs
echo "🔧 Enabling required APIs..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Build the Docker image
echo "🏗️  Building Docker image..."
gcloud builds submit --tag $IMAGE_NAME

# Deploy to Cloud Run
echo "🚀 Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
    --image $IMAGE_NAME \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --set-env-vars="NODE_ENV=production" \
    --set-env-vars="NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCgEeS4Zm6n7ZvaUp4tKDKMfBPXOo7cePs" \
    --set-env-vars="NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ocrcsvcap.firebaseapp.com" \
    --set-env-vars="NEXT_PUBLIC_FIREBASE_PROJECT_ID=ocrcsvcap" \
    --set-env-vars="NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ocrcsvcap.firebasestorage.app" \
    --set-env-vars="NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=571756360048" \
    --set-env-vars="NEXT_PUBLIC_FIREBASE_APP_ID=1:571756360048:web:830bfb34e06ff8e6ad1fb5" \
    --set-env-vars="NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-H6FW5K0EZJ" \
    --set-env-vars="FIREBASE_ADMIN_PROJECT_ID=ocrcsvcap" \
    --set-env-vars="FIREBASE_ADMIN_CLIENT_EMAIL=rajaninkv@gmail.com" \
    --set-env-vars="FIREBASE_ADMIN_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC83npbDHqhkSgn\nd8gwQCGZWCEh/N6wcpTdndPyy4MO+P6XtUVAprACoVTvAR8hW0MIlsEHJRcS4q16\nAVLywQ8JVijOMos1xnHtWfM7Zber68JrMdiPHoBxqb6MbRil4M0bCo31yxWnj4DH\nreYPRHqRJ+ijKLebRqfycujxcxy/EBtWg9Znandgch5F2VA7IvncTlJtbByiL+KY\n5GcDLgSNPpiAJJqNrN+G/FsXh7ajAHdvF8w6z+Ylibd9WpiHV0kK4EeJxDjZb2wM\ns6ALNXsIkO88H3BOS0Jv6Nm64aGnJP4CcYTn1CNsDazKUv/E0pjitqAwLzmLDxeW\nliBuyJopAgMBAAECggEAAVvXlNz8scrxv+1T8PTdKA+70xRJeCWbAG6PnI+uHscD\n4UfmVzhN7JeEWFV69pAAKs7xOqtLpg792vCR/cX6nHui8F4EUXYShcvkhHUu07Yk\naediUyARvrb+4zDzI3uPQFczZ26HfCqLCCp03SBYMfWEZo8zPpjM6eb26TSFv9TI\nbGn1fOKMsK1t4BVE/SDKl+8ZtqXWJdKwyfCWIyDn5wDFOOmNmDk8vjtLIz9eI+rv\nvZFNCtCCqih181ANgAbQLWZV4uF18qwCQqVYSxoLnRB2x2JBzC5gyYaTnrsCUk/m\nV0eni63CK9Tv6cNxVb11cLm43Bpmu/rDgl5QODznkwKBgQDyDpHOTKg4Vba0sjwI\naEYOuKiT6c6Z7MHnYqxgtJTNr7b590skvHpwpUaos12R19B7Cs1qdTXE4FuHRKcQ\nNu7EzJgtO/lp9ivgxrP4Bw52UDiig1EIGNK9vfcINEU4jliek+2QYKn7nNkvsCxo\nnuy60qYdvhvvz8zMS9E4minSMwKBgQDHv5ZU/ZF587JU5ZFtDFBUByl9wRr0D7G2\n2Er0Rb3ldTgUAOfrAAchqvfIW+yLsEsUpx4balwAB48HSzzE8PjZzX72ECbIrEUA\nyTWd+dzkY/0/a70I9MIsENOlMUZrZvyZ916W4Us6amsEU0XUmCRdTNt2n6XkTVy9\nRoN+yqdeMwKBgQCz3POnMfsF8VsUJiTJsoHsSnapgmDMq8rh3sZsDYNM27bBQ2qI\n36yzq3w3uyBaUN1PsJU29+V+Z6BbgT4KpGcDwWuKoTgR7qRoH/523Pd4HuAWkjFS\nLO/boh6/7+dHwS5El3M9hzaICuKvtt8o1n7dy8036J3lsqlhXS0YPCW7VQKBgDQ8\nA6ICFTLg6XeN+POdTrxKiy0ZfGTqXbzE3wT13+zLNHj2q68meLbzMIyyjS8SUO/7\nq8HblGdlkp+Dq0aNBWZfeJ38J0g+1GSaOW0wU/VduHIHSI25A7XmSJJgSlv3uILC\nz3eBPtzty0J8TDyF9Kx5VsK0iPskx+WvNN/JOu9FAoGASQgYpTSLAtxE9wpGpdwV\nE3O19eMcjaARdwi07QVRdrTaDbkzlCKA2gAehmv/Jmc2YKWJHcaAG2dGxNP9iCuX\nfVPvtacc/sD3761Wo18vJj2RojmC9kUv36vNksyh1df07vlMsWQW1TVXj5W4S3rC\ngJXnImaPFWdM5lXgrMhau4Q=\n-----END PRIVATE KEY-----" \
    --set-env-vars="BRAINTREE_ENVIRONMENT=sandbox" \
    --set-env-vars="BRAINTREE_MERCHANT_ID=f8yccj5hj3zmckzx" \
    --set-env-vars="BRAINTREE_PUBLIC_KEY=2mh3sysvtchv87qd" \
    --set-env-vars="BRAINTREE_PRIVATE_KEY=088ac88f01101cd4e8739ff4ca76bb48" \
    --set-env-vars="NEXT_PUBLIC_BRAINTREE_ENVIRONMENT=sandbox" \
    --set-env-vars="NEXT_PUBLIC_BRAINTREE_MERCHANT_ID=f8yccj5hj3zmckzx" \
    --set-env-vars="NEXT_PUBLIC_BRAINTREE_PUBLIC_KEY=2mh3sysvtchv87qd" \
    --memory=2Gi \
    --cpu=1 \
    --max-instances=10 \
    --timeout=300

# Get the service URL
echo "🎉 Deployment complete!"
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --platform=managed --region=$REGION --format="value(status.url)")
echo "🌐 Your app is live at: $SERVICE_URL"

echo ""
echo "📋 Next Steps:"
echo "1. Update Firebase authorized domains:"
echo "   - Go to Firebase Console > Authentication > Settings > Authorized domains"
echo "   - Add: $(echo $SERVICE_URL | sed 's|https://||')"
echo "2. Test your live application"
echo "3. Update DNS if you have a custom domain"
echo ""
echo "✅ Deployment successful!"