const axios = require("axios");

module.exports = {
  config: {
    name: "as",
    version: "1.1",
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
Here’s the social information of the bot owner along with all the uploaded photos below. ❤️ Enjoy!
`;

    // Send the text first
    await message.reply(text);

    // Download all images as streams
    const attachments = await Promise.all(
      urls.map(url => global.utils.getStreamFromURL(url))
    );

    // Send all images together in one message
    await message.reply({
      body: "", // no extra text
      attachment: attachments
    });
  },

  // Make it respond to AS/as/As/aS
  onChat: async function({ event, message }) {
    const body = event.body?.trim()?.toLowerCase();
    if (["as"].includes(body)) {
      await this.onStart({ message });
    }
  }
};
