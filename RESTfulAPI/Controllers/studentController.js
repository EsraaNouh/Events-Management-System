const { validationResult } = require("express-validator");

const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);

const Student = require("./../Models/studentModel");
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

module.exports.getAllStudents = (request, response, next) => {
    //Authorization
    if (request.role != "admin") {
        throw new Error("Not Authorized");
    }
    Student.find({})
        .then(data => {
            response.status(200).json({ data })
        })
        .catch(error => next(error));
}

module.exports.getStudent = (request, response, next) => {
    //Authorization
    if (request.role != "admin" && request.role != "student") {
        throw new Error("Not Authorized");
    }
    if (request.role == "student" && request.userId != request.params.id) {
        throw new Error("Not Authorized");
    }
    checkValidation(request);

    Student.find({ _id: request.params.id })
        .then(data => {
            response.status(200).json({ data })
        })
        .catch(error => next(error));

    //console.log(request.params);
}

module.exports.getStudentEvents = (request, response, next) => {
    //Authorization
    if (request.role != "admin" && request.role != "student") {
        throw new Error("Not Authorized");
    }
    if (request.role == "student" && request.userId != request.params.id) {
        throw new Error("Not Authorized");
    }
    checkValidation(request);

    Event.find({ students_ids: request.params.id })
        .then(data => {
            response.status(200).json({ data })
        })
        .catch(error => next(error));

    //console.log(request.params);
}

module.exports.createStudent = (request, response, next) => {
    checkValidation(request);

    //Hashing Password
    let pass = request.body.password;
    const hashedPass = bcrypt.hashSync(pass, salt);

    if (request.body._id != 0) {
        let student = new Student({
            _id: request.body._id,
            email: request.body.email,
            password: hashedPass
        })
        student.save()
        .then(data=>{
            response.status(201).json({ message: "student created", data });
        })
        .catch(error => next(error));

    }
    else{
        Student.find({}).sort({ _id: -1 }).limit(1).then(S=>{
            console.log(S.length);
            let id;
            if(S.length == 0)
                id = 1;
            else
                id = (S[0]._id) + 1;
            let student = new Student({
                _id: id,
                email: request.body.email,
                password: hashedPass
            })
            student.save()
            .then(data=>{
                response.status(201).json({ message: "student created", data });
            })
            .catch(error => next(error));
        })
    }
    
    //console.log(request.body);

}

module.exports.updateStudent = (request, response, next) => {
    //Authorization
    if (request.role != "admin" && request.role != "student") {
        throw new Error("Not Authorized");
    }

    Student.findOne({ _id: request.body._id })
        .then(data => {
            //Admin Authorization
            if (request.role == "admin" && ((typeof request.body.email != 'undefined' && request.body.email != data.email) || (typeof request.body.password != 'undefined' && !bcrypt.compareSync(request.body.password, data.password))))
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

                Student.updateOne({ _id: request.body._id }, {
                    $set: {
                        email: request.body.email || this.email,
                        password: hashedPass || this.password
                    }
                })
                    .then(data => {
                        if (data.matchedCount == 0)
                            throw new Error("student not exists");

                        else if (data.modifiedCount > 0)
                            response.status(200).json({ message: "student updated", data });

                        else
                            response.status(200).json({ message: "no different data", data });
                    })
                //.catch(error => next(error))
            }
        })
        .catch(error => next(error))

}
module.exports.deleteStudent = (request, response, next) => {
    //Authorization
    if (request.role != "admin") {
        throw new Error("Not Authorized");
    }
    checkValidation(request);

    Student.deleteOne({ _id: request.body._id })
        .then(data => {
            if (data.matchedCount == 0 || data.deletedCount == 0) {
                throw new Error("student not exists");
            }

            response.status(200).json({ message: "student deleted", data });
        })
        .catch(error => next(error))

    // console.log(request.query);
    // console.log(request.body);
}
