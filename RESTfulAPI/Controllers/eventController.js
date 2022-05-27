const { request } = require("express");
const { validationResult } = require("express-validator");

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

//Authorization 
CheckAuthorization = (request) => {
    if (request.role != "admin") {
        throw new Error("Not Authorized");
    }
}

module.exports.getAllEvents = (request, response, next) => {
    CheckAuthorization(request);
    Event.find({})
        .then(data => {
            response.status(200).json({ data })
        })
        .catch(error => next(error));
}

module.exports.getEvent = (request, response) => {
    CheckAuthorization(request);
    checkValidation(request);

    Event.find({ _id: request.params.id })
        .then(data => {
            response.status(200).json({ data })
        })
        .catch(error => next(error));

    //console.log(request.params);

}

module.exports.createEvent = (request, response, next) => {
    CheckAuthorization(request);
    checkValidation(request);

    let event = new Event({
        _id: request.body._id,
        title: request.body.title,
        event_date: new Date(request.body.event_date),
        mainSpeaker_id: request.body.mainSpeaker_id,
        otherSpeakers_ids: request.body.otherSpeakers_ids,
        students_ids: request.body.students_ids
    })
    event.save()
        .then((data) => {
            response.status(201).json({ message: "event created", data })

        }).catch(error => next(error));

    //console.log(request.body);

}

module.exports.updateEvent = (request, response) => {
    CheckAuthorization(request);
    checkValidation(request);

    Event.updateOne({ _id: request.body._id }, {
        $set: {
            title: request.body.title || this.title,
            event_date: request.body.event_date || this.event_date,
            mainSpeaker_id: request.body.mainSpeaker_id || this.mainSpeaker_id,
            otherSpeakers_ids: request.body.otherSpeakers_ids || this.otherSpeakers_ids,
            students_ids: request.body.students_ids || this.students_ids
        }
    })
        .then(data => {
            if (data.matchedCount == 0)
                throw new Error("event not exists");

            else if (data.modifiedCount > 0)
                response.status(200).json({ message: "event updated", data });

            else
                response.status(200).json({ message: "no different data", data });
        })
        .catch(error => next(error))

    //console.log(request.body);
}

module.exports.addSpeakersToEvent = (request, response, next) => {
    CheckAuthorization(request);
    checkValidation(request);

    Event.updateOne({ _id: request.body._id }, {
        $addToSet: {
            otherSpeakers_ids: request.body.speakers_ids
        }
    })
        .then(data => {
            if (data.matchedCount == 0)
                throw new Error("event not exists");

            else if (data.modifiedCount > 0)
                response.status(200).json({ message: "speakers added", data });

            else
                response.status(200).json({ message: "no different data", data });
        })
        .catch(error => next(error))

}

module.exports.addStudentsToEvent = (request, response, next) => {
    CheckAuthorization(request);
    checkValidation(request);

    Event.updateOne({ _id: request.body._id }, {
        $addToSet: {
            students_ids: request.body.students_ids
        }
    })
        .then(data => {
            if (data.matchedCount == 0)
                throw new Error("event not exists");

            else if (data.modifiedCount > 0)
                response.status(200).json({ message: "students added", data });

            else
                response.status(200).json({ message: "no different data", data });
        })
        .catch(error => next(error))
}

module.exports.deleteEvent = (request, response) => {
    CheckAuthorization(request);
    checkValidation(request);

    Event.deleteOne({ _id: request.body._id })
        .then(data => {
            if (data.matchedCount == 0 || data.deletedCount == 0) {
                throw new Error("event not exists");
            }

            response.status(200).json({ message: "event deleted", data });
        })
        .catch(error => next(error))

    // console.log(request.query);
    // console.log(request.body);

}