import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

function formatEvent(event) {
  const repo = event.repo?.name?.split('/')[1] || event.repo?.name
  switch (event.type) {
    case 'PushEvent': {
      const commits = event.payload?.commits || []
      const lastCommit = commits[commits.length - 1]
      const msg = lastCommit?.message?.split('\n')[0]?.slice(0, 50)
      return { icon: '⬆', text: msg || `pushed to ${repo}`, sub: repo }
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
  const [commits, setCommits] = useState([])

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

    const headers = {}
    const ghToken = import.meta.env.VITE_GITHUB_TOKEN
    if (ghToken) headers.Authorization = `token ${ghToken}`

    fetch(`https://api.github.com/users/${USERNAME}/repos?sort=stars&per_page=1`, { headers })
      .then(r => r.json())
      .then(repos => {
        if (Array.isArray(repos) && repos.length > 0) setTopRepo(repos[0])
      })
      .catch(() => {})

    fetch(`https://api.github.com/users/${USERNAME}/events/public?per_page=5`, { headers })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setEvents(data.slice(0, 5))
        const pushRepos = [...new Set(
          (Array.isArray(data) ? data : []).filter(e => e.type === 'PushEvent').map(e => e.repo?.name).filter(Boolean)
        )].slice(0, 3)
        Promise.all(
          pushRepos.map(repo =>
            fetch(`https://api.github.com/repos/${repo}/commits?per_page=3`, { headers })
              .then(r => r.json())
              .then(d => (Array.isArray(d) ? d : []).map(c => ({ message: c.commit?.message?.split('\n')[0], repo: repo.split('/')[1], date: c.commit?.author?.date })))
              .catch(() => [])
          )
        ).then(all => setCommits(all.flat().sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)))
      })
      .catch(() => {})
  }, [])

  const startSnake = (grid) => {
    if (!grid.length) return

    const cols = grid.length
    let pos = { x: 0, y: Math.floor(ROWS / 2) }
    let dir = { x: 1, y: 0 }
    let path = [{ ...pos }]
    let steps = 0

    const visited = new Set()
    const key = (x, y) => `${x},${y}`

    const isValid = (x, y) => x >= 0 && x < cols && y >= 0 && y < ROWS

    const interval = setInterval(() => {
      const dirs = [
        { x: dir.x, y: dir.y },
        { x: -dir.y, y: dir.x },
        { x: dir.y, y: -dir.x },
      ]

      let moved = false
      for (const d of dirs) {
        const nx = pos.x + d.x
        const ny = pos.y + d.y
        if (isValid(nx, ny) && !visited.has(key(nx, ny))) {
          dir = d
          pos = { x: nx, y: ny }
          moved = true
          break
        }
      }

      if (!moved) {
        for (const d of dirs) {
          const nx = pos.x + d.x
          const ny = pos.y + d.y
          if (isValid(nx, ny)) {
            dir = d
            pos = { x: nx, y: ny }
            moved = true
            break
          }
        }
      }

      if (!moved) {
        clearInterval(interval)
        setSnake([])
        setTimeout(() => startSnake(grid), 1500)
        return
      }

      visited.add(key(pos.x, pos.y))
      if (visited.size > cols * ROWS * 0.6) visited.clear()

      path = [...path, { ...pos }].slice(-6)
      setSnake([...path])

      if (Math.random() < 0.25) {
        const turn = Math.random() < 0.5
          ? { x: -dir.y, y: dir.x }
          : { x: dir.y, y: -dir.x }
        if (isValid(pos.x + turn.x, pos.y + turn.y)) {
          dir = turn
        }
      }

      steps++
      if (steps > cols * ROWS * 2) {
        clearInterval(interval)
        setSnake([])
        setTimeout(() => startSnake(grid), 1500)
      }
    }, 120)

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
      <div className="flex gap-4">
        <div className="flex gap-[3px] flex-shrink-0">
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

        {commits.length > 0 && (
          <div className="space-y-1.5 min-w-0 pt-0.5">
            {commits.map((c, i) => (
              <div key={i} className="flex items-center gap-2 text-[11px]">
                <span className="text-zinc-600 w-3 text-center flex-shrink-0">⬆</span>
                <span className="text-zinc-400 truncate">{c.message}</span>
                <span className="text-zinc-700 flex-shrink-0">· {c.repo}</span>
                <span className="text-zinc-700 ml-auto flex-shrink-0">{timeAgo(c.date)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
