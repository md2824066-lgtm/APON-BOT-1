const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "uptime",
    aliases: ["ut", "timeup"],
    version: "1.2",
    author: "Apon DiCaprio",
    role: 0,
    shortDescription: "Show bot uptime with custom background image",
    longDescription: "Shows how long the bot has been running, with a premium styled image card using custom bg and 3D red text",
    category: "tools",
    guide: "{pn}"
  },

  onStart: async function ({ api, event }) {
    const uptime = process.uptime(); // seconds
    const days = Math.floor(uptime / (60 * 60 * 24));
    const hours = Math.floor((uptime % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((uptime % (60 * 60)) / 60);
    const seconds = Math.floor(uptime % 60);

    const uptimeStr = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    const dateNow = new Date().toLocaleString("en-GB", { timeZone: "Asia/Dhaka" });

    const width = 800;
    const height = 400;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Load new background image
    const bgImage = await loadImage("https://files.catbox.moe/hgrq9f.jpg");
    ctx.drawImage(bgImage, 0, 0, width, height);

    // Overlay semi-transparent dark gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "rgba(0, 0, 0, 0.4)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0.6)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Outer red neon border glow
    ctx.strokeStyle = "#FF0000";
    ctx.lineWidth = 8;
    ctx.shadowColor = "#FF0000";
    ctx.shadowBlur = 25;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    // Reset for text shadows
    ctx.shadowBlur = 0;
    ctx.textAlign = "center";

    // Function to draw 3D text
    function draw3DText(text, x, y, fontSize) {
      ctx.font = `bold ${fontSize}px Sans`;
      // Shadow for 3D effect
      ctx.shadowColor = "black";
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;
      ctx.shadowBlur = 4;
      // Main text
      ctx.fillStyle = "#FF0000";
      ctx.fillText(text, x, y);
      // Reset shadow for next draw
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.shadowBlur = 0;
    }

    // Draw all texts with 3D effect
    draw3DText("BOT UPTIME", width / 2, 100, 60);
    draw3DText(uptimeStr, width / 2, 200, 80);
    draw3DText(`Date & Time: ${dateNow}`, width / 2, 280, 30);
    draw3DText("Owner: Apon DiCaprio", width / 2, 340, 28);

    // Save image
    const filePath = path.join(__dirname, "uptime_card.png");
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(filePath, buffer);

    // Send image
    api.sendMessage({
      body: "📊 Bot Uptime Status",
      attachment: fs.createReadStream(filePath)
    }, event.threadID, () => fs.unlinkSync(filePath));
  }
};
