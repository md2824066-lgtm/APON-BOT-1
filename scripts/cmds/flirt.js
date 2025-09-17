const fs = require("fs");
const path = __dirname + "/cache/flirtOn.json";

// Ensure cache folder exists
if (!fs.existsSync(__dirname + "/cache")) {
  fs.mkdirSync(__dirname + "/cache", { recursive: true });
}

// Ensure JSON file exists
if (!fs.existsSync(path)) {
  fs.writeFileSync(path, JSON.stringify({}));
}

// Load flirt data
function loadData() {
  return JSON.parse(fs.readFileSync(path));
}

// Save flirt data
function saveData(data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

const OWNER_ID = ["100093362964794"]; // এখানে তোমার FB numeric ID দাও

module.exports = {
  config: {
    name: "flirt",
    version: "4.0",
    author: "Amit Max ⚡ | Fixed & Upgraded by Apon",
    description: "Sequential flirt mode with multi-user support",
    category: "fun",
    usages: "[on/off/list @tag]",
    cooldowns: 5,
    role: 0,
  },

  onStart: async function ({ api, event, args }) {
    const data = loadData();
    const threadID = event.threadID;

    if (!data[threadID]) data[threadID] = {};

    // LIST command
    if (args[0] === "list") {
      const users = Object.keys(data[threadID]);
      if (users.length === 0) {
        return api.sendMessage("📋 এই গ্রুপে কেউ flirt mode এ নেই।", threadID);
      }
      let msg = "💖 Flirt Mode ON:\n";
      users.forEach((uid, i) => {
        msg += `${i + 1}. ${uid}\n`;
      });
      return api.sendMessage(msg, threadID);
    }

    // ON/OFF command needs mention
    if (!event.mentions || Object.keys(event.mentions).length === 0) {
      return api.sendMessage("⚠️ @tag ব্যবহার করো!", threadID);
    }

    const mentions = Object.keys(event.mentions);
    const action = args[0];

    if (action === "on") {
      mentions.forEach(uid => {
        if (!data[threadID][uid]) {
          data[threadID][uid] = { index: 0 };
        }
      });
      saveData(data);
      return api.sendMessage(`✅ Flirt mode চালু হলো ${mentions.length} জনের জন্য 😘`, threadID);
    }

    if (action === "off") {
      mentions.forEach(uid => {
        delete data[threadID][uid];
      });
      saveData(data);
      return api.sendMessage(`❌ Flirt mode বন্ধ হলো ${mentions.length} জনের জন্য 🙃`, threadID);
    }

    return api.sendMessage("⚠️ ব্যবহার: .flirt on/off/list @tag", threadID);
  },

  onChat: async function ({ api, event }) {
    const data = loadData();
    const threadID = event.threadID;
    const senderID = event.senderID;

    if (!data[threadID] || !data[threadID][senderID]) return;

    // Flirt Lines (তোমার আগের সব লাইন + extra random লাইন)
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
      "তুমি হাসলে earth এর gravity 2 sec off হয়ে যায় 🌍🫠",
      "😏 তুমি কি সবসময় এত কিউট নাকি শুধু আজকেই?",
      "😉 তোমার হাসি আমার দিনের পাওয়ারব্যাঙ্ক!",
      "🥰 আমি কি তোমাকে মিস করছিলাম নাকি তুমি আমায়?",
      "😘 তোমার সাথে কথা বললেই mood fresh হয়ে যায়!",
      "😍 তুমি একদম পারফেক্ট ক্রাশ মেটেরিয়াল!"
    ];

    const user = data[threadID][senderID];
    const line = flirts[user.index];

    // Send flirt line
    api.sendMessage(line, event.threadID, event.messageID);

    // Update index (loop back to start)
    user.index = (user.index + 1) % flirts.length;
    saveData(data);
  }
};
