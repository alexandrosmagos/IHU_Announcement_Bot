const client = require("../../index");
const chalk = require('chalk');

module.exports = {
  name: "ready.js"
};

client.once('ready', async () => {
  console.log(chalk.green("\n" + `[READY] ${client.user.tag} is up and ready to go. Running on on ${client.guilds.cache.size} guilds!`));

})