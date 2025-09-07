const fs = require("fs");
const path = __dirname + "/cache/flirtOn.json";

const OWNER_ID = ["61550806961724",];

module.exports = {
  config: {
    name: "flirt",
    version: "2.0",
    author: "Amit Max ⚡| Ew'r Saim",
    description: "Sequential flirt mode with Boss Saim's flavor",
    category: "fun",
    usages: "[on/off @tag]",
    cooldowns: 5,
    role: 0,
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID, mentions, senderID } = event;

    if (!OWNER_ID.includes(senderID)) {
      return api.sendMessage(
        "😒 এইটা কি তুমার বাপের flirt command নাকি? এইটা শুধু apon vai আর উনার নির্ধারিত admin-রা চালাতে পারবেন! 🫡",
        threadID,
        messageID
      );
    }

    if (!fs.existsSync(path)) fs.writeFileSync(path, "[]", "utf-8");
    let flirtList;
    try {
      flirtList = JSON.parse(fs.readFileSync(path, "utf-8"));
    } catch {
      flirtList = [];
    }

    if (args.length === 0) {
      return api.sendMessage(
        `💖 ব্যবহার:\n.flirt on @user - ফ্লার্ট মোড চালু\n.flirt off - ফ্লার্ট মোড বন্ধ`,
        threadID,
        messageID
      );
    }

    const command = args[0].toLowerCase();

    if (command === "off") {
      const updatedList = flirtList.filter(e => e.threadID !== threadID);
      fs.writeFileSync(path, JSON.stringify(updatedList, null, 2), "utf-8");
      return api.sendMessage("🥺 ফ্লার্ট মোড এখন বন্ধ! মিষ্টি কথা শুনতে পাবে না!", threadID, messageID);
    }

    if (command === "on") {
      if (!mentions || Object.keys(mentions).length === 0) {
        return api.sendMessage("🧐 কাকে ফ্লার্ট করতে চান? দয়া করে ট্যাগ দিন।", threadID, messageID);
      }

      const mentionID = Object.keys(mentions)[0];

      const exists = flirtList.some(
        e => e.threadID === threadID && e.userID === mentionID
      );

      if (exists) {
        return api.sendMessage(
          `😉 ${mentions[mentionID].replace("@", "")} তো আগেই ফ্লার্ট মোডে আছেন!`,
          threadID,
          messageID
        );
      }

      flirtList.push({ threadID, userID: mentionID, index: 0 });
      fs.writeFileSync(path, JSON.stringify(flirtList, null, 2), "utf-8");

      return api.sendMessage(
        `💘 ${mentions[mentionID].replace("@", "")} এখন থেকে ফ্লার্ট মোডে আছেন!\nতিনি কিছু বললেই প্রেমে পড়া যাবে! 💞\n\n🔮 Powered by Apon Vai 😎`,
        threadID,
        messageID
      );
    }
  },

  onChat: async function ({ api, event }) {
    if (!event.isGroup) return;
    if (!fs.existsSync(path)) return;

    let flirtList;
    try {
      flirtList = JSON.parse(fs.readFileSync(path, "utf-8"));
    } catch {
      flirtList = [];
    }

    const index = flirtList.findIndex(
      e => e.threadID === event.threadID && e.userID === event.senderID
    );

    if (index === -1) return;

    // Flirt Lines List (original + 10 new added)
    const flirts = [
      "Apon boss বলেন, তুমার হাসি 4G এর চেয়েও fast 💞",
      "তুমি কথা বললেই মনটা বেঘর হয়ে যায় 🥺",
      "তুমাকে দেখলেই Apon vai er  bot reroute হয়ে যায় love mode এ 😎",
      "তুমার চোখে এমন charm, camera autofocus করতে পারে না 😳",
      "Boss Apon বলেন, তুমার মত সুন্দর মানুষ AI দুনিয়াতে rare 💘",
      "তুমি কথা বললে Google আমার কাছে আসতে চায় উত্তর নিতে 😌",
      "তুমার profile দেখে antivirus ও blush করে 🥵",
      "apon bhai approval দিছে – তুমিই flirt worthy 💅",
      "তুমার মিষ্টি কন্ঠ শুনে bot এর speaker melt করে 🎤🔥",
      "তুমাকে দেখলে মনে হয় ফুলের মধ্যে perfume ছিটাইছে 🌸",
      "Apon vai just said: ‘এইটা flirt না করলে তর bot r job nai!’ 😭",
      "তুমার chat এ incoming love detected 🛸💌",
      "তুমার vibe দেখলে light bulb এরো voltage বেড়ে যায় 💡❤️",
      "তুমি যেই look দাও, apon vai বলেন ‘ETA screenshot-worthy!’ 📸",
      "তুমার নাম লিখলেই spell checker প্রেমে পড়ে যায় 🥰",
      "তুমাকে দেখে তো crush গুলাও resign দিয়ে দেয় 😭",
      "তুমি online আসলেই notification গুলা love song বাজায় 🎶",
      "Boss Apon daily তুমার নাম নিয়া bot ke recharge করে ⚡",
      "তুমি যখন লেখো, keyboard নিজেই poem type করে ফেলে ✍️",
      "তুমি হাসলে earth এর gravity 2 sec off হয়ে যায় 🌍🫠"
    ];

    const user = flirtList[index];
    const line = flirts[user.index];

    // Send flirt line
    api.sendMessage(line, event.threadID, event.messageID);

    // Update index
    flirtList[index].index = (user.index + 1) % flirts.length;
    fs.writeFileSync(path, JSON.stringify(flirtList, null, 2), "utf-8");
  }
};
