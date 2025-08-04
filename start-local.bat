@echo off
echo ========================================
echo   QUERY MANAGEMENT SYSTEM - LOCAL SETUP
echo ========================================
echo.

echo [1/2] Starting Backend (Spring Boot)...
echo.
cd loginapp
start "Backend Server" cmd /k "echo Backend Server Starting... && ./mvnw spring-boot:run"

echo [2/2] Starting Frontend (React)...
echo.
cd ../login-frontend
start "Frontend Server" cmd /k "echo Frontend Server Starting... && npm start"

echo.
echo ========================================
echo   SERVERS STARTING...
echo ========================================
echo   Backend:  http://localhost:8080
echo   Frontend: http://localhost:3000
echo ========================================
echo   Login as: admin@college.edu / password
echo ========================================
echo.
echo Both servers are starting in separate windows.
echo Your browser should open automatically to http://localhost:3000
echo.
pause
