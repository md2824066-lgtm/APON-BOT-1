module.exports = {
  config: {
    name: "info",
    aliases: ["about", "me"],
    version: "2.0",
    author: "Apon Dicaprio",
    countDown: 5,
    role: 0,
    shortDescription: "Show your premium royal profile",
    longDescription: "Displays a stylish cyber royal info card",
    category: "info"
  },

  onStart: async function ({ message }) {
    const profile = `
╔═══━━━─── • 👑 • ───━━━═══╗
        𝐑𝐎𝐘𝐀𝐋 𝐂𝐘𝐁𝐄𝐑 𝐈𝐃
╚═══━━━─── • 👑 • ───━━━═══╝

✨ 𝐍𝐚𝐦𝐞 : 『 𝘼𝙥𝙤𝙣 』
📅 𝐃.𝐎.𝐁 : 『 01•01•200* 』
🏠 𝐀𝐝𝐝𝐫𝐞𝐬𝐬 : 『 𝙇𝙖𝙠𝙨𝙝𝙢𝙞𝙥𝙪𝙧 』

🌐 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 : 『 Apon DiCaprio | Apon Xyro 』
📸 𝐈𝐧𝐬𝐭𝐚𝐠𝐫𝐚𝐦 : 『 @apon_dicaprio 』
🎶 𝐓𝐢𝐤𝐓𝐨𝐤 : 『 @apon_dicaprio 』

📧 𝐆𝐦𝐚𝐢𝐥 : 『 aponmohammed4241@gmail.com 』

╔═══━━━─── • ⚡ • ───━━━═══╗
     "𝐈 𝐑𝐔𝐋𝐄 𝐓𝐇𝐄 𝐆𝐀𝐌𝐄"
╚═══━━━─── • ⚡ • ───━━━═══╝
    `;

    message.reply(profile);
  }
};
