#!/usr/bin/env bash

# GradeWise Oracle Cloud VM Production Deployment Script

set -e

echo "🚀 Starting GradeWise Oracle Cloud Production Deployment..."

# 1. Pull latest changes from GitHub main branch
echo "📥 Pulling latest release from GitHub..."
git pull origin main

# 2. Build and restart Docker containers
echo "🐳 Building & restarting Docker Compose stack..."
docker compose down
docker compose up -d --build

# 3. Prune dangling images
echo "🧹 Cleaning up unused Docker image layers..."
docker image prune -f

# 4. Verify deployment health
echo "🩺 Verifying Backend Health..."
sleep 3
curl -s http://localhost:8000/ || (echo "❌ Backend health check failed!" && exit 1)

echo "✅ GradeWise Production Stack Deployed & Healthy!"
