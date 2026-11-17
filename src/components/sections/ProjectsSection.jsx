import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGithub, FaStar, FaDownload, FaCode, FaCube } from "react-icons/fa";
import { SiModrinth } from "react-icons/si";
import { LayoutList, Rows3, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { fetchAllProjects, formatNumber } from "../../config/projects";

const langColors = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Java: "#b07219",
  Rust: "#dea584",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Kotlin: "#A97BFF",
  Shell: "#89e051",
};

function ProjectCard({ project }) {
  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex-shrink-0 w-72 rounded-xl bg-zinc-900/40 border border-zinc-800/70 p-4 hover:border-zinc-700 hover:bg-zinc-900/60 transition-all duration-200"
    >
      <div className="flex items-center gap-3 mb-2">
        <img
          src={project.logo}
          alt={project.title}
          className="w-8 h-8 rounded-lg flex-shrink-0"
          onError={(e) => {
            e.target.src = "https://github.com/Sqrilizz.png";
          }}
        />
        <div className="min-w-0">
          <h3 className="text-white font-medium text-sm truncate group-hover:text-violet-300 transition-colors">
            {project.title}
          </h3>
          {project.language && (
            <span className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-mono">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: langColors[project.language] || "#666",
                }}
              />
              {project.language}
            </span>
          )}
        </div>
      </div>
      <p className="text-zinc-400 text-xs leading-relaxed line-clamp-2 mb-3">
        {project.description}
      </p>
      <div className="flex items-center gap-3 text-xs text-zinc-500 font-mono">
        {project.stars > 0 && (
          <span className="flex items-center gap-1">
            <FaStar size={10} className="text-amber-400/80" />{" "}
            {formatNumber(project.stars)}
          </span>
        )}
        {project.downloads > 0 && (
          <span className="flex items-center gap-1">
            <FaDownload size={9} /> {formatNumber(project.downloads)}
          </span>
        )}
        <div className="flex items-center gap-1.5 ml-auto">
          {project.source === "github" && (
            <FaGithub
              className="text-zinc-600 group-hover:text-zinc-400 transition-colors"
              size={13}
            />
          )}
          {project.hasModrinth && (
            <SiModrinth
              className="text-zinc-600 group-hover:text-emerald-400 transition-colors"
              size={13}
            />
          )}
        </div>
      </div>
    </a>
  );
}

function ProjectListItem({ project }) {
  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block p-4 rounded-xl bg-zinc-900/30 border border-zinc-800/60 hover:border-zinc-700/80 hover:bg-zinc-900/50 transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={project.logo}
            alt={project.title}
            className="w-8 h-8 rounded-lg flex-shrink-0"
            onError={(e) => {
              e.target.src = "https://github.com/Sqrilizz.png";
            }}
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-white font-medium text-sm truncate group-hover:text-violet-300 transition-colors">
                {project.title}
              </h3>
            </div>
            {project.language && (
              <span className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-mono">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: langColors[project.language] || "#666",
                  }}
                />
                {project.language}
              </span>
            )}
          </div>
        </div>
        <ExternalLink
          size={13}
          className="text-zinc-600 group-hover:text-zinc-400 transition-colors flex-shrink-0 mt-1"
        />
      </div>

      <p className="text-zinc-400 text-xs leading-relaxed line-clamp-2 mb-3">
        {project.description}
      </p>

      <div className="flex items-center justify-between gap-3 pt-2 border-t border-zinc-800/40 text-xs text-zinc-500 font-mono">
        <div className="flex items-center gap-3">
          {project.stars > 0 && (
            <span className="flex items-center gap-1">
              <FaStar size={10} className="text-amber-400/80" />{" "}
              {formatNumber(project.stars)}
            </span>
          )}
          {project.downloads > 0 && (
            <span className="flex items-center gap-1">
              <FaDownload size={9} /> {formatNumber(project.downloads)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {project.source === "github" && (
            <FaGithub
              className="text-zinc-600 group-hover:text-zinc-400 transition-colors"
              size={13}
            />
          )}
          {project.hasModrinth && (
            <SiModrinth
              className="text-zinc-600 group-hover:text-emerald-400 transition-colors"
              size={13}
            />
          )}
        </div>
      </div>
    </a>
  );
}

function MarqueeRow({ items, direction }) {
  const doubled = [...items, ...items];
  const animDir = direction === "left" ? "marquee-left" : "marquee-right";

  return (
    <div className="overflow-hidden mb-3 [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] w-full">
      <div
        className={`flex gap-3 w-max animate-${animDir} hover:[animation-play-state:paused]`}
      >
        {doubled.map((project, i) => (
          <ProjectCard key={project.title + i} project={project} />
        ))}
      </div>
    </div>
  );
}

export default function ProjectsSection() {
  const { t } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState(() => {
    try {
      return localStorage.getItem("projects_view_mode") || "carousel";
    } catch {
      return "carousel";
    }
  });

  useEffect(() => {
    fetchAllProjects().then((data) => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  const handleToggleView = () => {
    const next = viewMode === "carousel" ? "list" : "carousel";
    setViewMode(next);
    try {
      localStorage.setItem("projects_view_mode", next);
    } catch {}
  };

  const mid = Math.ceil(projects.length / 2);
  const row1 = projects.slice(0, mid);
  const row2 = projects.slice(mid);

  const totalStars = projects.reduce((sum, p) => sum + (p.stars || 0), 0);
  const totalDownloads = projects.reduce(
    (sum, p) => sum + (p.downloads || 0),
    0,
  );

  const stats = [
    { icon: FaCode, label: t("repos"), value: projects.length },
    { icon: FaStar, label: t("stars"), value: totalStars },
    { icon: FaDownload, label: t("downloads"), value: totalDownloads },
    {
      icon: FaCube,
      label: t("languages"),
      value: [...new Set(projects.map((p) => p.language).filter(Boolean))]
        .length,
    },
  ];

  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <motion.h2
            className="text-2xl font-semibold text-white"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            {t("projectsTitle")}
          </motion.h2>

          {!loading && (
            <button
              type="button"
              onClick={handleToggleView}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-800/60 text-xs font-mono text-zinc-300 hover:text-white transition-all cursor-pointer shadow-sm select-none"
            >
              {viewMode === "carousel" ? (
                <>
                  <LayoutList size={13} className="text-zinc-400" />
                  <span>{t("projectsViewList")}</span>
                </>
              ) : (
                <>
                  <Rows3 size={13} className="text-zinc-400" />
                  <span>{t("projectsViewCarousel")}</span>
                </>
              )}
            </button>
          )}
        </div>

        {loading ? (
          <p className="text-zinc-600 text-sm">{t("loading")}</p>
        ) : (
          <>
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4 }}
            >
              {stats.map((s, i) => (
                <div
                  key={i}
                  className="rounded-xl bg-zinc-900/40 border border-zinc-800/70 px-4 py-3 flex items-center gap-3"
                >
                  <s.icon className="text-zinc-600" size={14} />
                  <div>
                    <p className="text-white text-lg font-semibold leading-tight">
                      {formatNumber(s.value)}
                    </p>
                    <p className="text-zinc-600 text-[11px]">{s.label}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            <AnimatePresence mode="wait">
              {viewMode === "carousel" ? (
                <motion.div
                  key="carousel"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <MarqueeRow items={row1} direction="left" />
                  <MarqueeRow items={row2} direction="right" />
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-3"
                >
                  {projects.map((project) => (
                    <ProjectListItem key={project.title} project={project} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </section>
  );
}
