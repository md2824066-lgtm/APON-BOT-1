module.exports = {
  config: {
    name: "aponCheck",
    author: "Apon",
    category: "fun",
    version: "1.3"
  },

  onStart: async function ({ api, event }) {
    // onStart এ কিছু লাগবে না
  },

  onChat: async function ({ api, event }) {
    try {
      const message = event.body?.toLowerCase();

      // "apon" (english) বা "আপন" (bangla) থাকলে
      if (message && (message.includes("apon") || message.includes("আপন"))) {
        api.sendMessage(
          "এই তুই আমার ক্রিয়েটার আপন এর নাম নিলি কেন ? তোর কি মরার চুলকানি উঠেছে 😡",
          event.threadID,
          event.messageID
        );
      }
    } catch (e) {
      console.error(e);
    }
  }
};
