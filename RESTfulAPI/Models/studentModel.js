const mongoose = require("mongoose");

let studentSchema = new mongoose.Schema({
    _id: Number,               //plugin
    email: String,
    password: String,   
});

module.exports = mongoose.model("students", studentSchema)