@echo off
echo Starting Ryton Server...
echo.
echo If MongoDB is not running, please start it first:
echo   mongod
echo.

REM Kill any existing node processes on port 3000
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do (
    echo Stopping process %%a using port 3000...
    taskkill /F /PID %%a >nul 2>&1
)

REM Start the server
echo Starting server...
npm start

pause
