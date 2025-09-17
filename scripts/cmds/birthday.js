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

    // Treat as white if RGB all close to 255
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
    version: "13.0",
    role: 0,
    author: "Apon",
    category: "love",
    countDown: 5,
    guide: { en: "{p}{n} @mention" },
  },

  onStart: async function({ api, event }) {
    const mention = Object.keys(event.mentions);
    if (mention.length === 0) {
      return api.sendMessage("❌ You need to tag someone to wish!", event.threadID, event.messageID);
    }

    const taggedUserID = mention[0];
    const taggedUserName = event.mentions[taggedUserID].replace("@", "");

    const wishes = [
      `🎉💖 Happy Birthday, ${taggedUserName}! 💖🎉 Today is a celebration of the incredible person you are, the endless kindness you show, the love you share with the world, and the unique light that you bring into everyone’s life. May this year grant you unforgettable experiences, the courage to chase your dreams fearlessly, deep joy that fills your heart completely, and endless moments that remind you how truly special and loved you are.`,
      
      `🌹✨ Dear ${taggedUserName}, your journey has been filled with moments of struggle and triumph, and each challenge has shaped you into a stronger, wiser soul. May your birthday be a reminder of your resilience, the infinite potential within you, the unwavering love that surrounds you, and the countless opportunities that await. May every new day bring hope, peace, laughter, success, profound happiness, and experiences that fill your heart with unforgettable memories and everlasting joy.`,
      
      `💫🎂 Happy Birthday, ${taggedUserName}! Life is a beautiful tapestry woven with joy, sorrow, lessons, and love. May this year be a chapter full of growth, dreams realized, laughter echoing through your days, love that nourishes your soul, and courage to face every challenge. May your heart remain open to endless opportunities, your spirit soar with hope, and may every moment bring you closer to the happiness, fulfillment, and inspiration you have always longed for in your life.`,
      
      `🥂🌸 To ${taggedUserName}, on this special day, may the universe conspire to shower you with joy, peace, love, and endless opportunities. May your heart find serenity in every moment, your spirit remain unbreakable, your dreams take flight, and your journey be filled with magical experiences. Celebrate the incredible person you are, the light you bring into the lives of those around you, and may this year overflow with unforgettable moments, personal victories, and boundless happiness beyond measure.`,
      
      `💌🎉 Happy Birthday, ${taggedUserName}! May this day remind you of the beauty within you, the love that surrounds you, and the infinite possibilities that lie ahead. Embrace the lessons of the past, the triumphs that define you, and the hope that fuels your future. Let laughter, love, inspiration, and joy accompany you in every step, while challenges become lessons of strength and wisdom. May your soul always feel cherished, and may your life be an extraordinary journey of fulfillment and happiness.`,
      
      `🌟🎂 Hey ${taggedUserName}, birthdays are a celebration of existence, growth, and the remarkable journey of life. May your heart overflow with love, your mind remain at peace, and your spirit shine brightly through every challenge. May this year bring you countless opportunities for personal growth, unforgettable experiences that shape your soul, and moments of pure joy that leave lasting imprints on your heart. Remember that your presence is a gift to the world, and you deserve every happiness imaginable.`,
      
      `🎉💖 Happy Birthday, ${taggedUserName}! Celebrate not just the years that have passed, but the courage you have shown, the love you have shared, the lessons you have learned, and the countless memories that have made you who you are. May your path ahead be filled with inspiration, hope, laughter, and deep connections with those who truly cherish and support you. Let your dreams soar high, your spirit shine bright, and your heart always be filled with unending happiness and love.`,
      
      `💫🥳 To ${taggedUserName}, on this special occasion, may every moment of your birthday bring reflection, joy, and the realization of your extraordinary potential. Embrace the beauty of life, the love that surrounds you, and the unique contributions only you can make. May laughter fill your days, hope light your path, peace rest in your heart, and success in every endeavor accompany your journey. Let this year be a remarkable chapter of growth, fulfillment, inspiration, and unforgettable memories that you will treasure forever.`,
      
      `🌹✨ Happy Birthday, ${taggedUserName}! Life is a journey of endless lessons, discoveries, and emotional experiences. May you find the courage to overcome fears, the wisdom to learn from challenges, the strength to chase your deepest dreams, and the love that nurtures your soul. May every day of this year bring hope, joy, unforgettable adventures, and the kind of peace that allows you to grow into the remarkable person you were always meant to be, deeply loved and endlessly celebrated.`,
      
      `💌🌟 Dear ${taggedUserName}, as you celebrate this special day, may every moment remind you of your worth, your beauty, and the extraordinary impact you have on those around you. May laughter, inspiration, love, hope, and happiness accompany your every step. Let challenges become stepping stones, sorrows transform into lessons, and may every experience strengthen your spirit and enrich your heart. May your journey ahead overflow with unforgettable memories, immense joy, endless love, and boundless opportunities to shine your unique light in the world.`,
      
      // **5 new extremely long love/sad/motivational wishes (~80 words each)**
      `💖🌙 Dear ${taggedUserName}, even when the weight of life feels unbearable, know that your heart is strong, resilient, and capable of extraordinary love and courage. May every obstacle transform into a lesson of growth, every tear nourish your inner wisdom, every fear be replaced by hope, and every joy multiply. Let this birthday bring profound peace, lasting happiness, unforgettable memories, and the unwavering certainty that you are cherished, celebrated, and infinitely loved in ways beyond imagination.`,
      
      `🌹💫 ${taggedUserName}, life may present challenges that seem overwhelming, and moments of sorrow may cloud your heart, yet you possess a strength, resilience, and light that surpass all darkness. May every hardship teach you patience, every setback spark determination, every smile be a reminder of love, and every step forward bring fulfillment. Let this birthday be a turning point toward endless joy, meaningful connections, profound inspiration, and the realization of your greatest dreams and aspirations.`,
      
      `✨💌 To ${taggedUserName}, birthdays are a reminder of how far you have come, the battles you have fought, and the beauty that resides within your soul. Embrace the journey, forgive the past, cherish the present, and dream boldly for the future. May love surround you, hope uplift you, courage guide you, wisdom enlighten you, laughter warm your spirit, and every day be filled with extraordinary experiences that inspire, transform, and enrich your life in ways beyond measure.`,
      
      `🌟🎂 ${taggedUserName}, as another year unfolds, may you find inspiration in every sunrise, strength in every challenge, and love in every gesture that touches your heart. Let every trial reveal your inner courage, every tear deepen your compassion, and every dream awaken your soul. May joy fill your days, hope guide your nights, and unforgettable experiences transform ordinary moments into cherished memories. Celebrate the remarkable person you are, the extraordinary life you are creating, and the endless possibilities that lie ahead.`,
      
      `💫💖 Hey ${taggedUserName}, even when shadows of doubt appear, trust in your inner light, resilience, and infinite capacity to love and grow. Let patience guide your actions, courage shape your choices, and hope illuminate your path. May this year bring unforgettable experiences, personal growth, abundant joy, deep love, and moments that inspire your soul. May every step forward remind you of your extraordinary worth, your unique gifts, and the boundless happiness and fulfillment that await you in life.`
    ];

    try {
      const avatarOriginal = await fetchImage(`https://graph.facebook.com/${taggedUserID}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
      const frameOriginal = await fetchImage(frameUrl);

      // Detect the white rectangle automatically
      const box = detectWhiteBox(frameOriginal);

      for (let i = 0; i < wishes.length; i++) {
        const frame = frameOriginal.clone();
        const avatar = avatarOriginal.clone();

        // Resize avatar to cover the white box perfectly
        avatar.cover(box.width, box.height);

        // Composite avatar inside the detected white box
        frame.composite(avatar, box.x, box.y);

        // Save temporary image
        const imagePath = `/tmp/birthday_${taggedUserID}_${i}.png`;
        await frame.writeAsync(imagePath);

        await api.sendMessage(
          { body: wishes[i], attachment: fs.createReadStream(imagePath) },
          event.threadID,
          event.messageID
        );

        await sleep(1500);
      }

    } catch (err) {
      api.sendMessage(`❌ Something went wrong: ${err.message}`, event.threadID, event.messageID);
    }
  },
};
