# 🚀 Sqrilizz Portfolio

<div align="center">
  <h3>Современное интерактивное портфолио разработчика</h3>
  <p><strong>React + Vite + Tailwind CSS + Framer Motion</strong></p>

  ![Portfolio Preview](https://img.shields.io/badge/Status-Active-brightgreen)
  ![React](https://img.shields.io/badge/React-18.2.0-blue)
  ![Vite](https://img.shields.io/badge/Vite-4.4.5-646CFF)
  ![Tailwind](https://img.shields.io/badge/Tailwind-3.3.0-38B2AC)

  **🌐 [Посмотреть демо](https://sqrilizz.xyz)** |
  **📧 [Связаться со мной](mailto:contact@sqrlizz.xyz)**

</div>

---

## ✨ Особенности

### 🎨 **Современный дизайн**
- Темная тема с фиолетовыми градиентами
- Анимированное звездное поле на фоне
- Стеклянный эффект карточек с размытием

### 🎵 **Интерактивный музыкальный плеер**
- Воспроизведение MP3 файлов с обложками
- Визуализация эквалайзера с анимацией
- Управление громкостью и прогрессом

### 💬 **Терминальный интерфейс**
- Стиль VS Code с анимированным курсором
- Typing-эффект для текста
- Многоязычность (Русский/Английский)

### 🌍 **Адаптивность**
- Полностью responsive дизайн
- Поддержка мобильных устройств
- Современные веб-стандарты

## 🚀 Быстрый старт

### Предварительные требования
- Node.js 16+
- npm или yarn

### Установка

```bash
# Клонировать репозиторий
git clone https://github.com/Sqrilizz/ZovNew.git
cd ZovNew

# Установить зависимости
npm install

# Запустить в режиме разработки
npm run dev

# Собрать для продакшена
npm run build
```

Откройте [http://localhost:5173](http://localhost:5173) в браузере!

## 🛠 Кастомизация

### 1. **Персональная информация**
Отредактируйте `src/components/HomePage.jsx`:
```javascript
const USER = {
  nick: 'Sqrilizz',
  role: 'Developer, Minecraft Modder, Web Designer & AI Engineer',
  location: { country: 'Estonia', city: 'Tallinn' },
  // ... ваши социальные сети
}
```

### 2. **Музыкальный плейлист**
Добавьте MP3 файлы в `public/music/` и настройте в `src/components/HomePage.jsx`:
```javascript
const playlist = [
  {
    title: 'Название трека',
    src: '/music/track.mp3',
    cover: '/music/covers/cover.jpg'
  }
]
```

### 3. **Видео страницы**
Настройте секретные видео в `src/config/videos.js`:
```javascript
export const VIDEO_CONFIG = {
  'Important': 'https://youtube.com/embed/...',
  'Secret': '/videos/secret.mp4'
}
```
Доступ: `yoursite.com/Important`, `yoursite.com/Secret`

### 4. **Изображения**
- `public/avatar.png` - ваш аватар (квадратный)
- `public/favicon.ico` - иконка сайта
- `public/banner.jpg` - фоновый баннер

## 📁 Структура проекта

```
src/
├── components/          # React компоненты
│   ├── HomePage.jsx    # Главная страница
│   ├── ProfileCard.jsx # Карточка профиля
│   ├── MusicPlayer.jsx # Музыкальный плеер
│   ├── TerminalCard.jsx# Терминальный интерфейс
│   └── MottoCard.jsx   # Карточка с девизом
├── context/            # React контексты
├── hooks/              # Кастомные хуки
├── locales/            # Переводы (RU/EN)
├── utils/              # Утилиты
└── config/             # Конфигурации

public/
├── music/              # MP3 файлы и обложки
├── videos/             # Локальные видео
└── images/             # Дополнительные изображения
```

## 🛠 Технологии

- **React 18** - современный фреймворк
- **Vite** - быстрый bundler и dev server
- **Tailwind CSS** - утилитарный CSS фреймворк
- **Framer Motion** - анимации и переходы
- **Howler.js** - работа со звуком
- **React i18next** - интернационализация
- **React Icons** - красивые иконки

## 📊 Мониторинг

[![GitHub issues](https://img.shields.io/github/issues/Sqrilizz/ZovNew)](https://github.com/Sqrilizz/ZovNew/issues)
[![GitHub stars](https://img.shields.io/github/stars/Sqrilizz/ZovNew)](https://github.com/Sqrilizz/ZovNew/stargazers)
[![GitHub license](https://img.shields.io/github/license/Sqrilizz/ZovNew)](https://github.com/Sqrilizz/ZovNew/blob/master/LICENSE)

## 📝 Лицензия

Этот проект лицензирован под [MIT License](LICENSE) - свободно используйте для своих портфолио!

## 🤝 Контакты

**Sqrilizz** - Developer & Creator

- 🌐 **Website:** [sqrilizz.fun | Bio](https://sqrilizz.fun)
- 💬 **Telegram:** [@sqrilizz](https://t.me/sqrilizz)
- 📧 **Email:** contact@sqrlizz.xyz
- 🎮 **Modrinth:** [modrinth.com/user/Sqrilizz](https://modrinth.com/user/Sqrilizz)

---

<div align="center">
  <strong>⭐ Не забудьте поставить звездочку если проект понравился!</strong>
</div>
