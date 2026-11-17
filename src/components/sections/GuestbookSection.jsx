import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  FaPlus,
  FaTimes,
  FaPencilAlt,
  FaTrash,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";

const STORAGE_USER_KEY = "stickynotes_user";
const STORAGE_MY_SECRETS_KEY = "stickynotes_my_secrets";
const STORAGE_LIKED_KEY = "stickynotes_liked";
const STORAGE_POSITIONS_KEY = "stickynotes_positions";

const NOTE_THEMES = {
  yellow: {
    bg: "bg-[#fef9c3]",
    border: "border-[#fde047]/60",
    text: "text-[#422006]",
    meta: "text-[#713f12]",
    tape: "bg-white/45",
  },
  mint: {
    bg: "bg-[#dcfce7]",
    border: "border-[#86efac]/60",
    text: "text-[#052e16]",
    meta: "text-[#14532d]",
    tape: "bg-white/45",
  },
  sky: {
    bg: "bg-[#e0f2fe]",
    border: "border-[#7dd3fc]/60",
    text: "text-[#082f49]",
    meta: "text-[#0c4a6e]",
    tape: "bg-white/45",
  },
  rose: {
    bg: "bg-[#ffe4e6]",
    border: "border-[#fecdd3]/60",
    text: "text-[#4c0519]",
    meta: "text-[#881337]",
    tape: "bg-white/45",
  },
  lavender: {
    bg: "bg-[#f3e8ff]",
    border: "border-[#d8b4fe]/60",
    text: "text-[#3b0764]",
    meta: "text-[#581c87]",
    tape: "bg-white/45",
  },
};

const COLOR_OPTIONS = [
  { key: "yellow", name: "Yellow", dot: "bg-[#fde047]" },
  { key: "mint", name: "Mint", dot: "bg-[#86efac]" },
  { key: "sky", name: "Sky", dot: "bg-[#7dd3fc]" },
  { key: "rose", name: "Rose", dot: "bg-[#fecdd3]" },
  { key: "lavender", name: "Lavender", dot: "bg-[#d8b4fe]" },
];

function formatRelativeTime(dateString) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateString).toLocaleDateString();
}

function getStoredName() {
  try {
    return localStorage.getItem(STORAGE_USER_KEY) || "";
  } catch {
    return "";
  }
}

function getStoredSecrets() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_MY_SECRETS_KEY)) || {};
  } catch {
    return {};
  }
}

function getStoredLiked() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_LIKED_KEY)) || [];
  } catch {
    return [];
  }
}

function getStoredPositions() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_POSITIONS_KEY)) || {};
  } catch {
    return {};
  }
}

function getDeterministicPosition(index, id) {
  const seed = Math.abs(Number(id) || index || 1);
  const cols = 3;
  const col = index % cols;
  const row = Math.floor(index / cols);
  const jitterX = (seed % 9) - 4;
  const jitterY = ((seed >> 2) % 7) - 3;
  const x = Math.max(5, Math.min(76, 8 + col * 28 + jitterX));
  const y = Math.max(6, Math.min(74, 8 + (row % 4) * 22 + jitterY));
  const rotation = (seed % 11) - 5;
  return { x, y, rotation };
}

