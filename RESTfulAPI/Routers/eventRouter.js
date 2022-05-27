const express = require("express");
const { body, param, query } = require("express-validator");

const authMW=require("./../MiddleWares/authMiddleWare");

const controller = require("./../Controllers/eventController");
const Speaker = require("./../Models/speakerModel");
const Student = require("./../Models/studentModel");
const Event = require("./../Models/eventModel");

const router = express.Router();

router.use(authMW);

router.route("/events")
    .get(controller.getAllEvents)
    .post(
        [
            body("_id").isInt().withMessage("id should be intger")
            .custom(value => {
                return Event.findById(value)
                    .then((data) => {
                        if (data != null)
                            return Promise.reject("Duplicated Id")
                    })
            }),
            body("title").isAlphanumeric().withMessage("title should contain only letters and numbers")
                .isLength({ max: 10 }).withMessage("event title length<10"),
            body("mainSpeaker_id").isLength({ min: 12, max: 24 }).withMessage("Speaker id is not in a correct format")
            .custom(value => {
                return Speaker.findOne({ _id: value })     
                    .then((data) => {
                        if (data == null)
                            return Promise.reject("Main Speaker doesn't exist")
                    })
            }),
            body("otherSpeakers_ids").custom((values) => {
                return Speaker.find({ "_id": { $in: values } })
                    .then(data => {
                        if (data.length != values.length)
                            return Promise.reject("Invalid speakers' Ids")
                    })
            }),
            body("students_ids").custom(values => {
                return Student.find({ "_id": { $in: values } })
                    .then(data => {
                        if (data.length != values.length)
                            return Promise.reject("Invalid students' Ids")
                    })
            })
        ],
        controller.createEvent)
    .put(
        [
            body("_id").isInt().withMessage("id should be intger")
            .custom(value => {
                return Event.findById(value)
                    .then((data) => {
                        if (data == null)
                            return Promise.reject("Id doesn't exist")
                    })
            }),
            // Send only the data you want to change
            body("title").optional().isAlphanumeric().withMessage("title should contain only letters and numbers")
                .isLength({ max: 10 }).withMessage("event title length<10"),
            body("mainSpeaker_id").optional().isLength({ min: 12, max: 24 }).withMessage("Speaker id is not in a correct format")
            .custom(value => {
                return Speaker.findOne({ _id: value })     
                    .then((data) => {
                        if (data == null)
                            return Promise.reject("Main Speaker doesn't exist")
                    })
            }),
            body("otherSpeakers_ids").optional().custom((values) => {
                return Speaker.find({ "_id": { $in: values } })
                    .then(data => {
                        if (data.length != values.length)
                            return Promise.reject("Invalid speakers' Ids")
                    })
            }),
            body("students_ids").optional().custom(values => {
                return Student.find({ "_id": { $in: values } })
                    .then(data => {
                        if (data.length != values.length)
                            return Promise.reject("Invalid students' Ids")
                    })
            })
        ],
        controller.updateEvent)
    .delete(
        [
            body("_id").isInt().withMessage("id should be intger")
            .custom(value => {
                return Event.findById(value)
                    .then((data) => {
                        if (data == null)
                            return Promise.reject("Id doesn't exist")
                    })
            })
        ],
        controller.deleteEvent)

router.get("/events/:id",
    [
        param("id").isInt().withMessage("id should be intger")
            .custom(value => {
                return Event.findById(value)
                    .then((data) => {
                        if (data == null)
                            return Promise.reject("Id doesn't exist")
                    })
            })
    ],
    controller.getEvent);

router.put("/events/addspeakers",
[
    body("_id").isInt().withMessage("id should be intger")
    .custom(value => {
        return Event.findById(value)
            .then((data) => {
                if (data == null)
                    return Promise.reject("Event Id doesn't exist")
            })
    }),
    body("speakers_ids").custom((values) => {
        return Speaker.find({ "_id": { $in: values } })
            .then(data => {
                if (data.length != values.length)
                    return Promise.reject("Invalid speakers' Ids")
            })
    })
],
controller.addSpeakersToEvent)

router.put("/events/addstudents",
[
    body("_id").isInt().withMessage("id should be intger")
    .custom(value => {
        return Event.findById(value)
            .then((data) => {
                if (data == null)
                    return Promise.reject("Event Id doesn't exist")
            })
    }),
    body("students_ids").optional().custom(values => {
        return Student.find({ "_id": { $in: values } })
            .then(data => {
                if (data.length != values.length)
                    return Promise.reject("Invalid students' Ids")
            })
    })
],
controller.addStudentsToEvent)

module.exports = router;