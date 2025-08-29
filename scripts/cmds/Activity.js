const fs = require('fs');
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

async function getReportHuman(chatId, api) {
  ensureChat(chatId);
  const chat = db.chats[chatId];
  const users = Object.entries(chat.users).map(([uid, u]) => ({
    uid,
    messages: u.messages,
    activeTime: fmtMs(u.lastSeen - u.firstSeen)
  }));

  users.sort((a, b) => b.messages - a.messages);

  // fetch user names
  let nameMap = {};
  try {
    nameMap = await api.getUserInfo(users.map(u => u.uid));
  } catch (e) {}

  let text = "💎━━━━━━━━━━━━━━━━💎\n";
  text += "✨ 『 𝐕𝐈𝐏 𝐀𝐂𝐓𝐈𝐕𝐈𝐓𝐘 𝐑𝐄𝐏𝐎𝐑𝐓 』 ✨\n";
  text += "💎━━━━━━━━━━━━━━━━💎\n\n";

  text += `🆔 Chat ID: ${chatId}\n`;
  text += `📅 First Msg: ${chat.firstMessage ? new Date(chat.firstMessage).toLocaleString() : 'N/A'}\n`;
  text += `⏳ Last Msg: ${chat.lastMessage ? new Date(chat.lastMessage).toLocaleString() : 'N/A'}\n\n`;

  text += "👑 『 𝐑𝐀𝐍𝐊 𝐋𝐈𝐒𝐓 』 👑\n";
  text += "━━━━━━━━━━━━━━━\n";

  users.forEach((u, i) => {
    const crown = i === 0 ? "👑" : (i === 1 ? "🥈" : (i === 2 ? "🥉" : "🔹"));
    const name = nameMap[u.uid]?.name || u.uid;
    text += `${crown} 𝐑𝐚𝐧𝐤 ${i + 1}\n`;
    text += `🙋 Name: ${name}\n`;
    text += `💌 Messages: ${u.messages}\n`;
    text += `⏱ Active: ${u.activeTime}\n`;
    text += "━━━━━━━━━━━━━━━\n";
  });

  text += `📌 Total Users: ${users.length}\n`;
  text += "💎━━━━━━━━━━━━━━━━💎";

  return text;
}

// GoatBot Module
module.exports = {
  config: {
    name: "activity",
    version: "3.0",
    author: "Apon & GPT",
    countDown: 5,
    role: 0,
    shortDescription: "Shows VIP user activity",
    longDescription: "Tracks and shows messages, first message time, ranks with names in a premium VIP format",
    category: "tools",
    guide: "{p}activity"
  },

  onStart: async function({ api, event }) {
    const report = await getReportHuman(event.threadID, api);
    api.sendMessage(report, event.threadID, event.messageID);
  },

  onChat: async function({ event }) {
    recordMessage(event.threadID, event.senderID);
  }
};

loadDB();
