module.exports = {
  config: {
    name: "pending",
    version: "1.1",
    author: "Ew'r Saim & GPT",
    countDown: 5,
    role: 2,
    shortDescription: { vi: "", en: "" },
    longDescription: { vi: "", en: "" },
    category: "Admin"
  },

  langs: {
    en: {
      invaildNumber: "%1 is not a valid number",
      cancelSuccess: "Refused %1 thread!",
      approveSuccess: "✅ Successfully approved %1 thread(s)!",
      cantGetPendingList: "❌ Can't get the pending list!",
      returnListPending: "💎─────「 PENDING LIST 」─────💎\nTotal threads pending: %1\n\n%2",
      returnListClean: "✅ There is no pending thread!"
    }
  },

  onReply: async function ({ api, event, Reply, getLang, commandName }) {
    if (String(event.senderID) !== String(Reply.author)) return;
    const { body, threadID, messageID } = event;
    let count = 0;

    // Cancel pending threads
    if ((isNaN(body) && body.indexOf("c") == 0) || body.indexOf("cancel") == 0) {
      const index = body.slice(1).split(/\s+/);
      for (const i of index) {
        if (isNaN(i) || i <= 0 || i > Reply.pending.length)
          return api.sendMessage(getLang("invaildNumber", i), threadID, messageID);
        api.removeUserFromGroup(api.getCurrentUserID(), Reply.pending[i - 1].threadID);
        count++;
      }
      return api.sendMessage(getLang("cancelSuccess", count), threadID, messageID);
    } else {
      const index = body.split(/\s+/);
      for (const i of index) {
        if (isNaN(i) || i <= 0 || i > Reply.pending.length)
          return api.sendMessage(getLang("invaildNumber", i), threadID, messageID);

        const targetThread = Reply.pending[i - 1].threadID;
        const threadInfo = await api.getThreadInfo(targetThread);
        const groupName = threadInfo.threadName || "Unnamed Group";
        const memberCount = threadInfo.participantIDs.length;
        const time = new Date().toLocaleString('en-BD', { timeZone: 'Asia/Dhaka' });

        // Premium styled VIP box
        const premiumMsg = 
`💎━━━━━━━━━━━━━━━━💎
🔹 𝐆𝐑𝐎𝐔𝐏 𝐈𝐍𝐅𝐎 🔹
💎━━━━━━━━━━━━━━━━💎
🏷️ Name: ${groupName}
🆔 ID: ${targetThread}
👥 Members: ${memberCount}
🔒 Approval Mode: ${threadInfo.approvalMode ? "On" : "Off"}
😊 Emoji: ${threadInfo.emoji || "None"}
⏰ Joined: ${time}
💡 To Approve: Reply with the number ${i}

💎━━━━━━━━━━━━━━━━💎
🔹 𝐎𝐖𝐍𝐄𝐑 𝐈𝐍𝐅𝐎 🔹
💎━━━━━━━━━━━━━━━━💎
🧑‍💻 Name: 『A P O N』
🌐 Facebook: Apon DiCaprio 
🗺️ Country: Bangladesh
✅ Status: Active
📞 WhatsApp: 01765144xxx
✉️ Email: aponmohammed4241@gmail.com
🧵 Telegram: Not a user 
💡 Tip: Type /help to see all commands!
💎━━━━━━━━━━━━━━━━💎`;

        api.sendMessage(premiumMsg, targetThread);
        count++;
      }
      return api.sendMessage(getLang("approveSuccess", count), threadID, messageID);
    }
  },

  onStart: async function ({ api, event, getLang, commandName }) {
    const { threadID, messageID } = event;
    let msg = "", index = 1;

    try {
      const spam = await api.getThreadList(100, null, ["OTHER"]) || [];
      const pending = await api.getThreadList(100, null, ["PENDING"]) || [];
      const list = [...spam, ...pending].filter(group => group.isSubscribed && group.isGroup);

      for (const item of list) msg += `${index++}/ ${item.name} (${item.threadID})\n`;

      if (list.length != 0) {
        return api.sendMessage(getLang("returnListPending", list.length, msg), threadID, (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName,
            messageID: info.messageID,
            author: event.senderID,
            pending: list
          });
        }, messageID);
      } else return api.sendMessage(getLang("returnListClean"), threadID, messageID);

    } catch (e) {
      return api.sendMessage(getLang("cantGetPendingList"), threadID, messageID);
    }
  }
};
