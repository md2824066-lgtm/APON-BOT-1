const axios = require("axios");

module.exports = {
  config: {
    name: "as",
    version: "1.0",
    author: "Johir",
    role: 0,
    shortDescription: {
      en: "Shows the social info of bot owner"
    },
    longDescription: {
      en: "Sends a beautiful message along with 7 uploaded images showing the social information of the bot owner."
    },
    category: "vip",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function({ message }) {
    const urls = [
      "https://files.catbox.moe/54b0bh.jpg",
      "https://files.catbox.moe/nb3d3x.jpg",
      "https://files.catbox.moe/jqwlxr.jpg",
      "https://files.catbox.moe/iukm32.jpg",
      "https://files.catbox.moe/44fpnk.jpg",
      "https://files.catbox.moe/uq3ela.jpg",
      "https://files.catbox.moe/fuwsyz.jpg"
    ];

    const text = `💎✨ HERES THE SOCIAL INFORMATIONS OF BOT OWNER ✨💎

Hello! 👋
Here’s the social information of the bot owner along with the uploaded photos below. ❤️ Enjoy!
`;

    await message.reply(text);

    for (const url of urls) {
      await message.reply({
        body: "✅ Here's your Uploaded Url ✨",
        attachment: await global.utils.getStreamFromURL(url)
      });
    }
  },

  // 👇 This part makes "AS", "as", "As", "aS" all work
  onChat: async function({ event, message }) {
    const body = event.body?.trim()?.toLowerCase();
    if (["as"].includes(body)) {
      await this.onStart({ message });
    }
  }
};
