const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	guild_id: Number, //Discord serverID
	userId: String, //discord userID
	refreshToken: String,
	accessToken: String,
	expiresAt: Date,
	tags: Array,
});

module.exports = mongoose.model("User", userSchema);