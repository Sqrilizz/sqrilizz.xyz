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
  FaTablet,
} from "react-icons/fa";

function HeliumIcon({ size, className }) {
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
    href: "https://www.asus.com/uk/laptops/for-gaming/tuf-gaming/2021-asus-tuf-gaming-f15/",
  },
  { icon: FaMicrochip, name: "i5-11400H" },
  { icon: SiNvidia, name: "RTX 3050" },
  { icon: FaMemory, name: "16 GB DDR4" },
  { icon: FaHdd, name: "NVMe SSD" },
  { icon: FaTablet, name: "Kindle 10th Gen" },
];

const software = [
  { icon: SiArchlinux, name: "CachyOS" },
  { icon: SiKde, name: "KDE" },
  { icon: SiZedindustries, name: "Zed" },
  { icon: SiVscodium, name: "VS Code" },
  { icon: SiGit, name: "Git" },
  { icon: SiDocker, name: "Docker" },
  { icon: HeliumIcon, name: "Helium" },
  { icon: SiNotion, name: "Notion" },
  { icon: SiTelegram, name: "Telegram" },
  { icon: SiSteam, name: "Steam" },
];

const languages = [
  { icon: SiTypescript, name: "TypeScript" },
  { icon: SiReact, name: "React" },
  { icon: SiPython, name: "Python" },
  { icon: SiRust, name: "Rust" },
  { icon: FaJava, name: "Java" },
  { icon: SiKotlin, name: "Kotlin" },
  { icon: SiJavascript, name: "JavaScript" },
  { icon: SiNodedotjs, name: "Node.js" },
  { icon: SiTailwindcss, name: "Tailwind CSS" },
  { icon: SiVite, name: "Vite" },
];

export default function SetupSection() {
  const { t } = useTranslation();

  const categories = [
    { title: t("setupHardware"), items: hardware },
    { title: t("setupSoftware"), items: software },
    { title: t("setupLanguages"), items: languages },
  ];

  return (
    <section id="setup" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          className="text-2xl font-semibold text-white mb-10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          {t("setupTitle")}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat, ci) => (
            <motion.div
              key={ci}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: ci * 0.08 }}
            >
              <p className="text-xs text-zinc-600 uppercase tracking-wider mb-4">
                {cat.title}
              </p>
              <div className="space-y-2">
                {cat.items.map((item, i) => {
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
                      key={i}
                      {...linkProps}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg bg-zinc-900/40 border border-zinc-800/50 ${item.href ? "hover:border-zinc-700 hover:bg-zinc-900/60 transition-all cursor-pointer" : ""}`}
                    >
                      <item.icon
                        className="text-zinc-500 flex-shrink-0"
                        size={15}
                      />
                      <span className="text-zinc-300 text-sm">{item.name}</span>
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