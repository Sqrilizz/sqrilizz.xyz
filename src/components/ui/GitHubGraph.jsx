import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

function formatEvent(event) {
  const repo = event.repo?.name?.split("/")[1] || event.repo?.name;
  switch (event.type) {
    case "PushEvent": {
      const commits = event.payload?.commits || [];
      const lastCommit = commits[commits.length - 1];
      const msg = lastCommit?.message?.split("\n")[0]?.slice(0, 50);
      return {
        icon: "⬆",
        text: msg || `pushed to ${repo}`,
        repo: event.repo?.name,
      };
    }
    case "CreateEvent":
      return {
        icon: "+",
        text: `created ${event.payload?.ref_type} ${event.payload?.ref || ""}`,
        repo: event.repo?.name,
      };
    case "DeleteEvent":
      return {
        icon: "✕",
        text: `deleted ${event.payload?.ref_type} ${event.payload?.ref}`,
        repo: event.repo?.name,
      };
    case "WatchEvent":
      return { icon: "★", text: "starred", repo: event.repo?.name };
    case "ForkEvent":
      return { icon: "⑂", text: "forked", repo: event.repo?.name };
    case "IssuesEvent":
      return {
        icon: "●",
        text: `${event.payload?.action} issue`,
        repo: event.repo?.name,
      };
    case "PullRequestEvent":
      return {
        icon: "⇄",
        text: `${event.payload?.action} PR`,
        repo: event.repo?.name,
      };
    case "ReleaseEvent":
      return {
        icon: "◆",
        text: `released ${event.payload?.release?.tag_name}`,
        repo: event.repo?.name,
      };
    default:
      return null;
  }
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `${days}d`;
}

