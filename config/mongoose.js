// IMPORTING PACKAGE
const mongoose = require("mongoose");
require('dotenv').config();

// MAKING CONNECTION 

// mongoose.connect('mongodb://127.0.0.1:27017/csvUploads');
const DB = process.env.INSTITUTE_DB;

mongoose.connect(DB).then(()=>{
    console.log('Connection successful! /config/mongoose.js ');
}).catch((err) => console.log("no connection " + err));

//setting it to db
const db = mongoose.connection;

// CHECKING CONNECTION
//if error occurs
db.on("error", console.error.bind(console, "Error connecting to DB"));
// when db connects successfully
db.once("open", function(){
    console.log("Successfully connected to DB /config/mongoose.js ");
});

module.exports = db;