const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "groupNotifyConfig.json");
if (!fs.existsSync(configPath)) {
  fs.writeFileSync(configPath, JSON.stringify({ enabled: true }, null, 2));
}

module.exports = {
  config: {
    name: "groupNotify",
    version: "1.0",
    author: "Apon",
    countDown: 0,
    role: 0,
    shortDescription: {
      en: "Enable/Disable Group Notify via Messenger"
    },
    longDescription: {
      en: "Control the permanent group notification system from Messenger commands"
    },
    category: "system"
  },

  ownerGroup: "1875499480017249", // তোমার group ID

  // Messenger থেকে command চালানো
  onStart: async function ({ api, event, args }) {
    let settings = JSON.parse(fs.readFileSync(configPath, "utf8"));

    if (args[0] === "on") {
      settings.enabled = true;
      fs.writeFileSync(configPath, JSON.stringify(settings, null, 2));
      return api.sendMessage("✅ Group Notify ENABLED permanently!", event.threadID);
    } else if (args[0] === "off") {
      settings.enabled = false;
      fs.writeFileSync(configPath, JSON.stringify(settings, null, 2));
      return api.sendMessage("❌ Group Notify DISABLED!", event.threadID);
    } else {
      return api.sendMessage("⚙️ Usage: groupNotify on/off", event.threadID);
    }
  },

  // Event listener
  onEvent: async function ({ api, event }) {
    let settings = JSON.parse(fs.readFileSync(configPath, "utf8"));
    if (!settings.enabled) return;

    if (
      event.logMessageType === "log:subscribe" &&
      event.logMessageData.addedParticipants.some(u => u.userFbId == api.getCurrentUserID())
    ) {
      try {
        const info = await api.getThreadInfo(event.threadID);
        const msg =
`━━━━━━━━━━━━━━━━━━
🔔 BOT ADDED TO A NEW GROUP!
━━━━━━━━━━━━━━━━━━
📌 Group Name : ${info.threadName || "Unnamed Group"}
🆔 Group ID   : ${event.threadID}
👥 Members    : ${info.participantIDs.length}
━━━━━━━━━━━━━━━━━━`;
        api.sendMessage(msg, module.exports.ownerGroup);
      } catch (err) {
        console.error("GroupNotify Error:", err);
      }
    }
  }
};
