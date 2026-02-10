@echo off
setlocal
echo Setting HOME to %USERPROFILE% to avoid path issues...
set "HOME=%USERPROFILE%"

echo Checking for git repository...
if not exist .git (
    echo Initializing new git repository...
    git init
    git branch -M main
    git remote add origin https://github.com/AhmedTElKodsh/teachers-tools-hub.git
) else (
    echo Git repository found. ensuring remote is correct...
    git remote add origin https://github.com/AhmedTElKodsh/teachers-tools-hub.git 2>nul
)

echo Adding files...
git add .

echo Committing changes...
git commit -m "Update project files"

echo Pushing to remote...
git push -u origin main

echo Done.
pause
