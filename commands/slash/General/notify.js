const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const User = require('../../../server/models/user');
const Tags = require('../../../server/models/tag');
const config = require('../../../config/config.js');
const utils = require('../../../server/utils.js');
const chalk = require('chalk');

module.exports = {
    name: "notify",
    description: "Δες ποια μαθήματα έχεις επιλεγμένα για ειδοποίησεις",
    type: 1,
    options: [],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config, guild) => {
		console.log(chalk.yellow(`User ${interaction.user.username}#${interaction.user.discriminator} used the ${interaction.commandName} command`));

        //Get user's ID and DM user
		const userID = interaction.user.id; 
		const guild_id = config.GuildID;

		//Check if user exists in DB
		const user = await User.findOne({ userId: userID }).catch((err) => {
			console.log(err);
		});

		if (user) {
			if (user.tags.length > 0) {
				const tags = await Tags.find({ _id: { $in: user.tags } }).catch((err) => {
					console.log(err);
				});

				const embed = new EmbedBuilder()
					.setTitle("Επιλεγμένα μαθήματα")
					// .setDescription("Τα επιλεγμένα μαθήματα σου είναι:")
					.setColor("White")
					.setFooter({ text: "Για να αφαιρέσεις μάθημα, πάτησε το αντίστοιχο κουμπάκι." });

				const rows = [];

				for (let i = 0; i < Math.min(Math.ceil(tags.length / 5), 5); i++) {
					rows.push(new ActionRowBuilder());
                }

				tags.forEach((tag, i) => {
					if (i >= 25) return;
					rows[Math.floor(i / 5)].addComponents(
                        new ButtonBuilder()
                            .setLabel(tag.title)
                            .setCustomId(`removeTag:${tag._id}`)
                            .setStyle("Primary")
                    );
                });
				

				// Send the embed and the buttons
				interaction.reply({ embeds: [embed], components: rows, ephemeral: true });


				// collector
				const filter = (button) => button.user.id === userID;
				const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });
				collector.on("collect", async (button) => {
					const tag = Number(button.customId.split(":")[1]);
					
					const accessToken = await utils.getAccessToken(userID);
					const userTags = await utils.getUserTags(accessToken);

					await utils.subscribe(accessToken, userTags.filter((t) => t !== tag));
					
					await user.updateOne({ $pull: { tags: tag } }).catch((err) => {
						console.log(err);
					});

					const embed = new EmbedBuilder()
						.setTitle("Επιλεγμένα μαθήματα")
						.setDescription("Το μάθημα αφαιρέθηκε.")
						.setColor("White")

					interaction.editReply({ embeds: [embed], components: [] });
				});

				// if collector expires, update message
				collector.on("end", (collected) => {
					if (collected.size === 0) {
						const embed = new EmbedBuilder()
							.setTitle("Επιλεγμένα μαθήματα")
							.setDescription("Το μήνυμα έληξε.")
							.setColor("White")

						interaction.editReply({ embeds: [embed], components: [] });
					}
				});


			} else {
				const embed = new EmbedBuilder()
					.setTitle("Επιλεγμένα μαθήματα")
					.setDescription("Δεν έχεις επιλέξει κανένα μάθημα για ειδοποίηση.")
					.setColor("White")
				interaction.reply({ embeds: [embed], ephemeral: true });
			}
		} else {
			//User does not exist in DB
			const authURL = `https://login.iee.ihu.gr/authorization/?client_id=${config.ihu_app.CLIENT_ID}&response_type=code&state=${userID},${guild_id}&scope=${config.ihu_app.SCOPES}&redirect_uri=${config.ihu_app.REDIRECT_URI}`;
			const embed = new EmbedBuilder()
				.setTitle("Σύνδεση με τον λογαριασμό σου στο ΙΕΕ")
				.setDescription(`Για να συνδεθείς με τον λογαριασμό σου στο ΙΕΕ, πατήστε [εδώ](${authURL})`)
				.setColor("Random")
			interaction.reply({ embeds: [embed], ephemeral: true });
		}

    },
};
