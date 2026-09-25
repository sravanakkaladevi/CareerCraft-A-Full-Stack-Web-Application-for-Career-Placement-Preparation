@echo off
TITLE CareerCraft - External Terminal Launcher
echo ======================================================================
echo 🖥️ Spawning CareerCraft Full-Stack Application in External CMD Windows
echo ======================================================================
echo Starting Django Backend in external window...
start "CareerCraft Backend (Django - Port 8000)" cmd /k "python manage.py runserver 8000"

echo Starting React Frontend in external window...
start "CareerCraft Frontend (Vite React - Port 5173)" cmd /k "cd resumeforge-frontend && npm run dev"

echo.
echo  📍 Unified App UI:  http://localhost:5173/
echo  📍 Django REST API: http://127.0.0.1:8000/api/
echo.
timeout /t 3 >nul
start http://localhost:5173/
