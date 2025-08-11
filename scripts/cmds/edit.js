const axios = require("axios");
const { getStreamFromURL } = global.utils;

module.exports = {
  config: {
    name: "edit",
    aliases: [],
    role: 0,
    author: "Fahim (edited by Saim)",
    // ❌ Do not change author
    countDown: 5,
    category: "image",
    guide: {
      en: "{pn} make this image black white (reply to image)"
    }
  },

  onStart: async function ({ message, event, args, api, threadsData }) {
    const globalPrefix = global.GoatBot.config.prefix || "!";
    const threadPrefix = await threadsData.get(event.threadID, "data.prefix") || globalPrefix;

    const rawText = args.join(" ").toLowerCase();
    if (rawText === "help" || rawText === "--help") {
      return message.reply(
`╔═══『 𝗘𝗗𝗜𝗧 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗛𝗘𝗟𝗣 』═══╗
┃
┃ 🖼️ 𝗛𝗼𝘄 𝘁𝗼 𝗨𝘀𝗲:
┃ ➤ Reply to an image
┃ ➤ Write what you want to edit
┃
┃ 💡 𝗘𝘅𝗮𝗺𝗽𝗹𝗲𝘀:
┃ ${threadPrefix}edit make this image black white
┃ ${threadPrefix}edit blur the face
┃
┃ ⚠️ Must reply to an image!
╚══════════════════════════╝`
      );
    }

    if (!event.messageReply || !event.messageReply.attachments || !event.messageReply.attachments[0]?.url) {
      return message.reply(
`❌ 𝗘𝗿𝗿𝗼𝗿: 𝗡𝗼 𝗜𝗺𝗮𝗴𝗲 𝗙𝗼𝘂𝗻𝗱!
👉 Please reply to a photo you want to edit.`
      );
    }

    if (!args[0]) {
      return message.reply(
`📝 𝗣𝗹𝗲𝗮𝘀𝗲 𝗣𝗿𝗼𝘃𝗶𝗱𝗲 𝗮 𝗣𝗿𝗼𝗺𝗽𝘁!
👉 Example: ${threadPrefix}edit make it black and white`
      );
    }

    const prompt = encodeURIComponent(args.join(" "));
    const imgUrl = encodeURIComponent(event.messageReply.attachments[0].url);
    const geditUrl = `https://smfahim.xyz/gedit?prompt=${prompt}&url=${imgUrl}`;

    api.setMessageReaction("🐤", event.messageID, () => {}, true);

    message.reply("🎨 Editing your image, please wait...", async (err, info) => {
      try {
        const attachment = await getStreamFromURL(geditUrl);

        message.reply({
          body:
`✅ 𝗘𝗱𝗶𝘁 𝗖𝗼𝗺𝗽𝗹𝗲𝘁𝗲𝗱!
📤 Here is your edited image 👇`,
          attachment: attachment
        });

        const waitMsgID = info.messageID;
        message.unsend(waitMsgID);
        api.setMessageReaction("🐸", event.messageID, () => {}, true);
      } catch (error) {
        console.error("Edit error:", error.message);
        message.reply(
`📛 𝗙𝗮𝗶𝗹𝗲𝗱 𝘁𝗼 𝗘𝗱𝗶𝘁 𝗜𝗺𝗮𝗴𝗲!
🚫 Please try again later or check your prompt.`
        );
      }
    });
  }
};
