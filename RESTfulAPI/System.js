const express = require("express");
const body_parser = require("body-parser");
const mongoose = require("mongoose");

const authRouter = require("./Routers/authRouter");
const studentRouter = require("./Routers/studentRouter");
const speakerRouter = require("./Routers/speakerRouter");
const eventRouter = require("./Routers/eventRouter");

const server = express();
mongoose.connect("mongodb://localhost:27017/eventsSystem")
    .then(() => {
        console.log("DB Connected");
        server.listen(process.env.PORT || 8080, () => {
            console.log("I am Listening ....... ")
        });
    })
    .catch((error) => console.log(error+"DB connection problem"))


// Logger MW
server.use((request, response, next) => {
    console.log(request.url, request.method);
    next();
});
server.use((request,response,next)=>{

    response.header("Access-Control-Allow-Origin","*");
    response.header("Access-Control-Allow-Methods","GET,POST,DELETE,PUT,OPTIONS");
    response.header("Access-Control-Allow-Headers","Content-Type,Authorization")
    next();

});

// body parsing middleware
server.use(body_parser.json());
server.use(body_parser.urlencoded({ extended: false }));

// Routers /* we send all data in the request body (except for getById --> we send it using params) */
server.use(authRouter);
server.use(studentRouter);
server.use(speakerRouter);
server.use(eventRouter);

//Not Found MW
server.use((request, response) => {
    response.status(404).json({ message: "Page is Not Found" });
});

//Error MW
server.use((error, request, response, next) => {
    response.status(500).json({ message: error + "" });                 //Development
    //response.status(500).json({ message: "Something went wrong" });     //Production
});