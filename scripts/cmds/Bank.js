const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "bank",
    version: "1.3",
    description: "Deposit, withdraw, transfer money, and earn interest",
    guide: {
      en: "{pn} bank [deposit|withdraw|balance|interest|transfer|richest] [amount] [userID?]"
    },
    category: "𝗪𝗔𝗟𝗟𝗘𝗧",
    countDown: 15,
    role: 0,
    author: "Chitron Bhattacharjee + Modified by Apon"
  },

  onStart: async function ({ args, message, event, api, usersData }) {
    const user = event.senderID;
    const userMoney = await usersData.get(user, "money");
    const info = await api.getUserInfo(user);
    const username = info[user].name;

    const bankDataPath = path.join(__dirname, "bankData.json");

    // Initialize file
    if (!fs.existsSync(bankDataPath)) {
      fs.writeFileSync(bankDataPath, JSON.stringify({}, null, 2), "utf8");
    }

    const bankData = JSON.parse(fs.readFileSync(bankDataPath, "utf8"));

    if (!bankData[user]) {
      bankData[user] = { bank: 0, lastInterestClaimed: 0 };
      fs.writeFileSync(bankDataPath, JSON.stringify(bankData, null, 2), "utf8");
    }

    let bankBalance = bankData[user].bank || 0;

    const command = args[0]?.toLowerCase();
    const amount = parseInt(args[1]);
    const recipientUID = args[2];

    function saveData() {
      fs.writeFileSync(bankDataPath, JSON.stringify(bankData, null, 2), "utf8");
    }

    switch (command) {
      case "deposit": {
        if (isNaN(amount) || amount <= 0) {
          return message.reply("❏ Please enter a valid amount to deposit 🔁");
        }

        if (userMoney < amount) {
          return message.reply("❏ You don’t have enough money to deposit ✖️");
        }

        bankData[user].bank += amount;
        await usersData.set(user, { money: userMoney - amount });
        saveData();

        return message.reply(`❏ Successfully deposited $${formatNumber(amount)} into your bank ✅`);
      }

      case "withdraw": {
        if (isNaN(amount) || amount <= 0) {
          return message.reply("❏ Please enter a valid amount to withdraw 😪");
        }

        if (amount > bankBalance) {
          return message.reply("❏ You don’t have that much money in your bank ✖️");
        }

        bankData[user].bank -= amount;
        await usersData.set(user, { money: userMoney + amount });
        saveData();

        return message.reply(`❏ Successfully withdrew $${formatNumber(amount)} from your bank ✅`);
      }

      case "balance": {
        return message.reply(`❏ Your bank balance is: $${formatNumber(bankBalance)}`);
      }

      case "interest": {
        const interestRate = 0.001; // 0.1% daily
        const lastClaim = bankData[user].lastInterestClaimed || 0;
        const now = Date.now();
        const timeDiff = (now - lastClaim) / 1000;

        if (timeDiff < 86400) {
          const remain = Math.ceil(86400 - timeDiff);
          const h = Math.floor(remain / 3600);
          const m = Math.floor((remain % 3600) / 60);
          return message.reply(`❏ You can claim interest again in ${h}h ${m}m 😉`);
        }

        if (bankBalance <= 0) {
          return message.reply("❏ You don’t have money in the bank to earn interest 💸");
        }

        const earned = bankBalance * interestRate;
        bankData[user].bank += earned;
        bankData[user].lastInterestClaimed = now;
        saveData();

        return message.reply(`❏ You earned $${formatNumber(earned)} interest ✅`);
      }

      case "transfer": {
        if (!recipientUID || isNaN(amount) || amount <= 0) {
          return message.reply("❏ Usage: bank transfer <amount> <recipientUID>");
        }

        if (amount > bankBalance) {
          return message.reply("❏ You don’t have enough balance in the bank ✖️");
        }

        if (!bankData[recipientUID]) {
          bankData[recipientUID] = { bank: 0, lastInterestClaimed: 0 };
        }

        bankData[user].bank -= amount;
        bankData[recipientUID].bank += amount;
        saveData();

        return message.reply(`❏ Successfully transferred $${formatNumber(amount)} to UID ${recipientUID} ✅`);
      }

      case "richest": {
        const sorted = Object.entries(bankData)
          .sort((a, b) => b[1].bank - a[1].bank)
          .slice(0, 5);

        let msg = "🏦 Top 5 Richest in Bank 🏦\n\n";
        let i = 1;
        for (const [uid, data] of sorted) {
          let uInfo = await api.getUserInfo(uid);
          let name = uInfo[uid]?.name || uid;
          msg += `${i++}. ${name}: $${formatNumber(data.bank)}\n`;
        }
        return message.reply(msg);
      }

      default: {
        return message.reply(
          "❏ Bank Commands:\n- deposit <amount>\n- withdraw <amount>\n- balance\n- interest\n- transfer <amount> <uid>\n- richest"
        );
      }
    }
  }
};

// Helper function to format numbers
function formatNumber(num) {
  if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
  if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
  return num.toFixed(2);
}
