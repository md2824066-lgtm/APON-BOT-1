const axios = require("axios");
const moment = require("moment-timezone");

module.exports.config = {
  name: "autosend",
  version: "2.1",
  role: 0,
  author: "Apon DiCaprio",
  description: "Automatically sends videos from API without caption (or only APON GOAT BOT)",
  category: "Media",
  usages: "No manual trigger needed",
  cooldowns: 5
};

const lastSent = {};

async function sendVideo(api, threadID, timeSlot) {
  try {
    // 🔹 API থেকে ভিডিও নেওয়া হচ্ছে
    const response = await axios.get("https://mahabub-apis.vercel.app/mahabub");
    const videoUrl = response.data?.data;

    if (!videoUrl) {
      return api.sendMessage("❌ No videos found! (Invalid API Response)", threadID);
    }

    const res = await axios.get(videoUrl, { responseType: "stream" });

    // 🔹 Caption ছাড়া ভিডিও (শুধু চাইলে নিচের bodyMsg ব্যবহার করবে)
    const bodyMsg = "APON GOAT BOT";

    api.sendMessage({
      body: bodyMsg, // ❌ যদি একদম ক্যাপশন না চাই, তাহলে এই লাইনটা মুছে ফেলবা
      attachment: res.data
    }, threadID);

    lastSent[threadID] = timeSlot;

  } catch (error) {
    console.error("🚨 API Error:", error);
    api.sendMessage("❌ Failed to fetch video.", threadID);
  }
}

function scheduleVideo(api) {
  const timeSlots = [
    "1:00AM", "2:00AM", "3:00AM", "4:00AM", "5:00AM", "6:00AM",
    "7:00AM", "8:00AM", "9:00AM", "10:00AM", "11:00AM", "12:00PM",
    "1:00PM", "2:00PM", "3:00PM", "4:00PM", "5:00PM", "6:00PM",
    "7:00PM", "8:00PM", "9:00PM", "10:00PM", "11:00PM", "12:00AM"
  ];

  setInterval(async () => {
    const currentTime = moment().tz("Asia/Dhaka").format("h:mmA");

    const threads = await api.getThreadList(100, null, ["INBOX"]);

    for (const thread of threads) {
      const threadID = thread.threadID;
      if (!thread.isGroup) continue;

      if (timeSlots.includes(currentTime) && lastSent[threadID] !== currentTime) {
        await sendVideo(api, threadID, currentTime);
      }
    }
  }, 30000); // প্রতি ৩০ সেকেন্ড পর সময় মিলিয়ে দেখে
}

module.exports.onLoad = function ({ api }) {
  if (global.autosendInitialized) return;
  global.autosendInitialized = true;

  scheduleVideo(api);
  console.log("✅ AutoSend Module Loaded (Only Video / APON GOAT BOT)");
};

module.exports.onStart = () => {};
