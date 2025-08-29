module.exports = {
  config: {
    name: "grouplist",
    aliases: ["groups", "gl"],
    version: "1.0",
    author: "apon Dicaprio",
    role: 0,
    shortDescription: "Show all group list",
    longDescription: "Show all groups where bot is added with names and IDs in a premium styled format",
    category: "info",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, event }) {
    try {
      const threadList = await api.getThreadList(100, null, ["INBOX"]);
      const groupList = threadList.filter(t => t.isGroup);

      if (groupList.length === 0) {
        return api.sendMessage("❌ Bot কোনো গ্রুপে নেই!", event.threadID, event.messageID);
      }

      let msg = "✨『 𝐕𝐈𝐏 𝐆𝐑𝐎𝐔𝐏 𝐋𝐈𝐒𝐓 』✨\n\n";
      let count = 1;

      for (let group of groupList) {
        msg += `💎 ${count}. 〘 ${group.name} 〙\n🔑 GID: ${group.threadID}\n\n`;
        count++;
      }

      msg += `🌐 মোট গ্রুপ: ${groupList.length}`;

      api.sendMessage(msg, event.threadID, event.messageID);

    } catch (e) {
      api.sendMessage("⚠️ কোনো সমস্যা হয়েছে!", event.threadID, event.messageID);
      console.log(e);
    }
  }
};
