import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useAge } from "../../hooks/useAge";
import DiscordPresence from "../ui/DiscordPresence";

const skills = [
  "React",
  "TypeScript",
  "JavaScript",
  "Python",
  "Rust",
  "Java",
  "Node.js",
  "Tailwind CSS",
  "Docker",
  "Git",
  "Kotlin",
  "Vite",
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5 },
};

export default function AboutSection() {
  const { t } = useTranslation();
  const age = useAge("2011-07-09");

  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          className="text-2xl font-semibold text-white mb-10"
          {...fadeUp}
        >
          {t("aboutTitle")}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          <motion.div className="md:col-span-3 space-y-4" {...fadeUp}>
            <p className="text-zinc-400 leading-relaxed">
              {t("aboutP1", { age: Math.floor(age) })}
            </p>
            <p className="text-zinc-400 leading-relaxed">{t("aboutP2")}</p>

            <p className="text-xs text-zinc-600 font-mono pt-1 group relative cursor-help">
              {age.toFixed(8)} {t("yearsAlive")}
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-700/50 text-[11px] text-zinc-400 shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                July 9
              </span>
            </p>

            <div className="flex flex-wrap gap-2 pt-4">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 text-xs rounded-full bg-zinc-900 border border-zinc-800/80 text-zinc-400 select-none"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="md:col-span-2"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-xs text-zinc-600 uppercase tracking-wider mb-3">
              {t("currentlyDoing")}
            </p>
            <DiscordPresence />
          </motion.div>
        </div>
      </div>
    </section>
  );
}