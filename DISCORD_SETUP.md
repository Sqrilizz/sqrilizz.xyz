# 🎮 Discord RPC Setup

This component displays your real-time Discord activity on your portfolio.

## 🚀 Quick Setup

### 1. Get Your Discord User ID

1. Open Discord in browser or app
2. Enable **Developer Mode**:
   - Settings → Advanced → Developer Mode ✅
3. Right-click on your profile
4. Select **"Copy User ID"**
5. Paste the ID in `src/config/discord.js`:

```javascript
export const DISCORD_CONFIG = {
  USER_ID: 'YOUR_DISCORD_ID_HERE', // Replace with your actual ID
  // ...
}
```

### 2. Setup Lanyard (Recommended)

**Lanyard** is a free service for fetching Discord activity:

1. Join the Discord server: https://discord.gg/lanyard
2. Your activity will automatically become available via API
3. No additional configuration required!

**API endpoint:** `https://api.lanyard.rest/v1/users/YOUR_ID`

### 3. Alternative Method - Discord Bot (Advanced)

If you want more control, create a Discord bot:

1. Go to https://discord.com/developers/applications
2. Create a new application
3. In the **Bot** tab, create a bot
4. Copy the bot token
5. Add the bot to your server with `Read Messages` permissions

⚠️ **IMPORTANT:** Never publish your bot token in public code!

## 🎯 What's Displayed

### 📱 Status
- 🟢 **Online** - active
- 🟡 **Idle** - away
- 🔴 **DND** - do not disturb
- ⚫ **Offline** - not online

### 🎮 Activities
- **Games** - what you're playing
- **VS Code** - what you're working on
- **Spotify** - what you're listening to
- **Other apps** - browser, programs

### 🎵 Spotify Integration
Automatically shows:
- 🎵 Track name
- 👨‍🎤 Artist
- 💿 Album

## 🔧 Component Configuration

In `src/components/MottoCard.jsx` change the User ID:

```javascript
// Line 37
ws = new LanyardWebSocket('YOUR_DISCORD_ID', (data) => {
  // ...
})
```

## 🌐 Real-time Updates

The component supports two modes:

### WebSocket (Recommended)
- Instant updates
- Minimal API load
- Automatic reconnection

### HTTP Polling (Fallback)
- Updates every 30 seconds
- Works if WebSocket is unavailable
- More stable on some hosting providers

## 🎨 Customization

### Change Activity Priority
In `src/config/discord.js`:

```javascript
const priorities = {
  'Custom Status': 1,
  'Spotify': 5,
  'Visual Studio Code': 4,
  'Your App': 3
}
```

### Add New Icons
In the `DiscordRPC` component:

```javascript
{mainActivity.name === 'Your App' ? (
  <svg><!-- Your icon --></svg>
) : (
  // Default icon
)}
```

## 🐛 Troubleshooting

### Activity Not Loading
1. Check if Discord ID is correct
2. Make sure you joined the Lanyard server
3. Check browser console for errors

### WebSocket Not Connecting
- Check ad blockers
- Some corporate networks block WebSocket
- Component will automatically switch to HTTP polling

### Shows "Offline" When You're Online
- Wait 1-2 minutes for synchronization
- Reload the page
- Check Discord privacy settings

## 📊 Performance

- **Size:** ~3KB additional code
- **API requests:** Once per 30 seconds (HTTP) or real-time (WS)
- **Load impact:** minimal

## 🔒 Privacy

- Only public Discord activity is shown
- No personal data is transmitted
- Works through official Discord APIs

---

**🎉 Done!** Your portfolio now shows real-time Discord activity!
