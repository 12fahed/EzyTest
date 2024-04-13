const express = require('express')
const fs = require('fs')
const { MongoClient } = require('mongodb')
const bodyParser = require('body-parser');
const { Console } = require('console');
const cookieParser = require('cookie-parser');
const { compareSync } = require('bcryptjs');
const app = express();
app.use(cookieParser())

const client = new MongoClient("mongodb+srv://fahed12:12fahed@mpr.zgz8a91.mongodb.net/");
const databaseName = "Institute";

app.use(bodyParser.urlencoded({ extended: true }))

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB StudentListofTest");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

module.exports.studListOfTest = async function(req, res) {
    const collection = client.db(databaseName).collection("questions");
    const query = { instiKey: req.cookies.instiKey, Div: req.cookies.div };
    
    try {
        const test= await collection.find(query, { questPaperId: 1, _id: 0 }).toArray()
        // const questionPaperIds = documents.map(doc => doc.questPaperId);
        res.render('studListOfTest', { title: "List_of_Test", test: test});
    } catch (error) {
        console.error("Error fetching documents:", error);
        res.status(500).send("Error fetching documents");
    }
}

module.exports.displayQuestion = async function(req, res){
  const collection = client.db(databaseName).collection("questions");
  const data = await collection.findOne({questPaperId: req.params.id})
  const testName = data.TestName
  const question = data.jsonData.questions
  res.cookie('questPaperId', req.params.id)
  res.render('studentQuestion', {title: "Test", question: question, duration:data.Duration, testName: testName})
  // res.send(question)
}

module.exports.studQuesSub = async function(req, res) {
  try {
    const collection = client.db(databaseName).collection("stud_response")
    const response = JSON.parse(req.body.studResponse);

    const instiKey = req.cookies.instiKey
    const div = req.cookies.div
    const studName = req.cookies.studName
    const rollNo = req.cookies.rollNo
    const questPaperId = req.cookies.questPaperId
    
    const questionCollection = client.db(databaseName).collection("questions")
    const questionData = await questionCollection.findOne({questPaperId: req.cookies.questPaperId})
    const question = questionData.jsonData.questions
    // console.log(question)

    let marks = parseInt(0)
    for(var i = 0; i<question.length; i++){
      if(response[i+1] === question[i].correct_options[0]){
        marks++
        // console.log("Correct")
      }else{
        // console.log("Incorrect")
      }
    }

    collection.insertOne({instiKey: instiKey, div: div, studName: studName, rollNo: rollNo, questPaperId: questPaperId, marks: marks, response: response})

    res.render('studResult', {title: "Result", question: question, response: response, marks: marks});
  } catch (error) {
    console.error("Error processing response:", error);
    res.status(400).send("Invalid data received");
  }
}
