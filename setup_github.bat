@echo off
echo ===================================================
echo   Expense Tracker - GitHub Setup Script
echo ===================================================
echo.

REM Initialize Git
git init
echo.

REM ---- Commit 1 ----
echo [1/9] Project Configuration and Gitignore...
git add .gitignore requirements.txt Procfile
git commit -m "Initial setup: Add .gitignore and server configs"
echo.

REM ---- Commit 2 ----
echo [2/9] Flask Backend API...
git add app.py tests/
git commit -m "Build Flask REST API with SQLite database"
echo.

REM ---- Commit 3 ----
echo [3/9] React Frontend Setup...
git add frontend/package.json frontend/package-lock.json frontend/vite.config.js frontend/index.html frontend/src/main.jsx
git commit -m "Initialize React frontend with Vite and Bootstrap 5"
echo.

REM ---- Commit 4 ----
echo [4/9] Base UI and API Services...
git add frontend/src/index.css frontend/src/services/api.js frontend/src/App.jsx
git commit -m "Set up global styles, routing, and Axios API service"
echo.

REM ---- Commit 5 ----
echo [5/9] Navbar Component...
git add frontend/src/components/Navbar.jsx
git commit -m "Create responsive Navbar with React Router links"
echo.

REM ---- Commit 6 ----
echo [6/9] Dashboard Component...
git add frontend/src/components/Dashboard.jsx
git commit -m "Build Dashboard with stats cards and Chart.js integration"
echo.

REM ---- Commit 7 ----
echo [7/9] Expense Forms and Lists...
git add frontend/src/components/ExpenseForm.jsx frontend/src/components/ExpenseList.jsx
git commit -m "Add components for listing, filtering, adding, and editing expenses"
echo.

REM ---- Commit 8 ----
echo [8/9] CI/CD Pipeline...
git add .github/
git commit -m "Configure GitHub Actions CI for Flask and React"
echo.

REM ---- Commit 9 ----
echo [9/9] Documentation...
git add README.md
git add .
git commit -m "Update documentation and finalize React-Flask integration"
echo.

echo ========================================
echo   Connecting to your GitHub Repository
echo ========================================

git branch -M main
git remote add origin https://github.com/pr1y4nsh/ExpTracker.git
git push -u origin main

echo.
echo All Done! Your code has been pushed to GitHub with 9 meaningful commits!
pause
