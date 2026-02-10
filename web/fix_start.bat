@echo off
echo Cleaning up environment...
if exist node_modules (
    echo Removing node_modules...
    rmdir /s /q node_modules
)
if exist package-lock.json (
    echo Removing package-lock.json...
    del package-lock.json
)

echo Installing dependencies (this may take a few minutes)...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo npm install failed with error code %ERRORLEVEL%.
    pause
    exit /b %ERRORLEVEL%
)

echo Verifying installation...
if not exist "node_modules\@next\env" (
    echo Warning: @next/env package appears to be missing. Attempting direct install...
    call npm install @next/env
)

echo Starting development server...
npm run dev
pause
