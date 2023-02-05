const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
	_id: Number,
    title: String,
    is_public: Number,
    parent_id: Number,
    maillist_name: String,
    created_at: Date,
    updated_at: Date,
    deleted_at: Date
});


module.exports = mongoose.model("Tag", tagSchema);