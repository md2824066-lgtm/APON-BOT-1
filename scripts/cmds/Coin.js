const fs = require("fs");
const path = require("path");

const dataFile = path.join(__dirname, "coinData.json");

// Load & Save Functions
function loadData() {
  if (!fs.existsSync(dataFile)) return {};
  return JSON.parse(fs.readFileSync(dataFile));
}
function saveData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

module.exports = {
  config: {
    name: "coin",
    author: "Custom by GPT",
    category: "game",
    description: "Toss game (Head or Tail) + Balance + Leaderboard",
  },

  onStart: async function ({ api, event, args }) {
    try {
      let data = loadData();
      if (!data[event.senderID]) data[event.senderID] = { coins: 0 };

      const cmd = args[0]?.toLowerCase();

      // ✅ /coin balance
      if (cmd === "balance") {
        return api.sendMessage(
          `💳 𝗖𝗼𝗶𝗻 𝗕𝗮𝗹𝗮𝗻𝗰𝗲\n👤 User: ${event.senderID}\n🏦 Coins: ${data[event.senderID].coins}`,
          event.threadID,
          event.messageID
        );
      }

      // ✅ /coin leaderboard
      if (cmd === "leaderboard") {
        let leaderboard = Object.entries(data)
          .sort((a, b) => b[1].coins - a[1].coins)
          .slice(0, 10);

        if (leaderboard.length === 0) {
          return api.sendMessage("📊 Leaderboard is empty!", event.threadID, event.messageID);
        }

        let msg = "🏆 𝗧𝗼𝗽 𝗖𝗼𝗶𝗻 𝗟𝗲𝗮𝗱𝗲𝗿𝗯𝗼𝗮𝗿𝗱 🏆\n\n";
        leaderboard.forEach(([id, userData], index) => {
          msg += `${index + 1}. 👤 ${id} → ${userData.coins} coins\n`;
        });

        return api.sendMessage(msg, event.threadID, event.messageID);
      }

      // ✅ /coin head OR tail
      if (!cmd || !["head", "tail"].includes(cmd)) {
        return api.sendMessage(
          "⚠️ Usage:\n/coin head\n/coin tail\n/coin balance\n/coin leaderboard",
          event.threadID,
          event.messageID
        );
      }

      const outcomes = ["head", "tail"];
      const result = outcomes[Math.floor(Math.random() * outcomes.length)];

      // Images
      const imageMap = {
        head: "https://files.catbox.moe/p4d58u.jpg", // Head image
        tail: "https://files.catbox.moe/8p20oz.jpg"  // Tail image
      };

      let message = "";

      if (cmd === result) {
        data[event.senderID].coins += 1;
        message =
`╔══════════════════╗
   🌿✨ 𝗬𝗢𝗨 𝗪𝗢𝗡 ✨🌿
╚══════════════════╝

🎯 Your Choice: ${cmd.toUpperCase()}
✅ Toss Result: ${result.toUpperCase()}

🏆 Congratulations!
➕ +1 Coin

💳 Balance: ${data[event.senderID].coins} coins
═════════════════════`;
      } else {
        data[event.senderID].coins = Math.max(0, data[event.senderID].coins - 1);
        message =
`╔══════════════════╗
   🔥💔 𝗬𝗢𝗨 𝗟𝗢𝗦𝗧 💔🔥
╚══════════════════╝

🎯 Your Choice: ${cmd.toUpperCase()}
❌ Toss Result: ${result.toUpperCase()}

😔 Better luck next time!
➖ -1 Coin

💳 Balance: ${data[event.senderID].coins} coins
═════════════════════`;
      }

      saveData(data);

      // Always send result image
      const attachment = await global.utils.getStreamFromURL(imageMap[result]);

      api.sendMessage(
        { body: message, attachment },
        event.threadID,
        event.messageID
      );

    } catch (error) {
      api.sendMessage("❌ Error: " + error.message, event.threadID, event.messageID);
    }
  },
};
