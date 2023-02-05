const client = require("../../index");
const chalk = require('chalk');
const guildSchema = require("../../server/models/guild");

module.exports = {
  name: "guildCreate.js"
};

client.once('guildCreate', async (guild) => {

  console.log(chalk.green("\n" + `[GUILD CREATE] Joined ${guild.name}.`));

  const newGuild = new guildSchema({
    _id: guild.id,
    name: guild.name,
    date_joined: Date.now(),
  });

  newGuild.save().catch((err) => console.log(err));


})