@echo off
echo ===== GitHub Push Script for ontrakk-app =====

REM Navigate to the project directory
cd /d E:\TechProjects\ontrakk-app

REM Check if git is initialized, if not initialize it
if not exist .git (
    echo Initializing Git repository...
    git init
    echo Git repository initialized.
)

REM Check if remote origin exists, if not add it
git remote -v | findstr origin
if %errorlevel% neq 0 (
    echo Adding remote origin...
    git remote add origin https://github.com/Raventwist88/ontrakk.git
    echo Remote origin added.
)

REM Add all files to staging
echo Adding files to staging...
git add .

REM Prompt for commit message
set /p commit_msg="Enter commit message: "

REM Commit changes
echo Committing changes...
git commit -m "%commit_msg%"

REM Push to remote repository
echo Pushing to GitHub...
git push -u origin master

REM Check if push was successful
if %errorlevel% == 0 (
    echo ===== Push completed successfully! =====
) else (
    echo ===== Error: Push failed! =====
    echo You might need to:
    echo 1. Check your internet connection
    echo 2. Verify you have the right permissions for the repository
    echo 3. Try using 'main' instead of 'master' as the branch name with:
    echo    git push -u origin main
)

pause
