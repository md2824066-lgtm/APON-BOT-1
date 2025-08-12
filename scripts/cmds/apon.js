module.exports.config = {
  name: "apon",
  version: "1.0",
  author: "Apon",
  role: 0,
  description: "Auto reply when someone says Apon",
  guide: "Just type Apon, no prefix needed",
  category: "fun",
  noPrefix: true
};

module.exports.handleEvent = function ({ api, event }) {
  const trigger = "apon"; // keyword
  if (event.body && event.body.toLowerCase().includes(trigger)) {
    return api.sendMessage(
      "আমার ক্রিয়েটার আপন অনেক ভালো মনের মানুষ তিনি খুবই একা থাকতে ভালবাসে । তিনি তার জীবনে একজন মেয়ের প্রতি বেশি দুর্বল ছিলেন যাকে তিনি ক্লাস ৩ থেকে পছন্দ করতেন কিন্তু সেই মেয়ে তাকে পছন্দ করতো না আর এই কারণে আমার ক্রিয়েটার তার পছন্দের মানুষ কে পাইনি",
      event.threadID,
      event.messageID
    );
  }
};

module.exports.run = async function () {};
