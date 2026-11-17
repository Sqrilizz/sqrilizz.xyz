import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  SiArchlinux,
  SiKde,
  SiZedindustries,
  SiVscodium,
  SiGit,
  SiDocker,
  SiNotion,
  SiTelegram,
  SiSteam,
  SiTypescript,
  SiPython,
  SiRust,
  SiJavascript,
  SiReact,
  SiNodedotjs,
  SiTailwindcss,
  SiKotlin,
  SiVite,
  SiNvidia,
} from "react-icons/si";
import {
  FaJava,
  FaLaptop,
  FaMicrochip,
  FaMemory,
  FaHdd,
  FaTabletAlt,
} from "react-icons/fa";

function HeliumIcon({ size = 14, className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
    >
      <path
        fill="currentColor"
        d="M14.308 22.298L12 24l-2.308-1.702l1.049-8.118l-6.518 4.966L1.593 18l.322-2.847L9.48 12L1.915 8.847L1.594 6l2.63-1.146l6.517 4.967L9.69 1.7L12 0l2.308 1.702L13.26 9.82l6.518-4.967L22.407 6l-.322 2.847L14.52 12l7.566 3.153l.321 2.847l-2.63 1.146l-6.517-4.966z"
      />
    </svg>
  );
}

const hardware = [
  {
    icon: FaLaptop,
    name: "ASUS TUF Gaming",
    tag: "laptop",
    href: "https://www.asus.com/uk/laptops/for-gaming/tuf-gaming/2021-asus-tuf-gaming-f15/",
  },
  { icon: FaMicrochip, name: "i5-11400H", tag: "cpu" },
  { icon: SiNvidia, name: "RTX 3050", tag: "gpu" },
  { icon: FaMemory, name: "16 GB DDR4", tag: "ram" },
  { icon: FaHdd, name: "NVMe SSD", tag: "storage" },
  {
    icon: FaTabletAlt,
    name: "Kindle 10th Gen",
    tag: "chroot",
    href: "https://github.com/sqrilizz/kindle-linux-chroot",
  },
];

const software = [
  {
    icon: SiArchlinux,
    name: "CachyOS",
    tag: "os",
    href: "https://cachyos.org",
  },
  { icon: SiKde, name: "KDE Plasma", tag: "de", href: "https://kde.org" },
  {
    icon: SiZedindustries,
    name: "Zed",
    tag: "editor",
    href: "https://zed.dev",
  },
  {
    icon: SiVscodium,
    name: "VS Code",
    tag: "editor",
    href: "https://code.visualstudio.com",
  },
  {
    icon: SiDocker,
    name: "Docker",
    tag: "containers",
    href: "https://www.docker.com",
  },
  { icon: SiGit, name: "Git", tag: "vcs", href: "https://git-scm.com" },
  { icon: HeliumIcon, name: "Helium", tag: "browser" },
  { icon: SiNotion, name: "Notion", tag: "notes", href: "https://notion.so" },
  {
    icon: SiTelegram,
    name: "Telegram",
    tag: "chat",
    href: "https://telegram.org",
  },
  {
    icon: SiSteam,
    name: "Steam",
    tag: "gaming",
    href: "https://store.steampowered.com",
  },
];

const languages = [
  { icon: SiRust, name: "Rust", tag: "systems" },
  { icon: SiTypescript, name: "TypeScript", tag: "typed" },
  { icon: SiReact, name: "React", tag: "ui" },
  { icon: SiPython, name: "Python", tag: "scripts" },
  { icon: FaJava, name: "Java", tag: "backend" },
  { icon: SiKotlin, name: "Kotlin", tag: "android" },
  { icon: SiJavascript, name: "JavaScript", tag: "web" },
  { icon: SiNodedotjs, name: "Node.js", tag: "runtime" },
  { icon: SiTailwindcss, name: "Tailwind CSS", tag: "styling" },
  { icon: SiVite, name: "Vite", tag: "build" },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.4 },
};

export default function SetupSection() {
  const { t } = useTranslation();

  const categories = [
    { title: t("setupHardware"), items: hardware },
    { title: t("setupSoftware"), items: software },
    { title: t("setupLanguages"), items: languages },
  ];

  return (
    <section id="setup" className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div {...fadeUp} className="mb-8">
          <h2 className="text-2xl font-semibold text-white">
            {t("setupTitle")}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat, ci) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: ci * 0.06 }}
            >
              <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 mb-3">
                {cat.title}
              </p>
              <div className="space-y-1.5">
                {cat.items.map((item) => {
                  const Tag = item.href ? "a" : "div";
                  const linkProps = item.href
                    ? {
                        href: item.href,
                        target: "_blank",
                        rel: "noopener noreferrer",
                      }
                    : {};
                  return (
                    <Tag
                      key={item.name}
                      {...linkProps}
                      className={`group flex items-center justify-between px-3 py-2 rounded-lg bg-zinc-900/40 border border-zinc-800/50 ${
                        item.href
                          ? "hover:border-zinc-700 hover:bg-zinc-900/70 transition-all cursor-pointer"
                          : "hover:border-zinc-800/80 transition-colors"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <item.icon
                          className="text-zinc-500 group-hover:text-zinc-300 flex-shrink-0 transition-colors"
                          size={14}
                        />
                        <span className="text-zinc-300 group-hover:text-white text-xs font-medium truncate transition-colors">
                          {item.name}
                        </span>
                      </div>
                      {item.tag && (
                        <span className="text-[10px] font-mono text-zinc-600 group-hover:text-zinc-400 flex-shrink-0 ml-2 transition-colors">
                          {item.tag}
                        </span>
                      )}
                    </Tag>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
