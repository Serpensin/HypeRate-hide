# HypeRate Heart Rate Widget

[![Docker Build](https://github.com/Serpensin/HypeRate-hide/actions/workflows/docker-image.yml/badge.svg)](https://github.com/Serpensin/HypeRate-hide/actions/workflows/docker-image.yml)

A real-time heart rate widget system designed for streamers, gamers, and content creators who want to display their live heart rate data on their streams or overlays.

The system scrapes heart rate data from **HypeRate.io** and displays it as a beautiful, animated widget that can be used as a browser source in OBS Studio or similar streaming software.

## ⚡ Quick Start

### Prerequisites
- A HypeRate.io compatible heart rate device (Apple Watch, Fitbit, etc.)
- Your personal HypeRate.io URL

### Option 1: Local Setup

1. **Install dependencies**:
   ```bash
   ./setup.bat  # Windows
   ```

2. **Configure your HypeRate URL**:
   Edit `config.json` with your personal HypeRate.io URL:
   ```json
   {
     "url": "https://app.hyperate.io/YOUR_ID_HERE"
   }
   ```

3. **Start the server**:
   ```bash
   ./run.bat  # Windows
   ```

4. **Access your widget**:
   - Documentation: http://127.0.0.1:3000
   - Widget (for OBS): http://127.0.0.1:3000/widget

### Option 2: Docker Setup

See [README-Docker.md](README-Docker.md) for detailed Docker instructions.

## 🔧 GitHub Actions Workflow

This repository includes a GitHub Actions workflow that automatically builds and pushes Docker images to GitHub Container Registry (ghcr.io).

### Workflow Triggers

The workflow runs on:

- **Push events** to `master` or `main` branches (when relevant files change)
- **Pull requests** to `master` or `main` branches (build only, no push)
- **Manual trigger** via GitHub Actions UI (`workflow_dispatch`)
- **Release events** when a new release is published

### Workflow Features

- **Multi-architecture builds**: Creates images for both `linux/amd64` and `linux/arm64`
- **Smart triggers**: Only runs when Docker-related files change
- **Efficient caching**: Uses GitHub Actions cache for faster builds
- **Automatic tagging**: Tags images based on branch, version, or event type
- **Security**: Uses GitHub's built-in `GITHUB_TOKEN` for authentication

### Monitored Files

The workflow automatically triggers when these files are modified:
- `Dockerfile`
- `server.js`
- `package*.json`
- `.github/workflows/docker-image.yml`

### Using Pre-built Images

You can use the automatically built images:

```bash
docker pull ghcr.io/serpensin/hyperate-hide:latest
```

## ✨ Features

- **🔄 Real-time Updates**: Heart rate data updates every second with minimal delay
- **💓 Animated Heart**: Pulsing heart emoji that matches your heartbeat rhythm  
- **🎨 Visual States**: Green when active, red when inactive, with smooth transitions
- **🛡️ Auto-Recovery**: Automatically handles connection issues and page reloads
- **📱 Browser Source Ready**: Perfect for OBS Studio browser sources with transparent background
- **🔧 Easy Setup**: Simple batch files for installation and running

## 🎯 How It Works

1. **Heart Rate Device** → Your Apple Watch, Fitbit, or other device measures your heart rate
2. **HypeRate.io** → Data is sent to HypeRate.io and displayed on your personal dashboard  
3. **Our Server** → Puppeteer scrapes your HypeRate page every second for the latest data
4. **Widget Display** → WebSocket broadcasts data to your widget in real-time

## 💡 Usage Tips

- **OBS Browser Source**: Set width: 400px, height: 300px for best results
- **Custom Styling**: Edit `widget/index.html` to change colors, sizes, or animations
- **Multiple Widgets**: You can have multiple browser sources pointing to the same server
- **Heart Rate Range**: Works with any heart rate value from your device
- **Transparent Background**: Widget background is transparent for clean overlays

## 📁 Project Structure

```
HypeRate-hide/
├── setup.bat              # Install dependencies
├── run.bat                # Start the server  
├── server.js              # Main server logic
├── config.json            # HypeRate URL configuration
├── widget/
│   └── index.html         # Heart rate widget
├── public/
│   └── index.html         # Documentation page
├── .github/workflows/
│   └── docker-image.yml   # CI/CD pipeline
├── Dockerfile             # Container configuration
├── docker-compose.yml     # Docker Compose setup
└── README-Docker.md       # Docker-specific docs
```

## 🔧 Technical Details

### Server Architecture
- **Node.js & Express**: Web server framework
- **Puppeteer**: Browser automation for scraping HypeRate.io  
- **WebSocket (ws)**: Real-time communication
- **Smart Error Handling**: Detects stuck pages and auto-reloads

### Widget Features  
- **CSS Animations**: Smooth pulsing heart effect
- **Transparent Background**: Perfect for overlays
- **Auto-reconnection**: Handles server disconnections
- **Smart Zero Handling**: Prevents flickering when heart rate briefly shows 0

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. The GitHub Actions workflow will automatically build and test your changes
5. Submit a pull request

## 📄 License

This project is open source. Built for streamers, by streamers ❤️