const fs = require("fs");
const chalk = require('chalk');

module.exports = (client) => {
  console.log(chalk.blue("0------------------| Events Handler:"));
  
  fs.readdirSync('./events/').forEach(dir => {
		const commands = fs.readdirSync(`./events/${dir}`).filter(file => file.endsWith('.js'));
		for (let file of commands) {
      
			let pull = require(`../events/${dir}/${file}`);
			if (pull.name) {
				client.events.set(pull.name, pull);
				console.log(chalk.green(`[HANDLER - EVENTS] Loaded a file: ${pull.name}`))
			} else {
				console.log(chalk.red(`[HANDLER - EVENTS] Couldn't load the file ${file}. missing name or aliases.`))
				continue;
			}
      
		}
	});
}