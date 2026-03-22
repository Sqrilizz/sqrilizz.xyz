# Sqrilizz.xyz

My website

## Features

- Bento Grid Layout
- Real-time Discord Status (Lanyard API)
- Auto Project Sync (GitHub & Modrinth)
- Music Player
- Weather Widget
- Terminal Card
- Smooth Animations (Framer Motion)


## Configuration

### Personal Info
Edit `src/components/bento/HeroCard.jsx` - update name, birthdate, location, social links

### Discord
Edit `src/config/discord.js`:
```js
USER_ID: 'your_discord_id'
CUSTOM_BANNER: 'your_banner_url'
```

### Projects
Edit `src/config/projects.js`:
```js
GITHUB_USERNAME: 'your_username'
MODRINTH_USERNAME: 'your_username'
```

### Music
Edit `src/components/bento/MusicCard.jsx` - add your tracks

### Skills
Edit `src/components/bento/SkillsCard.jsx` - customize tech stack

### Meta Tags
Edit `index.html` - update title, description, og:image

## Environment Variables

Create `.env.local`:
```env
VITE_ACCUWEATHER_API_KEY=your_key
VITE_MODRINTH_TOKEN=your_token
```

## Build

```bash
npm run build
```

## Deploy

Works with Vercel, Netlify, or any static host. Add environment variables in your hosting dashboard.
