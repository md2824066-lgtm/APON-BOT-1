const axios = require("axios");
const { GoatWrapper } = require("fca-liane-utils");

module.exports = {
  config: {
    name: "4k",
    aliases: ["upscale"],
    version: "1.1",
    role: 0,
    author: "Fahim_Noob",
    countDown: 5,
    longDescription: "Upscale images to 4K resolution.",
    category: "image",
    guide: {
      en: "${pn} reply to an image to upscale it to 4K resolution."
    }
  },

  onStart: async function ({ message, event }) {
    if (!event.messageReply || !event.messageReply.attachments || !event.messageReply.attachments[0]) {
      return message.reply("Please reply to an image to upscale it.");
    }

    const imgurl = encodeURIComponent(event.messageReply.attachments[0].url);
    const noobs = 'xyz'; // replace with actual domain suffix
    const upscaleUrl = `https://smfahim.${noobs}/4k?url=${imgurl}`;

    message.reply("𝙿𝚕𝚜 𝚆8 𝙱𝚘𝚜𝚜😉.", async (err, info) => {
      try {
        const { data: { image } } = await axios.get(upscaleUrl);
        const attachment = await global.utils.getStreamFromURL(image, "upscaled-image.png");

        message.reply({
          body: "✅| 𝙷𝚎𝚛𝚎 𝚒𝚜 𝙱𝚘𝚜𝚜 4𝚔 𝚞𝚙𝚜𝚌𝚊𝚕𝚎𝚍 𝚒𝚖𝚐:",
          attachment: attachment
        });

        let processingMsgID = info.messageID;
        message.unsend(processingMsgID);

      } catch (error) {
        console.error(error);
        message.reply("❌| There was an error upscaling your image.");
      }
    });
  }
};

// ✅ Enable no-prefix support
const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });
