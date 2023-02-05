const client = require("../../index");
const chalk = require('chalk');
const guildSchema = require("../../server/models/guild");

module.exports = {
  name: "guildCreate.js"
};

client.once('guildDelete', async (guild) => {

  console.log(chalk.red("\n" + `[GUILD DELETE] Left guild ${guild.name}.`));

  //delete guild with id guildID from the db
  await guildSchema.findOneAndDelete({ _id: guild.id }).catch((err) => console.log(err));

})