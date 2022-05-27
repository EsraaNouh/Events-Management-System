const { validationResult } = require("express-validator");
var mongoose = require('mongoose');

const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);

const Speaker = require("./../Models/speakerModel");
const Event = require("./../Models/eventModel");

//Validation
checkValidation = (request) => {
    let result = validationResult(request);
    if (!result.isEmpty()) {
        let message = result.array().reduce((current, error) => current + error.msg + " ", " ");
        let error = new Error(message);
        error.status = 422;
        throw error;
    }
}

module.exports.getAllSpeakers = (request, response, next) => {
    //Authorization
    if (request.role != "admin") {
        throw new Error("Not Authorized");
    }
    Speaker.find({})
        .then(data => {
            response.status(200).json({ data })
        })
        .catch(error => next(error));
}

module.exports.getSpeaker = (request, response, next) => {
    //Authorization
    if (request.role != "admin" && request.role != "speaker") {
        throw new Error("Not Authorized");
    }
    if(request.role == "speaker" && request.userId != request.params.id){
        throw new Error("Not Authorized");
    }
    checkValidation(request);

    Speaker.find({ _id: request.params.id })
        .then(data => {
            response.status(200).json({ data })
        })
        .catch(error => next(error));

    //console.log(request.params);
}

module.exports.getSpeakerEvents = (request, response, next) => {
    //Authorization
    if (request.role != "admin" && request.role != "speaker") {
        throw new Error("Not Authorized");
    }
    if(request.role == "speaker" && request.userId != request.params.id){
        throw new Error("Not Authorized");
    }
    checkValidation(request);
    let events = [];

    Event.find({ mainSpeaker_id: request.params.id })
        .then(data => {
            events.push(...data);
            Event.find({ otherSpeakers_ids: request.params.id })
                .then(data => {
                    events.push(...data);
                    response.status(200).json({ events })
                })
        })
        .catch(error => next(error));
}

module.exports.createSpeaker = (request, response, next) => {
    checkValidation(request);

    //Hashing Password
    let pass = request.body.password;
    let hashedPass = bcrypt.hashSync(pass, salt);

    let speaker = new Speaker({
        _id: mongoose.Types.ObjectId(),
        email: request.body.email,
        userName: request.body.userName,
        password: hashedPass,
        address:{
            city: request.body.address.city,
            street: request.body.address.street,
            building: request.body.address.building
        }
        // address:request.body.address
    })
    speaker.save()
        .then((data) => {
            response.status(201).json({ message: "speaker created", data })

        }).catch(error => next(error));

    //console.log(request.body);

}

module.exports.updateSpeaker = (request, response, next) => {
    //Authorization
    if (request.role != "admin" && request.role != "speaker") {
        throw new Error("Not Authorized");
    }

    Speaker.findOne({ _id: request.body._id })
        .then(data => {
            //Admin Authorization
            if (request.role == "admin" && ((typeof request.body.userName != 'undefined' && request.body.userName != data.userName) || (typeof request.body.password != 'undefined' && !bcrypt.compareSync(request.body.password, data.password))))
                throw new Error("Not Authorized");
            else {
                //The Original Code: Authorized to update
                checkValidation(request);

                //Hashing Password
                let pass = request.body.password;
                let hashedPass;
                if (typeof pass === 'undefined') {
                    hashedPass = pass;
                }
                else {
                    hashedPass = bcrypt.hashSync(pass, salt);
                }

                Speaker.updateOne({ _id: request.body._id }, {
                    $set: {
                        email: request.body.email || this.email,
                        userName: request.body.userName || this.userName,
                        password: hashedPass || this.password,
                        address:{
                            city: request.body.address.city || this.address.city,
                            street: request.body.address.street || this.address.street,
                            building: request.body.address.building || this.address.building
                        }
                    }
                })
                    .then(data => {
                        if (data.matchedCount == 0)
                            throw new Error("speaker not exists");

                        else if (data.modifiedCount > 0)
                            response.status(200).json({ message: "speaker updated", data });

                        else
                            response.status(200).json({ message: "no different data", data });
                    })
                //.catch(error => next(error))

            }
        })
        .catch(error => next(error))
}
module.exports.deleteSpeaker = (request, response, next) => {
    //Authorization
    if (request.role != "admin") {
        throw new Error("Not Authorized");
    }
    checkValidation(request);

    Speaker.deleteOne({ _id: request.body._id })
        .then(data => {
            if (data.matchedCount == 0 || data.deletedCount == 0) {
                throw new Error("speaker not exists");
            }

            response.status(200).json({ message: "speaker deleted", data });
        })
        .catch(error => next(error))

    //console.log(request.query);
    //console.log(request.body);
}