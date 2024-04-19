// IMPORTING PACKAGE/MODELS
const express = require('express')
const File = require("../models/csv");
const { MongoClient } = require('mongodb')
const cookieParser = require('cookie-parser');

const client = new MongoClient("mongodb+srv://fahed12:12fahed@mpr.zgz8a91.mongodb.net/");
const databaseName = "Institute";
const app = express();
app.use(cookieParser())

// EXPORTING FUNCTION To open admin page 
module.exports.admin = async function(req, res) {
    try {
        let file = await File.find({admin: req.cookies.admin});
        // console.log(file)
        return res.render('admin', {files: file, title: "Admin", adminName: "adminName"});
    } catch (error) {
        console.log('Error in adminController/admin', error);
        return;
    }
}

module.exports.adminTestRecord = async function(req, res){

    try{
        const collection = client.db(databaseName).collection("questions")
        const studAttempt = client.db(databaseName).collection("stud_response")

        const instiKey = req.cookies.instiKey

        const cursor = collection.find({instiKey: instiKey})
        const tests= await cursor.toArray()

        const cursorr = studAttempt.find({instiKey: instiKey})
        const students = await cursorr.toArray()

        res.render('adminTestRecord', {title: "Admin Test Record", tests: tests, students: students})

    } catch (error) {

    }

}