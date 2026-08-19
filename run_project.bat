@echo off
title Cleanytics Development Starter
echo =============================================
echo        Cleanytics Development Starter (Windows)
echo =============================================

:: 1. Start the Backend in a separate window
echo Starting Backend Server...
start "Cleanytics Backend" cmd /k "cd Backend && pip install -r requirements.txt && python -m uvicorn app.main:app --reload --port 8000"

:: 2. Start the Frontend in a separate window
echo Starting Frontend Server...
start "Cleanytics Frontend" cmd /k "cd Frontend\LoginNew && npm install && npm run dev"

echo =============================================
echo Servers starting in separate windows...
echo Backend API Docs: http://127.0.0.1:8000/docs
echo Frontend: http://localhost:5173
echo =============================================
pause
