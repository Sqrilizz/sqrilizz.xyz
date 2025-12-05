// Конфигурация проектов для портфолио

// API конфигурация
export const API_CONFIG = {
  modrinth: {
    baseUrl: 'https://api.modrinth.com/v2',
    userId: 'Sqrilizz', // Твой Modrinth username
    token: import.meta.env.VITE_MODRINTH_TOKEN || null, // Опционально: Modrinth API token
  },
  github: {
    baseUrl: 'https://api.github.com',
    username: 'sqrilizz',
    token: import.meta.env.VITE_GITHUB_TOKEN || null, // Опционально: GitHub PAT для увеличения rate limit
  }
}

// Статические проекты (не из API)
export const STATIC_PROJECTS = [
  {
    id: 'portfolio',
    title: 'Personal Portfolio',
    description: 'Modern interactive portfolio with Discord integration, music player, and real-time activity tracking',
    image: '/projects/portfolio.png',
    tags: ['React', 'Vite', 'Tailwind CSS', 'Framer Motion'],
    github: 'https://github.com/sqrilizz/ZovNew',
    demo: 'https://sqrilizz.xyz',
    featured: true,
    category: 'web',
    source: 'static'
  },
  // Добавь свои статические проекты здесь
]

export const CATEGORIES = {
  all: { label: 'All Projects', icon: '📦' },
  web: { label: 'Web Development', icon: '🌐' },
  minecraft: { label: 'Minecraft Mods', icon: '🎮' },
  ai: { label: 'AI & ML', icon: '🤖' },
  design: { label: 'Design', icon: '🎨' }
}

// Функция для получения проектов с Modrinth
export const fetchModrinthProjects = async (userId = API_CONFIG.modrinth.userId) => {
  try {
    const headers = {
      'Accept': 'application/json'
    }
    
    // Добавляем токен если есть
    if (API_CONFIG.modrinth.token) {
      headers['Authorization'] = API_CONFIG.modrinth.token
    }
    
    const response = await fetch(`${API_CONFIG.modrinth.baseUrl}/user/${userId}/projects`, { headers })
    
    if (!response.ok) {
      throw new Error(`Modrinth API error: ${response.status}`)
    }
    
    const projects = await response.json()
    
    return {
      success: true,
      data: projects.map(project => ({
        id: `modrinth-${project.id}`,
        title: project.title,
        description: project.description,
        image: project.icon_url || project.gallery?.[0]?.url,
        tags: [
          ...project.categories,
          ...project.loaders,
          ...(project.game_versions?.slice(0, 2) || [])
        ].slice(0, 6),
        github: project.source_url,
        demo: `https://modrinth.com/${project.project_type}/${project.slug}`,
        featured: project.slug === 'sqrilizz-report', // Только Sqrilizz | Report
        category: 'minecraft',
        source: 'modrinth',
        stats: {
          downloads: project.downloads,
          followers: project.followers
        }
      }))
    }
  } catch (error) {
    console.error('Failed to fetch Modrinth projects:', error)
    return { success: false, error: error.message, data: [] }
  }
}

// Функция для получения репозиториев с GitHub
export const fetchGitHubRepos = async (username = API_CONFIG.github.username) => {
  try {
    const headers = {
      'Accept': 'application/vnd.github.v3+json'
    }
    
    // Добавляем токен если есть
    if (API_CONFIG.github.token) {
      headers['Authorization'] = `token ${API_CONFIG.github.token}`
    }
    
    const response = await fetch(
      `${API_CONFIG.github.baseUrl}/users/${username}/repos?sort=updated&per_page=20`,
      { headers }
    )
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }
    
    const repos = await response.json()
    
    // Фильтруем только форки, оставляем все остальные репозитории
    const filteredRepos = repos.filter(repo => !repo.fork)
    
    return {
      success: true,
      data: filteredRepos.map(repo => ({
        id: `github-${repo.id}`,
        title: repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        description: repo.description || 'No description provided',
        image: repo.owner.avatar_url,
        tags: [
          repo.language,
          ...(repo.topics?.slice(0, 4) || [])
        ].filter(Boolean),
        github: repo.html_url,
        demo: repo.homepage,
        featured: repo.name.toLowerCase() === 'auryx-agent', // Только Auryx-Agent
        category: detectCategory(repo),
        source: 'github',
        stats: {
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          language: repo.language
        }
      }))
    }
  } catch (error) {
    console.error('Failed to fetch GitHub repos:', error)
    return { success: false, error: error.message, data: [] }
  }
}

// Вспомогательная функция для определения категории по репозиторию
function detectCategory(repo) {
  const name = repo.name.toLowerCase()
  const desc = (repo.description || '').toLowerCase()
  const topics = repo.topics || []
  
  // Специальные проекты
  if (name === 'auryx-agent') {
    return 'ai'
  }
  
  if (topics.includes('minecraft') || name.includes('minecraft') || desc.includes('minecraft')) {
    return 'minecraft'
  }
  if (topics.includes('ai') || topics.includes('ml') || name.includes('ai') || desc.includes('machine learning') || name.includes('agent')) {
    return 'ai'
  }
  if (repo.language === 'JavaScript' || repo.language === 'TypeScript' || topics.includes('react') || topics.includes('vue')) {
    return 'web'
  }
  if (topics.includes('design') || name.includes('design')) {
    return 'design'
  }
  
  return 'web' // По умолчанию
}

// Функция для получения всех проектов
export const fetchAllProjects = async () => {
  try {
    const [modrinthResult, githubResult] = await Promise.all([
      fetchModrinthProjects(),
      fetchGitHubRepos()
    ])
    
    const allProjects = [
      ...STATIC_PROJECTS,
      ...(modrinthResult.data || []),
      ...(githubResult.data || [])
    ]
    
    // Удаляем дубликаты по названию
    const uniqueProjects = allProjects.reduce((acc, project) => {
      const exists = acc.find(p => 
        p.title.toLowerCase() === project.title.toLowerCase()
      )
      if (!exists) {
        acc.push(project)
      }
      return acc
    }, [])
    
    return {
      success: true,
      data: uniqueProjects
    }
  } catch (error) {
    console.error('Failed to fetch all projects:', error)
    return {
      success: false,
      error: error.message,
      data: STATIC_PROJECTS // Возвращаем хотя бы статические проекты
    }
  }
}

// Утилита для форматирования чисел (1000 -> 1k)
export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}
