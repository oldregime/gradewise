#!/usr/bin/env bash

echo "🚀 Starting GradeWise Platform Local Stack..."

# 1. Start FastAPI Backend Server
cd backend
python3 -m uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!
cd ..

# 2. Start Frontend Server
cd frontend
node node_modules/vite/bin/vite.js --port 5173 &
FRONTEND_PID=$!
cd ..

echo "✅ Backend running on http://localhost:8000"
echo "✅ Frontend running on http://localhost:5173"
echo "Press Ctrl+C to stop both servers."

trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
wait
