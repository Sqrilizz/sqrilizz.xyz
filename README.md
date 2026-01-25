# Portfolio Website

Modern portfolio website built with React, Vite, and Tailwind CSS featuring a Bento Grid layout.

## Features

- Dark minimalist design with Bento Grid layout
- Real music player with Howler.js
- Real-time Discord status via Lanyard API
- Live weather widget with AccuWeather API
- Automatic project fetching from GitHub and Modrinth
- Favorites page with games, books, movies, and anime
- Smooth animations with Framer Motion
- Fully responsive design

## Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Audio:** Howler.js
- **Routing:** React Router
- **Deployment:** Vercel

## Setup

1. Clone the repository:
```bash
git clone https://github.com/Sqrilizz/portfolio.git
cd portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```bash
cp .env.example .env.local
```

4. Add your API keys to `.env.local`:
```env
ACCUWEATHER_API_KEY=your_accuweather_api_key
VITE_MODRINTH_TOKEN=your_modrinth_token
```

5. Run development server:
```bash
npm run dev
```

6. Build for production:
```bash
npm run build
```

## Configuration

### Discord Integration
Edit `src/config/discord.js` to change:
- Discord User ID
- Custom banner URL

### Projects
Edit `src/config/projects.js` to change:
- GitHub username
- Modrinth username
- Excluded repositories
- Custom project logos

### Favorites
Edit `src/config/favorites.js` to add/remove:
- Games
- Books
- Movies
- Anime

### Music
Edit `src/components/bento/MusicCard.jsx` to change:
- Music tracks
- Cover images

## Deployment

The site is configured for deployment on Vercel. Simply connect your GitHub repository to Vercel and add the environment variables.

### Environment Variables on Vercel
- `ACCUWEATHER_API_KEY` - AccuWeather API key
- `VITE_MODRINTH_TOKEN` - Modrinth API token

## License

MIT License - feel free to use this project for your own portfolio!

## Credits

- Design inspiration: Modern Bento Grid layouts
- Icons: React Icons
- Fonts: System fonts
