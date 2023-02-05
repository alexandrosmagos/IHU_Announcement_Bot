const { EmbedBuilder } = require("discord.js");
const utils = require("../../../server/utils.js");

module.exports = {
  config: {
    name: "updateTags",
    description: "Gets all the announcement tags",
    usage: "updateTags"
  },
  permissions: ['Administrator'],
  run: async (client, message, args, prefix, config) => {

    const accessToken = await utils.getAccessToken(message.author.id);
		await utils.getAllTags(accessToken);

    const embed = new EmbedBuilder()
    .setTitle("Tags updated!")
    .setColor("White")

    await message.channel.send({ embeds: [embed], ephemeral: true });
    
  },
};
