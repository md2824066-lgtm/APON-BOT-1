const fs = require("fs");
const path = __dirname + "/cache/flirtOn.json";

const OWNER_ID = ["100093362964794"]; // এখানে তোমার FB numeric ID দাও

module.exports = {
  config: {
    name: "flirt",
    version: "3.0",
    author: "Amit Max ⚡ | Fixed by Apon",
    description: "Sequential flirt mode with Boss Apon's flavor",
    category: "fun",
    usages: "[on/off @tag]",
    cooldowns: 5,
    role: 0,
  },

  // 📌 Start Command
  onStart: async function ({ api, event, args }) {
    const { threadID, messageID, mentions, senderID } = event;

    // Only owner can run
    if (!OWNER_ID.includes(senderID)) {
      return api.sendMessage(
        "😒 এইটা কি তুমার বাপের flirt command নাকি? এটা শুধু Apon Vai আর উনার নির্ধারিত admin-রা চালাতে পারবেন! 🫡",
        threadID,
        messageID
      );
    }

    // Ensure JSON file
    if (!fs.existsSync(path)) fs.writeFileSync(path, "[]", "utf-8");

    let flirtList;
    try {
      flirtList = JSON.parse(fs.readFileSync(path, "utf-8"));
    } catch {
      flirtList = [];
    }

    if (args.length === 0) {
      return api.sendMessage(
        `💖 ব্যবহার:\n.flirt on @user - ফ্লার্ট মোড চালু\n.flirt off @user - ফ্লার্ট মোড বন্ধ`,
        threadID,
        messageID
      );
    }

    const command = args[0].toLowerCase();

    // 🛑 OFF Command
    if (command === "off") {
      if (!mentions || Object.keys(mentions).length === 0) {
        return api.sendMessage("🧐 কাকে off করবেন? দয়া করে ট্যাগ দিন।", threadID, messageID);
      }

      let removed = [];
      Object.keys(mentions).forEach(uid => {
        flirtList = flirtList.filter(e => !(e.threadID === threadID && e.userID === uid));
        removed.push(mentions[uid]);
      });

      fs.writeFileSync(path, JSON.stringify(flirtList, null, 2), "utf-8");
      return api.sendMessage(
        `🥺 ${removed.join(", ")} এর ফ্লার্ট মোড বন্ধ করা হলো!`,
        threadID,
        messageID
      );
    }

    // ✅ ON Command
    if (command === "on") {
      if (!mentions || Object.keys(mentions).length === 0) {
        return api.sendMessage("🧐 কাকে ফ্লার্ট করতে চান? দয়া করে ট্যাগ দিন।", threadID, messageID);
      }

      let added = [];
      Object.keys(mentions).forEach(uid => {
        const exists = flirtList.some(e => e.threadID === threadID && e.userID === uid);
        if (!exists) {
          flirtList.push({ threadID, userID: uid, index: 0 });
          added.push(mentions[uid]);
        }
      });

      fs.writeFileSync(path, JSON.stringify(flirtList, null, 2), "utf-8");

      if (added.length === 0) {
        return api.sendMessage("😉 এইসব ইউজার তো আগেই ফ্লার্ট মোডে আছে!", threadID, messageID);
      }

      return api.sendMessage(
        `💘 ${added.join(", ")} এখন থেকে ফ্লার্ট মোডে আছেন!\nতিনি কিছু বললেই প্রেমে পড়া যাবে! 💞\n\n🔮 Powered by Apon Vai 😎`,
        threadID,
        messageID
      );
    }
  },

  // 📌 Chat Event
  onChat: async function ({ api, event }) {
    // শুধুই group এ কাজ করবে
    if (!event.threadID || event.isGroup === false) return;
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

    // Flirt Lines
    const flirts = [
      "Apon boss বলেন, তুমার হাসি 4G এর চেয়েও fast 💞",
      "তুমি কথা বললেই মনটা বেঘর হয়ে যায় 🥺",
      "তুমাকে দেখলেই Apon vai er bot reroute হয়ে যায় love mode এ 😎",
      "তুমার চোখে এমন charm, camera autofocus করতে পারে না 😳",
      "Boss Apon বলেন, তুমার মত সুন্দর মানুষ AI দুনিয়াতে rare 💘",
      "তুমি কথা বললে Google আমার কাছে আসতে চায় উত্তর নিতে 😌",
      "তুমার profile দেখে antivirus ও blush করে 🥵",
      "Apon bhai approval দিছে – তুমিই flirt worthy 💅",
      "তুমার মিষ্টি কন্ঠ শুনে bot এর speaker melt করে 🎤🔥",
      "তুমাকে দেখলে মনে হয় ফুলের মধ্যে perfume ছিটাইছে 🌸",
      "Apon vai just said: ‘এইটা flirt না করলে তর bot r job nai!’ 😭",
      "তুমার chat এ incoming love detected 🛸💌",
      "তুমার vibe দেখলে light bulb এরো voltage বেড়ে যায় 💡❤️",
      "তুমি যেই look দাও, Apon vai বলেন ‘ETA screenshot-worthy!’ 📸",
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
