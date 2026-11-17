import { motion } from "framer-motion";
import { FaTelegram, FaEnvelope, FaDiscord } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function ContactSection() {
  const { t } = useTranslation();
  const [visitorCount, setVisitorCount] = useState(0);
  const [discordCopied, setDiscordCopied] = useState(false);

  const handleDiscordClick = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText("sqrilizz");
    setDiscordCopied(true);
    setTimeout(() => setDiscordCopied(false), 2000);
  };

  const contacts = [
    {
      icon: FaTelegram,
      label: "Telegram",
      value: "@sqrilizz",
      href: "https://t.me/sqrilizz",
    },
    {
      icon: FaEnvelope,
      label: "Email",
      value: "contact@sqrlizz.xyz",
      href: "mailto:contact@sqrlizz.xyz",
    },
    {
      icon: FaDiscord,
      label: discordCopied ? t("copied") : "Discord",
      value: "sqrilizz",
      href: "#",
      onClick: handleDiscordClick,
      isCopied: discordCopied,
    },
  ];

  useEffect(() => {
    fetch("/api/visitor")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setVisitorCount(data.totalCount || 0);
      })
      .catch(() => {});
  }, []);

  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          className="text-2xl font-semibold text-white mb-10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          {t("contactTitle")}
        </motion.h2>

        <motion.div
          className="flex flex-col sm:flex-row gap-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          {contacts.map((c, i) => {
            const isButton = Boolean(c.onClick);
            const Tag = isButton ? "button" : "a";
            const props = isButton
              ? { type: "button", onClick: c.onClick }
              : {
                  href: c.href,
                  target: "_blank",
                  rel: "noopener noreferrer",
                };

            return (
              <Tag
                key={i}
                {...props}
                className={`flex items-center gap-3 px-5 py-4 rounded-xl bg-zinc-900/40 border transition-all duration-200 group flex-1 text-left cursor-pointer ${
                  c.isCopied
                    ? "border-emerald-500/50 bg-emerald-950/20"
                    : "border-zinc-800/70 hover:border-zinc-700 hover:bg-zinc-900/60"
                }`}
              >
                <c.icon
                  className={`transition-colors duration-200 ${
                    c.isCopied
                      ? "text-emerald-400"
                      : "text-zinc-600 group-hover:text-white"
                  }`}
                  size={18}
                />
                <div className="min-w-0">
                  <div
                    className={`text-[11px] uppercase tracking-wider transition-colors ${
                      c.isCopied
                        ? "text-emerald-400 font-semibold"
                        : "text-zinc-600"
                    }`}
                  >
                    {c.label}
                  </div>
                  <div className="text-sm text-zinc-300 truncate">{c.value}</div>
                </div>
              </Tag>
            );
          })}
        </motion.div>

        {visitorCount > 0 && (
          <motion.p
            className="mt-10 text-sm text-zinc-700"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {visitorCount.toLocaleString()} {t("visitors")}
          </motion.p>
        )}
      </div>
    </section>
  );
}
