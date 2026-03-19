#!/bin/bash

echo "🚀 Setting up Image Background Remover..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found"
    echo "📝 Creating .env.local from .env.example..."
    cp .env.example .env.local
    
    echo ""
    echo "🔑 IMPORTANT: Please add your Remove.bg API key to .env.local"
    echo "   Get your free API key at: https://www.remove.bg/api"
    echo ""
    echo "   Edit .env.local and replace 'your_api_key_here' with your actual key"
    echo ""
    read -p "Press Enter to continue after adding your API key..."
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if API key is set
if grep -q "your_api_key_here" .env.local; then
    echo ""
    echo "⚠️  WARNING: API key is still set to placeholder value!"
    echo "   Please update .env.local with your actual Remove.bg API key"
    echo ""
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the development server:"
echo "   npm run dev"
echo ""
echo "Then open http://localhost:3000 in your browser"
