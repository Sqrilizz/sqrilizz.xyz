import React from 'react'
import { motion } from 'framer-motion'

export default function ProjectCard({ title, description, url }) {
  return (
    <motion.a whileHover={{ scale: 1.02 }} className="card block p-5" href={url} target="_blank" rel="noreferrer">
      <div className="text-lg font-semibold">{title}</div>
      <div className="text-sm text-gray-300 mt-2">{description}</div>
    </motion.a>
  )
}