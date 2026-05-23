import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

function formatEvent(event) {
  const repo = event.repo?.name?.split('/')[1] || event.repo?.name
  switch (event.type) {
    case 'PushEvent': {
      const commits = event.payload?.commits || []
      const lastCommit = commits[commits.length - 1]
      if (lastCommit?.message) {
        const msg = lastCommit.message.split('\n')[0].slice(0, 40)
        return { icon: '⬆', text: `${msg} → ${repo}` }
      }
      return { icon: '⬆', text: `pushed to ${repo}` }
    }
    case 'CreateEvent':
      return { icon: '✦', text: `created ${event.payload?.ref_type || 'repo'} ${event.payload?.ref || repo}` }
    case 'DeleteEvent':
      return { icon: '✕', text: `deleted ${event.payload?.ref_type} ${event.payload?.ref} in ${repo}` }
    case 'WatchEvent':
      return { icon: '★', text: `starred ${repo}` }
    case 'ForkEvent':
      return { icon: '⑂', text: `forked ${repo}` }
    case 'IssuesEvent':
      return { icon: '●', text: `${event.payload?.action} issue in ${repo}` }
    case 'PullRequestEvent':
      return { icon: '⇄', text: `${event.payload?.action} PR in ${repo}` }
    case 'ReleaseEvent':
      return { icon: '◆', text: `released ${event.payload?.release?.tag_name} in ${repo}` }
    default:
      return { icon: '·', text: `${event.type?.replace('Event', '')} in ${repo}` }
  }
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  const days = Math.floor(hrs / 24)
  return `${days}d`
}

export default function GitHubGraph() {
  const [weeks, setWeeks] = useState([])
  const [snake, setSnake] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalCommits, setTotalCommits] = useState(0)
  const [weekCommits, setWeekCommits] = useState(0)
  const [topRepo, setTopRepo] = useState(null)
  const [events, setEvents] = useState([])

  const ROWS = 7
  const USERNAME = 'Sqrilizz'

  useEffect(() => {
    fetch(`https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`)
      .then(r => r.json())
      .then(data => {
        const contributions = data.contributions || []
        const grid = []
        let weekArr = []
        let total = 0
        let thisWeek = 0
        const now = new Date()
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

        contributions.forEach((day) => {
          total += day.count
          if (new Date(day.date) >= weekAgo) thisWeek += day.count
          weekArr.push(day.count)
          if (weekArr.length === ROWS) {
            grid.push(weekArr)
            weekArr = []
          }
        })
        if (weekArr.length > 0) {
          while (weekArr.length < ROWS) weekArr.push(0)
          grid.push(weekArr)
        }

        setTotalCommits(total)
        setWeekCommits(thisWeek)

        const last20 = grid.slice(-20)
        setWeeks(last20)
        setLoading(false)

        startSnake(last20)
      })
      .catch(() => setLoading(false))

    fetch(`https://api.github.com/users/${USERNAME}/repos?sort=stars&per_page=1`)
      .then(r => r.json())
      .then(repos => {
        if (repos.length > 0) setTopRepo(repos[0])
      })
      .catch(() => {})

    fetch(`https://api.github.com/users/${USERNAME}/events/public?per_page=5`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setEvents(data.slice(0, 5))
      })
      .catch(() => {})
  }, [])

  const startSnake = (grid) => {
    if (!grid.length) return

    const cols = grid.length
    let pos = { x: 0, y: 3 }
    let dir = { x: 1, y: 0 }
    let path = [{ ...pos }]
    let steps = 0

    const interval = setInterval(() => {
      let nextX = pos.x + dir.x
      let nextY = pos.y + dir.y

      if (nextX < 0 || nextX >= cols || nextY < 0 || nextY >= ROWS) {
        if (dir.x !== 0) {
          dir = { x: 0, y: pos.y < ROWS / 2 ? 1 : -1 }
        } else {
          dir = { x: 1, y: 0 }
        }
        nextX = pos.x + dir.x
        nextY = pos.y + dir.y
      }

      if (nextX < 0 || nextX >= cols || nextY < 0 || nextY >= ROWS) {
        clearInterval(interval)
        return
      }

      pos = { x: nextX, y: nextY }
      path = [...path, { ...pos }].slice(-8)
      setSnake([...path])

      steps++
      if (steps > cols * ROWS) {
        clearInterval(interval)
        setTimeout(() => startSnake(grid), 2000)
      }

      if (Math.random() < 0.3) {
        const options = []
        if (dir.x !== 0) {
          if (pos.y > 0) options.push({ x: 0, y: -1 })
          if (pos.y < ROWS - 1) options.push({ x: 0, y: 1 })
        } else {
          if (pos.x < cols - 1) options.push({ x: 1, y: 0 })
          if (pos.x > 0) options.push({ x: -1, y: 0 })
        }
        if (options.length > 0) {
          dir = options[Math.floor(Math.random() * options.length)]
        }
      }
    }, 150)

    return () => clearInterval(interval)
  }

  const getColor = (count) => {
    if (count === 0) return 'bg-zinc-800/60'
    if (count <= 2) return 'bg-emerald-900/60'
    if (count <= 5) return 'bg-emerald-700/70'
    if (count <= 10) return 'bg-emerald-500/70'
    return 'bg-emerald-400/80'
  }

  const isSnakeCell = (col, row) => {
    return snake.some(s => s.x === col && s.y === row)
  }

  const getSnakeIndex = (col, row) => {
    return snake.findIndex(s => s.x === col && s.y === row)
  }

  if (loading) return null

  return (
    <div className="mt-2">
      <div className="flex items-center gap-4 mb-2 text-[11px]">
        <span className="text-zinc-500">
          <span className="text-white font-medium">{totalCommits.toLocaleString()}</span> commits
        </span>
        <span className="text-zinc-500">
          <span className="text-emerald-400 font-medium">{weekCommits}</span> this week
        </span>
        {topRepo && (
          <a
            href={topRepo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            top: <span className="text-violet-400 font-medium">{topRepo.name}</span> ★{topRepo.stargazers_count}
          </a>
        )}
      </div>
      <div className="flex gap-[3px]">
        {weeks.map((week, col) => (
          <div key={col} className="flex flex-col gap-[3px]">
            {week.map((count, row) => {
              const isSnake = isSnakeCell(col, row)
              const snakeIdx = getSnakeIndex(col, row)
              const isHead = snakeIdx === snake.length - 1

              return (
                <div
                  key={row}
                  className={`w-[14px] h-[14px] rounded-[2px] transition-all duration-150 ${
                    isSnake
                      ? isHead
                        ? 'bg-white scale-125'
                        : 'bg-violet-400/80'
                      : getColor(count)
                  }`}
                />
              )
            })}
          </div>
        ))}
      </div>

      {events.length > 0 && (
        <div className="mt-3 space-y-1">
          {events.map((event, i) => {
            const { icon, text } = formatEvent(event)
            return (
              <div key={i} className="flex items-center gap-2 text-[11px]">
                <span className="text-zinc-600 w-3 text-center flex-shrink-0">{icon}</span>
                <span className="text-zinc-500 truncate">{text}</span>
                <span className="text-zinc-700 ml-auto flex-shrink-0">{timeAgo(event.created_at)}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