export default function GuestbookSection() {
  const { t, i18n } = useTranslation();
  const isRu = i18n.language?.startsWith("ru");
  const boardRef = useRef(null);

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  const [name, setName] = useState(getStoredName);
  const [text, setText] = useState("");
  const [color, setColor] = useState("yellow");
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [mySecrets, setMySecrets] = useState(getStoredSecrets);
  const [likedIds, setLikedIds] = useState(getStoredLiked);

  useEffect(() => {
    fetch("/api/guestbook")
      .then((res) => {
        if (!res.ok) throw new Error("Load failed");
        return res.json();
      })
      .then((data) => {
        if (data.messages) {
          const storedPositions = getStoredPositions();
          const positionedNotes = data.messages.map((note, index) => {
            const fallback = getDeterministicPosition(index, note.id);
            const custom = storedPositions[note.id];
            return {
              ...note,
              x: custom?.x ?? (typeof note.x === "number" ? note.x : fallback.x),
              y: custom?.y ?? (typeof note.y === "number" ? note.y : fallback.y),
              rotation:
                typeof note.rotation === "number"
                  ? note.rotation
                  : fallback.rotation,
            };
          });
          setNotes(positionedNotes);
        }
      })
      .catch(() => {
        setErrorMessage(
          isRu ? "Не удалось загрузить стикеры" : "Unable to load notes",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isRu]);

  const handleOpenCreate = () => {
    setEditingNote(null);
    setText("");
    setColor("yellow");
    setErrorMessage("");
    setIsComposerOpen(true);
  };

  const handleOpenEdit = (note) => {
    setEditingNote(note);
    setText(note.text);
    setColor(note.color || "yellow");
    setErrorMessage("");
    setIsComposerOpen(true);
  };

  const handleToggleLike = async (noteId) => {
    const isLiked = likedIds.includes(noteId);
    const nextLiked = isLiked
      ? likedIds.filter((id) => id !== noteId)
      : [...likedIds, noteId];

    setLikedIds(nextLiked);
    try {
      localStorage.setItem(STORAGE_LIKED_KEY, JSON.stringify(nextLiked));
    } catch {}

    setNotes((prev) =>
      prev.map((n) => {
        if (n.id !== noteId) return n;
        const current = n.likes || 0;
        return {
          ...n,
          likes: isLiked ? Math.max(0, current - 1) : current + 1,
        };
      }),
    );

    try {
      const response = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: isLiked ? "unlike" : "like",
          id: noteId,
        }),
      });
      const data = await response.json();
      if (data.success && typeof data.likes === "number") {
        setNotes((prev) =>
          prev.map((n) => (n.id === noteId ? { ...n, likes: data.likes } : n)),
        );
      }
    } catch {}
  };

  const handleDragEnd = (noteId, info) => {
    if (!boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    setNotes((prevNotes) => {
      let nextX = null;
      let nextY = null;
      const nextNotes = prevNotes.map((n) => {
        if (n.id !== noteId) return n;
        const currentX = n.x ?? 20;
        const currentY = n.y ?? 25;
        const deltaXPercent = (info.offset.x / rect.width) * 100;
        const deltaYPercent = (info.offset.y / rect.height) * 100;
        nextX = Math.round(Math.max(3, Math.min(82, currentX + deltaXPercent)));
        nextY = Math.round(Math.max(3, Math.min(76, currentY + deltaYPercent)));
        return { ...n, x: nextX, y: nextY };
      });

      if (nextX !== null && nextY !== null) {
        try {
          const stored = getStoredPositions();
          stored[noteId] = { x: nextX, y: nextY };
          localStorage.setItem(STORAGE_POSITIONS_KEY, JSON.stringify(stored));
        } catch {}

        const secret = mySecrets[noteId];
        if (secret) {
          fetch("/api/guestbook", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "move",
              id: noteId,
              secret,
              x: nextX,
              y: nextY,
            }),
          }).catch(() => {});
        }
      }

      return nextNotes;
    });
  };

  const handleDelete = async (noteId) => {
    const secret = mySecrets[noteId];
    if (!secret) return;

    const confirmed = window.confirm(
      isRu ? "Удалить этот стикер?" : "Delete this note?",
    );
    if (!confirmed) return;

    try {
      const response = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete",
          id: noteId,
          secret,
        }),
      });

      if (!response.ok) throw new Error("Delete failed");

      setNotes((prev) => prev.filter((n) => n.id !== noteId));
      const nextSecrets = { ...mySecrets };
      delete nextSecrets[noteId];
      setMySecrets(nextSecrets);
      try {
        localStorage.setItem(
          STORAGE_MY_SECRETS_KEY,
          JSON.stringify(nextSecrets),
        );
        const stored = getStoredPositions();
        delete stored[noteId];
        localStorage.setItem(STORAGE_POSITIONS_KEY, JSON.stringify(stored));
      } catch {}
    } catch {
      alert(isRu ? "Не удалось удалить стикер" : "Failed to delete note");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (honeypot) return;

    if (!name.trim()) {
      setErrorMessage(
        isRu ? "Пожалуйста, введи имя." : "Please enter your name.",
      );
      return;
    }

    if (text.trim().length < 2) {
      setErrorMessage(
        isRu
          ? "Сообщение слишком короткое (минимум 2 символа)."
          : "Message is too short (min 2 chars).",
      );
      return;
    }

    if (text.trim().length > 160) {
      setErrorMessage(
        isRu
          ? "Сообщение слишком длинное (максимум 160 символов)."
          : "Message is too long (max 160 chars).",
      );
      return;
    }

    setSubmitting(true);
    try {
      if (editingNote) {
        const secret = mySecrets[editingNote.id];
        if (!secret) throw new Error("Unauthorized");

        const response = await fetch("/api/guestbook", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "edit",
            id: editingNote.id,
            secret,
            text: text.trim(),
            color,
          }),
        });

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || "Update failed");
        }

        setNotes((prev) =>
          prev.map((n) => (n.id === editingNote.id ? result.message : n)),
        );
        setIsComposerOpen(false);
        setEditingNote(null);
      } else {
        if (!name.trim()) return;

        const posX = Math.floor(Math.random() * 55) + 12;
        const posY = Math.floor(Math.random() * 45) + 15;

        const response = await fetch("/api/guestbook", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            text: text.trim(),
            color,
            honeypot,
            x: posX,
            y: posY,
          }),
        });

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || "Submit failed");
        }

        const newNoteWithPos = {
          ...result.message,
          x: result.message?.x ?? posX,
          y: result.message?.y ?? posY,
        };

        setNotes((prev) => [newNoteWithPos, ...prev]);
        setText("");
        setIsComposerOpen(false);

        if (result.secret && result.message?.id) {
          const nextSecrets = {
            ...mySecrets,
            [result.message.id]: result.secret,
          };
          setMySecrets(nextSecrets);
          try {
            localStorage.setItem(
              STORAGE_MY_SECRETS_KEY,
              JSON.stringify(nextSecrets),
            );
            localStorage.setItem(STORAGE_USER_KEY, name.trim());
            const stored = getStoredPositions();
            stored[result.message.id] = { x: newNoteWithPos.x, y: newNoteWithPos.y };
            localStorage.setItem(STORAGE_POSITIONS_KEY, JSON.stringify(stored));
          } catch {}
        }
      }
    } catch (err) {
      if (err.message === "Content not allowed") {
        setErrorMessage(
          isRu
            ? "Ссылки и ненормативная лексика запрещены."
            : "Links and slurs are not allowed.",
        );
      } else if (err.message === "Please wait before posting again") {
        setErrorMessage(
          isRu
            ? "Подожди немного перед наклейкой следующего стикера."
            : "Please wait before posting again.",
        );
      } else {
        setErrorMessage(
          isRu
            ? "Не удалось сохранить стикер. Проверь текст."
            : "Failed to save note. Check your text.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="guestbook" className="px-6 py-12 sm:py-16">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-semibold text-white tracking-tight">
              {isRu ? "доска заметок" : "sticky notes"}
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              {isRu
                ? "перетаскивай свои стикеры или наклей новый (ссылки запрещены)"
                : "drag your notes around or pin a new one (no links allowed)"}
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-zinc-100 text-zinc-950 text-xs font-medium hover:bg-white transition-all cursor-pointer shadow-sm shrink-0"
          >
            <FaPlus size={10} />
            <span>{isRu ? "Наклеить стикер" : "Stick note"}</span>
          </button>
        </div>

        <div
          ref={boardRef}
          className="relative w-full h-[460px] sm:h-[500px] rounded-2xl border border-zinc-800/80 bg-zinc-950/70 overflow-hidden select-none shadow-2xl [background-image:radial-gradient(#27272a_1.2px,transparent_1.2px)] [background-size:22px_22px]"
        >
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-mono text-zinc-600 animate-pulse">
                {t("loading")}
              </span>
            </div>
          ) : notes.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-6 text-center">
              <div className="w-10 h-10 rounded-full border border-zinc-800 bg-zinc-900/60 flex items-center justify-center mb-3">
                <FaPlus className="text-zinc-600" size={14} />
              </div>
              <p className="text-sm text-zinc-400 font-medium">
                {isRu ? "Доска пока пуста" : "The board is empty"}
              </p>
              <p className="text-xs text-zinc-600 mt-1 max-w-xs">
                {isRu
                  ? "Нажми кнопку «Наклеить стикер», чтобы оставить первую заметку"
                  : "Click Stick note to pin the very first note on this wall"}
              </p>
            </div>
          ) : (
            notes.map((note) => {
              const theme = NOTE_THEMES[note.color] || NOTE_THEMES.yellow;
              const isMine = Boolean(mySecrets[note.id]);
              const isLiked = likedIds.includes(note.id);

              return (
                <motion.div
                  key={note.id}
                  drag={isMine}
                  dragConstraints={boardRef}
                  dragElastic={0.08}
                  dragMomentum={false}
                  onDragEnd={isMine ? (_e, info) => handleDragEnd(note.id, info) : undefined}
                  initial={{
                    scale: 0.8,
                    opacity: 0,
                  }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    x: 0,
                    y: 0,
                  }}
                  whileHover={isMine ? {
                    scale: 1.04,
                    zIndex: 40,
                  } : { zIndex: 30 }}
                  whileDrag={{
                    scale: 1.08,
                    rotate: 0,
                    zIndex: 50,
                    cursor: "grabbing",
                  }}
                  style={{
                    position: "absolute",
                    left: `${note.x}%`,
                    top: `${note.y}%`,
                    rotate: `${note.rotation}deg`,
                  }}
                  className={`group/note w-44 sm:w-52 p-3.5 sm:p-4 rounded-md border ${theme.bg} ${theme.border} ${theme.text} shadow-[0_8px_20px_rgba(0,0,0,0.35)] ${isMine ? "cursor-grab active:cursor-grabbing hover:shadow-[0_12px_28px_rgba(0,0,0,0.5)]" : "cursor-default"} transition-shadow`}
                >
                  <div
                    className={`absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-3.5 ${theme.tape} rounded-[1px] shadow-xs rotate-[-1deg] pointer-events-none`}
                  />

                  {isMine && (
                    <div className="absolute top-1 right-1 flex items-center gap-1 opacity-0 group-hover/note:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEdit(note);
                        }}
                        aria-label="Edit note"
                        className="w-5 h-5 rounded flex items-center justify-center bg-black/10 hover:bg-black/20 text-black/70 hover:text-black transition-colors cursor-pointer"
                      >
                        <FaPencilAlt size={9} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(note.id);
                        }}
                        aria-label="Delete note"
                        className="w-5 h-5 rounded flex items-center justify-center bg-black/10 hover:bg-rose-500 hover:text-white text-black/70 transition-colors cursor-pointer"
                      >
                        <FaTrash size={9} />
                      </button>
                    </div>
                  )}

                  <p className="text-[13px] sm:text-sm font-sans font-normal leading-snug break-words whitespace-pre-line mb-3 mt-1">
                    {note.text}
                  </p>

                  <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-black/10 text-[10px]">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleLike(note.id);
                        }}
                        aria-label={isLiked ? "Unlike" : "Like"}
                        className={`inline-flex items-center gap-1 transition-transform active:scale-90 cursor-pointer ${
                          isLiked
                            ? "text-rose-600 font-semibold"
                            : "text-black/60 hover:text-black"
                        }`}
                      >
                        {isLiked ? (
                          <FaHeart size={10} className="text-rose-600" />
                        ) : (
                          <FaRegHeart size={10} />
                        )}
                        <span className="font-mono text-[10px]">
                          {note.likes || 0}
                        </span>
                      </button>
                      <span className="font-semibold truncate">
                        {note.name}
                      </span>
                    </div>
                    <span className={`font-mono shrink-0 ${theme.meta}`}>
                      {formatRelativeTime(note.date)}
                    </span>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      <AnimatePresence>
        {isComposerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-sm rounded-xl border border-zinc-800 bg-zinc-900 p-5 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-white">
                  {editingNote
                    ? isRu
                      ? "Редактировать стикер"
                      : "Edit note"
                    : isRu
                      ? "Новый стикер"
                      : "Pin a note"}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setIsComposerOpen(false);
                    setEditingNote(null);
                  }}
                  className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
                >
                  <FaTimes size={13} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div className="hidden">
                  <input
                    type="text"
                    name="website"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                    {isRu ? "Твоё имя" : "Your name"}
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={30}
                    value={name}
                    disabled={Boolean(editingNote)}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isRu ? "никнейм..." : "nickname..."}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-600 focus:outline-hidden focus:border-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                    {isRu ? "Цвет стикера" : "Note color"}
                  </label>
                  <div className="flex items-center gap-2">
                    {COLOR_OPTIONS.map((c) => (
                      <button
                        key={c.key}
                        type="button"
                        onClick={() => setColor(c.key)}
                        className={`w-6 h-6 rounded-full ${c.dot} transition-transform cursor-pointer ${
                          color === c.key
                            ? "ring-2 ring-white ring-offset-2 ring-offset-zinc-900 scale-110"
                            : "opacity-70 hover:opacity-100 hover:scale-105"
                        }`}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                    {isRu ? "Текст заметки" : "Message"}
                  </label>
                  <div className="relative">
                    <textarea
                      required
                      rows={3}
                      maxLength={160}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder={
                        isRu
                          ? "оставь привет, совет или мысль..."
                          : "say hi, leave feedback or a quick thought..."
                      }
                      className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-600 focus:outline-hidden focus:border-zinc-600 resize-none"
                    />
                    <span className="absolute bottom-2 right-2.5 text-[10px] font-mono text-zinc-600">
                      {text.length}/160
                    </span>
                  </div>
                </div>

                {errorMessage && (
                  <p className="text-xs text-rose-400 bg-rose-950/40 border border-rose-900/60 rounded-md px-2.5 py-1.5 leading-snug">
                    {errorMessage}
                  </p>
                )}

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsComposerOpen(false);
                      setEditingNote(null);
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {isRu ? "Отмена" : "Cancel"}
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !text.trim() || !name.trim()}
                    className="px-4 py-1.5 rounded-lg bg-zinc-100 text-zinc-950 text-xs font-medium hover:bg-white transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {submitting
                      ? isRu
                        ? "Сохранение..."
                        : "Saving..."
                      : isRu
                        ? "Прикрепить"
                        : "Pin note"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

