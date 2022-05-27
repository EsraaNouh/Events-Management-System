const express = require("express");
const { body, param, query } = require("express-validator");

const authMW = require("./../MiddleWares/authMiddleWare");

const controller = require("./../Controllers/studentController");
const Student = require("./../Models/studentModel");

const router = express.Router();

//router.use(authMW); /*Create Student does not require authentication */

router.route("/students")
    .get(
        authMW, 
        controller.getAllStudents)
    .post( /*Authuntication not required*/
        [
            body("_id").isInt().withMessage("id should be intger")
                .custom(value => {
                    return Student.findById(value)
                        .then((data) => {
                            if (data != null)
                                return Promise.reject("Duplicated Id")
                        })
                }),
            body("email").isEmail().withMessage("Invalid Email")
                .custom(value => {
                    return Student.findOne({ email: value })
                        .then((data) => {
                            if (data != null)
                                return Promise.reject('Duplicated Email')
                        })
                }),
            body("password").isLength({ min: 8 }).withMessage("Password should be at least 8 characters")
        ],
        controller.createStudent)
    .put(
        authMW,
        [
            body("_id").isInt().withMessage("id should be intger")
                .custom(value => {
                    return Student.findById(value)
                        .then((data) => {
                            if (data == null)
                                return Promise.reject("Id doesn't exist")
                        })
                }),
            //Send only the data you want to change
            body("email").optional().isEmail().withMessage("you should enter an email"),
            //If he sent his own email ==> it is not duplicated then
            (request, response, next) => {
                Student.findOne({ email: request.body.email, _id: { "$ne": request.body._id } })
                    .then(data => {
                        if (data != null)
                            throw new Error('Duplicated Email');
                        
                        next();
                    }).catch(error => next(error))
            },
            body("password").optional().isLength({ min: 8 }).withMessage("Password should be at least 8 characters")
        ],
        controller.updateStudent)
    .delete(
        authMW,
        [
            body("_id").isInt().withMessage("id should be intger")
                .custom(value => {
                    return Student.findById(value)
                        .then((data) => {
                            if (data == null)
                                return Promise.reject("Id doesn't exist")
                        })
                })
            //query("id").isInt().withMessage("id should be intger")
        ],
        controller.deleteStudent)

router.get("/students/:id",
    authMW,
    [
        param("id").isInt().withMessage("id should be intger")
            .custom(value => {
                return Student.findById(value)
                    .then((data) => {
                        if (data == null)
                            return Promise.reject("Id doesn't exist")
                    })
            }),
    ],
    controller.getStudent)

router.get("/students/events/:id",
    authMW,
    [
        param("id").isInt().withMessage("id should be intger")
            .custom(value => {
                return Student.findById(value)
                    .then((data) => {
                        if (data == null)
                            return Promise.reject("Id doesn't exist")
                    })
            }),
    ],
    controller.getStudentEvents)

module.exports = router;