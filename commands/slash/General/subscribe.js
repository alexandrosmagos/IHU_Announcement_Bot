const { EmbedBuilder, ActionRowBuilder, SelectMenuBuilder } = require("discord.js");

const User = require("../../../server/models/user");
const config = require("../../../config/config.js");
const Tags = require("../../../server/models/tag");
const utils = require("../../../server/utils.js");

module.exports = {
	name: "subscribe",
	description: "Εγγραφή σε ειδοποιήσεις για μαθήματα.",
	type: 1,
	options: [
		{
			name: "semester",
			description: "The semester that the subject is in.",
			type: 4,
			// required: true,
		},
		{
			name: "subject",
			description: "The subject to be notified about.",
			type: 3,
			// required: true,
			autocomplete: true,
		},
	],
	permissions: {
		DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
	},

	async autocomplete(interaction, client) {
		const focusedValue = interaction.options.getFocused();

		//for string option name
		var semester = interaction.options.getInteger("semester");

		//If semester value is between 1 and 9
		if (semester > 0 && semester < 10) {
			//get all tags titles and add to array
			const tagss = await Tags.find({ title: { $regex: /^\d{4}/ }, parent_id: semester + 1 })
				.sort({ title: 1 })
				.exec();

			//add tag titles to array, and if there are more than 25, add "and more..." to the last element
			const choices = [];
			for (let i = 0; i < tagss.length; i++) {
				if (i < 24) {
					choices.push(tagss[i].title);
				} else {
					choices.push("και περισσότερα...");
					break;
				}
			}

			const filtered = choices.filter((choice) => choice.includes(focusedValue));

			// Respond the request here.
			await interaction.respond(filtered.map((choice) => ({ name: choice, value: choice })));
		} else {
			//show invalid semester message in subject autocomplete
			await interaction.respond([
				{
					name: "Invalid semester",
					value: "Invalid semester",
				},
			]);
		}
	},

	run: async (client, interaction, config, db) => {
		console.log(`User ${interaction.user.username}#${interaction.user.discriminator} used the ${interaction.commandName} command`);
		
		const userID = interaction.user.id;
		const guild_id = config.GuildID;

		//Check if user exists in DB
		const user = await User.findOne({ userId: userID });

		if (!user) {
			const authURL = `https://login.iee.ihu.gr/authorization/?client_id=${config.ihu_app.CLIENT_ID}&response_type=code&state=${userID},${guild_id}&scope=${config.ihu_app.SCOPES}&redirect_uri=${config.ihu_app.REDIRECT_URI}`;
			const embed = new EmbedBuilder().setTitle("Σύνδεση με τον λογαριασμό σου στο ΙΕΕ").setDescription(`Για να συνδεθείς με τον λογαριασμό σου στο ΙΕΕ, πατήστε [εδώ](${authURL})`).setColor("Random");
			// return await interaction.editReply({ embeds: [embed], components: [], ephemeral: true });
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		const accessToken = await utils.getAccessToken(userID);
		const userTags = await utils.getUserTags(accessToken);

		//If no arguments provided
		if (interaction.options.getInteger("semester") == null || interaction.options.getString("subject") == null) {
			//Create an embed asking to select semester number with buttons
			const embed = new EmbedBuilder()
				.setTitle("Επιλογή Εξαμήνου")
				.setDescription("Επιλέξτε το εξάμηνο που ανήκει το μάθημα που θέλετε να ειδοποιηθείτε.")
				.setColor("White")
				// .setFooter("Επιλέξτε το εξάμηνο που ανήκει το μάθημα που θέλετε να εγγραφείτε στις ειδοποιήσεις.")
				.setTimestamp();

			const row = new ActionRowBuilder().addComponents(
				new SelectMenuBuilder().setCustomId("select").setPlaceholder("Nothing selected").addOptions(
					{
						label: "Εξάμηνο 1",
						value: "1",
					},
					{
						label: "Εξάμηνο 2",
						value: "2",
					},
					{
						label: "Εξάμηνο 3",
						value: "3",
					},
					{
						label: "Εξάμηνο 4",
						value: "4",
					},
					{
						label: "Εξάμηνο 5",
						value: "5",
					},
					{
						label: "Εξάμηνο 6",
						value: "6",
					},
					{
						label: "Εξάμηνο 7",
						value: "7",
					},
					{
						label: "Εξάμηνο 8",
						value: "8",
					},
					{
						label: "Εξάμηνο 9",
						value: "9",
					}
				)
			);

			await interaction.reply({
				embeds: [embed],
				components: [row],
				ephemeral: true,
			});

			//Create a collector for the buttons
			const filter = (i) => i.customId === "select";
			const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

			//when value 1 is selected
			collector.on("collect", async (i) => {
				if (i.customId === "select") {
					//get value
					const semester = Number(i.values[0]);

					//Get all subjects
					const subjects = await Tags.find({ title: { $regex: /^\d{4}/ }, parent_id: semester + 1 })
						.sort({ title: 1 })
						.exec();

					//update embed with a new select containing all the subjects of that semester
					const embed = new EmbedBuilder()
						.setTitle("Επιλογή Μαθήματος")
						.setDescription("Επιλέξτε το μάθημα που θέλετε να ειδοποιηθείτε.")
						.setColor("Blue");

					const row = new ActionRowBuilder().addComponents(
						new SelectMenuBuilder()
							.setCustomId("select1")
							.setPlaceholder("Nothing selected")
							.addOptions(
								subjects.map((subject) => {
									return {
										label: subject.title,
										//value is index
										value: String(subject._id),
									};
								})
							)
					);

					//edit the message with the new embed
					await i.update({
						embeds: [embed],
						components: [row],
					});

					//when a subject is selected
					const filter1 = (i) => i.customId === "select1";
					const collector1 = interaction.channel.createMessageComponentCollector({ filter1, time: 15000 });

					collector1.on("collect", async (i) => {
						if (i.customId === "select1") {
							//get value
							const subject = Number(i.values[0]);
							console.log(subject);

							//Check if subject exist in user's tags
							const user = await User.findOne({ userId: userID }).exec();

							if (user.tags.includes(subject)) {
								await utils.subscribe(accessToken, userTags.filter((t) => t !== subject));
                                await User.updateOne({ userId: interaction.user.id }, { $pull: { tags: subject } }).exec();
								const embed = new EmbedBuilder()
									.setTitle("Εγγραφή Μαθήματος")
									.setDescription("Το μάθημα απεγγράφηκε επιτυχώς.")
									.setColor("Random");

								return await interaction.editReply({ embeds: [embed], components: [], ephemeral: true });
							} else {
								await utils.subscribe(accessToken, [...userTags, subject]);
                                await User.updateOne({ userId: interaction.user.id }, { $push: { tags: subject } }).exec();
                                const embed = new EmbedBuilder()
									.setTitle("Εγγραφή Μαθήματος")
									.setDescription("Το μάθημα εγγράφηκε επιτυχώς.")
									.setColor("Random");

								return await interaction.editReply({ embeds: [embed], components: [], ephemeral: true });
							}

						}
					});
				}
			});
		} else {
			//If arguments provided
			const semester = interaction.options.getInteger("semester");
			const subject = interaction.options.getString("subject");

			const user = await User.findOne({ userId: interaction.user.id }).exec();
			const tag = await Tags.findOne({ title: subject, parent_id: semester + 1 }).exec();


			if (user.tags.includes(tag._id)) {
				await User.updateOne({ userId: interaction.user.id }, { $pull: { tags: tag._id } }).exec();
				await utils.subscribe(accessToken, userTags.filter((t) => t !== tag._id));
				
				const embed = new EmbedBuilder()
				.setTitle("Εγγραφή στις ειδοποιήσεις")
				.setDescription(`Δεν θα λαμβάνεις ειδοποιήσεις για το μάθημα **${subject}** του **${semester}** εξαμήνου.`)
				.setColor("Red");
				return await interaction.reply({ embeds: [embed], components: [], ephemeral: true });
			} else {
				await User.updateOne({ userId: interaction.user.id }, { $push: { tags: tag._id } }).exec();
				await utils.subscribe(accessToken, [...userTags, tag._id]);
				
				const embed = new EmbedBuilder()
				.setTitle("Εγγραφή στις ειδοποιήσεις")
				.setDescription(`Θα λαμβάνεις ειδοποιήσεις για το μάθημα **${subject}** του **${semester}** εξαμήνου.`)
				.setColor("Green");
				return await interaction.reply({ embeds: [embed], components: [], ephemeral: true });
			}
		}
	},
};