export default function GitHubGraph() {
  const [weeks, setWeeks] = useState([]);
  const [snake, setSnake] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCommits, setTotalCommits] = useState(0);
  const [weekCommits, setWeekCommits] = useState(0);
  const [topRepo, setTopRepo] = useState(null);
  const [events, setEvents] = useState([]);
  const [commits, setCommits] = useState([]);
  const [tooltip, setTooltip] = useState(null);
  const snakeIntervalRef = useRef(null);
  const snakeTimeoutRef = useRef(null);

  const ROWS = 7;
  const USERNAME = "Sqrilizz";

  useEffect(() => {
    fetch(`https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`)
      .then((r) => r.json())
      .then((data) => {
        const contributions = data.contributions || [];
        const grid = [];
        let weekArr = [];
        let total = 0;
        let thisWeek = 0;
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        contributions.forEach((day) => {
          total += day.count;
          if (new Date(day.date) >= weekAgo) thisWeek += day.count;
          weekArr.push({ count: day.count, date: day.date });
          if (weekArr.length === ROWS) {
            grid.push(weekArr);
            weekArr = [];
          }
        });
        if (weekArr.length > 0) {
          while (weekArr.length < ROWS) weekArr.push(0);
          grid.push(weekArr);
        }

        setTotalCommits(total);
        setWeekCommits(thisWeek);

        const last20 = grid.slice(-20);
        setWeeks(last20);
        setLoading(false);

        startSnake(last20);
      })
      .catch(() => setLoading(false));

    const headers = {};
    const ghToken = import.meta.env.VITE_GITHUB_TOKEN;
    if (ghToken) headers.Authorization = `token ${ghToken}`;

    fetch(
      `https://api.github.com/users/${USERNAME}/repos?sort=stars&per_page=1`,
      { headers },
    )
      .then((r) => r.json())
      .then((repos) => {
        if (Array.isArray(repos) && repos.length > 0) setTopRepo(repos[0]);
      })
      .catch(() => {});

    fetch(`https://api.github.com/users/${USERNAME}/events/public?per_page=5`, {
      headers,
    })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setEvents(data.slice(0, 5));
        const pushRepos = [
          ...new Set(
            (Array.isArray(data) ? data : [])
              .filter((e) => e.type === "PushEvent")
              .map((e) => e.repo?.name)
              .filter(Boolean),
          ),
        ].slice(0, 3);
        Promise.all(
          pushRepos.map((repo) =>
            fetch(`https://api.github.com/repos/${repo}/commits?per_page=3`, {
              headers,
            })
              .then((r) => r.json())
              .then((d) =>
                (Array.isArray(d) ? d : []).map((c) => ({
                  message: c.commit?.message?.split("\n")[0],
                  repo: repo.split("/")[1],
                  date: c.commit?.author?.date,
                })),
              )
              .catch(() => []),
          ),
        ).then((all) =>
          setCommits(
            all
              .flat()
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 5),
          ),
        );
      })
      .catch(() => {});

    return () => stopSnake();
  }, []);

  const stopSnake = () => {
    if (snakeIntervalRef.current) {
      clearInterval(snakeIntervalRef.current);
      snakeIntervalRef.current = null;
    }
    if (snakeTimeoutRef.current) {
      clearTimeout(snakeTimeoutRef.current);
      snakeTimeoutRef.current = null;
    }
  };

  const startSnake = (grid) => {
    stopSnake();
    if (!grid.length) return;

    const cols = grid.length;
    let pos = { x: 0, y: Math.floor(ROWS / 2) };
    let dir = { x: 1, y: 0 };
    let path = [{ ...pos }];
    let steps = 0;

    const visited = new Set();
    const key = (x, y) => `${x},${y}`;

    const isValid = (x, y) => x >= 0 && x < cols && y >= 0 && y < ROWS;
    const totalCells = cols * ROWS;

    const tick = () => {
      const dirs = [
        { x: dir.x, y: dir.y },
        { x: -dir.y, y: dir.x },
        { x: dir.y, y: -dir.x },
      ];

      let moved = false;
      for (const d of dirs) {
        const nx = pos.x + d.x;
        const ny = pos.y + d.y;
        if (isValid(nx, ny) && !visited.has(key(nx, ny))) {
          dir = d;
          pos = { x: nx, y: ny };
          moved = true;
          break;
        }
      }

      if (!moved) {
        for (const d of dirs) {
          const nx = pos.x + d.x;
          const ny = pos.y + d.y;
          if (isValid(nx, ny)) {
            dir = d;
            pos = { x: nx, y: ny };
            moved = true;
            break;
          }
        }
      }

      if (!moved) {
        stopSnake();
        setSnake([]);
        snakeTimeoutRef.current = setTimeout(() => startSnake(grid), 2000);
        return;
      }

      visited.add(key(pos.x, pos.y));
      steps++;

      path = [...path, { ...pos }].slice(-6);
      setSnake([...path]);

      if (steps >= totalCells) {
        stopSnake();
        setSnake([]);
        snakeTimeoutRef.current = setTimeout(() => startSnake(grid), 2000);
      }
    };

    snakeIntervalRef.current = setInterval(tick, 120);
  };

  const getColor = (count) => {
    if (count === 0) return "bg-zinc-800/60";
    if (count <= 2) return "bg-emerald-900/60";
    if (count <= 5) return "bg-emerald-700/70";
    if (count <= 10) return "bg-emerald-500/70";
    return "bg-emerald-400/80";
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isSnakeCell = (col, row) => {
    return snake.some((s) => s.x === col && s.y === row);
  };

  const getSnakeIndex = (col, row) => {
    return snake.findIndex((s) => s.x === col && s.y === row);
  };

  if (loading) return null;

  return (
    <div className="mt-2">
      <div className="flex items-center gap-4 mb-2 text-[11px]">
        <span className="text-zinc-500">
          <span className="text-white font-medium">
            {totalCommits.toLocaleString()}
          </span>{" "}
          commits
        </span>
        <span className="text-zinc-500">
          <span className="text-emerald-400 font-medium">{weekCommits}</span>{" "}
          this week
        </span>
        {topRepo && (
          <a
            href={topRepo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            top:{" "}
            <span className="text-violet-400 font-medium">{topRepo.name}</span>{" "}
            ★{topRepo.stargazers_count}
          </a>
        )}
      </div>
      <div className="flex gap-4">
        <div className="flex gap-[3px] flex-shrink-0">
          {weeks.map((week, col) => (
            <div key={col} className="flex flex-col gap-[3px]">
              {week.map((count, row) => {
                const isSnake = isSnakeCell(col, row);
                const snakeIdx = getSnakeIndex(col, row);
                const isHead = snakeIdx === snake.length - 1;

                return (
                  <div
                    key={row}
                    onMouseEnter={(e) =>
                      setTooltip({
                        count: count.count,
                        date: count.date,
                        x: e.clientX,
                        y: e.clientY,
                      })
                    }
                    onMouseLeave={() => setTooltip(null)}
                    onMouseMove={(e) =>
                      setTooltip((prev) =>
                        prev ? { ...prev, x: e.clientX, y: e.clientY } : null,
                      )
                    }
                    className={`w-[14px] h-[14px] rounded-[2px] transition-all duration-150 ${
                      isSnake
                        ? isHead
                          ? "bg-white scale-125"
                          : "bg-violet-400/80"
                        : getColor(count.count)
                    }`}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {events.length > 0 && (
          <div className="space-y-1.5 min-w-0 pt-0.5">
            {events
              .filter(
                (e) =>
                  Date.now() - new Date(e.created_at).getTime() <
                  7 * 24 * 60 * 60 * 1000,
              )
              .map((e, i) => {
                if (e.type === "PushEvent") {
                  const commit = commits.find(
                    (c) => c.repo === e.repo?.name?.split("/")[1],
                  );
                  if (commit) {
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-[11px]"
                      >
                        <span className="text-zinc-600 w-3 text-center flex-shrink-0">
                          ⬆
                        </span>
                        <span className="text-zinc-400 truncate">
                          {commit.message}
                        </span>
                        <a
                          href={`https://github.com/${USERNAME}/${commit.repo}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-zinc-600 hover:text-violet-400 transition-colors flex-shrink-0"
                        >
                          · {commit.repo}
                        </a>
                        <span className="text-zinc-700 ml-auto flex-shrink-0">
                          {timeAgo(e.created_at)}
                        </span>
                      </div>
                    );
                  }
                }
                const f = formatEvent(e);
                if (!f) return null;
                return (
                  <div key={i} className="flex items-center gap-2 text-[11px]">
                    <span className="w-3 text-center flex-shrink-0">
                      {f.icon}
                    </span>
                    <span className="text-zinc-500 truncate">{f.text}</span>
                    <a
                      href={`https://github.com/${f.repo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-600 hover:text-violet-400 transition-colors flex-shrink-0"
                    >
                      · {f.repo?.split("/")[1]}
                    </a>
                    <span className="text-zinc-700 ml-auto flex-shrink-0">
                      {timeAgo(e.created_at)}
                    </span>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {tooltip && (
        <div
          className="fixed z-50 px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-700/50 text-xs shadow-xl pointer-events-none"
          style={{
            left: tooltip.x + 12,
            top: tooltip.y - 28,
          }}
        >
          <span className="text-white font-medium">{tooltip.count}</span>
          <span className="text-zinc-400">
            {" "}
            {tooltip.count === 1 ? "contribution" : "contributions"} on{" "}
          </span>
          <span className="text-zinc-300">{formatDate(tooltip.date)}</span>
        </div>
      )}
    </div>
  );
}