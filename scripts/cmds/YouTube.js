const axios = require('axios');

module.exports.config = {
    name: "youtube",
    version: "1.0.0",
    permission: 0,
    credits: "Apon Edit",
    description: "YouTube theke video search kore link pathay",
    prefix: true,
    category: "media",
    usages: "[video name]",
    cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
    try {
        if (!args[0]) return api.sendMessage("❌ Video name likho!", event.threadID, event.messageID);

        const query = encodeURIComponent(args.join(" "));
        const res = await axios.get(`https://www.youtube.com/results?search_query=${query}`);

        const match = res.data.match(/"videoId":"(.*?)"/);
        if (!match || !match[1]) return api.sendMessage("❌ Video khuje pai nai!", event.threadID, event.messageID);

        const videoId = match[1];
        const videoURL = `https://www.youtube.com/watch?v=${videoId}`;

        api.sendMessage(`📺 YouTube Video:\n${videoURL}`, event.threadID, event.messageID);

    } catch (err) {
        console.error(err);
        api.sendMessage("⚠️ Somossa hoise, abar try koro!", event.threadID, event.messageID);
    }
};
