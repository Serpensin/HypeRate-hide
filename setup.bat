@echo off
REM -----------------------------
REM Puppeteer & Express Setup
REM This batch file sets up all required dependencies for the heartbeat widget
REM -----------------------------

echo Initializing npm...
REM Create a package.json file with default settings (-y flag skips interactive questions)
call npm init -y

echo Installing puppeteer, express and ws...
REM Install required Node.js packages:
REM - puppeteer: Browser automation (for scraping heart rate data)
REM - express: Web server framework (serves the widget HTML)
REM - ws: WebSocket library (real-time communication between server and widget)
call npm install puppeteer express ws

REM Fix package.json to use ES modules safely
echo Setting "type": "module" in package.json...
REM Modify package.json to enable ES6 import/export syntax instead of require()
REM This PowerShell command reads the JSON file, adds the "type": "module" property, 
REM and saves it back to enable modern JavaScript module syntax
powershell -Command ^
    "$json = Get-Content package.json | Out-String | ConvertFrom-Json; $json.type = 'module'; $json | ConvertTo-Json -Depth 100 | Set-Content package.json"

echo.
echo Setup complete! You can now run the heartbeat server with run.bat
echo Press any key to close this window...
pause
