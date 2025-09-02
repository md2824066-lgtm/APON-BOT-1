const fs = require("fs");
const path = require("path");
const dataFile = path.join(__dirname, "coinData.json");

function loadData() { if (!fs.existsSync(dataFile)) return {}; return JSON.parse(fs.readFileSync(dataFile)); }
function saveData(data) { fs.writeFileSync(dataFile, JSON.stringify(data, null, 2)); }

module.exports = {
  config: { name: "slot", author:"GPT VIP", category:"game", description:"Slot Machine" },

  onStart: async ({ api, event }) => {
    let data = loadData();
    if (!data[event.senderID]) data[event.senderID] = { coins: 0 };

    const fruits = ["🍒","🍋","🍉","🍇","🍓"];
    const result = [fruits[Math.floor(Math.random()*fruits.length)],
                    fruits[Math.floor(Math.random()*fruits.length)],
                    fruits[Math.floor(Math.random()*fruits.length)]];

    const jackpot = result[0]===result[1] && result[1]===result[2];
    if(jackpot) data[event.senderID].coins += 2;  // +2 coin for win
    else data[event.senderID].coins = Math.max(0, data[event.senderID].coins - 1);

    saveData(data);

    const msg = jackpot 
      ? `╔════════════╗
🌟 𝗝𝗔𝗖𝗞𝗣𝗢𝗧! 🌟
╚════════════╝
🎰 ${result.join(" | ")}
🏆 +2 Coins
💳 Balance: ${data[event.senderID].coins}`
      : `╔════════════╗
💥 𝗬𝗢𝗨 𝗟𝗢𝗦𝗧 💥
╚════════════╝
🎰 ${result.join(" | ")}
💔 -1 Coin
💳 Balance: ${data[event.senderID].coins}`;

    return api.sendMessage(msg, event.threadID, event.messageID);
  }
};
