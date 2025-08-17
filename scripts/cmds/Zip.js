const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

// সব কমান্ড ফাইল যেখানে আছে
const commandsFolder = path.join(__dirname, "commands");
const outputZip = path.join(__dirname, "GoatBot_Commands.zip");

// আর্কাইভার তৈরি
const output = fs.createWriteStream(outputZip);
const archive = archiver("zip", { zlib: { level: 9 } });

output.on("close", () => {
  console.log(`✅ ZIP তৈরি হয়েছে: ${archive.pointer()} bytes`);
});

archive.on("error", (err) => {
  throw err;
});

archive.pipe(output);

// ফাইলগুলো ZIP এ যোগ করা
fs.readdir(commandsFolder, (err, files) => {
  if (err) throw err;

  files.forEach((file) => {
    if (file.endsWith(".js") && file.toLowerCase() !== "help.js") {
      const filePath = path.join(commandsFolder, file);
      archive.file(filePath, { name: file });
      console.log(`Added: ${file}`);
    }
  });

  archive.finalize();
});
