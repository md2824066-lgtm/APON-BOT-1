const { getStreamFromURL } = global.utils;

module.exports = {
 config: {
 name: "botupdate",
 aliases: [],
 version: "1.2",
 author: "Chitron Bhattacharjee",
 countDown: 0,
 role: 2, // Bot owner only
 shortDescription: {
 en: "Reduce balance due to coin value update"
 },
 description: {
 en: "Balances >500 reduced to 10%, protected UID stays infinite"
 },
 category: "economy",
 guide: {
 en: "Use to adjust user balances"
 }
 },

 onStart: async function ({ message, usersData }) {
 const allUsers = await usersData.getAll();

 const protectedUID = "100077380038521"; // Infinity balance UID

 let updated = 0, skipped = 0, protectedCount = 0, invalid = 0;

 for (const user of allUsers) {
 const uid = user?.userID;
 const bal = user?.money || 0;

 if (!uid || typeof uid !== "string") {
 invalid++;
 continue; // â›” Skip invalid users
 }

 if (uid === protectedUID) {
 await usersData.set(uid, { money: 999999999 });
 protectedCount++;
 continue;
 }

 if (bal >= 500) {
 const newBal = Math.floor(bal * 0.10);
 await usersData.set(uid, { money: newBal });
 updated++;
 } else {
 skipped++;
 }
 }

 const msg = `ðŸ’Ž ð—•ð—¼ð˜ ð—˜ð—°ð—¼ð—»ð—¼ð—ºð˜† ð—¨ð—½ð—±ð—®ð˜ð—² ðŸ’Ž

ðŸ’¹ ð—–ð—¼ð—¶ð—» ð˜ƒð—®ð—¹ð˜‚ð—² ð—µð—®ð˜€ ð—¿ð—¶ð˜€ð—²ð—» ð—¶ð—» ð—¦ð—µð—¶ð—£ð˜‚ ð—”ð—œ ðŸ’—
â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”
ðŸ”» ðŸ­ðŸ¬% ð—¿ð—²ð—ºð—®ð—¶ð—»ð—²ð—± ð—³ð—¼ð—¿ ð—¯ð—®ð—¹ð—®ð—»ð—°ð—² > ðŸ±ðŸ¬ðŸ¬ 
ðŸ¤ ð—•ð—®ð—¹ð—®ð—»ð—°ð—² < ðŸ±ðŸ¬ðŸ¬ ð˜„ð—²ð—¿ð—² ð˜€ð—®ð—³ð—² 
ðŸ‘‘ UID ${protectedUID} ð˜„ð—¶ð—¹ð—¹ ð—¿ð—²ð—ºð—®ð—¶ð—» â™¾ï¸
â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”
âœ… ð—¨ð—½ð—±ð—®ð˜ð—²ð—±: ${updated} users 
â© ð—¦ð—¸ð—¶ð—½ð—½ð—²ð—±: ${skipped} users 
â™¾ï¸ ð—£ð—¿ð—¼ð˜ð—²ð—°ð˜ð—²ð—±: ${protectedCount} user 
ðŸš« ð—œð—»ð˜ƒð—®ð—¹ð—¶ð—±: ${invalid} skipped due to bad UID`;

 return message.reply(msg);
 }
};
