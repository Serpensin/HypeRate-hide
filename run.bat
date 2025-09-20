@echo off
REM -----------------------------
REM Start Heartbeat Server
REM This batch file starts the Node.js server that:
REM 1. Scrapes heart rate data from HypeRate.io
REM 2. Serves the heartbeat widget HTML page
REM 3. Provides real-time heart rate updates via WebSocket
REM -----------------------------

echo Starting heartbeat server...
echo.
echo The server will:
echo - Run on http://localhost:3000
echo - Scrape heart rate from the configured HypeRate URL
echo - Send updates to connected widgets in real-time
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the Node.js server using the server.js file
node server.js

REM Keep the window open after the server stops (for debugging)
echo.
echo Server stopped. Press any key to close this window...
pause
