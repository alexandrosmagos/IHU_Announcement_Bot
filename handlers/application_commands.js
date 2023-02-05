const { PermissionsBitField, Routes, REST, User } = require('discord.js');
const fs = require("fs");
const chalk = require('chalk');

module.exports = (client, config) => {
  console.log(chalk.blue("0------------------| Application commands Handler:"));

  let commands = [];

  // Slash commands handler:
  fs.readdirSync('./commands/slash/').forEach((dir) => {
    console.log(chalk.yellow('[!] Started loading slash commands...'));
    const SlashCommands = fs.readdirSync(`./commands/slash/${dir}`).filter((file) => file.endsWith('.js'));

    for (let file of SlashCommands) {
      let pull = require(`../commands/slash/${dir}/${file}`);

      if (pull.name, pull.description, pull.type == 1) {
        client.slash_commands.set(pull.name, pull);
        console.log(chalk.green(`[HANDLER - SLASH] Loaded a file: ${pull.name} (#${client.slash_commands.size})`));

        commands.push({
          name: pull.name,
          description: pull.description,
          type: pull.type || 1,
          options: pull.options ? pull.options : null,
          default_permission: pull.permissions.DEFAULT_PERMISSIONS ? pull.permissions.DEFAULT_PERMISSIONS : null,
          default_member_permissions: pull.permissions.DEFAULT_MEMBER_PERMISSIONS ? PermissionsBitField.resolve(pull.permissions.DEFAULT_MEMBER_PERMISSIONS).toString() : null
        });

      } else {
        console.log(chalk.red(`[HANDLER - SLASH] Couldn't load the file ${file}, missing module name value, description, or type isn't 1.`))
        continue;
      };
    };
  });

  const rest = new REST({ version: '10' }).setToken(config.Client.TOKEN || process.env.TOKEN);

  (async () => {
    console.log(chalk.yellow('[HANDLER] Started registering all the application commands.'));

    try {
      await rest.put(
        Routes.applicationCommands(config.Client.ID),
        { body: commands }
      );

      console.log(chalk.green('[HANDLER] Successfully registered all the application commands.'));
    } catch (err) {
      console.log(err);
    }
  })();
};
