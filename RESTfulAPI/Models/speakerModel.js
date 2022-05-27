const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

let speakerSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    email: String,       
    userName: String,
    password: String,   
    address:{
                city: String ,
                street:String , 
                building: Number
            }
});

module.exports = mongoose.model("speakers", speakerSchema)