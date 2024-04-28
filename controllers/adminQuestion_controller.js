const express = require('express')
const fs = require('fs')
const { MongoClient } = require('mongodb')
const bodyParser = require('body-parser');
const { Console } = require('console');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
const app = express();
app.use(cookieParser())

const client = new MongoClient("mongodb+srv://fahed12:12fahed@mpr.zgz8a91.mongodb.net/");
const databaseName = "Institute";

app.use(bodyParser.urlencoded({ extended: true }))

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Questions");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

function questionName(){
  var questionName ="";
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  for(var i =0; i<3; i++){
      questionName+= characters.charAt(Math.floor(Math.random() *characters.length))
  }
  questionName = questionName + (Math.floor(Math.random()*999))
  return questionName
}

connectToDatabase();
app.use(express.json());

async function classes(req) {
  try {
    const collection = client.db(databaseName).collection("stud_infos");
    const classesCursor = await collection.find({instiKey: req.cookies.instiKey}, { div: 1, _id: 0 });
    const classes = await classesCursor.toArray();
    // console.log(classes);
    const divisions = classes.map(classObj => classObj.div);
    // console.log(divisions);
    return divisions
  } catch (err) {
    console.error("Error in retrieving classes:", err);
  }
}

module.exports.physics = async function(req, res){
  try {
    fs.readFile('./public/jsonFiles/physics.json', 'utf8', async (err, data) => {
      if (err) {
        console.error('Error reading JSON file:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      
      const jsonData = JSON.parse(data);
      divisions = await classes(req);
      res.render("adminQuestion.ejs", {title: "physics_Questions", data: jsonData, file: "./public/jsonFiles/physics.json", divisions: divisions});
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
}

module.exports.chemistry = async function(req, res){
  try {
    fs.readFile('./public/jsonFiles/chemistry.json', 'utf8', async (err, data) => {
      if (err) {
        console.error('Error reading JSON file:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      
      const jsonData = JSON.parse(data);
      divisions = await classes(req);
      res.render("adminQuestion.ejs", {title: "chemistry_Questions", data: jsonData, file: "./public/jsonFiles/chemistry.json", divisions: divisions});
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
}

module.exports.maths= async function(req, res){
  try {
    fs.readFile('./public/jsonFiles/maths.json', 'utf8', async (err, data) => {
      if (err) {
        console.error('Error reading JSON file:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      
      const jsonData = JSON.parse(data);
      divisions = await classes(req);
      res.render("adminQuestion.ejs", {title: "maths_Questions", data: jsonData, file: "./public/jsonFiles/maths.json", divisions: divisions});
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
}

module.exports.adminQuesSub = async function(req, res){
  try {
    const collection = client.db(databaseName).collection("questions")
    const student = client.db(databaseName).collection("stud_infos")
    const fileName = req.body.fileName

    fs.readFile("./public/jsonFiles/"+fileName+'.json', 'utf8', async (err, data) => {
      if (err) {
        console.error('Error reading JSON file:', err);
        res.status(500).send('Internal Server Error');
        return;
      }

      const jsonData = JSON.parse(data);
      const duration = parseInt(req.body.duration);
      const date = req.body.date;
      const marks = parseInt(req.body.marks);
      const time = req.body.time;
      const questPaperId = questionName()
      const selectedDivisions = JSON.parse(req.body.selectedDivisions);

      collection.insertOne({TestName: req.body.fileName, questPaperId: questPaperId, instiKey: req.cookies.instiKey, Div: selectedDivisions, Duration: duration, Date: date, Time: time, Marks: marks, jsonData}) ;

      // console.log(selectedDivisions)
      for(let i=0; i<selectedDivisions.length; i++){

        const cursor = student.find({instiKey: req.cookies.instiKey, div: selectedDivisions[i]});
        const studData = await cursor.toArray();
        // console.log(studData)

        for(let data of studData){
          for(let studentt of data.stud_data){
            //NODEMAILER START
            var html = `
                <div style="font-family: Arial, sans-serif; line-height: 1.5; padding: 10px; color: #000;">
                    <h2 style="color: #073B7B; margin-bottom: 10px;">Test Scheduled</h2>
                    <p style="font-size: 14px;">Your test <strong>${req.body.fileName}</strong> is scheduled on <strong>${date}</strong> at <strong>${time}</strong> for marks: <strong>${marks}</strong>.</p>
                    <p style="font-size: 12px; color: #555;">If you have any questions, feel free to reach out.</p>
                </div>
            `;     
            var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'ezyTestNotify@gmail.com',
                pass: 'hnqkmlfvxokcsleo'
            }
            });
                
            var mailOptions = {
            from: ' "EzyTEST" <ezyTestNotifygmail.com>',
            to: studentt.email,
            subject: 'Test is Scheduled',
            // text: 'Hello and Welcome to Educare, your key',
            html: html
            };
                
            transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                // console.log('Email sent: ' + info.response);
            }
            });
            // console.log(email)          
            //NODEMAILER ENDS
          }
        }

      }


      res.render('adminLanding', {title: "adminLanding"})
    });
  

  } catch (err) {
    console.error("Error inserting data into MongoDB:", err);
    res.status(500).send("Internal Server Error");
  }
};


