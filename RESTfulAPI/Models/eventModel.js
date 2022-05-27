const mongoose = require("mongoose");

let eventSchema = new mongoose.Schema({
    _id: Number,
    title: { type: String, required: true },
    event_date: Date,
    mainSpeaker_id: {type:String,ref:"speakers"}, //check if exist
    otherSpeakers_ids: [{type:String,ref:"speakers"}],
    students_ids: [{type:Number,ref:"students"}]
    // students_ids: {type:Array,ref:"students"}
});

module.exports = mongoose.model("events", eventSchema)