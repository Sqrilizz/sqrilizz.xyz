import { kv } from "@vercel/kv";

export const config = { runtime: "edge" };

const NOTES_KEY = "guestbook:messages";
const MAX_NOTES = 40;
const COOLDOWN_SECONDS = 15;
const LIKE_COOLDOWN_SECONDS = 86400;

const ALLOWED_COLORS = ["yellow", "mint", "sky", "rose", "lavender"];

let localMemoryNotes = [];

const BANNED_PATTERNS = [
  /n+[i1!|l]+g+[e3a4r]+/i,
  /n+[i1!|l]+g+a+/i,
  /н+[ие1!]+г+[еаэ]+р*/i,
  /н+[ие1!]+г+а+/i,
  /п+[ие1!]+д+[оае]+р/i,
  /х+[оа]+х+[оа]+л/i,
  /ч+[уе]+р+[кk]+/i,
  /х+[ае]+ч/i,
  /f+[a4]+g+[o0]+t/i,
  /f+[a4]+g/i,
  /k+[y1]+s/i,
];

const URL_PATTERN =
  /https?:\/\/|www\.|\.[a-z]{2,8}(\/|$)|(t\.me|discord\.gg|discord\.com\/invite)/i;

function getClientIp(request) {
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return "127.0.0.1";
}

function containsBannedContent(name, text) {
  const combined = `${name} ${text}`.toLowerCase();
  if (URL_PATTERN.test(combined)) return true;
  for (const pattern of BANNED_PATTERNS) {
    if (pattern.test(combined)) return true;
  }
  return false;
}

function isSpam(name, text) {
  if (typeof name !== "string" || typeof text !== "string") return true;
  const cleanName = name.trim();
  const cleanText = text.trim();
  if (cleanName.length < 2 || cleanName.length > 30) return true;
  if (cleanText.length < 2 || cleanText.length > 160) return true;
  if (/<[^>]*>/.test(cleanText)) return true;
  if (/^(.)\1{4,}$/.test(cleanText.replace(/\s+/g, ""))) return true;
  const uniqueChars = new Set(cleanText.toLowerCase().replace(/\s/g, ""));
  if (uniqueChars.size < 2 && cleanText.length > 4) return true;
  return false;
}

function sanitizeNoteForPublic(note) {
  const { secret, ...publicData } = note;
  return publicData;
}

async function getAllStoredNotes() {
  try {
    const values = await kv.lrange(NOTES_KEY, 0, MAX_NOTES - 1);
    if (!values) return [];
    return values.map((val) =>
      typeof val === "string" ? JSON.parse(val) : val,
    );
  } catch {
    return localMemoryNotes;
  }
}

async function saveAllNotes(notesList) {
  try {
    await kv.del(NOTES_KEY);
    if (notesList.length > 0) {
      await kv.rpush(NOTES_KEY, ...notesList.map((n) => JSON.stringify(n)));
    }
  } catch {
    localMemoryNotes = [...notesList];
  }
}

