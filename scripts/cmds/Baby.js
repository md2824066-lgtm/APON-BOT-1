const axios = require('axios');
const { Configuration, OpenAIApi } = require('openai');

const OPENAI_API_KEY = "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";

const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

module.exports.config = {
    name: "bby",
    aliases: ["baby", "sakura", "bbe", "babe"],
    version: "1.0.0",
    author: "dipto",
    description: "GoatBot style GPT messenger bot",
    category: "chat",
    countDown: 0,
    role: 0,
    guide: {
        en: "{pn} [anyMessage] - automatic GPT reply in all languages"
    }
};

async function getGPTReply(message, userID) {
    try {
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are GoatBot, reply like a friendly, fun, casual messenger bot." },
                { role: "user", content: message }
            ],
            temperature: 0.8,
            max_tokens: 500
        });
        return response.data.choices[0].message.content;
    } catch (err) {
        console.error(err);
        return "❌ GPT API Error!";
    }
}

module.exports.onChat = async ({ api, event }) => {
    try {
        const message = event.body ? event.body.trim() : "";
        if (!message) return;

        // GPT reply
        const reply = await getGPTReply(message, event.senderID);
        await api.sendMessage(reply, event.threadID, event.messageID);
    } catch (err) {
        console.error(err);
        api.sendMessage(`❌ Error: ${err.message}`, event.threadID, event.messageID);
    }
};

module.exports.onStart = async ({ api, event, args }) => {
    try {
        const message = args.join(" ").trim();
        if (!message) {
            return api.sendMessage("Hey! Bolo kichu, ami reply debo 😎", event.threadID, event.messageID);
        }

        const reply = await getGPTReply(message, event.senderID);
        await api.sendMessage(reply, event.threadID, event.messageID);
    } catch (err) {
        console.error(err);
        api.sendMessage(`❌ Error: ${err.message}`, event.threadID, event.messageID);
    }
};
