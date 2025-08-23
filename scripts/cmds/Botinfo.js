module.exports = {
  config: {
    name: "botinfo",
    version: "1.0.0",
    author: "ChatGPT",
    role: 0,
    cooldown: 3,
    category: "info",
    shortDescription: {
      en: "Send bot info image"
    },
    longDescription: {
      en: "Sends a fixed bot info image when command is used."
    },
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, event }) {
    const imgUrl = "https://files.catbox.moe/v4cqpq.jpg";
    try {
      const stream = await global.utils.getStreamFromURL(imgUrl);
      return api.sendMessage(
        { attachment: stream },
        event.threadID,
        event.messageID
      );
    } catch (err) {
      return api.sendMessage(
        "❌ Failed to send image.",
        event.threadID,
        event.messageID
      );
    }
  }
};
