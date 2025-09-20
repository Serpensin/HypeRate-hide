# ❤️ HypeRate Heart Rate Widget

<div align="center">

![Heart Rate Demo](https://img.shields.io/badge/Heart_Rate-Live-red?style=for-the-badge&logo=heart&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)

**Real-time heart rate display widget for streamers and content creators**

*Show your viewers exactly how intense the game really is!* 💓

[🚀 Quick Start](#-quick-start) • [🎮 For Streamers](#-for-streamers-obs-setup) • [🐳 Docker Setup](#-docker-setup) • [⚙️ Configuration](#️-configuration)

</div>

---

## 🎯 What is this?

The **HypeRate Heart Rate Widget** is a real-time heart rate display system designed specifically for **streamers**, **gamers**, and **content creators**. It connects to your **HypeRate.io** account and displays your live heart rate as a beautiful, animated widget that can be used as an overlay in **OBS Studio** or similar streaming software.

### ✨ Key Features

- 💓 **Real-time Heart Rate Display** - Updates every second
- 🎨 **Animated Pulsing Heart** - Beats in sync with your actual heart rate  
- 🌈 **Visual States** - Green when active, red when inactive, smooth transitions
- 🔄 **Smart Recovery** - Automatically handles connection issues and reconnects
- 📱 **Browser Source Ready** - Perfect for OBS with transparent background
- 🐳 **Docker Support** - Run anywhere with containerization
- 🔧 **Easy Setup** - Simple configuration and deployment

---

## 🎮 For Streamers (OBS Setup)

### What You Need
1. **Heart Rate Device** - Apple Watch, Fitbit, or any HypeRate.io compatible device
2. **HypeRate.io ID** - Free ID from [hyperate.io](https://hyperate.io)
3. **OBS Studio** - Or any streaming software that supports browser sources

### How It Works
```mermaid
graph LR
    A[📱 Your Device] --> B[🌐 HypeRate.io]
    B --> C[🖥️ Our Server]
    C --> D[📺 OBS Widget]
    D --> E[🎥 Your Stream]
```

1. **Your heart rate device** (Apple Watch, Fitbit, etc.) sends data to HypeRate.io
2. **Our server** scrapes your HypeRate dashboard every second
3. **The widget** displays your heart rate with a pulsing animation
4. **Your viewers** see exactly how intense the moment is!

---

## 🚀 Quick Start

### Option 1: Docker (Recommended)

```bash
# 1. Clone or download this repository
git clone https://github.com/Serpensin/HypeRate-hide.git
cd HypeRate-hide

# 2. Edit your HypeRate URL in docker-compose.yml
# Change: HYPERATE_URL=https://app.hyperate.io/YOUR_ID_HERE

# 3. Start the service
docker-compose up -d

# 4. Add to OBS as Browser Source: http://127.0.0.1:3000/widget
```

### Option 2: Local Setup

```bash
# 1. Install dependencies
./setup.bat  # (Windows)

# 2. Configure your HypeRate URL
# Edit config.json with your HypeRate.io URL

# 3. Start the server
./run.bat  # (Windows)

# 4. Add to OBS as Browser Source: http://127.0.0.1:3000/widget
```

---

## 🐳 Docker Setup

### Using Pre-built Image (Easiest)

```yaml
# docker-compose.yml
services:
  hyperate-widget:
    image: ghcr.io/serpensin/hyperate-hide:latest
    container_name: hyperate-heart-widget
    ports:
      - "3000:3000"
    environment:
      - HYPERATE_URL=https://app.hyperate.io/YOUR_ID_HERE
    restart: unless-stopped
```

### Commands

```bash
# Start the service
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the service
docker-compose down

# Update to latest version
docker-compose pull && docker-compose up -d
```

---

## ⚙️ Configuration

### Getting Your HypeRate URL

1. **Connect your heart rate device** - Open your HypeRate App and click on `Get your ID`
2. **Use This ID** in your configuration

### Environment Variables (Docker)

| Variable | Description | Example |
|----------|-------------|---------|
| `HYPERATE_URL` | Your personal HypeRate.io dashboard URL | `https://app.hyperate.io/abc123` |


### Local Configuration (config.json)

```json
{
  "url": "https://app.hyperate.io/YOUR_ID_HERE"
}
```

---

## 🎨 Widget Customization

### OBS Browser Source Settings

- **URL**: `http://127.0.0.1:3000/widget`
- **Width**: `225px`
- **Height**: `225px`
- **Custom CSS**: Optional styling overrides

### Styling Options

The widget is fully customizable! Edit `widget/index.html` to change:

- **Colors** - Heart color, text color, glow effects
- **Size** - Heart size, text size, overall scale  
- **Animation** - Pulse speed, transition effects
- **Position** - Layout and alignment

---

## 🔧 Technical Details

### Architecture

```
┌─────────────────┐    ┌──────────────┐    ┌─────────────┐
│   HypeRate.io   │◄──►│  Our Server  │◄──►│ OBS Widget  │
│   (Data Source) │    │ (Node.js +   │    │ (Browser)   │
│                 │    │  Puppeteer)  │    │             │
└─────────────────┘    └──────────────┘    └─────────────┘
```

### Technologies Used

- **Node.js** - Server runtime
- **Express** - Web server framework  
- **Puppeteer** - Browser automation for scraping HypeRate
- **WebSocket** - Real-time communication
- **Docker** - Containerization
- **HTML/CSS/JS** - Widget frontend

### System Requirements

- **Memory**: ~100-200MB RAM
- **CPU**: Minimal (mostly idle)
- **Network**: Stable internet connection
- **Browser**: Modern browser for OBS (Chrome-based recommended)

---

## 📁 Project Structure

```
HypeRate-hide/
├── 🐳 Dockerfile              # Container configuration
├── 🐙 docker-compose.yml      # Easy deployment setup
├── 🚀 server.js               # Main server application
├── ⚙️ config.json             # Configuration file
├── 📦 setup.bat               # Windows setup script
├── ▶️ run.bat                 # Windows start script
├── 📱 widget/
│   └── index.html            # Heart rate widget (for OBS)
├── 📚 public/
│   └── index.html            # Documentation page
└── 🔧 .github/workflows/
    └── docker-image.yml      # Automated builds
```

---

## 🎯 Usage Examples

### For Gaming Streams
Show your viewers how intense boss fights really are! Your heart rate spikes during clutch moments create authentic reactions.

### For Horror Games  
Perfect for horror game streams - watch your heart rate jump during jump scares!

### For Fitness Streams
Great for workout streams, showing real-time exertion levels during exercises.

### For Reaction Content
Ideal for reaction videos - show how content affects you physiologically.

---

## 🛠️ Troubleshooting

### Common Issues

**❌ Widget shows "---" or "ERR"**
- Check your HypeRate URL in configuration
- Ensure your heart rate device is connected to HypeRate.io
- Verify server is running (`docker-compose logs`)

**❌ OBS shows blank/black widget**  
- Verify URL is `http://127.0.0.1:3000/widget` (note the `/widget`)
- Check browser source dimensions (225x225 recommended)
- Select the source and press refresh
- Clear browser cache in OBS

**❌ Heart rate not updating**
- Confirm your device is actively sending data to HypeRate.io
- Check server logs for connection errors
- Restart the service: `docker-compose restart`

### Advanced Debugging

```bash
# View detailed logs
docker-compose logs -f hyperate-widget

# Test the widget manually
open http://127.0.0.1:3000/widget

# Check server status  
curl http://127.0.0.1:3000
```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

- 🐛 **Report Bugs** - Open an issue with details
- 💡 **Suggest Features** - Share your ideas  
- 🔧 **Submit PRs** - Code improvements welcome
- 📖 **Improve Docs** - Help others understand better

---

## 📄 License

This project is open source and available under the [GNU Affero General Public License v3.0 (AGPLv3)](LICENSE).

---

## 🙏 Acknowledgments

- **HypeRate.io** - For providing the heart rate data service
- **Puppeteer Team** - For the excellent browser automation
- **Docker Community** - For containerization best practices
- **OBS Project** - For the amazing streaming software

### 💬 Community & Support

- **HypeRate Discord** - Join the community: https://discord.gg/75jcqvuHAH

---

<div align="center">

**Made with ❤️ for the streaming community**

[⭐ Star this repo](https://github.com/Serpensin/HypeRate-hide) • [🐛 Report Issues](https://github.com/Serpensin/HypeRate-hide/issues)

</div>