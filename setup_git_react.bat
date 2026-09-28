@echo off
REM React + Flask Migration Commit Script
cd /d "%~dp0"
git add .
git commit -m "Convert to React Frontend and Flask API"
echo Done converting to React!