export default async function handler(request) {
  try {
    if (request.method === "GET") {
      const allNotes = await getAllStoredNotes();
      let needSave = false;
      const publicNotes = allNotes
        .filter(
          (n) =>
            n && n.name && n.text && !containsBannedContent(n.name, n.text),
        )
        .map((n, index) => {
          if (typeof n.x !== "number" || typeof n.y !== "number") {
            const cols = 3;
            const row = Math.floor(index / cols);
            const col = index % cols;
            n.x = Math.max(4, Math.min(75, 8 + col * 28 + ((n.id % 7) - 3)));
            n.y = Math.max(
              4,
              Math.min(72, 8 + (row % 4) * 22 + (((n.id >> 2) % 7) - 3)),
            );
            n.rotation =
              typeof n.rotation === "number" ? n.rotation : (n.id % 11) - 5;
            needSave = true;
          }
          return sanitizeNoteForPublic(n);
        });

      if (needSave) {
        saveAllNotes(allNotes).catch(() => {});
      }

      return Response.json(
        { success: true, messages: publicNotes },
        {
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    if (request.method !== "POST") {
      return Response.json(
        { success: false, error: "Method not allowed" },
        { status: 405 },
      );
    }

    const body = await request.json();
    const ip = getClientIp(request);

    if (body.action === "move") {
      const id = Number(body.id);
      const secret = body.secret;
      const x = Number(body.x);
      const y = Number(body.y);

      if (
        !Number.isFinite(id) ||
        !secret ||
        !Number.isFinite(x) ||
        !Number.isFinite(y)
      ) {
        return Response.json(
          { success: false, error: "Missing required fields" },
          { status: 400 },
        );
      }

      const allNotes = await getAllStoredNotes();
      const target = allNotes.find((n) => n.id === id);
      if (!target) {
        return Response.json(
          { success: false, error: "Note not found" },
          { status: 404 },
        );
      }

      if (target.secret && target.secret !== secret) {
        return Response.json(
          { success: false, error: "Unauthorized" },
          { status: 403 },
        );
      }

      target.x = Math.max(2, Math.min(85, Math.round(x)));
      target.y = Math.max(2, Math.min(80, Math.round(y)));
      await saveAllNotes(allNotes);
      return Response.json({ success: true, id, x: target.x, y: target.y });
    }

    if (body.action === "like") {
      const id = Number(body.id);
      if (!Number.isFinite(id)) {
        return Response.json(
          { success: false, error: "Invalid note ID" },
          { status: 400 },
        );
      }
      try {
        await kv.set(`guestbook:like:${ip}:${id}`, "1", {
          ex: LIKE_COOLDOWN_SECONDS,
        });
        const allNotes = await getAllStoredNotes();
        const target = allNotes.find((n) => n.id === id);
        if (target) {
          target.likes = (target.likes || 0) + 1;
          await saveAllNotes(allNotes);
          return Response.json({ success: true, likes: target.likes });
        }
        return Response.json({ success: true, likes: 1 });
      } catch {
        const target = localMemoryNotes.find((n) => n.id === id);
        if (target) {
          target.likes = (target.likes || 0) + 1;
          return Response.json({ success: true, likes: target.likes });
        }
        return Response.json({ success: true, likes: 1 });
      }
    }

    if (body.action === "unlike") {
      const id = Number(body.id);
      if (!Number.isFinite(id)) {
        return Response.json(
          { success: false, error: "Invalid note ID" },
          { status: 400 },
        );
      }
      try {
        await kv.del(`guestbook:like:${ip}:${id}`);
        const allNotes = await getAllStoredNotes();
        const target = allNotes.find((n) => n.id === id);
        if (target) {
          target.likes = Math.max(0, (target.likes || 0) - 1);
          await saveAllNotes(allNotes);
          return Response.json({ success: true, likes: target.likes });
        }
        return Response.json({ success: true, likes: 0 });
      } catch {
        const target = localMemoryNotes.find((n) => n.id === id);
        if (target) {
          target.likes = Math.max(0, (target.likes || 0) - 1);
          return Response.json({ success: true, likes: target.likes });
        }
        return Response.json({ success: true, likes: 0 });
      }
    }

    if (body.action === "delete") {
      const id = Number(body.id);
      const secret = body.secret;
      if (!Number.isFinite(id) || !secret) {
        return Response.json(
          { success: false, error: "Missing note ID or secret" },
          { status: 400 },
        );
      }

      const allNotes = await getAllStoredNotes();
      const noteIndex = allNotes.findIndex((n) => n.id === id);
      if (noteIndex === -1) {
        return Response.json(
          { success: false, error: "Note not found" },
          { status: 404 },
        );
      }

      const target = allNotes[noteIndex];
      if (target.secret && target.secret !== secret) {
        return Response.json(
          { success: false, error: "Unauthorized" },
          { status: 403 },
        );
      }

      allNotes.splice(noteIndex, 1);
      await saveAllNotes(allNotes);
      return Response.json({ success: true, id });
    }

    if (body.action === "edit") {
      const id = Number(body.id);
      const secret = body.secret;
      const newText = (body.text || "").trim();
      const newColor = ALLOWED_COLORS.includes(body.color)
        ? body.color
        : "yellow";

      if (!Number.isFinite(id) || !secret) {
        return Response.json(
          { success: false, error: "Missing note ID or secret" },
          { status: 400 },
        );
      }

      if (newText.length < 2 || newText.length > 160) {
        return Response.json(
          { success: false, error: "Invalid text length" },
          { status: 400 },
        );
      }

      if (containsBannedContent("", newText) || isSpam("user", newText)) {
        return Response.json(
          { success: false, error: "Content not allowed" },
          { status: 400 },
        );
      }

      const allNotes = await getAllStoredNotes();
      const target = allNotes.find((n) => n.id === id);
      if (!target) {
        return Response.json(
          { success: false, error: "Note not found" },
          { status: 404 },
        );
      }

      if (target.secret && target.secret !== secret) {
        return Response.json(
          { success: false, error: "Unauthorized" },
          { status: 403 },
        );
      }

      target.text = newText;
      target.color = newColor;
      target.editedAt = new Date().toISOString();

      await saveAllNotes(allNotes);
      return Response.json({
        success: true,
        message: sanitizeNoteForPublic(target),
      });
    }

    if (
      body.honeypot ||
      isSpam(body.name, body.text) ||
      containsBannedContent(body.name, body.text)
    ) {
      return Response.json(
        { success: false, error: "Content not allowed" },
        { status: 400 },
      );
    }

    try {
      const allowed = await kv.set(`guestbook:post:${ip}`, "1", {
        nx: true,
        ex: COOLDOWN_SECONDS,
      });
      if (!allowed) {
        return Response.json(
          { success: false, error: "Please wait before posting again" },
          { status: 429 },
        );
      }
    } catch {}

    const noteSecret =
      Math.random().toString(36).substring(2) + Date.now().toString(36);
    const color = ALLOWED_COLORS.includes(body.color) ? body.color : "yellow";
    const x =
      typeof body.x === "number" && body.x >= 5 && body.x <= 80
        ? body.x
        : Math.floor(Math.random() * 65) + 10;
    const y =
      typeof body.y === "number" && body.y >= 5 && body.y <= 75
        ? body.y
        : Math.floor(Math.random() * 55) + 12;
    const rotation =
      typeof body.rotation === "number" &&
      body.rotation >= -8 &&
      body.rotation <= 8
        ? body.rotation
        : Math.floor(Math.random() * 10) - 5;

    const newNote = {
      id: Date.now(),
      name: body.name.trim(),
      text: body.text.trim(),
      color,
      x,
      y,
      rotation,
      date: new Date().toISOString(),
      likes: 0,
      secret: noteSecret,
    };

    const allNotes = await getAllStoredNotes();
    allNotes.unshift(newNote);
    const trimmed = allNotes.slice(0, MAX_NOTES);
    await saveAllNotes(trimmed);

    return Response.json(
      {
        success: true,
        message: sanitizeNoteForPublic(newNote),
        secret: noteSecret,
      },
      { status: 201 },
    );
  } catch {
    return Response.json(
      { success: false, error: "Unable to save note" },
      { status: 500 },
    );
  }
}
