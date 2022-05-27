const jwt = require("jsonwebtoken");

module.exports = (request, response, next) => {
    if (request.method != "OPTIONS") {
        let token, decodedToken;
        try {
            token = request.get("Authorization").split(" ")[1];
            decodedToken = jwt.verify(token, "This is my 1st node project");
        }
        catch (error) {
            throw new Error("Not Authenticated");
        }

        //authenticated
        request.role = decodedToken.role;
        request.userId = decodedToken._id;
    }
    next();
}