@echo off
cd /d "C:\Users\piyus\OneDrive\Desktop\JobSprint"
echo Current Status:
git -c core.pager=cat status
echo.
echo Attempting to push...
git push --force origin main
echo.
echo Push completed.
pause
