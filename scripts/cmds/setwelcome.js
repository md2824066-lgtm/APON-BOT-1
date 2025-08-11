const fs = require("fs-extra");
const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");
const GIFEncoder = require("gifencoder");

module.exports.config = {
    name: "welcome",
    eventType: ["log:subscribe"],
    version: "3.0.0",
    credits: "Md Apon + ChatGPT",
    description: "VIP Welcome with GIF Background, Glow & Shadow Text"
};

module.exports.run = async function ({ event, api, Threads }) {
    try {
        const threadData = await Threads.getData(event.threadID);
        const groupName = threadData.threadInfo.threadName || "this group";
        const memJoin = event.logMessageData.addedParticipants;

        for (let mem of memJoin) {
            let userName = mem.fullName;
            let id = mem.userFbId;

            // Profile picture
            const picURL = `https://graph.facebook.com/${id}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
            const avatar = await loadImage(picURL);

            // তোমার দেওয়া ব্যাকগ্রাউন্ড ফ্রেম
            const gifFrames = [
                "https://files.catbox.moe/b7xfaz.jpg",
                "https://files.catbox.moe/ed2c0g.jpg"
            ];

            // GIF encoder setup
            const encoder = new GIFEncoder(1000, 500);
            const imgPath = __dirname + `/cache/welcome_${id}.gif`;
            const stream = encoder.createWriteStream();
            const out = fs.createWriteStream(imgPath);
            stream.pipe(out);

            encoder.start();
            encoder.setRepeat(0);
            encoder.setDelay(500); // প্রতি ফ্রেম 0.5 সেকেন্ড
            encoder.setQuality(10);

            for (let bgURL of gifFrames) {
                const bg = await loadImage(bgURL);
                const canvas = createCanvas(1000, 500);
                const ctx = canvas.getContext("2d");

                // Draw background
                ctx.drawImage(bg, 0, 0, 1000, 500);

                // Profile circle
                ctx.save();
                ctx.beginPath();
                ctx.arc(250, 250, 180, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.clip();
                ctx.drawImage(avatar, 70, 70, 360, 360);
                ctx.restore();

                // Glow effect for text
                ctx.shadowColor = "gold";
                ctx.shadowBlur = 20;

                // Main WELCOME
                ctx.font = "bold 60px Sans-serif";
                ctx.fillStyle = "#FFD700";
                ctx.fillText("WELCOME", 500, 220);

                // Name
                ctx.shadowColor = "black";
                ctx.shadowBlur = 10;
                ctx.font = "bold 45px Sans-serif";
                ctx.fillStyle = "#FFFFFF";
                ctx.fillText(userName, 500, 300);

                // Group
                ctx.font = "30px Sans-serif";
                ctx.fillStyle = "#00FFFF";
                ctx.fillText(`to ${groupName}`, 500, 360);

                encoder.addFrame(ctx);
            }

            encoder.finish();

            // Send message with GIF
            const msg = {
                body: `💎 VIP Welcome to **${groupName}**\n🎉 Hello ${userName}!`,
                attachment: fs.createReadStream(imgPath)
            };
            api.sendMessage(msg, event.threadID, () => {
                fs.unlinkSync(imgPath);
            });
        }
    } catch (e) {
        console.error(e);
    }
};
