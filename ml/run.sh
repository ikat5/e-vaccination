#!/bin/bash

# E-Vaccination Dashboard - Setup and Run Script
# This script automates the setup and launch of the dashboard

echo "=============================================="
echo "🏥 E-Vaccination Admin Dashboard"
echo "=============================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check Python installation
echo -e "${YELLOW}[1/5]${NC} Checking Python installation..."
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo -e "${GREEN}✓${NC} $PYTHON_VERSION found"
else
    echo -e "${RED}✗${NC} Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Step 2: Install dependencies
echo ""
echo -e "${YELLOW}[2/5]${NC} Installing Python dependencies..."
pip3 install -r requirements.txt --quiet
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Dependencies installed successfully"
else
    echo -e "${RED}✗${NC} Failed to install dependencies"
    exit 1
fi

# Step 3: Generate synthetic dataset
echo ""
echo -e "${YELLOW}[3/5]${NC} Generating synthetic dataset..."
if [ ! -d "data" ] || [ ! -f "data/hubs_master.csv" ]; then
    python3 generate_dataset.py
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} Dataset generated successfully"
    else
        echo -e "${RED}✗${NC} Failed to generate dataset"
        exit 1
    fi
else
    echo -e "${GREEN}✓${NC} Dataset already exists (skipping generation)"
fi

# Step 4: Start backend server
echo ""
echo -e "${YELLOW}[4/5]${NC} Starting Flask backend server..."
cd backend
python3 app.py &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Check if backend is running
if ps -p $BACKEND_PID > /dev/null; then
    echo -e "${GREEN}✓${NC} Backend server started (PID: $BACKEND_PID)"
else
    echo -e "${RED}✗${NC} Failed to start backend server"
    exit 1
fi

# Step 5: Open frontend
echo ""
echo -e "${YELLOW}[5/5]${NC} Opening dashboard in browser..."

# Try to open browser
if command -v xdg-open &> /dev/null; then
    xdg-open "frontend/index.html" &> /dev/null &
elif command -v open &> /dev/null; then
    open "frontend/index.html" &> /dev/null &
else
    echo -e "${YELLOW}⚠${NC} Could not auto-open browser. Please manually open: frontend/index.html"
fi

echo ""
echo "=============================================="
echo -e "${GREEN}✓ Dashboard is running!${NC}"
echo "=============================================="
echo ""
echo "📡 Backend API:  http://localhost:5000"
echo "🌐 Frontend:     file://$(pwd)/frontend/index.html"
echo ""
echo "To stop the server, press Ctrl+C"
echo ""
echo "Useful commands:"
echo "  - View API docs:     curl http://localhost:5000"
echo "  - Test endpoint:     curl http://localhost:5000/api/overview"
echo "  - Stop server:       kill $BACKEND_PID"
echo ""
echo "=============================================="

# Keep script running and wait for Ctrl+C
trap "echo ''; echo 'Stopping backend server...'; kill $BACKEND_PID; exit 0" INT

wait $BACKEND_PID
