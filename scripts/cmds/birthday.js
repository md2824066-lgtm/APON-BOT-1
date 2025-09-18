const axios = require("axios");
const Jimp = require("jimp");
const fs = require("fs");

const frameUrl = "https://files.catbox.moe/kv4wyv.jpg"; // Your frame URL

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Fetch image safely with retries
const fetchImage = async (url) => {
  for (let i = 0; i < 3; i++) {
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer', timeout: 5000 });
      return await Jimp.read(Buffer.from(response.data));
    } catch (err) {
      if (i === 2) throw err;
      await sleep(1000);
    }
  }
};

// Detect the largest white rectangle in the frame
const detectWhiteBox = (frame) => {
  const { width, height } = frame.bitmap;
  let minX = width, minY = height, maxX = 0, maxY = 0;

  frame.scan(0, 0, width, height, function(x, y, idx) {
    const r = this.bitmap.data[idx + 0];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];

    if (r > 240 && g > 240 && b > 240) {
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  });

  return {
    x: minX,
    y: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1
  };
};

module.exports = {
  config: {
    name: "birthday",
    aliases: ["wish"],
    version: "17.0",
    role: 0,
    author: "MahMUD",
    category: "love",
    countDown: 5,
    guide: { en: "{p}{n} @mention" },
  },

  onStart: async function({ api, event }) {
    const mentions = Object.keys(event.mentions);
    if (mentions.length === 0) {
      return api.sendMessage("❌ You need to tag someone to wish!", event.threadID, event.messageID);
    }

    try {
      const frameOriginal = await fetchImage(frameUrl);

      // Detect the white rectangle automatically
      const box = detectWhiteBox(frameOriginal);

      // Loop through each mentioned user
      for (let i = 0; i < mentions.length; i++) {
        const userID = mentions[i];
        const userName = event.mentions[userID].replace("@", "");

        // Fetch avatar
        const avatarOriginal = await fetchImage(`https://graph.facebook.com/${userID}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);

        // All wishes (~80 words each, 14 wishes)
        const wishes = [
          `🎉💖 Happy Birthday, ${userName}! Today is a celebration of your unique light, the endless love you give, and the incredible person you are. May your heart overflow with joy, your soul find peace, and every moment of the year bring you unforgettable experiences, courage, hope, deep happiness, and inspiration that reminds you how truly special you are in the lives of everyone around you.`,
          `🌹✨ Dear ${userName}, life has tested you in many ways, shaping you into a wise and resilient soul. May this birthday bring adventures, countless smiles, hope, love, and opportunities that guide you toward your dreams. Let every day be filled with joy, laughter, meaningful connections, and memories that warm your heart, enrich your life, and fill your soul with lasting happiness.`,
          `💫🎂 Happy Birthday, ${userName}! Life is a beautiful tapestry of lessons, love, joy, and sorrow. May this year be a chapter full of growth, laughter, love that nourishes your soul, courage to face challenges, and moments that bring you closer to fulfillment, happiness, and the inspiration you have always longed for in your heart and spirit.`,
          `🥂🌸 To ${userName}, may the universe conspire to shower you with joy, peace, love, and endless opportunities. Celebrate the incredible person you are, the light you bring to others, and may this year overflow with unforgettable moments, personal victories, and boundless happiness that inspires your mind, uplifts your spirit, and fills your life with extraordinary experiences beyond measure.`,
          `💌🎉 Happy Birthday, ${userName}! May this day remind you of the beauty within you, the love around you, and the infinite possibilities ahead. Embrace past lessons, triumphs, and the hope that fuels your future. Let laughter, love, inspiration, and joy accompany every step, filling your life with fulfillment, peace, unforgettable memories, and boundless happiness throughout the coming year.`,
          `🌟🎂 Hey ${userName}, birthdays celebrate your journey, courage, and achievements. May your heart overflow with love, your mind with peace, and your soul with endless inspiration, while every moment brings joy, growth, and experiences that leave lasting imprints on your heart and help you realize your dreams and full potential in life.`,
          `🎉💖 Happy Birthday, ${userName}! Celebrate not just the years, but the resilience, kindness, and wisdom that define you. May every day ahead bring laughter, fulfillment, adventures, meaningful connections, and endless love that embraces your soul, inspires your mind, and allows you to live life fully while touching the lives of everyone around you.`,
          `💫🥳 To ${userName}, may every moment of your birthday bring reflection, joy, and realization of your extraordinary potential. Embrace the beauty of life, the love that surrounds you, and the unique contributions only you can make. May laughter, hope, peace, and success accompany you on this remarkable journey, filling your year with unforgettable moments, growth, and happiness.`,
          `🌹✨ Happy Birthday, ${userName}! Life is a journey of lessons, discoveries, and emotional experiences. May you find the courage to overcome fears, the wisdom to learn from challenges, the strength to chase your deepest dreams, and the love that nurtures your soul. May every day of this year bring hope, joy, and remarkable memories to treasure.`,
          `💌🌟 Dear ${userName}, as you celebrate this special day, may every moment remind you of your worth, your beauty, and the extraordinary impact you have on those around you. May laughter, inspiration, love, hope, and happiness accompany your every step. Let challenges become stepping stones, sorrows transform into lessons, and may every experience strengthen your spirit.`,
          `💖🌙 Dear ${userName}, even when the weight of life feels unbearable, know that your heart is strong, resilient, and capable of extraordinary love and courage. May every obstacle transform into a lesson of growth, every tear nourish your inner wisdom, every fear be replaced by hope, and every joy multiply abundantly, filling your year with love, peace, and happiness.`,
          `🌹💫 ${userName}, life may present challenges that seem overwhelming, and moments of sorrow may cloud your heart, yet you possess a strength, resilience, and light that surpass all darkness. May every hardship teach you patience, every setback spark determination, every smile remind you of love, and every step forward bring fulfillment and joy.`,
          `✨💌 To ${userName}, birthdays are a reminder of how far you have come, the battles you have fought, and the beauty that resides within your soul. Embrace the journey, forgive the past, cherish the present, and dream boldly for the future. May love, hope, courage, wisdom, laughter, and extraordinary experiences enrich your life every day.`,
          `🌟🎂 ${userName}, as another year unfolds, may you find inspiration in every sunrise, strength in every challenge, and love in every gesture that touches your heart. Let every trial reveal your inner courage, every tear deepen your compassion, and every dream awaken your soul. Celebrate the remarkable person you are and the endless possibilities ahead.`
        ];

        // Pick a random wish for this user
        const randomIndex = Math.floor(Math.random() * wishes.length);
        const selectedWish = wishes[randomIndex];

        const frame = frameOriginal.clone();
        const avatar = avatarOriginal.clone();

        avatar.cover(box.width, box.height);
        frame.composite(avatar, box.x, box.y);

        const imagePath = `/tmp/birthday_${userID}.png`;
        await frame.writeAsync(imagePath);

        await api.sendMessage(
          { body: selectedWish, attachment: fs.createReadStream(imagePath) },
          event.threadID,
          event.messageID
        );
        await sleep(1000); // small delay for multiple users
      }
    } catch (err) {
      api.sendMessage(`❌ Something went wrong: ${err.message}`, event.threadID, event.messageID);
    }
  },
};
