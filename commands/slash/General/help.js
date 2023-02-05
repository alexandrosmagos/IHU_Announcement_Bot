const { EmbedBuilder, ActionRowBuilder, Events, SelectMenuBuilder } = require("discord.js");
const User = require('../../../server/models/user');
const config = require('../../../config/config.js');

module.exports = {
    name: "help",
    description: "View the bot commands",
    type: 1,
    options: [],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config, guild) => {
        console.log(`User ${interaction.user.username}#${interaction.user.discriminator} used the ${interaction.commandName} command`);

		// Send an embed showcasing bot commands
		const embed = new EmbedBuilder()
            .setColor("White")
            .setTitle("Εντολές του Bot")
            .setDescription(`Προκειμένου να συμμορφωθεί με την πολιτική απορρήτου του Πανεπιστημίου, το bot πρέπει να επαληθεύσει ότι είστε φοιτητής και έτσι για να μπορείτε να χρησιμοποιήσετε οποιεσδήποτε εντολές, πρέπει πρώτα να κάνετε </auth:1026486199730327623>.\n\n:point_right: </auth:1026486199730327623>\n*Για έλεγχο ταυτότητας χρησιμοποιώντας το api του πανεπιστημίου*\n\n:point_right: </deauth:1071481680415686788>\n*Για κατάργηση ταυτότητας και κατάργηση του χρήστη σας από το bot μας.*\n\n:point_right: </notify:1071789077789163582>\n*Για να δείτε ή να αφαιρέσετε οποιοδήποτε από τα μαθήματα(tags) στα οποία έχετε εγγραφεί.*\n\n:point_right: </subscribe:1071749387044270090>\n*Για να εγγραφείτε σε νέα θέματα, στα οποία θέλετε λαμβάνετε DM όταν βγαίνει μια νέα ανακοίνωση*`)
			
		await interaction.reply({ embeds: [embed], ephemeral: true });
		
		

    },
};
