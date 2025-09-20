# HypeRate Heart Rate Widget - Docker Setup

## 🐳 Quick Start with Docker

### Using Docker Compose (Recommended)

1. **Edit the HypeRate URL** in `docker-compose.yml`:
   ```yaml
   environment:
     - HYPERATE_URL=https://app.hyperate.io/YOUR_ID_HERE
   ```

2. **Start the container**:
   ```bash
   docker-compose up -d
   ```

3. **Access your widget**:
   - Documentation: http://127.0.0.1:3000
   - Widget (for OBS): http://127.0.0.1:3000/widget

### Using Docker directly

1. **Build the image**:
   ```bash
   docker build -t hyperate-widget .
   ```

2. **Run the container**:
   ```bash
   docker run -d \
     --name hyperate-widget \
     -p 3000:3000 \
     -e HYPERATE_URL="https://app.hyperate.io/YOUR_ID_HERE" \
     --restart unless-stopped \
     hyperate-widget
   ```

## 🛠️ Management Commands

```bash
# View logs
docker-compose logs -f

# Stop the service
docker-compose down

# Restart the service
docker-compose restart

# Update and restart
docker-compose down && docker-compose up -d --build
```

## 🔧 Configuration

### Environment Variables
- `HYPERATE_URL` - Your personal HypeRate.io URL (required)

### Fallback Config
If no environment variable is set, the container will look for `config.json` file.

## 📊 Health Monitoring

The container includes health checks. Check status with:
```bash
docker ps
# Look for (healthy) status
```

## 🔄 Auto-Restart

The container is configured to restart automatically unless manually stopped, ensuring your heart rate widget stays online 24/7!