/cmd install activity.js const fs = require('fs');
const path = require('path');
const DB_FILE = path.join(__dirname, 'activity_db.json');

let db = { chats: {} };

function loadDB() {
  if (fs.existsSync(DB_FILE)) {
    try {
      db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8')) || { chats: {} };
    } catch {
      db = { chats: {} };
    }
  }
}

function saveDB() {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

function ensureChat(chatId) {
  if (!db.chats[chatId]) {
    db.chats[chatId] = { users: {}, firstMessage: null, lastMessage: null };
  }
}

function fmtMs(ms) {
  if (!ms || ms <= 0) return '0s';
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h ? h + 'h ' : ''}${m ? m + 'm ' : ''}${sec ? sec + 's' : ''}`.trim();
}

function recordMessage(chatId, senderId) {
  ensureChat(chatId);
  const chat = db.chats[chatId];
  const ts = Date.now();

  chat.firstMessage = chat.firstMessage || ts;
  chat.lastMessage = ts;

  if (!chat.users[senderId]) {
    chat.users[senderId] = { messages: 0, firstSeen: ts, lastSeen: ts };
  }
  const u = chat.users[senderId];
  u.messages++;
  u.lastSeen = ts;

  saveDB();
}

function getReportHuman(chatId) {
  ensureChat(chatId);
  const chat = db.chats[chatId];
  const users = Object.entries(chat.users).map(([uid, u]) => ({
    uid,
    messages: u.messages,
    activeTime: fmtMs(u.lastSeen - u.firstSeen)
  }));

  users.sort((a, b) => b.messages - a.messages);

  let text = `📊 Activity Report for Chat: ${chatId}\n`;
  text += `First message: ${chat.firstMessage ? new Date(chat.firstMessage).toLocaleString() : 'N/A'}\n`;
  text += `Last message: ${chat.lastMessage ? new Date(chat.lastMessage).toLocaleString() : 'N/A'}\n\n`;
  text += `👥 Users:\n`;
  users.forEach((u, i) => {
    text += `${i + 1}. ${u.uid} — ${u.messages} msgs — ${u.activeTime}\n`;
  });

  return text;
}

// GoatBot Module
module.exports = {
  config: {
    name: "activity",
    version: "1.0",
    author: "Apon & GPT",
    countDown: 5,
    role: 0,
    shortDescription: "Shows user activity",
    longDescription: "Tracks and shows how many messages each user sent and how long they've been active",
    category: "tools",
    guide: "{p}activity"
  },

  onStart: async function({ api, event }) {
    const report = getReportHuman(event.threadID);
    api.sendMessage(report, event.threadID, event.messageID);
  },

  onChat: async function({ event }) {
    // Tracks every message automatically
    recordMessage(event.threadID, event.senderID);
  }
};

loadDB();
