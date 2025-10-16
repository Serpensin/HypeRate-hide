// ==========================================
// HypeRate Heart Rate Widget Server
// ==========================================
// This server scrapes heart rate data from HypeRate.io using Puppeteer (browser automation)
// and broadcasts it in real-time to connected widgets via WebSocket

// Import required Node.js modules
import express from "express";           // Web server framework
import { readFileSync, existsSync } from "fs"; // File system operations (reading config file)
import puppeteer from "puppeteer";      // Browser automation (scraping HypeRate website)
import { WebSocketServer } from "ws";    // WebSocket server for real-time communication

// Load configuration from environment variables or config.json file
// Priority: Environment variables > config.json > error
let config = {};

if (process.env.HYPERATE_URL) {
  // Use environment variable (preferred for Docker/production)
  config = {
    url: process.env.HYPERATE_URL
  };
  console.log("📋 Using configuration from environment variables");
} else if (existsSync("./config.json")) {
  // Fallback to config.json file (for local development)
  config = JSON.parse(readFileSync("./config.json", "utf8"));
  console.log("📋 Using configuration from config.json file");
} else {
  console.error("❌ No configuration found! Please set HYPERATE_URL environment variable or create config.json");
  process.exit(1);
}

if (!config.url) {
  console.error("❌ HypeRate URL not configured! Please set HYPERATE_URL environment variable.");
  process.exit(1);
}

// Create Express web server instance
const app = express();
// Serve static files from ./public directory (documentation)
app.use(express.static("./public"));
// Serve the heart rate widget from ./widget directory
app.use('/widget', express.static("./widget"));

// Health check endpoint for Docker/monitoring systems
app.get('/health', (req, res) => {
  const timeSinceLastSuccess = Date.now() - lastSuccessfulRead;
  const isHealthy = timeSinceLastSuccess < MAX_ERROR_TIME && 
                    pageRecreationAttempts < MAX_RECREATION_ATTEMPTS;
  
  const status = {
    status: isHealthy ? 'healthy' : 'unhealthy',
    lastSuccessfulRead: new Date(lastSuccessfulRead).toISOString(),
    timeSinceLastSuccess: `${Math.floor(timeSinceLastSuccess / 1000)}s`,
    consecutiveErrors: consecutiveErrors,
    pageRecreationAttempts: pageRecreationAttempts,
    maxRecreationAttempts: MAX_RECREATION_ATTEMPTS,
    connectedClients: wss ? wss.clients.size : 0
  };
  
  const httpStatus = isHealthy ? 200 : 503;
  res.status(httpStatus).json(status);
  
  if (!isHealthy) {
    console.log(`🏥 Health check FAILED: ${JSON.stringify(status)}`);
  }
});

// Start HTTP server on port 3000
const server = app.listen(3000, () =>
  console.log("✅ Server running on http://localhost:3000")
);

// Create WebSocket server attached to the HTTP server
// This allows real-time communication between server and connected widgets
const wss = new WebSocketServer({ server });

// Global variables for browser automation and data processing
let browser, page;              // Puppeteer browser and page instances
let lastValues = [];            // Array to store recent heart rate values
let lastSentZero = false;       // Flag to prevent sending multiple zeros in a row
const MAX_SAME_VALUES = 10;     // Maximum identical values before reloading page

// Health check tracking variables
let lastSuccessfulRead = Date.now();  // Timestamp of last successful heart rate read
let consecutiveErrors = 0;            // Count of consecutive errors
let pageRecreationAttempts = 0;       // Count of page recreation attempts
const MAX_ERROR_TIME = 60000;         // Maximum time without successful read (60 seconds)
const MAX_RECREATION_ATTEMPTS = 5;    // Maximum page recreation attempts before declaring unhealthy

