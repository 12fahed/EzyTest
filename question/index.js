import express from 'express';
import fs from "fs"
import { MongoClient } from "mongodb";
import bodyParser from 'body-parser'

const app = express();
const port = 3001

const client = new MongoClient("mongodb+srv://fahed12:12fahed@mpr.zgz8a91.mongodb.net/");
const databaseName = "Institute";

app.use(bodyParser.urlencoded({ extended: true }))

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

connectToDatabase();

app.use(express.static("public"))
app.use(express.json()); // Middleware to parse JSON bodies

app.get('/', (req, res) => {
  res.render("index.ejs")
});

app.post('/physics', (req, res) =>{
  fs.readFile('physics.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading JSON file:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    
    const jsonData = JSON.parse(data);
    res.render("question.ejs", {data: jsonData, file: "physics.json"});
  }); 
})

app.post('/chemistry', (req, res) =>{
  fs.readFile('chemistry.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading JSON file:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    
    const jsonData = JSON.parse(data);
    res.render("question.ejs", {data: jsonData, file: "chemistry.json"});
  }); 
})

app.post('/maths', (req, res) =>{
  fs.readFile('maths.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading JSON file:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    
    const jsonData = JSON.parse(data);
    res.render("question.ejs", {data: jsonData, file: "maths.json"});
  }); 
})

//THIS NEED TO BE CHANGED
app.post('/quesSub', async (req, res) => {
  try {
    const collection = client.db(databaseName).collection("questions");

    fs.readFile('physics.json', 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading JSON file:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      
      const jsonData = JSON.parse(data);
      const result = collection.insertOne({jsonData, Test: req.body.fileName}) ;
      console.log("Data inserted:", result);
      res.status(200).send("Data inserted successfully");
    });    
  

  } catch (err) {
    console.error("Error inserting data into MongoDB:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
