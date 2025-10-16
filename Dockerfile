# Multi-stage build for minimal final image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Initialize npm and install dependencies
RUN npm init -y
# Install with aggressive size optimizations
RUN npm install --production --no-optional --no-audit --no-fund puppeteer express ws
RUN npm pkg set type=module
# Clean npm cache aggressively
RUN npm cache clean --force
RUN rm -rf ~/.npm

# Minimal Alpine production stage
FROM alpine:3.18 AS production

# Install absolute minimum: Node.js and Chromium only
RUN apk add --no-cache nodejs chromium \
    && rm -rf /var/cache/apk/* \
    /usr/share/man \
    /tmp/* \
    /var/tmp/* \
    /usr/share/doc \
    /root/.cache

# Set working directory
WORKDIR /app

# Copy only the essentials from builder
COPY --from=builder /app/package.json ./
# Copy node_modules but exclude any dev or optional dependencies
COPY --from=builder /app/node_modules ./node_modules

# Copy application files
COPY server.js ./
COPY widget/ ./widget/
COPY public/ ./public/

# Create minimal user
RUN addgroup -S heartrate && adduser -S heartrate -G heartrate
RUN chown -R heartrate:heartrate /app
USER heartrate

# Expose port
EXPOSE 3000

# Environment variables
ENV NODE_ENV=production \
    DOCKER_ENV=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_SKIP_DOWNLOAD=true \
    HYPERATE_URL=""

# Ultra-minimal health check using the /health endpoint
HEALTHCHECK --interval=20s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health',(r)=>{let d='';r.on('data',c=>d+=c);r.on('end',()=>process.exit(r.statusCode===200?0:1))}).on('error',()=>process.exit(1))"

# Start server
CMD ["node", "server.js"]