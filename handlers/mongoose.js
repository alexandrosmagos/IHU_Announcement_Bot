const mongoose = require('mongoose');
const config = require("../config/config.js");
const chalk = require('chalk');

module.exports = (client) => {
	console.log(chalk.yellow("[DATABASE] Started connecting to MongoDB..."));
	const mongo = process.env.MONGO || config.Handlers.MONGO;
	
	if (!mongo) {
		console.log(chalk.red("[WARN] A Mongo URI/URL isn't provided! (Not required)"));
	} else {
		mongoose.connect(mongo, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}).catch((e) => console.log(e))

		mongoose.connection.once("open", () => {
			console.log(chalk.green("[DATABASE] Connected to MongoDB!"));
		})
		return;
	}
}
