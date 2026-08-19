#!/usr/bin/env bash

# Exit script immediately on errors
set -e

# Setup cleanup traps for killing background tasks on exit/Ctrl+C
cleanup() {
    echo ""
    echo "Stopping Cleanytics development servers..."
    if [ -n "$BACKEND_PID" ]; then
        kill "$BACKEND_PID" 2>/dev/null || true
    fi
    if [ -n "$FRONTEND_PID" ]; then
        kill "$FRONTEND_PID" 2>/dev/null || true
    fi
    echo "Done!"
}
trap cleanup EXIT INT TERM

echo "============================================="
echo "       Cleanytics Development Starter        "
echo "============================================="

# 1. Start the Backend
echo "Starting Backend Server..."
cd Backend

# Activate virtual environment if present
if [ -d ".venv" ]; then
    echo "Using python virtual env (.venv)"
    source .venv/Scripts/activate || source .venv/bin/activate
elif [ -d "venv" ]; then
    echo "Using python virtual env (venv)"
    source venv/Scripts/activate || source venv/bin/activate
fi

echo "Installing/checking Python dependencies..."
pip install -r requirements.txt

echo "Starting FastAPI server on http://127.0.0.1:8000 ..."
python -m uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!

cd ..

# 2. Start the Frontend
echo "Starting Frontend Server..."
cd Frontend/LoginNew

echo "Installing/checking npm dependencies..."
npm install

echo "Starting Vite development server..."
npm run dev &
FRONTEND_PID=$!

echo "============================================="
echo "Cleanytics is running!"
echo "Backend:  http://127.0.0.1:8000"
echo "API Docs: http://127.0.0.1:8000/docs"
echo "Frontend: Check Vite terminal output (usually http://localhost:5173)"
echo "Press Ctrl+C to terminate both servers."
echo "============================================="

# Wait on foreground tasks to run indefinitely until user interrupts
wait
