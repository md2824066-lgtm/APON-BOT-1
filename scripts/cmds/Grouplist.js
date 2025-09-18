const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "grouplist",
    aliases: ["groups", "gl"],
    version: "5.0",
    author: "apon Dicaprio",
    role: 0,
    shortDescription: "Show all group list",
    longDescription: "Show all groups where bot is added with names, IDs, member counts, admin counts and join date in a premium styled format",
    category: "info",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, event }) {
    try {
      const threadList = await api.getThreadList(50, null, ["INBOX"]);
      const groupList = threadList.filter(t => t.isGroup);

      if (groupList.length === 0) {
        return api.sendMessage("❌ বট বর্তমানে কোনো গ্রুপে নেই!", event.threadID, event.messageID);
      }

      let msg = "🌟═════════════════🌟\n";
      msg += "     『 𝐆𝐑𝐎𝐔𝐏 𝐋𝐈𝐒𝐓 』\n";
      msg += "🌟══════════════════🌟\n\n";

      let count = 1;
      for (let group of groupList) {
        const info = await api.getThreadInfo(group.threadID);
        const memberCount = info.participantIDs?.length || 0;
        const adminCount = info.adminIDs?.length || 0;

        // বট join করার সময় বের করা
        const joinTime = info.approvalMode ? null : (info.messageCount ? info.messageCount : null);
        const joinDate = group.timestamp
          ? moment(group.timestamp).tz("Asia/Dhaka").format("DD/MM/YYYY hh:mm A")
          : "Unknown";

        msg += `💠 ${count}. 《 ${group.name} 》\n`;
        msg += `🔑 Group ID: ${group.threadID}\n`;
        msg += `👥 Members: ${memberCount}\n`;
        msg += `⭐ Admins: ${adminCount}\n`;
        msg += `📅 Joined: ${joinDate}\n`;
        msg += "━━━━━━━━━━━━━━━\n";
        count++;
      }

      msg += `\n📌 মোট গ্রুপ: ${groupList.length} টি`;

      api.sendMessage(msg, event.threadID, event.messageID);

    } catch (e) {
      api.sendMessage("⚠️ কোনো সমস্যা হয়েছে! অনুগ্রহ করে আবার চেষ্টা করুন।", event.threadID, event.messageID);
      console.error(e);
    }
  }
};
