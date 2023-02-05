const mongoose = require("mongoose");

var tagSchema = mongoose.Schema({
    id: Number
}, { _id : false });

var authorSchema = mongoose.Schema({
    id: Number,
    name: String,
}, { _id : false });

var attachmentSchema = mongoose.Schema({
    filename: String,
    filesize: Number,
    mime_type: String,
    attachment_url: String,
    attachment_url_view: String,
}, { _id : false });

const announcementSchema = new mongoose.Schema({
	id: Number,
    title: String,
    body: String,
    created_at: Date,
    updated_at: Date,
    eng_title: String,
    eng_body: String,
    tags: [tagSchema],
    author: [authorSchema],
    attachments: [attachmentSchema],
});
    


module.exports = mongoose.model("Announcement", announcementSchema);