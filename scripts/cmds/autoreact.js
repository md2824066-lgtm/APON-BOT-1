const axios = require("axios");

// AutoReact toggle (true = ON, false = OFF)
let autoReactEnabled = true;

module.exports = {
  config: {
    name: "autoreact",
    aliases: ["ar"],
    version: "8.0",
    author: "Apon",
    countDown: 5,
    role: 0,
    shortDescription: "Messenger AI + Emotion-based AutoReact",
    longDescription: "Bot detects user text emotion (AI + Bangla/Banglish + Adult) and reacts with a single emoji based on the detected emotion.",
    category: "fun"
  },

  onStart: async function () {},

  onCommand: async function({ api, event, args }) {
    const cmd = args[0]?.toLowerCase();
    if(cmd === "on") {
      autoReactEnabled = true;
      return api.sendMessage("✅ AutoReact is now ON", event.threadID, event.messageID);
    } else if(cmd === "off") {
      autoReactEnabled = false;
      return api.sendMessage("❌ AutoReact is now OFF", event.threadID, event.messageID);
    } else {
      return api.sendMessage("Usage: /autoreact on | off", event.threadID, event.messageID);
    }
  },

  onChat: async function ({ api, event }) {
    try {
      if (!autoReactEnabled) return;

      const text = event.body?.toLowerCase();
      if (!text) return;

      // =================
      // 1) AI Sentiment detection
      // =================
      let sentiment = "neutral";
      try {
        const res = await axios.post("https://sentim-api.herokuapp.com/api/v1/",
          { text },
          { headers: { "Content-Type": "application/json" } }
        );
        sentiment = res.data.result.type; // positive / negative / neutral
      } catch (err) {
        console.log("Sentiment API fail:", err.message);
      }

      // =================
      // 2) Context detection (Bangla/Banglish/Adult keywords)
      // =================
      let context = "neutral";

      const adultKeywords = [
        "sex","fuck","chuda","চুদ","chudi","choda","চোদা","kiss","চুমু","চুমা",
        "boob","স্তন","নিপল","nipple","dick","cock","লিঙ্গ","vagina","pussy","গুদ","cunt",
        "ass","gand","পাছা","butt","🍑","🍆","blowjob","handjob","bj","hj","suck","cum","hot","sexy"
      ];

      if(adultKeywords.some(k => text.includes(k))) context = "adult";
      else if (/ভালোবাসি|valobasi|love|prem/.test(text)) context = "love";
      else if (/হাহা|haha|lol|😂/.test(text)) context = "laugh";
      else if (/tease|chumma|চুমু|😏|😉/.test(text)) context = "tease";
      else if (/দুঃখ|dukho|cry|sad|কাঁদ|breakup/.test(text)) context = "sad";
      else if (/রাগ|rag|angry|fuck|gali/.test(text)) context = "angry";
      else if(sentiment === "positive") context = "positive";
      else if(sentiment === "negative") context = "negative";
      else context = "neutral";

      // =================
      // 3) Emoji pools
      // =================
      const emojiPools = {
        love: ["❤️","💖","😍","🥰","😘","💘","💝","💋","🥂","🌹","💐","🫶","🔥","💕","💞","💓","💗","💟","💌","💏","🫀","💑","🫂","💒"],
        laugh: ["😂","🤣","😆","😁","😄","😃","😹","😸","😺","🎉","👏","🙌","🔥","✨","😝","😛","🫠","🥳","🤩","🤪","😹"],
        tease: ["😏","😉","😼","🤭","🙊","👀","💋","👄","🫦","🥵","🫣","😽","😚","😛","🫤","🫥","🙃","🙂","😏"],
        sad: ["😢","😭","💔","🥀","😞","😔","😟","😣","😖","😫","😩","🥺","😿","🙁","😪","😓","🩸","☹️","😧","😨","😰","😥","😩"],
        angry: ["😡","🤬","💢","😠","👿","🖕","💣","😤","😾","😿","😈","👺","💥","⚡","🔥","💀","👊","✊","🤛","🤜","🩸"],
        adult: ["😏","🥵","👅","🍑","🍆","💦","🫦","💋","👄","🍌","🥒","🔞","🍓","🥭","🥥","🫐","💣","🍷","🍸","🍹","🫦","🫰","🫱","🫲","🫶","🫣","🥴","🤤","💋","👅","👄"],
        positive: ["😀","😃","😄","😁","😆","🤩","🥳","🔥","✨","🌹","💐","❤️","💖","💘","💝","💯","👏","🙌","👍","👌","✌️","🤟","🤘","🤙","🎉","🎊","🎶","🥰","😘","😍","🥂","🍫","🍭"],
        negative: ["😞","😔","😟","😕","🙁","☹️","😣","😖","😫","😩","🥺","😢","😭","😤","😠","😡","🤬","💔","🥀","👎","💀","🩸","😾","⚡","😨","😰","😧"],
        neutral: ["😐","😑","😶","🙄","🤔","🤨","🤷‍♂️","🤷‍♀️","🤦‍♂️","🤦‍♀️","👌","👍","🙃","🙂","😏","😴","🤫","🤭","🤝","🙏","🫱","🫲","🫶","🫥","🫤","😮‍💨","😬","🧐","😕","😇","💤"]
      };

      // Pick emoji pool based on context
      let pool = emojiPools[context] || emojiPools.neutral;

      // Pick single emoji randomly
      const reaction = pool[Math.floor(Math.random() * pool.length)];

      // React to the message
      await api.setMessageReaction(reaction, event.messageID, () => {}, true);

    } catch (e) {
      console.log("AutoReact Error:", e.message);
    }
  }
};
