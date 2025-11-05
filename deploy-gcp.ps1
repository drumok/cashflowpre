# SMB Analytics Platform - GCP Deployment Script (PowerShell)
# This script deploys your app to Google Cloud Run

Write-Host "🚀 SMB Analytics Platform - GCP Deployment" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Green

# Check if gcloud is installed
if (!(Get-Command gcloud -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Google Cloud CLI is not installed" -ForegroundColor Red
    Write-Host "Please install it from: https://cloud.google.com/sdk/docs/install" -ForegroundColor Yellow
    exit 1
}

# Set project variables
$PROJECT_ID = "rare-sound-469106-n6"
$SERVICE_NAME = "smb-analytics-platform"
$REGION = "us-central1"
$IMAGE_NAME = "gcr.io/$PROJECT_ID/$SERVICE_NAME"

Write-Host "📋 Deployment Configuration:" -ForegroundColor Cyan
Write-Host "Project ID: $PROJECT_ID" -ForegroundColor White
Write-Host "Service Name: $SERVICE_NAME" -ForegroundColor White
Write-Host "Region: $REGION" -ForegroundColor White
Write-Host "Image: $IMAGE_NAME" -ForegroundColor White
Write-Host ""

# Set the project
Write-Host "🎯 Setting project to $PROJECT_ID..." -ForegroundColor Yellow
gcloud config set project $PROJECT_ID

# Enable required APIs
Write-Host "🔧 Enabling required APIs..." -ForegroundColor Yellow
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Build the Docker image
Write-Host "🏗️  Building Docker image..." -ForegroundColor Yellow
gcloud builds submit --tag $IMAGE_NAME

# Deploy to Cloud Run
Write-Host "🚀 Deploying to Cloud Run..." -ForegroundColor Yellow
gcloud run deploy $SERVICE_NAME `
    --image $IMAGE_NAME `
    --platform managed `
    --region $REGION `
    --allow-unauthenticated `
    --set-env-vars="NODE_ENV=production" `
    --set-env-vars="NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCgEeS4Zm6n7ZvaUp4tKDKMfBPXOo7cePs" `
    --set-env-vars="NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ocrcsvcap.firebaseapp.com" `
    --set-env-vars="NEXT_PUBLIC_FIREBASE_PROJECT_ID=ocrcsvcap" `
    --set-env-vars="NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ocrcsvcap.firebasestorage.app" `
    --set-env-vars="NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=571756360048" `
    --set-env-vars="NEXT_PUBLIC_FIREBASE_APP_ID=1:571756360048:web:830bfb34e06ff8e6ad1fb5" `
    --set-env-vars="NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-H6FW5K0EZJ" `
    --set-env-vars="FIREBASE_ADMIN_PROJECT_ID=ocrcsvcap" `
    --set-env-vars="FIREBASE_ADMIN_CLIENT_EMAIL=rajaninkv@gmail.com" `
    --set-env-vars="BRAINTREE_ENVIRONMENT=sandbox" `
    --set-env-vars="BRAINTREE_MERCHANT_ID=f8yccj5hj3zmckzx" `
    --set-env-vars="BRAINTREE_PUBLIC_KEY=2mh3sysvtchv87qd" `
    --set-env-vars="BRAINTREE_PRIVATE_KEY=088ac88f01101cd4e8739ff4ca76bb48" `
    --set-env-vars="NEXT_PUBLIC_BRAINTREE_ENVIRONMENT=sandbox" `
    --set-env-vars="NEXT_PUBLIC_BRAINTREE_MERCHANT_ID=f8yccj5hj3zmckzx" `
    --set-env-vars="NEXT_PUBLIC_BRAINTREE_PUBLIC_KEY=2mh3sysvtchv87qd" `
    --memory=2Gi `
    --cpu=1 `
    --max-instances=10 `
    --timeout=300

# Get the service URL
Write-Host "🎉 Deployment complete!" -ForegroundColor Green
$SERVICE_URL = gcloud run services describe $SERVICE_NAME --platform=managed --region=$REGION --format="value(status.url)"
Write-Host "🌐 Your app is live at: $SERVICE_URL" -ForegroundColor Green

Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Update Firebase authorized domains:" -ForegroundColor White
Write-Host "   - Go to Firebase Console > Authentication > Settings > Authorized domains" -ForegroundColor Gray
$DOMAIN = $SERVICE_URL -replace "https://", ""
Write-Host "   - Add: $DOMAIN" -ForegroundColor Gray
Write-Host "2. Test your live application" -ForegroundColor White
Write-Host "3. Update DNS if you have a custom domain" -ForegroundColor White
Write-Host ""
Write-Host "✅ Deployment successful!" -ForegroundColor Green