module.exports = {
  config: {
    name: "info",
    aliases: ["botinfo", "owner"],
    version: "1.0",
    author: "Md Apon",
    countDown: 5,
    role: 0,
    shortDescription: "Show bot and owner information",
    longDescription: "Displays detailed information about the bot and its owner",
    category: "info",
    guide: "{pn}"
  },

  onStart: async function ({ api, event }) {
    const ownerName = "Md Apon";
    const ownerFB = "https://facebook.com/apon.dicaprio";
    const contact = "+8801765144###"; // Replace ### with actual digits
    const botName = "My Messenger Goat Bot";
    const version = "1.0";
    const prefix = "!";
    const groupLink = "No Group";

    const message = 
`📌 BOT INFORMATION
━━━━━━━━━━━━━━━━
🤖 Bot Name: ${botName}
⚙ Version: ${version}
💬 Prefix: ${prefix}

👑 OWNER INFORMATION
━━━━━━━━━━━━━━━━
👤 Name: ${ownerName}
📘 Facebook: ${ownerFB}
📱 Contact: ${contact}

🌐 COMMUNITY
━━━━━━━━━━━━━━━━
🔗 Group: ${groupLink}

✨ Thank you for using the bot!`;

    api.sendMessage(message, event.threadID, event.message
