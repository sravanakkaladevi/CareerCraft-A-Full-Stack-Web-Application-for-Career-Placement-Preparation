@echo off
TITLE CareerCraft Full-Stack Application Launcher

echo ======================================================================
echo           🚀 CareerCraft Full-Stack Application Launcher
echo ======================================================================
echo.
echo Starting Django Backend REST API on http://127.0.0.1:8000 ...
start /B python manage.py runserver 8000

echo Starting React SPA Frontend on http://localhost:5173 ...
start /B npm run dev --prefix resumeforge-frontend

echo.
echo ----------------------------------------------------------------------
echo  Unified Full-Stack App: http://localhost:5173/
echo  Django REST API:        http://127.0.0.1:8000/api/
echo ----------------------------------------------------------------------
echo.
echo Both servers are launched in background.
echo.
start http://localhost:5173/