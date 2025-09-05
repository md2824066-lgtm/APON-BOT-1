const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "pair3",
    author: "Apon DiCaprio",
    category: "fun",
    role: 0,
    shortDescription: { en: "Match two random members in group with cute image card" },
    longDescription: { en: "Randomly selects two members and makes a cute couple card ❤️" },
    guide: { en: "{pn}" }
  },

  onStart: async function ({ api, event, usersData }) {
    try {
      const threadInfo = await api.getThreadInfo(event.threadID);
      const members = threadInfo.participantIDs.filter(id => id != api.getCurrentUserID());

      if (members.length < 2) {
        return api.sendMessage("👀 এই গ্রুপে pair বানানোর মতো যথেষ্ট মেম্বার নেই!", event.threadID);
      }

      const first = members[Math.floor(Math.random() * members.length)];
      let second = first;
      while (second === first) {
        second = members[Math.floor(Math.random() * members.length)];
      }

      // Name fetch
      const getNameSafe = async (uid) => {
        try {
          const name = await usersData.getName(uid);
          if (name) return name;
          if (threadInfo.nicknames && threadInfo.nicknames[uid]) return threadInfo.nicknames[uid];
          if (threadInfo.participantNames && threadInfo.participantNames[uid]) return threadInfo.participantNames[uid];
          return "Unknown User";
        } catch {
          return "Unknown User";
        }
      };

      const firstName = await getNameSafe(first);
      const secondName = await getNameSafe(second);

      // Profile pictures
      const loadProfilePic = async (uid) => {
        const buffer = (await axios.get(
          `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
          { responseType: "arraybuffer" }
        )).data;
        return await loadImage(Buffer.from(buffer, "binary"));
      };

      const avatar1 = await loadProfilePic(first);
      const avatar2 = await loadProfilePic(second);

      // Background
      const bgBuffer = (await axios.get("https://files.catbox.moe/fbmqi1.jpg", { responseType: "arraybuffer" })).data;
      const background = await loadImage(Buffer.from(bgBuffer, "binary"));

      // Canvas
      const canvas = createCanvas(900, 550);
      const ctx = canvas.getContext("2d");

      // Draw background
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

      // Top text
      ctx.save();
      ctx.font = "bold 48px Comic Sans MS";
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.shadowColor = "rgba(0,0,0,0.8)";
      ctx.shadowBlur = 8;
      ctx.fillText("Heres your pair image", canvas.width / 2, 60);
      ctx.restore();

      // First avatar
      ctx.save();
      ctx.beginPath();
      ctx.arc(250, 300, 120, 0, Math.PI * 2);
      ctx.closePath();
      ctx.shadowColor = "rgba(255,182,193,0.8)";
      ctx.shadowBlur = 30;
      ctx.clip();
      ctx.drawImage(avatar1, 130, 180, 240, 240);
      ctx.restore();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(250, 300, 120, 0, Math.PI * 2);
      ctx.stroke();

      // Second avatar
      ctx.save();
      ctx.beginPath();
      ctx.arc(650, 300, 120, 0, Math.PI * 2);
      ctx.closePath();
      ctx.shadowColor = "rgba(255,182,193,0.8)";
      ctx.shadowBlur = 30;
      ctx.clip();
      ctx.drawImage(avatar2, 530, 180, 240, 240);
      ctx.restore();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(650, 300, 120, 0, Math.PI * 2);
      ctx.stroke();

      // Names under avatars
      ctx.font = "bold 40px Comic Sans MS";
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.shadowColor = "rgba(0,0,0,0.8)";
      ctx.shadowBlur = 6;
      ctx.fillText(firstName, 250, 480);
      ctx.fillText(secondName, 650, 480);

      // Central ❤️
      ctx.font = "90px Arial";
      ctx.fillStyle = "red";
      ctx.shadowColor = "pink";
      ctx.shadowBlur = 50;
      ctx.textAlign = "center";
      ctx.fillText("❤️", 450, 300);

      // Signature
      ctx.font = "20px Arial";
      ctx.fillStyle = "white";
      ctx.shadowBlur = 0;
      ctx.fillText("Made with 💝 Apon Goat Bot", canvas.width / 2, 520);

      // Save image
      const imgPath = path.join(__dirname, "pair.png");
      const out = fs.createWriteStream(imgPath);
      const stream = canvas.createPNGStream();
      stream.pipe(out);

      out.on("finish", () => {
        api.sendMessage({
          body: `✨ আজকের কাপল:\n\n❤️ ${firstName}\n❤️ ${secondName}\n\n🎉 সবাই তাদেরকে অভিনন্দন জানাও!`,
          attachment: fs.createReadStream(imgPath)
        }, event.threadID, () => fs.unlinkSync(imgPath), event.messageID);
      });

    } catch (e) {
      console.error(e);
      return api.sendMessage("❌ কিছু সমস্যা হয়েছে!", event.threadID);
    }
  }
};
