export const PROJECTS_CONFIG = {
  githubUsername: 'Sqrilizz',
  modrinthUsername: 'Sqrilizz',
  modrinthToken: import.meta.env.VITE_MODRINTH_TOKEN || '',
  
  customLogos: {
    'SqrilizzLauncher': '/SLL.png'
  },
  
  excludeRepos: ['Sqrilizz', 'sqrilizz', 'ZovNew']
}

export const fetchAllGitHubRepos = async (username) => {
  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`)
    if (!response.ok) throw new Error('GitHub API error')
    
    const repos = await response.json()
    
    return repos
      .filter(repo => !repo.fork && !PROJECTS_CONFIG.excludeRepos.includes(repo.name))
      .map(repo => ({
        title: repo.name,
        description: repo.description || 'No description available',
        url: repo.html_url,
        stars: repo.stargazers_count,
        language: repo.language,
        topics: repo.topics || [],
        owner: repo.owner.login,
        logo: repo.owner.avatar_url,
        updatedAt: repo.updated_at,
        source: 'github'
      }))
  } catch (error) {
    console.error('Failed to fetch GitHub repos:', error)
    return []
  }
}

export const fetchAllModrinthProjects = async (username) => {
  try {
    const response = await fetch(`https://api.modrinth.com/v2/user/${username}/projects`, {
      headers: {
        'Authorization': PROJECTS_CONFIG.modrinthToken,
        'User-Agent': 'Sqrilizz-Portfolio/1.0'
      }
    })
    
    if (!response.ok) {
      console.error(`Modrinth API error: ${response.status}`)
      return []
    }
    
    const projects = await response.json()
    
    return projects.map(project => ({
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
      source: 'modrinth',
      tags: project.categories?.slice(0, 3) || []
    }))
  } catch (error) {
    console.error('Failed to fetch Modrinth projects:', error)
    return []
  }
}

export const fetchGitHubRepo = async (repo) => {
  try {
    const response = await fetch(`https://api.github.com/repos/${repo}`)
    if (!response.ok) throw new Error('GitHub API error')
    
    const data = await response.json()
    
    return {
      title: data.name,
      description: data.description || 'No description available',
      url: data.html_url,
      stars: data.stargazers_count,
      language: data.language,
      topics: data.topics || [],
      owner: data.owner.login,
      logo: data.owner.avatar_url,
      updatedAt: data.updated_at,
      source: 'github'
    }
  } catch (error) {
    console.error(`Failed to fetch GitHub repo ${repo}:`, error)
    return null
  }
}

export const fetchModrinthProject = async (slug) => {
  try {
    const response = await fetch(`https://api.modrinth.com/v2/project/${slug}`, {
      headers: {
        'Authorization': PROJECTS_CONFIG.modrinthToken,
        'User-Agent': 'Sqrilizz-Portfolio/1.0'
      }
    })
    
    if (!response.ok) {
      console.error(`Modrinth API error: ${response.status}`)
      return null
    }
    
    const data = await response.json()
    
    return {
      title: data.title,
      description: data.description,
      url: `https://modrinth.com/project/${data.slug}`,
      modrinthUrl: `https://modrinth.com/project/${data.slug}`,
      downloads: data.downloads,
      followers: data.followers,
      categories: data.categories || [],
      logo: data.icon_url,
      hasModrinth: true,
      source: 'modrinth',
      tags: data.categories?.slice(0, 3) || []
    }
  } catch (error) {
    console.error(`Failed to fetch Modrinth project ${slug}:`, error)
    return null
  }
}

export const fetchAllProjects = async () => {
  const [githubRepos, modrinthProjects] = await Promise.all([
    fetchAllGitHubRepos(PROJECTS_CONFIG.githubUsername),
    fetchAllModrinthProjects(PROJECTS_CONFIG.modrinthUsername)
  ])
  
  const allProjects = []
  
  for (const repo of githubRepos) {
    if (PROJECTS_CONFIG.customLogos[repo.title]) {
      repo.logo = PROJECTS_CONFIG.customLogos[repo.title]
    }
    
    const modrinthProject = modrinthProjects.find(p => 
      p.title.toLowerCase().includes(repo.title.toLowerCase()) ||
      repo.title.toLowerCase().includes(p.title.toLowerCase())
    )
    
    if (modrinthProject) {
      repo.hasModrinth = true
      repo.modrinthUrl = modrinthProject.url
      repo.downloads = modrinthProject.downloads
    }
    
    repo.tags = [repo.language, ...repo.topics.slice(0, 2)].filter(Boolean)
    allProjects.push(repo)
  }
  
  for (const project of modrinthProjects) {
    const existsInGithub = githubRepos.some(repo => 
      repo.title.toLowerCase().includes(project.title.toLowerCase()) ||
      project.title.toLowerCase().includes(repo.title.toLowerCase())
    )
    
    if (!existsInGithub) {
      allProjects.push(project)
    }
  }
  
  allProjects.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
  return allProjects
}

export const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}
