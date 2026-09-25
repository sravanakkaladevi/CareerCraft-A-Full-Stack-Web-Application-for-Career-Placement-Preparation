Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "         🚀 CareerCraft Full-Stack Application Launcher" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Starting Django Backend REST API on http://127.0.0.1:8000 ..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "python manage.py runserver 8000"

Write-Host "Starting Vite React Frontend on http://localhost:5173 ..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location resumeforge-frontend; npm run dev"

Write-Host ""
Write-Host "======================================================================" -ForegroundColor Green
Write-Host "  ✅ Unified CareerCraft Full-Stack Application Running!" -ForegroundColor Green
Write-Host "  📍 Unified App UI:  http://localhost:5173/" -ForegroundColor White
Write-Host "  📍 Django REST API: http://127.0.0.1:8000/api/" -ForegroundColor White
Write-Host "======================================================================" -ForegroundColor Green
Write-Host ""

Start-Sleep -Seconds 3
Start-Process "http://localhost:5173/"
