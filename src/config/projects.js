export const PROJECTS_CONFIG = {
  githubUsername: "Sqrilizz",
  modrinthUsername: "Sqrilizz",

  customLogos: {
    SqrilizzLauncher: "/SLL.png",
  },

  excludeRepos: ["Sqrilizz", "sqrilizz", "ZovNew"],
  featuredProjects: [
    "lorgarctl",
    "ffind",
    "Client",
    "sqrilizz reports",
    "kindle-linux-chroot",
    "sqrilizz headcam",
  ],
};

const CACHE_PROJECTS_KEY = "sqrilizz_projects_cache";

const STATIC_GITHUB_FALLBACK = [
  {
    title: "lorgarctl",
    description:
      "Linux daemon, CLI controller & DKMS kernel driver for LORGAR MSA10W gaming mouse (native UPower battery, DPI, RGB, profile switching).",
    url: "https://github.com/Sqrilizz/lorgarctl",
    stars: 0,
    language: "Rust",
    topics: ["linux", "rust", "kernel-module", "dkms"],
    owner: "Sqrilizz",
    logo: "https://github.com/Sqrilizz.png",
    updatedAt: "2026-11-12T14:19:52Z",
    source: "github",
  },
  {
    title: "ffind",
    description:
      "High-performance multi-threaded file finder for Linux written in Rust.",
    url: "https://github.com/Sqrilizz/ffind",
    stars: 0,
    language: "Rust",
    topics: ["rust", "cli", "linux"],
    owner: "Sqrilizz",
    logo: "https://github.com/Sqrilizz.png",
    updatedAt: "2026-11-15T21:46:09Z",
    source: "github",
  },
  {
    title: "Client",
    description: "A Minecraft client written in Rust from scratch.",
    url: "https://github.com/Sqrilizz/Client",
    stars: 0,
    language: "Rust",
    topics: ["minecraft", "rust", "client"],
    owner: "Sqrilizz",
    logo: "https://github.com/Sqrilizz.png",
    updatedAt: "2026-11-11T18:18:51Z",
    source: "github",
  },
  {
    title: "SqrilizzLauncher",
    description:
      "Modern, blazing-fast Minecraft launcher, server manager, and ecosystem engineered in Rust.",
    url: "https://github.com/Sqrilizz/SqrilizzLauncher",
    stars: 3,
    language: "Rust",
    topics: ["minecraft", "launcher", "rust"],
    owner: "Sqrilizz",
    logo: "https://github.com/Sqrilizz.png",
    updatedAt: "2026-11-03T20:47:10Z",
    source: "github",
  },
  {
    title: "kindle-linux-chroot",
    description: "The best solution to create .ext3 files for your kindle.",
    url: "https://github.com/Sqrilizz/kindle-linux-chroot",
    stars: 5,
    language: "Shell",
    topics: ["kindle", "linux", "chroot"],
    owner: "Sqrilizz",
    logo: "https://github.com/Sqrilizz.png",
    updatedAt: "2026-11-09T19:33:35Z",
    source: "github",
  },
  {
    title: "Sqrilizz-Reports",
    description:
      "Minecraft plugin for player reporting via Telegram & Discord with webhook management and admin tools.",
    url: "https://github.com/Sqrilizz/Sqrilizz-Reports",
    stars: 4,
    language: "Java",
    topics: ["minecraft", "plugin", "spigot", "paper"],
    owner: "Sqrilizz",
    logo: "https://github.com/Sqrilizz.png",
    updatedAt: "2026-09-17T20:56:05Z",
    source: "github",
  },
];

async function fetchJson(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 7000);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

export const fetchAllGitHubRepos = async (username) => {
  try {
    const repos = await fetchJson(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`,
    );
    const mapped = repos
      .filter(
        (repo) =>
          !repo.fork && !PROJECTS_CONFIG.excludeRepos.includes(repo.name),
      )
      .map((repo) => ({
        title: repo.name,
        description: repo.description || "",
        url: repo.html_url,
        stars: repo.stargazers_count,
        language: repo.language,
        topics: repo.topics || [],
        owner: repo.owner.login,
        logo: repo.owner.avatar_url,
        updatedAt: repo.updated_at,
        source: "github",
      }));
    if (mapped.length > 0) return mapped;
    return STATIC_GITHUB_FALLBACK;
  } catch {
    return STATIC_GITHUB_FALLBACK;
  }
};

export const fetchAllModrinthProjects = async (username) => {
  try {
    const projects = await fetchJson(
      `https://api.modrinth.com/v2/user/${username}/projects`,
    );
    return projects.map((project) => ({
      title: project.title,
      description: project.description,
      url: `https://modrinth.com/project/${project.slug}`,
      modrinthUrl: `https://modrinth.com/project/${project.slug}`,
      downloads: project.downloads,
      followers: project.followers,
      categories: project.categories || [],
      logo: project.icon_url,
      updatedAt: project.updated || project.published,
      hasModrinth: true,
      source: "modrinth",
      tags: project.categories?.slice(0, 3) || [],
    }));
  } catch {
    return [];
  }
};

export const fetchAllProjects = async () => {
  try {
    const cached = localStorage.getItem(CACHE_PROJECTS_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (
        parsed &&
        Array.isArray(parsed.data) &&
        Date.now() - parsed.timestamp < 3600000
      ) {
        return parsed.data;
      }
    }
  } catch {}

  const [githubRepos, modrinthProjects] = await Promise.all([
    fetchAllGitHubRepos(PROJECTS_CONFIG.githubUsername),
    fetchAllModrinthProjects(PROJECTS_CONFIG.modrinthUsername),
  ]);

  const allProjects = [];

  for (const repo of githubRepos) {
    if (PROJECTS_CONFIG.customLogos[repo.title]) {
      repo.logo = PROJECTS_CONFIG.customLogos[repo.title];
    }

    const modrinthProject = modrinthProjects.find(
      (p) =>
        p.title.toLowerCase().includes(repo.title.toLowerCase()) ||
        repo.title.toLowerCase().includes(p.title.toLowerCase()),
    );

    if (modrinthProject) {
      repo.hasModrinth = true;
      repo.modrinthUrl = modrinthProject.url;
      repo.downloads = modrinthProject.downloads;
    }

    repo.tags = [repo.language, ...repo.topics.slice(0, 2)].filter(Boolean);
    allProjects.push(repo);
  }

  for (const project of modrinthProjects) {
    const existsInGithub = githubRepos.some(
      (repo) =>
        repo.title.toLowerCase().includes(project.title.toLowerCase()) ||
        project.title.toLowerCase().includes(repo.title.toLowerCase()),
    );

    if (!existsInGithub) {
      allProjects.push(project);
    }
  }

  allProjects.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  try {
    localStorage.setItem(
      CACHE_PROJECTS_KEY,
      JSON.stringify({ timestamp: Date.now(), data: allProjects }),
    );
  } catch {}

  return allProjects;
};

export const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
};
