@echo off
echo Initializing Git Repository...
call git init
call git add .
call git commit -m "Initial commit"

echo Creating GitHub Repository 'Teachers-Tools-Hub'...
call gh repo create Teachers-Tools-Hub --public --source=. --remote=origin --push

if %errorlevel% neq 0 (
    echo.
    echo Error: Failed to create or push to GitHub repository.
    echo Please make sure you have GitHub CLI (gh) installed and authenticated.
    echo usage: gh auth login
) else (
    echo.
    echo Repository created and pushed successfully!
)
pause
