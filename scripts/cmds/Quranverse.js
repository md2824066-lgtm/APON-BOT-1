module.exports.config = {
  name: "quranverse",
  version: "1.0",
  author: "Md Apon + ChatGPT",
  cooldowns: 5,
  role: 0,
  description: "Send random Quran verses every 20 minutes automatically",
};

const verses = [
  {
    ayat: "الرَّحْمَنُ",
    translation: "অর্থ: পরম করুণাময়",
    reference: "সূরা আর-রহমান (৫৫:১)",
  },
  {
    ayat: "وَقُل رَّبِّ زِدْنِي عِلْمًا",
    translation: "অর্থ: এবং বলো, হে আমার পালনকর্তা! আমার জ্ঞান বৃদ্ধি কর",
    reference: "সূরা তাহা (২০:১১৪)",
  },
  {
    ayat: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translation: "অর্থ: নিশ্চয়ই কঠিনতার সঙ্গে সহজতা আছে",
    reference: "সূরা আশ-শারহ (৯৪:৬)",
  },
  {
    ayat: "وَاذْكُر رَّبَّكَ إِذَا نَسِيتَ",
    translation: "অর্থ: আর যখন তুমি ভুলে যাও তখন তোমার পালনকর্তাকে স্মরণ কর",
    reference: "সূরা আল-ক্বামার (৫৩:১৯)",
  },
  {
    ayat: "فَصْلِ لِلْقَوْمِ الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ",
    translation: "অর্থ: বিশ্বাসীদের জন্য নির্দেশাবলী",
    reference: "সূরা আল-বাকারা (২:৩)",
  },
  {
    ayat: "إِنَّ اللَّـهَ مَعَ الصَّابِرِينَ",
    translation: "অর্থ: নিশ্চয় আল্লাহ ধৈর্যশীলদের সঙ্গে আছেন",
    reference: "সূরা আল-বাকারা (২:১৫৩)",
  },
  {
    ayat: "وَمَا تَوْفِيقِي إِلَّا بِاللَّـهِ",
    translation: "অর্থ: আমার সফলতা আল্লাহর সাহায্য ব্যতিরেকে নয়",
    reference: "সূরা হুদ (১১:৮৮)",
  },
  {
    ayat: "وَلاَ تَيْأَسُوا مِن رَّوْحِ اللَّـهِ",
    translation: "অর্থ: আল্লাহর রহমত থেকে হতাশ হবেন না",
    reference: "সূরা ইউসুফ (১২:৮৭)",
  },
  {
    ayat: "إِنَّمَا الْمُؤْمِنُونَ إِخْوَةٌ",
    translation: "অর্থ: নিশ্চিতভাবেই বিশ্বাসিরা একে অপরের ভাই",
    reference: "সূরা আল-হুজুরাত (৪৯:১০)",
  },
  {
    ayat: "وَمَن يَتَّقِ اللَّـهَ يَجْعَل لَّهُ مَخْرَجًا",
    translation: "অর্থ: যে আল্লাহকে ভয় করে, আল্লাহ তার জন্য উপায় বের করে দেবেন",
    reference: "সূরা আত-তালাক (৬৫:২)",
  },
  {
    ayat: "وَاللَّـهُ غَفُورٌ رَّحِيمٌ",
    translation: "অর্থ: আল্লাহ ক্ষমাশীল, দয়ালু",
    reference: "সূরা আল-বাকারা (২:১৮২)",
  },
  {
    ayat: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translation: "অর্থ: সত্যিই কঠিনতার সাথে সহজতা রয়েছে",
    reference: "সূরা আল-ইনশিরাহ (৯৪:৬)",
  },
  {
    ayat: "وَلَا تَقْرَبُوا الزِّنَىٰ",
    translation: "অর্থ: অশ্লীলতার কাছে যেও না",
    reference: "সূরা আল-ইসরা (১৭:৩২)",
  },
  {
    ayat: "إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا",
    translation: "অর্থ: নিশ্চয়ই নামাজ মু’মিনদের জন্য নির্ধারিত সময়ে আদেশ করা হয়েছে",
    reference: "সূরা আনকাবুত (২৯:৪৫)",
  },
  {
    ayat: "وَاصْبِرْ وَمَا صَبْرُكَ إِلَّا بِاللَّـهِ",
    translation: "অর্থ: ধৈর্য ধর, আর তোমার ধৈর্য আল্লাহর সাহায্য ব্যতীত নয়",
    reference: "সূরা আনফাল (৮:৪৬)",
  },
];

let intervalId = null;
let groupIDs = [];

async function loadGroupIDs(api) {
  try {
    const threads = await api.getThreadList(100, null, ["INBOX"]);
    groupIDs = threads.filter(t => t.isGroup).map(t => t.threadID);
    console.log(`[QuranVerse] Loaded ${groupIDs.length} groups`);
  } catch (error) {
    console.error("[QuranVerse] Failed to load groups:", error);
  }
}

async function sendRandomVerse(api) {
  if (groupIDs.length === 0) {
    console.log("[QuranVerse] No groups to send messages.");
    return;
  }
  const randomIndex = Math.floor(Math.random() * verses.length);
  const verse = verses[randomIndex];
  const message = `📖 Quran Verse:\n\n${verse.ayat}\n\n${verse.translation}\n\n📚 Reference: ${verse.reference}`;

  for (const id of groupIDs) {
    try {
      await api.sendMessage(message, id);
      console.log(`[QuranVerse] Sent verse to group ${id}`);
    } catch (error) {
      console.error(`[QuranVerse] Failed to send verse to group ${id}:`, error);
    }
  }
}

module.exports.run = async function({ api, event, args }) {
  const threadID = event.threadID;
  const input = args[0]?.toLowerCase();

  if (!input) {
    return api.sendMessage(
      "⚠️ Please specify 'start' or 'stop'.\nUsage:\n/quranverse start\n/quranverse stop",
      threadID,
      event.messageID
    );
  }

  if (input === "start") {
    if (intervalId) {
      return api.sendMessage("⏳ Quran verse sender is already running.", threadID, event.messageID);
    }

    await loadGroupIDs(api);

    if (groupIDs.length === 0) {
      return api.sendMessage("❌ No groups found to send Quran verses.", threadID, event.messageID);
    }

    intervalId = setInterval(() => sendRandomVerse(api), 20 * 60 * 1000); // 20 minutes
    sendRandomVerse(api);

    return api.sendMessage("✅ Quran verse sender started for all groups.", threadID, event.messageID);
  }

  if (input === "stop") {
    if (!intervalId) {
      return api.sendMessage("ℹ️ Quran verse sender is not running.", threadID, event.messageID);
    }
    clearInterval(intervalId);
    intervalId = null;
    return api.sendMessage("⛔ Quran verse sender stopped.", threadID, event.messageID);
  }

  return api.sendMessage("⚠️ Invalid command. Use 'start' or 'stop'.", threadID, event.messageID);
};
