const config = require("../config/config.js");
const utils = require("../server/utils.js");
const { convert } = require("html-to-text");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const User = require("../server/models/user");
const chalk = require("chalk");

const prepareAnnouncement = async (announcement, accessToken) => {
	const base64ImageRegex = /<img src="data:image\/(png|jpg|jpeg);base64,([^"]*)"/g;
	const base64ImagewithAltRegex = /<img src="data:image\/(png|jpg|jpeg);base64,([^"]*)" alt="([^"]*)">/g;
	const base64ImageRegexResult = base64ImagewithAltRegex.exec(announcement.body);

	const embed = new EmbedBuilder()
		.setColor("Random")
		.setTitle(announcement.title)
		.setURL(`${announcement.announcement_url}`)
		.setFooter({
			text: `${announcement.author.name} • ${announcement.created_at}`,
		});

	const row = new ActionRowBuilder();
	if (announcement.body.match(base64ImagewithAltRegex)) {
		console.log(`  > Announcement contains base64 image`);
		const base64Image = base64ImageRegexResult[2];
		const filename = `image_${announcement.id}.${base64ImageRegexResult[1]}`;
		console.log(`  > Filename: ${filename}`);
		await utils.saveBase64Image(base64Image, announcement.id, filename);
		const body = announcement.body.replace(base64ImageRegexResult[0], ``);
		embed.setImage(`https://announcements.alexandrosmagos.com/attachments/${announcement.id}/${filename}`);

		embed.setDescription(
			convert(body, {
				selectors: [{ selector: "img", remove: "all" }],
				wordwrap: 130,
				hideLinkHrefIfSameAsText: true,
			}).trim()
		);

		const button = new ButtonBuilder().setLabel(`${filename}`).setStyle(5).setURL(`https://announcements.alexandrosmagos.com/attachments/${announcement.id}/${filename}`);

		row.addComponents(button);
	} else {
		embed.setDescription(
			convert(announcement.body, {
				wordwrap: 130,
				hideLinkHrefIfSameAsText: true,
			})
		);
	}

	if (announcement.attachments.length > 0) {
		for (const attachment of announcement.attachments) {
			const filename = attachment.filename.replace(/ /g, "_");
			await utils.downloadAttachment(accessToken, announcement.id, filename, attachment.attachment_url);

			const button = new ButtonBuilder().setLabel(`${filename}`).setStyle(5).setURL(`https://announcements.alexandrosmagos.com/attachments/${announcement.id}/${filename}`);

			row.addComponents(button);
		}
	}

	// if row doesn't contain buttons
	if (row.components.length === 0) {
		return { embeds: [embed] };
	} else {
		return { embeds: [embed], components: [row] };
	}
};

module.exports = (client) => {
	// countdown to 5 seconds before

	setInterval(async () => {
		console.log(`Checking for new announcements...`);
		if (!(await utils.usersExist())) return console.log(chalk.red("Can't check for new announcements, since no users available in the database"));

		const accessToken = await utils.getRandomAccessToken().catch((err) => {
			console.log(chalk.red(err));
			process.exit(1);
		});

		const announcements = await utils.getAllAnnouncements(accessToken).catch((err) => {
			console.log(chalk.red(err));
			process.exit(1);
		});

		if (announcements.length > 0) {
			announcements.sort(function (a, b) {
				return new Date(a.created_at) - new Date(b.created_at);
			});

			for (const announcement of announcements) {
				const tagIDs = await announcement.tags.map((tag) => tag.id);
				console.log(chalk.green(`  > Announcement name : ${announcement.title}`));
				console.log(chalk.green(`  > Announcement tags: ${tagIDs.join(", ")}`));

				const ann = await prepareAnnouncement(announcement, accessToken).catch((err) => {
					console.log(chalk.red(err));
				});

				if (tagIDs.length > 0) {
					const users = await User.find({ tags: { $in: tagIDs } }).exec();

					for (const user of users) {
						const discordUser = await client.users.fetch(user.userId);
						console.log(`Sending announcement to user ${user.userId}`);
						await discordUser.send(ann).catch((err) => {
							console.log(chalk.red(err));
						});
					}
				}

				console.log(chalk.green(`Sending announcement to channel`));
				return await client.channels.cache.get(config.announcements.send_all_channelID).send(ann).catch(chalk.red(console.error));
			}
		}
	}, 210000);
};