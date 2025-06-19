#!/bin/bash

# OptiCours Deployment Script
# This script builds and deploys the OptiCours application

set -e  # Exit on any error

echo "🚀 Starting OptiCours deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm."
    exit 1
fi

print_status "Node.js version: $(node --version)"
print_status "npm version: $(npm --version)"

# Install dependencies
print_status "Installing dependencies..."
npm ci --only=production

# Run linting
print_status "Running linting checks..."
npm run lint

# Build the application
print_status "Building the application..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    print_error "Build failed: dist directory not found"
    exit 1
fi

print_status "Build completed successfully!"

# Optional: Deploy to server (uncomment and configure as needed)
# print_status "Deploying to server..."
# rsync -avz --delete dist/ user@your-server:/var/www/opticours/

print_status "✅ Deployment completed successfully!"
print_status "The application is ready to serve from the dist/ directory" 