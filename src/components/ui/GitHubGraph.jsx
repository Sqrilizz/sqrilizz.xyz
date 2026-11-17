import { useState, useEffect, useRef } from "react";

const USERNAME = "Sqrilizz";
const ROWS = 7;
const CACHE_COMMITS_KEY = "github_recent_commits_v6";
const CACHE_TTL_MS = 60 * 60 * 1000;

const REAL_FALLBACK_COMMITS = [
  {
    repo: "ffind",
    message: "chore: AUR PKGBUILDs for ffind-rs and ffind-rs-bin",
    date: "2026-11-15T21:46:08Z",
    url: "https://github.com/Sqrilizz/ffind",
  },
  {
    repo: "ffind",
    message: "fix: exclude unpacked dirs from release artifact upload",
    date: "2026-11-15T21:41:28Z",
    url: "https://github.com/Sqrilizz/ffind",
  },
  {
    repo: "lorgarctl",
    message: "chore(deps): bump cc (#10)",
    date: "2026-11-12T14:19:51Z",
    url: "https://github.com/Sqrilizz/lorgarctl",
  },
  {
    repo: "Client",
    message: "end the click on a bed (#905)",
    date: "2026-11-11T13:36:11Z",
    url: "https://github.com/Sqrilizz/Client",
  },
  {
    repo: "pomme-website",
    message: "Fix 404 runner canvas: add asset cache busting",
    date: "2026-11-10T18:52:47Z",
    url: "https://github.com/Sqrilizz/pomme-website",
  },
  {
    repo: "kindle-linux-chroot",
    message: "Update README.md",
    date: "2026-11-09T19:33:35Z",
    url: "https://github.com/Sqrilizz/kindle-linux-chroot",
  },
  {
    repo: "SqrilizzLauncher",
    message: "chore: release v1.0.7 (stability and bugfix release)",
    date: "2026-10-27T18:29:08Z",
    url: "https://github.com/Sqrilizz/SqrilizzLauncher",
  },
];

function getCachedCommits() {
  try {
    const raw = localStorage.getItem(CACHE_COMMITS_KEY);
    if (!raw) return null;
    const { timestamp, data } = JSON.parse(raw);
    if (Date.now() - timestamp > CACHE_TTL_MS) return null;
    return data;
  } catch {
    return null;
  }
}

function setCachedCommits(data) {
  try {
    localStorage.setItem(
      CACHE_COMMITS_KEY,
      JSON.stringify({ timestamp: Date.now(), data }),
    );
  } catch {}
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
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
  const [commits, setCommits] = useState(REAL_FALLBACK_COMMITS);
  const [tooltip, setTooltip] = useState(null);
  const snakeIntervalRef = useRef(null);
  const snakeTimeoutRef = useRef(null);

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
          while (weekArr.length < ROWS) weekArr.push({ count: 0, date: "" });
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

    fetch(`https://api.github.com/users/${USERNAME}/repos?sort=stars&per_page=1`)
      .then((r) => r.json())
      .then((repos) => {
        if (Array.isArray(repos) && repos.length > 0) setTopRepo(repos[0]);
      })
      .catch(() => {});

    const cached = getCachedCommits();
    if (cached && Array.isArray(cached) && cached.length > 0) {
      setCommits(cached);
    } else {
      fetch(`https://api.github.com/users/${USERNAME}/events/public?per_page=30`)
        .then((r) => {
          if (!r.ok) throw new Error("Events API error");
          return r.json();
        })
        .then((events) => {
          if (!Array.isArray(events)) return;
          const pushRepos = [
            ...new Set(
              events
                .filter((e) => e.type === "PushEvent")
                .map((e) => e.repo?.name)
                .filter(Boolean),
            ),
          ].slice(0, 4);

          if (pushRepos.length === 0) return;

          Promise.all(
            pushRepos.map((repoFullName) =>
              fetch(`https://api.github.com/repos/${repoFullName}/commits?per_page=3`)
                .then((r) => r.json())
                .then((list) =>
                  (Array.isArray(list) ? list : []).map((c) => ({
                    repo: repoFullName.split("/")[1] || repoFullName,
                    message: (c.commit?.message || "").split("\n")[0] || "update",
                    date: c.commit?.author?.date || c.commit?.committer?.date,
                    url: c.html_url || `https://github.com/${repoFullName}/commit/${c.sha}`,
                  })),
                )
                .catch(() => []),
            ),
          ).then((results) => {
            const all = results
              .flat()
              .filter((c) => c && c.message && c.date)
              .sort((a, b) => new Date(b.date) - new Date(a.date));

            if (all.length > 0) {
              const sliced = all.slice(0, 6);
              setCommits(sliced);
              setCachedCommits(sliced);
            }
          });
        })
        .catch(() => {});
    }

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
    if (!dateStr) return "";
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

  if (loading && weeks.length === 0) return null;

  return (
    <div className="mt-2 w-full">
      <div className="flex items-center gap-4 mb-2 text-[11px] flex-wrap">
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
            <span className="text-emerald-400 font-medium">{topRepo.name}</span>{" "}
            ★{topRepo.stargazers_count}
          </a>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div className="flex gap-[3px] flex-shrink-0 overflow-x-auto max-w-full pb-1">
          {weeks.map((week, col) => (
            <div key={col} className="flex flex-col gap-[3px]">
              {week.map((cell, row) => {
                const isSnake = isSnakeCell(col, row);
                const snakeIdx = getSnakeIndex(col, row);
                const isHead = snakeIdx === snake.length - 1;

                return (
                  <div
                    key={row}
                    onMouseEnter={(e) =>
                      cell.date &&
                      setTooltip({
                        count: cell.count,
                        date: cell.date,
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
                    className={`w-[14px] h-[14px] rounded-[2px] transition-all duration-150 cursor-pointer ${
                      isSnake
                        ? isHead
                          ? "bg-white scale-125"
                          : "bg-emerald-400"
                        : getColor(cell.count)
                    }`}
                  />
                );
              })}
            </div>
          ))}
        </div>

        <div className="space-y-1.5 min-w-0 flex-1 pt-0.5 w-full">
          {commits.slice(0, 4).map((c, i) => (
            <div key={i} className="flex items-center gap-2 text-[11px]">
              <span className="text-zinc-600 w-3 text-center flex-shrink-0">
                ⬆
              </span>
              <span className="text-zinc-300 truncate max-w-[200px] sm:max-w-[240px]">
                {c.message}
              </span>
              <a
                href={c.url || `https://github.com/${USERNAME}/${c.repo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-emerald-400 transition-colors flex-shrink-0"
              >
                · {c.repo}
              </a>
              <span className="text-zinc-600 ml-auto flex-shrink-0">
                {timeAgo(c.date)}
              </span>
            </div>
          ))}
        </div>
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
