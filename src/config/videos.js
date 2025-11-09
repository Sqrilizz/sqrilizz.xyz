// Конфигурация видео для разных URL
export const VIDEO_CONFIG = {
  // Формат: 'URL_PATH': 'EMBED_URL'
  
  // YouTube видео (замени на свои)
  'Important': 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&controls=1&rel=0',
  'Secret': 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&controls=1&rel=0',
  'Special': 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&controls=1&rel=0',
  
  // Можно добавить Vimeo
  // 'Vimeo': 'https://player.vimeo.com/video/VIDEO_ID?autoplay=1',
  
  // Или прямые ссылки на MP4
  // 'Local': '/videos/my-video.mp4',
  
  // Twitch клипы
  // 'Twitch': 'https://clips.twitch.tv/embed?clip=CLIP_ID&parent=localhost',
}

// Настройки для разных типов видео
export const VIDEO_SETTINGS = {
  youtube: {
    allowFullScreen: true,
    allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  },
  vimeo: {
    allowFullScreen: true,
    allow: "autoplay; fullscreen; picture-in-picture"
  },
  mp4: {
    controls: true,
    autoPlay: true,
    loop: false
  }
}

// Функция для определения типа видео
export function getVideoType(url) {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube'
  if (url.includes('vimeo.com')) return 'vimeo'
  if (url.includes('twitch.tv')) return 'twitch'
  if (url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg')) return 'mp4'
  return 'iframe'
}
