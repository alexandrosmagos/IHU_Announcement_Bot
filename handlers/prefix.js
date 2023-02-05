const fs = require("fs");
const chalk = require("chalk");

module.exports = (client, config) => {
  console.log(chalk.blue("0------------------| Prefix Handler:"));

  fs.readdirSync('./commands/prefix/').forEach(dir => {
    const commands = fs.readdirSync(`./commands/prefix/${dir}`).filter(file => file.endsWith('.js'));
    for (let file of commands) {

      let pull = require(`../commands/prefix/${dir}/${file}`);
      if (pull.config.name) {
        client.prefix_commands.set(pull.config.name, pull);
        console.log(chalk.green(`[HANDLER - PREFIX] Loaded a file: ${pull.config.name} (#${client.prefix_commands.size})`))
      } else {
        console.log(chalk.red(`[HANDLER - PREFIX] Couldn't load the file ${file}, missing module name value.`))
        continue;
      };

    };
  });
};
