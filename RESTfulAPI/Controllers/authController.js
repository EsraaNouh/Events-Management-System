const jwt = require("jsonwebtoken");

const Student = require("./../Models/studentModel");
const Speaker = require("./../Models/speakerModel");

const bcrypt = require("bcrypt");

module.exports.login = (request, response, next) => {
    let token;
    //System have only one administrator (static username and password).
    if (request.body.userName == "theoneandonlyadmin@gmail.com" && request.body.password == "123abc456DEF$") {
        token = jwt.sign({
            _id: 1,
            userName: request.body.userName,
            role: "admin"
            },
            "This is my 1st node project",
            { expiresIn: "1h" });

        response.status(200).json({ msg: "login", token , role: "admin" })
    }
    else {
        Student.findOne({ email: request.body.userName })
            .then(data => {
                if (data != null && bcrypt.compareSync(request.body.password, data.password)) {
                    token = jwt.sign({
                        _id: data._id,
                        //students usernames will be their emails
                        userName: data.email,
                        role: "student"
                        },
                        "This is my 1st node project",
                        { expiresIn: "1h" });

                    response.status(200).json({ msg: "login", token , role: "student", id: data._id })
                }
                else {
                    Speaker.findOne({ userName: request.body.userName })
                        .then(data => {
                            if (data == null || !bcrypt.compareSync(request.body.password, data.password))
                                throw new Error("userName and password incorrect");

                            token = jwt.sign({
                                _id: data._id,
                                userName: data.userName,
                                role: "speaker"
                                },
                                "This is my 1st node project",
                                { expiresIn: "1h" });

                            response.status(200).json({ msg: "login", token, role: "speaker", id: data._id })
                        })
                        .catch(error => next(error))
                }
            })
            .catch(error => next(error))
    }
}