// Main server logic - runs immediately when server starts
(async () => {
  // Launch Puppeteer browser in headless mode (no visible window)
  // Configure for Docker/container environment
  const browserOptions = {
    headless: true,
    args: []
  };
  
  // Add container-specific flags only when running in Docker
  if (process.env.DOCKER_ENV || process.env.PUPPETEER_EXECUTABLE_PATH) {
    browserOptions.args.push(
      '--no-sandbox',                    // Required for containers (SECURITY RISK outside containers!)
      '--disable-setuid-sandbox',        // Container permission handling
      '--disable-dev-shm-usage',         // Prevents shared memory issues in containers
      '--disable-accelerated-2d-canvas', // Disable 2D canvas acceleration
      '--no-first-run',                  // Skip first run setup
      '--no-zygote',                     // Disable zygote process
      '--disable-gpu'                    // No GPU acceleration in headless mode
    );
    console.log("🐳 Running in container mode with security flags");
  } else {
    console.log("💻 Running in local development mode");
  }
  
  // Use system Chromium if available (Docker environment)
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    browserOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
  }
  
  browser = await puppeteer.launch(browserOptions);
  
  // Create new browser page and navigate to HypeRate URL
  page = await browser.newPage();
  await page.goto(config.url, { waitUntil: "networkidle2" });
  console.log("🌍 Puppeteer loaded:", config.url);

  // Set up interval to scrape heart rate data every second
  setInterval(async () => {
    try {
      // Check if page is still attached and valid
      if (!page || page.isClosed()) {
        console.log("🔄 Page is closed, recreating...");
        pageRecreationAttempts++;
        page = await browser.newPage();
        await page.goto(config.url, { waitUntil: "networkidle2" });
        console.log("✅ Page recreated successfully");
        lastValues = []; // Reset values after page recreation
        return;
      }

      // Extract heart rate value from the HypeRate page
      // Looks for a <div> element with ID "heartRate" and gets its text content
      const val = await page.$eval("#heartRate", el => el.textContent.trim());
  
      console.log("❤️ Current heart rate:", val);
      
      // Update health tracking - successful read
      lastSuccessfulRead = Date.now();
      consecutiveErrors = 0;
      pageRecreationAttempts = 0;  // Reset recreation attempts on success
  
      // Keep track of recent values to detect if the page is stuck
      lastValues.push(val);
      if (lastValues.length > MAX_SAME_VALUES) lastValues.shift(); // Remove oldest value
  
      // If we have 10 identical values in a row, the page might be stuck
      if (lastValues.length === MAX_SAME_VALUES &&
          lastValues.every(v => v === lastValues[0])) {
        console.log("🔄 Heart rate stuck → reloading page...");
        await page.reload({ waitUntil: "networkidle2" });
        lastValues = []; // Clear the stuck values array
      }
  
      // Smart zero handling: Don't send consecutive zeros
      // This prevents the widget from flickering when HypeRate briefly shows 0
      let sendVal = val;
      if(val === "0"){
        if(!lastSentZero){
          // First zero - send the previous non-zero value instead
          lastSentZero = true;
          sendVal = lastValues[lastValues.length - 2] || "0";
        } else {
          // Second zero - now send it (prevents infinite hiding)
          lastSentZero = false;
        }
      } else {
        // Non-zero value - reset the zero flag
        lastSentZero = false;
      }
  
      // Broadcast heart rate value to all connected WebSocket clients (widgets)
      wss.clients.forEach(client => {
        if (client.readyState === 1) { // Check if connection is open
          client.send(sendVal);
        }
      });
  
    } catch (e) {
      // Handle errors gracefully (e.g., if HypeRate page structure changes or page becomes detached)
      console.warn("⚠️ Could not read heartrate:", e.message);
      consecutiveErrors++;
      
      // Check if it's a detached frame error or execution context destroyed
      if (e.message.includes("detached") || 
          e.message.includes("Execution context was destroyed") ||
          e.message.includes("Session closed")) {
        console.log("🔄 Detected detached page, reloading...");
        try {
          await page.reload({ waitUntil: "networkidle2", timeout: 10000 });
          console.log("✅ Page reloaded successfully");
          lastValues = []; // Reset values after reload
          consecutiveErrors = 0;
        } catch (reloadError) {
          console.error("❌ Failed to reload page:", reloadError.message);
          console.log("🔄 Attempting to recreate page...");
          pageRecreationAttempts++;
          
          if (pageRecreationAttempts >= MAX_RECREATION_ATTEMPTS) {
            console.error(`❌ Max recreation attempts (${MAX_RECREATION_ATTEMPTS}) reached. Container will be marked unhealthy.`);
          } else {
            try {
              await page.close().catch(() => {}); // Try to close the old page
              page = await browser.newPage();
              await page.goto(config.url, { waitUntil: "networkidle2" });
              console.log("✅ Page recreated successfully");
              lastValues = [];
            } catch (recreateError) {
              console.error("❌ Failed to recreate page:", recreateError.message);
            }
          }
        }
      }
    }
  }, 1000); // Run every 1000ms (1 second)
})();
