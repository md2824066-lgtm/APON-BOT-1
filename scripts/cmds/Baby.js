const axios = require('axios');

const baseApiUrl = () => "https://www.noobs-api.rf.gd/dipto";

module.exports.config = {
  name: "bby",
  aliases: ["baby", "sakura", "bbe", "babe"],
  version: "6.9.1",
  author: "dipto",
  countDown: 0,
  role: 0,
  description: "better than all sim simi",
  category: "chat",
  guide: {
    en:
      "{pn} [anyMessage]\n" +
      "teach [YourMessage] - [Reply1], [Reply2]...\n" +
      "teach [react] [YourMessage] - [react1], [react2]...\n" +
      "remove [YourMessage]\n" +
      "rm [YourMessage] - [indexNumber]\n" +
      "msg [YourMessage]\n" +
      "list / list all\n" +
      "edit [YourMessage] - [NewMessage]"
  }
};

module.exports.onStart = async ({ api, event, args, usersData }) => {
  try {
    const link = `${baseApiUrl()}/baby`;
    const dipto = args.join(" ").toLowerCase();
    const uid = event.senderID;

    if (!args[0]) {
      const ran = ["Bolo baby 💕", "hum?", "type help baby", "type !baby hi"];
      return api.sendMessage(ran[Math.floor(Math.random() * ran.length)], event.threadID, event.messageID);
    }

    // remove
    if (args[0] === const { data } = await axios.get(`${link}?remove=${encodeURIComponent(fina)}&senderID=${encodeURIComponent(uid)}`);
      return api.sendMessage(data.message || "No response", event.threadID, event.messageID);
    }

    // rm [msg] - [index]
    if (args[0] === 'rm' && dipto.includes('-')) {
      const [fi, f] = dipto.replace(/^rm\s+/, "").split(' - ');
      const { data } = await axios.get(`${link}?remove=${encodeURIComponent(fi)}&index=${encodeURIComponent(f)}`);
      return api.sendMessage(data.message || "No response", event.threadID, event.messageID);
    }

    // list
    if (args[0] === 'list') {
      const { data } = await axios.get(`${link}?list=all`);
      // safe handling if API shape differs
      if (args[1] === 'all') {
        if (data && data.teacher && Array.isArray(data.teacher.teacherList)) {
          const teachers = await Promise.all(data.teacher.teacherList.map(async (item) => {
            const number = Object.keys(item)[0];
            const value = item[number];
            const user = await usersData.get(number).catch(() => ({ name: number }));
            const name = user ? user.name : number;
            return { name, value };
          }));
          teachers.sort((a, b) => b.value - a.value);
          const output = teachers.map((t, i) => `${i + 1}/ ${t.name}: ${t.value}`).join('\n');
          return api.sendMessage(
            `Total Teach = ${teachers.length}\n👑 Teachers of baby\n${output}`,
            event.threadID,
            event.messageID
          );
        } else {
          return api.sendMessage(`No teacher data available.`, event.threadID, event.messageID);
        }
      } else {
        return api.sendMessage(`Total Teach = ${Array.isArray(data) ? data.length : (data.total || 'N/A')}`, event.threadID, event.messageID);
      }
    }

    // msg
    if (args[0] === 'msg') {
      const fuk = dipto.replace(/^msg\s+/, "");
      const { data } = await axios.get(`${link}?list=${encodeURIComponent(fuk)}`);
      return api.sendMessage(`Message ${fuk} = ${data.data || data.reply || 'N/A'}`, event.threadID, event.messageID);
    }

    // edit
    if (args[0] === 'edit' && dipto.includes('-')) {
      const [fi, f] = dipto.replace(/^edit\s+/, "").split(' - ');
      if (!fi || !f) return api.sendMessage('❌ | Invalid format! Use edit [YourMessage] - [NewReply]', event.threadID, event.messageID);
      const { data } = await axios.get(`${link}?edit=${encodeURIComponent(fi)}&replace=${encodeURIComponent(f)}&senderID=${encodeURIComponent(uid)}`);
      return api.sendMessage(`✅ Changed: ${data.message || 'OK'}`, event.threadID, event.messageID);
    }

    // teach normal
    if (args[0] === 'teach' && args[1] !== 'amar' && args[1] !== 'react') {
      const [comd, command] = dipto.split(' - ');
      const final = comd.replace(/^teach\s+/, "");
      if (!command) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);

      const { data } = await axios.get(`${link}?teach=${encodeURIComponent(final)}&reply=${encodeURIComponent(command)}&senderID=${encodeURIComponent(uid)}`);
      const teacherName = data && data.teacher ? (await usersData.get(data.teacher).catch(()=>({name: data.teacher}))).name : 'unknown';
      return api.sendMessage(
        `✅ Replies added: ${data.message || 'OK'}\n👩‍🏫 Teacher: ${teacherName}\n📚 Total: ${data.teachs || 'N/A'}`,
        event.threadID,
        event.messageID
      );
    }

    // teach amar
    if (args[0] === 'teach' && args[1] === 'amar') {
      const [comd, command] = dipto.split(' - ');
      const final = comd.replace(/^teach amar\s+/, "");
      if (!command) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
      const { data } = await axios.get(`${link}?teach=${encodeURIComponent(final)}&senderID=${encodeURIComponent(uid)}&reply=${encodeURIComponent(command)}&key=intro`);
      return api.sendMessage(`✅ Replies added: ${data.message || 'OK'}`, event.threadID, event.messageID);
    }

    // teach react
    if (args[0] === 'teach' && args[1] === 'react') {
      const [comd, command] = dipto.split(' - ');
      const final = comd.replace(/^teach react\s+/, "");
      if (!command) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
      const { data } = await axios.get(`${link}?teach=${encodeURIComponent(final)}&react=${encodeURIComponent(command)}&senderID=${encodeURIComponent(uid)}`);
      return api.sendMessage(`✅ Reactions added: ${data.message || 'OK'}`, event.threadID, event.messageID);
    }

    // amar name ki
    if (dipto.includes('amar name ki') || dipto.includes('amr nam ki') || dipto.includes('whats my name')) {
      const { data } = await axios.get(`${link}?text=${encodeURIComponent('amar name ki')}&senderID=${encodeURIComponent(uid)}&key=intro`);
      return api.sendMessage(data.reply || data.message || 'N/A', event.threadID, event.messageID);
    }

    // default reply
    {
      const { data } = await axios.get(`${link}?text=${encodeURIComponent(dipto)}&senderID=${encodeURIComponent(uid)}&font=1`);
      const replyText = data && (data.reply || data.message) ? (data.reply || data.message) : "No reply";
      api.sendMessage(replyText, event.threadID, (error, info) => {
        if (!error && info) {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: module.exports.config.name,
            type: "reply",
            messageID: info.messageID,
            author: event.senderID,
            apiUrl: link
          });
        }
      }, event.messageID);
    }

  } catch (e) {
    console.error(e);
    api.sendMessage("❌ Error! Check console.", event.threadID, event.messageID);
  }
};

