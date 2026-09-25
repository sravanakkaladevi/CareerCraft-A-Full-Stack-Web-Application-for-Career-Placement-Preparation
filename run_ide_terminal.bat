@echo off
TITLE CareerCraft - IDE Terminal Launcher
echo ======================================================================
echo 🟢 Running CareerCraft Full-Stack Application
echo ======================================================================
echo Starting Django Backend REST API on http://127.0.0.1:8000 ...
start /B python manage.py runserver 8000

echo Starting React SPA Frontend on http://localhost:5173 ...
start /B npm --prefix resumeforge-frontend run dev

echo.
echo  📍 Unified App UI:  http://localhost:5173/
echo  📍 Django REST API: http://127.0.0.1:8000/api/
echo.
timeout /t 3 >nul
start http://localhost:5173/
