module.exports.config = {
  name: "font",
  version: "2.0",
  author: "Apon Premium",
  role: 0,
  description: "Convert text into multiple stylish & premium fonts",
  category: "Fun",
  usages: "[text]",
  cooldowns: 3,
};

const fonts = {
  fancy1: str => str.replace(/[a-zA-Z]/g, c => String.fromCharCode(c.charCodeAt(0) + 119951)), // 𝓐 𝓑 𝓒
  fancy2: str => str.replace(/[a-z]/g, c => String.fromCharCode(c.charCodeAt(0) - 97 + 0x1D41A)), // 𝗮 𝗯 𝗰
  fancy3: str => str.split("").map(c => `『${c}』`).join(""),
  fancy4: str => str.split("").map(c => `★${c}`).join(""),
  fancy5: str => str.split("").map(c => `꧁༺${c}༻꧂`).join(""),
  fancy6: str => str.split("").map(c => c + "͎").join(""),
  fancy7: str => str.toUpperCase().split("").map(c => `【${c}】`).join(" "),
  fancy8: str => str.split("").map(c => `♡${c}♡`).join(""),
  fancy9: str => str.split("").reverse().join(""),
  fancy10: str => str.toLowerCase().split("").map(c => `✧${c}✧`).join(""),
  fancy11: str => str.split("").map(c => `༺${c}༻`).join(""),
  fancy12: str => str.split("").map(c => `•${c}•`).join(""),
  fancy13: str => str.split("").map(c => `✪${c}✪`).join(""),
  fancy14: str => str.split("").map(c => `❀${c}❀`).join(""),
  fancy15: str => str.split("").map(c => `✦${c}✦`).join(""),
  fancy16: str => str.split("").map(c => `☬${c}☬`).join(""),
  fancy17: str => str.split("").map(c => `꧁${c}꧂`).join(""),
  fancy18: str => str.split("").map(c => `✯${c}✯`).join(""),
  fancy19: str => str.split("").map(c => `✰${c}✰`).join(""),
  fancy20: str => str.split("").map(c => `➳${c}➳`).join(""),
  fancy21: str => str.split("").map(c => `★✩${c}✩★`).join(""),
  fancy22: str => str.split("").map(c => `༒${c}༒`).join(""),
};

module.exports.onStart = async function ({ event, args, api }) {
  if (!args[0]) return api.sendMessage("⚡ Please provide a text!\n\nExample: /font Apon", event.threadID, event.messageID);

  const input = args.join(" ");
  let output = "🌹 𝗬𝗼𝘂𝗿 𝗣𝗿𝗲𝗺𝗶𝘂𝗺 𝗙𝗼𝗻𝘁 𝗦𝘁𝘆𝗹𝗲𝘀 🌹\n\n";

  let count = 1;
  for (let style in fonts) {
    output += `${count}. ${fonts[style](input)}\n`;
    count++;
  }

  api.sendMessage(output, event.threadID, event.messageID);
};
