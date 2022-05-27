const express = require("express");
const { body, param, query } = require("express-validator");

const authMW = require("./../MiddleWares/authMiddleWare");

const controller = require("./../Controllers/speakerController");
const Speaker = require("./../Models/speakerModel")

const router = express.Router();

//router.use(authMW);   /*Create Speaker does not require authentication */

router.route("/speakers")
    .get(
        authMW,
        controller.getAllSpeakers)
    .post( /*Authuntication not required*/
        [
            body("email").isEmail().withMessage("Invalid Email")
                .custom(value => {
                    return Speaker.findOne({ email: value })
                        .then((data) => {
                            if (data != null)
                                return Promise.reject('Duplicated Email')
                        })
                }),
            body("userName").isAlphanumeric().withMessage("UserName should contain alphapetic and numbers")
                .custom(value => {
                    return Speaker.findOne({ userName: value })
                        .then((data) => {
                            if (data != null)
                                return Promise.reject('Duplicated userName')
                        })
                }),
            body("password").isLength({ min: 8 }).withMessage("Password should be at least 8 characters"),
            body("address.city").isAlpha().withMessage("city should be string"),
            body("address.street").isAlpha().withMessage("street name should be string"),
            body("address.building").isInt().withMessage("Bulding number should be intger")
        ],
        controller.createSpeaker)
    .put(
        authMW,
        [
            body("_id").isLength({ min: 12, max: 24 }).withMessage("id is not in a correct format")
                .custom(value => {
                    return Speaker.findOne({ _id: value })
                        .then((data) => {
                            if (data == null)
                                return Promise.reject("Id doesn't exist")
                        })
                }),
            //Send only the data you want to update
            body("email").optional().isEmail().withMessage("you should enter an email"),
            //If he sent his own email ==> it is not duplicated then
            (request, response, next) => {
                Speaker.findOne({ email: request.body.email, _id: { "$ne": request.body._id } })
                    .then(data => {
                        if (data != null)
                            throw new Error('Duplicated Email');

                        next();
                    }).catch(error => next(error))
            },
            body("userName").optional().isAlphanumeric().withMessage("UserName should contain alphapetic and numbers"),
            (request, response, next) => {
                Speaker.findOne({ email: request.body.userName, _id: { "$ne": request.body._id } })
                    .then(data => {
                        if (data != null)
                            throw new Error('Duplicated userName');

                        next();
                    }).catch(error => next(error))
            },
            body("password").optional().isLength({ min: 8 }).withMessage("Password should be at least 8 characters"),
            body("address.city").optional().isAlpha().withMessage("city should be string"),
            body("address.street").optional().isAlpha().withMessage("street name should be string"),
            body("address.building").optional().isInt().withMessage("Bulding number should be intger")
        ],
        controller.updateSpeaker)
    .delete(
        authMW,
        [
            body("_id").isLength({ min: 12, max: 24 }).withMessage("id is not in a correct format")
                .custom(value => {
                    return Speaker.findOne({ _id: value })
                        .then((data) => {
                            if (data == null)
                                return Promise.reject("Id doesn't exist")
                        })
                })
        ],
        controller.deleteSpeaker)

router.get("/speakers/:id",
    authMW,
    [
        param("id").isLength({ min: 12, max: 24 }).withMessage("id is not in a correct format")
            .custom(value => {
                return Speaker.findById(value)
                    .then((data) => {
                        if (data == null)
                            return Promise.reject("Id doesn't exist")
                    })
            }),
    ],
    controller.getSpeaker);

router.get("/speakers/events/:id",
    authMW,
    [
        param("id").isLength({ min: 12, max: 24 }).withMessage("id is not in a correct format")
            .custom(value => {
                return Speaker.findById(value)
                    .then((data) => {
                        if (data == null)
                            return Promise.reject("Id doesn't exist")
                    })
            }),
    ],
    controller.getSpeakerEvents);

module.exports = router;