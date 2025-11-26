#!/bin/bash
# Quick Start Script for Cstyle

echo "=========================================="
echo "  🚀 Cstyle - E-Commerce Setup"
echo "=========================================="
echo ""

# Check Node.js
echo "📋 Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js v18+"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm not found."
    exit 1
fi

echo "✅ Node.js $(node -v) found"
echo "✅ npm $(npm -v) found"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ npm install failed"
    exit 1
fi
echo "✅ Dependencies installed"
echo ""

# Seed database
echo "🌱 Seeding database..."
npm run seed
if [ $? -ne 0 ]; then
    echo "⚠️  Database seeding failed. Make sure MongoDB is running."
    echo "   Start MongoDB: mongod"
    exit 1
fi
echo "✅ Database seeded"
echo ""

# Start dev server
echo "🚀 Starting development server..."
echo "   Open: http://localhost:3000"
echo ""
echo "Default Credentials:"
echo "   Admin: admin@cstyle.com / admin123"
echo "   User:  user@example.com / user123"
echo ""

npm run dev
