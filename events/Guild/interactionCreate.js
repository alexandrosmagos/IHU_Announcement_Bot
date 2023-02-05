const { EmbedBuilder } = require("discord.js");
const client = require("../../index");
const config = require("../../config/config.js");

module.exports = {
  name: "interactionCreate"
};

client.on('interactionCreate', async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = client.slash_commands.get(interaction.commandName);

    if (!command) return;

    try {
      command.run(client, interaction, config, interaction.guild);
    } catch (e) {
      console.error(e)
    };
  };

  if (interaction.isUserContextMenuCommand()) { // User:
    const command = client.user_commands.get(interaction.commandName);

    if (!command) return;

    try {
      command.run(client, interaction, config);
    } catch (e) {
      console.error(e)
    };
  };

  if (interaction.isAutocomplete()) { // Autocomplete
    const { commands } = client;
    const { commandName } = interaction;
    const command = client.slash_commands.get(interaction.commandName);

    if (!command) return;

    try {
      command.autocomplete(interaction, client);
    } catch (e) {
      console.error(e)
    }
  };

});

