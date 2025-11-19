# 🚀 Sqrilizz Portfolio

<div align="center">
  <h3>Modern Interactive Developer Portfolio</h3>
  <p><strong>React + Vite + Tailwind CSS + Framer Motion</strong></p>

  ![Portfolio Preview](https://img.shields.io/badge/Status-Active-brightgreen)
  ![React](https://img.shields.io/badge/React-18.2.0-blue)
  ![Vite](https://img.shields.io/badge/Vite-4.4.5-646CFF)
  ![Tailwind](https://img.shields.io/badge/Tailwind-3.3.0-38B2AC)

  **🌐 [View Demo](https://sqrilizz.xyz)** |
  **📧 [Contact Me](mailto:contact@sqrlizz.xyz)**

</div>

---

## ✨ Features

### 🎨 **Modern Design**
- Dark theme with purple gradients
- Animated starfield background
- Glass-morphism card effects with blur

### 🎵 **Interactive Music Player**
- MP3 playback with album covers
- Animated equalizer visualization
- Volume and progress controls

### 💬 **Terminal Interface**
- VS Code style with animated cursor
- Typing effect for text
- Multi-language support (Russian/English)

### 🎮 **Discord Rich Presence**
- Real-time Discord activity display
- Shows what you're playing, coding, or listening to
- Spotify integration with live track info
- WebSocket for instant updates

### 🌍 **Responsive**
- Fully responsive design
- Mobile device support
- Modern web standards

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Sqrilizz/ZovNew.git
cd ZovNew

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173) in your browser!

## 🛠 Customization

### 1. **Personal Information**
Edit `src/components/HomePage.jsx`:
```javascript
const USER = {
  nick: 'Sqrilizz',
  role: 'Developer, Minecraft Modder, Web Designer & AI Engineer',
  location: { country: 'Estonia', city: 'Tallinn' },
  // ... your social links
}
```

### 2. **Music Playlist**
Add MP3 files to `public/music/` and configure in `src/components/HomePage.jsx`:
```javascript
const playlist = [
  {
    title: 'Track Name',
    src: '/music/track.mp3',
    cover: '/music/covers/cover.jpg'
  }
]
```

### 3. **Discord Activity**
See [DISCORD_SETUP.md](DISCORD_SETUP.md) for detailed instructions on setting up Discord Rich Presence integration.

### 4. **Video Pages**
Configure secret videos in `src/config/videos.js`:
```javascript
export const VIDEO_CONFIG = {
  'Important': 'https://youtube.com/embed/...',
  'Secret': '/videos/secret.mp4'
}
```
Access: `yoursite.com/Important`, `yoursite.com/Secret`

### 5. **Images**
- `public/avatar.png` - your avatar (square)
- `public/favicon.ico` - site icon
- `public/banner.jpg` - background banner

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── HomePage.jsx    # Main page
│   ├── ProfileCard.jsx # Profile card
│   ├── MusicPlayer.jsx # Music player
│   ├── TerminalCard.jsx# Terminal interface
│   └── MottoCard.jsx   # Discord RPC card
├── context/            # React contexts
├── hooks/              # Custom hooks
├── locales/            # Translations (RU/EN)
├── utils/              # Utilities
└── config/             # Configurations
    └── discord.js      # Discord API config

public/
├── music/              # MP3 files and covers
├── videos/             # Local videos
└── images/             # Additional images
```

## 🛠 Technologies

- **React 18** - modern framework
- **Vite** - fast bundler and dev server
- **Tailwind CSS** - utility-first CSS framework
- **Framer Motion** - animations and transitions
- **Howler.js** - audio handling
- **React i18next** - internationalization
- **React Icons** - beautiful icons
- **Lanyard API** - Discord Rich Presence integration

## 📊 Stats

[![GitHub issues](https://img.shields.io/github/issues/Sqrilizz/ZovNew)](https://github.com/Sqrilizz/ZovNew/issues)
[![GitHub stars](https://img.shields.io/github/stars/Sqrilizz/ZovNew)](https://github.com/Sqrilizz/ZovNew/stargazers)
[![GitHub license](https://img.shields.io/github/license/Sqrilizz/ZovNew)](https://github.com/Sqrilizz/ZovNew/blob/master/LICENSE)

## 📝 License

This project is licensed under the [MIT License](LICENSE) - feel free to use it for your own portfolio!

## 🤝 Contact

**Sqrilizz** - Developer & Creator

- 🌐 **Website:** [sqrilizz.fun | Bio](https://sqrilizz.fun)
- 💬 **Telegram:** [@sqrilizz](https://t.me/sqrilizz)
- 📧 **Email:** contact@sqrlizz.xyz
- 🎮 **Modrinth:** [modrinth.com/user/Sqrilizz](https://modrinth.com/user/Sqrilizz)

---

<div align="center">
  <strong>⭐ Don't forget to star the repo if you like it!</strong>
</div>
