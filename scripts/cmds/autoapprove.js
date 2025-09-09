const fs = require("fs");
const path = require("path");

// config file এ status রাখবো
const configPath = path.join(__dirname, "autoapprove.json");
if (!fs.existsSync(configPath)) {
  fs.writeFileSync(configPath, JSON.stringify({ enabled: false }, null, 2));
}

module.exports = {
  config: {
    name: "autoapprove",
    version: "1.1",
    author: "Apon",
    countDown: 5,
    role: 2,
    shortDescription: {
      en: "Toggle autoapprove system"
    },
    longDescription: {
      en: "When enabled, all pending groups will be auto approved permanently"
    },
    category: "system"
  },

  onStart: async function ({ api, event, args }) {
    let settings = JSON.parse(fs.readFileSync(configPath, "utf8"));

    if (args[0] === "on") {
      settings.enabled = true;
      fs.writeFileSync(configPath, JSON.stringify(settings, null, 2));
      return api.sendMessage("✅ Auto-Approve system is now ENABLED permanently!", event.threadID);
    } 
    else if (args[0] === "off") {
      settings.enabled = false;
      fs.writeFileSync(configPath, JSON.stringify(settings, null, 2));
      return api.sendMessage("❌ Auto-Approve system is now DISABLED!", event.threadID);
    } 
    else {
      return api.sendMessage("⚙️ Usage: autoapprove on/off", event.threadID);
    }
  },

  // Event listener: নতুন pending group এ auto approve
  onEvent: async function ({ api }) {
    let settings = JSON.parse(fs.readFileSync(configPath, "utf8"));
    if (!settings.enabled) return;

    try {
      const pending = await api.getThreadList(100, null, ["PENDING"]) || [];
      for (const group of pending) {
        api.sendMessage(
          `✅ Auto-Approved this GC!\n\nName: ${group.name}\nID: ${group.threadID}`,
          group.threadID
        );
      }
    } catch (err) {
      console.error("Autoapprove error:", err);
    }
  }
};
