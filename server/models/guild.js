const mongoose = require("mongoose");
const tag = require("./tag");

const tagRef = new mongoose.Schema({
    tagID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
    },
    channelID: Number,
});

const guildSchema = new mongoose.Schema({
	_id: Number,
    name: String,
    date_joined: Date,
    general_channel: Number,
    tags: [tagRef],
});
    

module.exports = mongoose.model("Guild", guildSchema);