module.exports.onReply = async ({ api, event, Reply }) => {
  try {
    if (event && event.type === "message_reply") {
      const link = `${baseApiUrl()}/baby`;
      const text = encodeURIComponent((event.body || "").toLowerCase());
      const { data } = await axios.get(`${link}?text=${text}&senderID=${encodeURIComponent(event.senderID)}&font=1`);
      const replyText = data && (data.reply || data.message) ? (data.reply || data.message) : "No reply";

      await api.sendMessage(replyText, event.threadID, (error, info) => {
        if (!error && info) {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: module.exports.config.name,
            type: "reply",
            messageID: info.messageID,
            author: event.senderID
          });
        }
      }, event.messageID);
    }
  } catch (err) {
    return api.sendMessage(`❌ Error: ${err.message}`, event.threadID, event.messageID);
  }
};

module.exports.onChat = async ({ api, event, message }) => {
  try {
    const body = event.body ? event.body.toLowerCase() : "";
    if (body.startsWith("baby") || body.startsWith("bby") || body.startsWith("bot") || body.startsWith("jan") || body.startsWith("babu") || body.startsWith("saim")) {
      const arr = body.replace(/^\S+\s*/, "");
      const randomReplies = ["😘", "bolo jaan 🥺", "Amake na deke amar boss Apon er sathe prem kor 😧", "ki koibi ko taratari 😒", "Kire kemon achis?"];
      if (!arr) {
        await api.sendMessage(randomReplies[Math.floor(Math.random() * randomReplies.length)], event.threadID, (error, info) => {
          if (info) {
            global.GoatBot.onReply.set(info.messageID, {
              commandName: module.exports.config.name,
              type: "reply",
              messageID: info.messageID,
              author: event.senderID
            });
          }
        }, event.messageID);
        return; // important: do not continue if no extra text
      }

      const a = (await axios.get(`${baseApiUrl()}/baby?text=${encodeURIComponent(arr)}&senderID=${encodeURIComponent(event.senderID)}&font=1`)).data.reply;
      await api.sendMessage(a, event.threadID, (error, info) => {
        if (info) {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: module.exports.config.name,
            type: "reply",
            messageID: info.messageID,
            author: event.senderID
          });
        }
      }, event.messageID);
    }
  } catch (err) {
    return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
  }
};