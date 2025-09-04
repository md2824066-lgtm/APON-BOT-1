module.exports = {
  config: {
    name: "botinfo",
    version: "1.0.1",
    author: "ChatGPT",
    role: 0,
    cooldown: 3,
    category: "info",
    shortDescription: {
      en: "Send bot information"
    },
    longDescription: {
      en: "Sends detailed information about the bot when command is used."
    },
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, event }) {
    const infoMessage = `
🤖 BOT INFORMATION 🤖

📌 BOT NAME: MAKIMA
👤 BOT ACCOUNT: LISA DELRAY
🛠️ BOT CREATOR: APON
🌍 BOT WORLD PREFIX: /

📱 BOT OWNER INFO:
   • Facebook: APON DICAPRIO
   • Instagram: apon_dicaprio
   • TikTok: apon_dicaprio
   • Full Name: MOHAMMED APON

──────────────────────
📢 LAST MESSAGE:
If you want to connect the bot to your group chat then simply send a friend request to the bot account and add the bot to your group chat.
    `;

    try {
      return api.sendMessage(infoMessage, event.threadID, event.messageID);
    } catch (err) {
      return api.sendMessage(
        "❌ Failed to send bot info.",
        event.threadID,
        event.messageID
      );
    }
  }
};
