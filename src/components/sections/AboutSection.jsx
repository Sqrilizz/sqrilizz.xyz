import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useAge } from "../../hooks/useAge";
import DiscordPresence from "../ui/DiscordPresence";

const skills = [
  "Rust",
  "Kotlin",
  "Java",
  "TypeScript",
  "React",
  "Linux / Arch",
  "Python",
  "Docker",
  "Git",
  "Vite",
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.4 },
};

export default function AboutSection() {
  const { t } = useTranslation();
  const age = useAge("2011-07-09");

  return (
    <section id="about" className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          className="text-2xl font-semibold text-white mb-8"
          {...fadeUp}
        >
          {t("aboutTitle")}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
          <motion.div className="md:col-span-3 space-y-4" {...fadeUp}>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              {t("aboutP1", { age: Math.floor(age) })}
            </p>
            <p className="text-zinc-400 text-sm leading-relaxed">{t("aboutP2")}</p>

            <div className="pt-1">
              <span className="text-xs text-zinc-500 font-mono inline-flex items-center gap-1.5 group relative cursor-help">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                <span>
                  {age.toFixed(8)} {t("yearsAlive")}
                </span>
                <span className="absolute bottom-full left-0 mb-2 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-sans">
                  July 9, 2011
                </span>
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-3">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 text-xs rounded-md bg-zinc-900/60 border border-zinc-800/60 text-zinc-300 font-mono select-none"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="md:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: 0.08 }}
          >
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
                {t("currentlyDoing")}
              </span>
            </div>
            <DiscordPresence />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
