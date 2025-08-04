#!/bin/bash
# Quick setup script for multi-service deployment

echo "🚀 Setting up Query Management System - Multi-Service Architecture"
echo ""

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "❌ Heroku CLI not found. Please install from https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
fi

echo "📝 Please provide the following information:"
read -p "Heroku app name for backend: " HEROKU_APP
read -p "Supabase database URL: " DATABASE_URL

echo ""
echo "🔧 Creating Heroku app..."
heroku create $HEROKU_APP

echo "🔧 Setting environment variables..."
heroku config:set DATABASE_URL="$DATABASE_URL" --app $HEROKU_APP
heroku config:set SPRING_PROFILES_ACTIVE=heroku --app $HEROKU_APP

echo ""
echo "📦 Deploying backend to Heroku..."
git subtree push --prefix=loginapp heroku main

echo ""
echo "✅ Backend deployment complete!"
echo "🌐 Backend URL: https://$HEROKU_APP.herokuapp.com"
echo ""
echo "Next steps:"
echo "1. Update login-frontend/.env.production with your Heroku URL"
echo "2. Deploy frontend to Vercel"
echo "3. Update CORS settings in Heroku with your Vercel URL"
