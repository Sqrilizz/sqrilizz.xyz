import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FaArrowLeft, FaGamepad, FaBook, FaFilm } from 'react-icons/fa'
import { MdAnimation } from 'react-icons/md'
import { useState } from 'react'
import { FAVORITES } from '../config/favorites'

function FavoriteCard({ item }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative bg-zinc-900/30 backdrop-blur-sm rounded-lg overflow-hidden border border-zinc-800/50 hover:border-zinc-700 transition-all shadow-md hover:shadow-xl hover:shadow-zinc-900/50"
      >
        {/* Shine effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent" />
        </div>

        {/* Image */}
        <div className="relative w-full aspect-[2/3] overflow-hidden bg-zinc-950">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-110"
          />
          
          {/* Gradient overlay on hover */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

          {/* Title on hover */}
          {isHovered && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 p-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-white font-bold text-xs leading-tight line-clamp-2">{item.title}</h3>
              {item.author && (
                <p className="text-zinc-300 text-[10px] mt-1 line-clamp-1">{item.author}</p>
              )}
            </motion.div>
          )}
        </div>
      </a>
    </motion.div>
  )
}

export default function FavoritesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black p-4 md:p-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute top-20 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute top-60 -right-40 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-1/3 w-72 h-72 bg-pink-500/5 rounded-full blur-3xl" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        
        {/* Noise texture */}
        <div className="absolute inset-0 opacity-[0.015] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]" />
      </div>

      <div className="max-w-[1800px] mx-auto relative z-10">
        {/* Header */}
        <div className="mb-10">
          <Link to="/">
            <motion.button
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6 group"
              whileHover={{ x: -5 }}
            >
              <FaArrowLeft size={14} />
              <span className="text-sm">Back to Home</span>
            </motion.button>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 bg-gradient-to-r from-white via-zinc-300 to-zinc-500 bg-clip-text text-transparent relative inline-block">
              My Favorites
              {/* Underline decoration */}
              <motion.div
                className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-zinc-700 via-zinc-600 to-transparent"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.3, duration: 0.6 }}
              />
            </h1>
            <p className="text-zinc-500 text-base mt-4">
              Things I love and recommend
            </p>
          </motion.div>
        </div>

        {/* Games Section */}
        {FAVORITES.games.length > 0 && (
          <section className="mb-14">
            <motion.div
              className="flex items-center gap-2.5 mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="w-8 h-8 rounded-lg bg-zinc-900/50 border border-zinc-800 flex items-center justify-center">
                <FaGamepad className="text-zinc-400" size={16} />
              </div>
              <h2 className="text-2xl font-bold text-white">Games</h2>
              <span className="text-zinc-600 text-xs ml-1">({FAVORITES.games.length})</span>
            </motion.div>
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
              {FAVORITES.games.map((game, i) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <FavoriteCard item={game} />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Books Section */}
        {FAVORITES.books.length > 0 && (
          <section className="mb-14">
            <motion.div
              className="flex items-center gap-2.5 mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="w-8 h-8 rounded-lg bg-zinc-900/50 border border-zinc-800 flex items-center justify-center">
                <FaBook className="text-zinc-400" size={16} />
              </div>
              <h2 className="text-2xl font-bold text-white">Books</h2>
              <span className="text-zinc-600 text-xs ml-1">({FAVORITES.books.length})</span>
            </motion.div>
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
              {FAVORITES.books.map((book, i) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <FavoriteCard item={book} />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Movies Section */}
        {FAVORITES.movies.length > 0 && (
          <section className="mb-14">
            <motion.div
              className="flex items-center gap-2.5 mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="w-8 h-8 rounded-lg bg-zinc-900/50 border border-zinc-800 flex items-center justify-center">
                <FaFilm className="text-zinc-400" size={16} />
              </div>
              <h2 className="text-2xl font-bold text-white">Movies</h2>
              <span className="text-zinc-600 text-xs ml-1">({FAVORITES.movies.length})</span>
            </motion.div>
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
              {FAVORITES.movies.map((movie, i) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <FavoriteCard item={movie} />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Anime Section */}
        {FAVORITES.anime && FAVORITES.anime.length > 0 && (
          <section className="mb-14">
            <motion.div
              className="flex items-center gap-2.5 mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="w-8 h-8 rounded-lg bg-zinc-900/50 border border-zinc-800 flex items-center justify-center">
                <MdAnimation className="text-zinc-400" size={16} />
              </div>
              <h2 className="text-2xl font-bold text-white">Anime</h2>
              <span className="text-zinc-600 text-xs ml-1">({FAVORITES.anime.length})</span>
            </motion.div>
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
              {FAVORITES.anime.map((anime, i) => (
                <motion.div
                  key={anime.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <FavoriteCard item={anime} />
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
