const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const ftp = require("basic-ftp");

const FTP_CONFIG = {
	host: "ftpupload.net",
	user: "cpfr_39361582",
	password: "chitron@2448766",
	secure: false,
	port: 21
};

module.exports = {
	config: {
		name: "git2ftp",
		version: "1.0",
		author: "Chitron Bhattacharjee",
		countDown: 5,
		role: 2,
		shortDescription: { en: "ðŸ“¡ Backup GitHub cmds â†’ FTP" },
		description: {
			en: "Downloads all GitHub cmd files & folders and uploads them to your FTP server under /htdocs/bot/"
		},
		category: "tools",
		guide: {
			en:
				"ðŸ”¹ Usage:\n" +
				"âž¤ +git2ftp\n" +
				"Backs up full GitHub cmds folder onto your FTP server."
		}
	},

	onStart: async function ({ message }) {
		const owner = "blossom-blust";
		const repo = "Blossom";
		const basePath = "scripts/cmds";

		message.reply("â³ | Fetching file list from GitHubâ€¦");

		try {
			const client = new ftp.Client();
			await client.access(FTP_CONFIG);

			// recursive sync
			await syncFolderFromGitHub(client, owner, repo, basePath, "htdocs/bot/");

			client.close();

			return message.reply("âœ… | Backup completed! All GitHub cmds synced to FTP: htdocs/bot/");
		} catch (err) {
			return message.reply("ðŸš« | Backup failed: " + err.message);
		}
	}
};

async function syncFolderFromGitHub(client, owner, repo, githubPath, ftpBasePath) {
	const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${githubPath}`;

	const res = await axios.get(apiUrl, {
		headers: {
			"User-Agent": "GoatBot"
			// Optional if you want:
			// "Authorization": "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"
		}
	});

	const items = res.data;

	for (const item of items) {
		if (item.type === "file") {
			await uploadGitFile(client, item, ftpBasePath);
		} else if (item.type === "dir") {
			const dirName = item.name;
			const newFtpPath = path.posix.join(ftpBasePath, dirName);

			await client.ensureDir(newFtpPath);
			await client.cd(newFtpPath);

			await syncFolderFromGitHub(client, owner, repo, item.path, newFtpPath);

			await client.cd("..");
		}
	}
}

async function uploadGitFile(client, fileItem, ftpPath) {
	const fileUrl = fileItem.download_url;
	const res = await axios.get(fileUrl, {
		responseType: "arraybuffer"
	});

	const tempFile = path.join(__dirname, "cache", fileItem.name);
	await fs.ensureDir(path.dirname(tempFile));
	await fs.writeFile(tempFile, res.data);

	await client.uploadFrom(tempFile, path.posix.join(ftpPath, fileItem.name));

	await fs.remove(tempFile);
}
