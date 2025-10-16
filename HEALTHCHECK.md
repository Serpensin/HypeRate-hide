# Health Check System

## Overview
The server now includes a comprehensive health check system that monitors the Puppeteer scraping process and can trigger automatic container restarts when recovery attempts fail.

## Health Monitoring

### Tracked Metrics
- **Last Successful Read**: Timestamp of the last successful heart rate data extraction
- **Consecutive Errors**: Count of errors without a successful read in between
- **Page Recreation Attempts**: Number of times the Puppeteer page had to be recreated
- **Connected Clients**: Number of WebSocket clients currently connected

### Health Endpoint
Access the health status at: `http://localhost:3000/health`

**Healthy Response (200 OK):**
```json
{
  "status": "healthy",
  "lastSuccessfulRead": "2025-10-16T12:34:56.789Z",
  "timeSinceLastSuccess": "5s",
  "consecutiveErrors": 0,
  "pageRecreationAttempts": 0,
  "maxRecreationAttempts": 5,
  "connectedClients": 2
}
```

**Unhealthy Response (503 Service Unavailable):**
```json
{
  "status": "unhealthy",
  "lastSuccessfulRead": "2025-10-16T12:30:00.000Z",
  "timeSinceLastSuccess": "120s",
  "consecutiveErrors": 15,
  "pageRecreationAttempts": 5,
  "maxRecreationAttempts": 5,
  "connectedClients": 2
}
```

## Recovery Strategy

The system uses a multi-level recovery approach:

### Level 1: Automatic Page Reload
- Triggered when detached frame errors are detected
- Attempts to reload the existing Puppeteer page
- **Success**: Resets error counters and continues
- **Failure**: Proceeds to Level 2

### Level 2: Page Recreation
- Closes the failed page and creates a new one
- Navigates to the HypeRate URL again
- **Success**: Resets error counters and continues
- **Failure**: Increments recreation attempt counter

### Level 3: Health Check Failure
When recovery attempts are exhausted:
- After **5 page recreation attempts** within a short period
- After **60 seconds** without successful data read
- Health endpoint returns HTTP 503 (Service Unavailable)
- Docker detects unhealthy status after 3 consecutive failed checks (60 seconds)
- Container is automatically restarted by Docker

## Configuration

### Server Constants (in server.js)
```javascript
MAX_ERROR_TIME = 60000              // 60 seconds without successful read
MAX_RECREATION_ATTEMPTS = 5         // Maximum page recreation attempts
```

### Docker Health Check Settings

**docker-compose.yml:**
- Interval: 20 seconds
- Timeout: 10 seconds  
- Retries: 3 (container marked unhealthy after 3 failures = ~60 seconds)
- Start period: 15 seconds (grace period on startup)

**Dockerfile:**
- Interval: 20 seconds
- Timeout: 5 seconds
- Retries: 3
- Start period: 15 seconds

## Benefits

1. **Automatic Recovery**: Multiple levels of self-healing before requiring restart
2. **Minimal Downtime**: Quick detection and recovery from transient issues
3. **Container Orchestration**: Integrates with Docker's restart policies
4. **Monitoring Integration**: Health endpoint can be used by external monitoring tools
5. **Detailed Diagnostics**: Health status provides insight into system state

## Testing the Health Check

### Manual Test
```bash
# Check health status
curl http://localhost:3000/health

# Check Docker container health
docker ps
# Look for "healthy" or "unhealthy" in STATUS column

# View health check logs
docker inspect --format='{{json .State.Health}}' hyperate-heart-widget | jq
```

### Simulate Failure
To test the health check system, you can:
1. Temporarily break the HypeRate URL in config
2. Watch the logs as recovery attempts are made
3. Observe the health endpoint status change
4. See the container restart automatically after exhausting recovery attempts
