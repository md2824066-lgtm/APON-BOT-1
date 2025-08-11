const axios = require('axios');

async function getStreamFromURL(url) {
  const response = await axios.get(url, { responseType: 'stream' });
  return response.data;
}

async function fetchTikTokVideos(query) {
  try {
    const response = await axios.get(`https://lyric-search-neon.vercel.app/kshitiz?keyword=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching videos:", error);
    return null;
  }
}

async function checkAuthor(authorName) {
  try {
    const response = await axios.get('https://author-check.vercel.app/name');
    return response.data.name === authorName;
  } catch (error) {
    console.error("Error checking author:", error);
    return false;
  }
}

module.exports = {
  config: {
    name: "fyp",
    aliases: [],
    author: "Vex_Kshitiz",
    version: "1.0",
    shortDescription: { en: "" },
    longDescription: { en: "tiktok alternative" },
    category: "media",
    guide: { en: "{p}{n} [keyword]" },
  },

  onStart: async function ({ api, event, args }) {
    const isAuthorValid = await checkAuthor(module.exports.config.author);
    if (!isAuthorValid) {
      await api.sendMessage("Author changer alert! this cmd belongs to Vex_Kshitiz.", event.threadID, event.messageID);
      return;
    }

    api.setMessageReaction("✨", event.messageID, (err) => {
      if (err) console.error("React error:", err);
    }, true);

    const query = args.join(' ').trim();
    if (!query) {
      return api.sendMessage("Please provide a keyword to search for videos.", event.threadID, event.messageID);
    }

    const videos = await fetchTikTokVideos(query);

    if (!videos || videos.length === 0) {
      return api.sendMessage({ body: `No videos found for "${query}".` }, event.threadID, event.messageID);
    }

    const selectedVideo = videos[Math.floor(Math.random() * videos.length)];
    const videoUrl = selectedVideo.videoUrl;

    if (!videoUrl) {
      return api.sendMessage({ body: 'Error: Video not found.' }, event.threadID, event.messageID);
    }

    try {
      const shortUrl = global.utils?.shortenURL ? await global.utils.shortenURL(videoUrl) : videoUrl;
      const videoStream = await getStreamFromURL(videoUrl);

      await api.sendMessage({
        body: `🎬 Video for: "${query}"\n${shortUrl}`,
        attachment: videoStream,
      }, event.threadID, event.messageID);

    } catch (error) {
      console.error("Error sending video:", error);
      api.sendMessage({ body: 'An error occurred while processing the video.\nPlease try again later.' }, event.threadID, event.messageID);
    }
  },
};
