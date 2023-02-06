const { EmbedBuilder } = require("discord.js");
const User = require('../../../server/models/user');
const config = require('../../../config/config.js');
const chalk = require('chalk');

module.exports = {
    name: "auth",
    description: "Συνδέσου με τον λογαριασμό σου στο ΙΕΕ για να έχεις πρόσβαση σε περισσότερες λειτουργίες.",
    type: 1,
    options: [],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config, guild) => {
		console.log(chalk.yellow(`User ${interaction.user.username}#${interaction.user.discriminator} used the ${interaction.commandName} command`));

		if (!interaction.guild) {
			return interaction.reply({ content: `Αυτή η εντολή δεν είναι διαθέσιμη σε προσωπικά μηνύματα.`, ephemeral: true });
        }

        //Get user's ID and DM user
		const userID = interaction.user.id; 
		const guild_id = config.GuildID;

		//Check if user exists in DB
		await User.findOne({ userId: userID }).then(async (user) => {
			if (user) {
				//User exists in DB
				interaction.reply({ content: `Έχεις ήδη συνδεθεί με τον λογαριασμό σου στο ΙΕΕ.`, ephemeral: true });
			} else {
				//User does not exist in DB
				const authURL = `https://login.iee.ihu.gr/authorization/?client_id=${config.ihu_app.CLIENT_ID}&response_type=code&state=${userID},${guild_id}&scope=${config.ihu_app.SCOPES}&redirect_uri=${config.ihu_app.REDIRECT_URI}`;
				const embed = new EmbedBuilder()
					.setTitle("Σύνδεση με τον λογαριασμό σου στο ΙΕΕ")
					.setDescription(`Για να συνδεθείς με τον λογαριασμό σου στο ΙΕΕ, πατήστε [εδώ](${authURL})`)
					.setColor("Random")
				interaction.reply({ embeds: [embed], ephemeral: true });
			}
		}).catch((err) => {
			console.log(err);
			interaction.reply({ content: `Υπήρξε κάποιο πρόβλημα στην επικοινωνία με την βάση δεδομένων.`, ephemeral: true });
		});


    },
};
