// IMPORTING PACKAGE/MODELS
var User = require('../models/user')
var csv = require('csvtojson');
const { response } = require('express');
var nodemailer = require('nodemailer');

const fs = require('fs');
const csvParser = require('csv-parser');
const CSV = require('../models/csv');
const path = require('path');

// EXPORTING FUNCTION To upload a file
module.exports.upload = async function(req, res) {
    try {
        // file is not present
        if(!req.file) {
            return res.status(400).send('No files were uploaded.');
        }

        // file is not csv
        if(req.file.mimetype != "text/csv") {
            return res.status(400).send('Select CSV files only.');
        }

        // console.log(req.file);
        let file = await CSV.create({
            fileName: req.file.originalname,
            filePath: req.file.path,
            file: req.file.filename
        });

        // ----------------------
        var userData = []

        csv()
        .fromFile(req.file.path)
        .then( async (response) =>{
            
            for(var i=0; i< response.length; i++){
                userData.push({
                    insti: response[i].insti,
                    year: response[i].year,
                    div: response[i].div,
                    stud_data: response[i].stud_data
                })
            }

            await User.insertMany(userData)
            console.log(response)

            for(var i=0; i<response.length; i++){
                for(j=0; j<(response[i].stud_data).length; j++){
                    var email = response[i].stud_data[j].email
                    console.log(email)
            
                    //NODEMAILER START
                    var html=`Hello ${(response[i].stud_data[j]).fname}, you have been successfully added to the ${response[i].insti}`
            
                    var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'ezyTestNotify@gmail.com',
                        pass: 'hnqkmlfvxokcsleo'
                    }
                    });
            
                    var mailOptions = {
                    from: ' "EzyTEST" <ezyTestNotifygmail.com>',
                    to: email,
                    subject: 'Welcome to EzyTest',
                    text: 'Hello and Welcome to Educare, your key',
                    html: html
                    };
            
                    transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                    });
                    console.log(email)
                    //NODEMAILER ENDS
            
                }
            }
    
        })

        // res.send({ status: 200, success: true, msg: "CSV Imported"})

        return res.redirect('/');
    } catch (error) {
        console.log('Error in fileController/upload', error);
        res.status(500).send('Internal server error');
    }
}

// EXPORTING FUNCTION To open file viewer page
module.exports.view = async function(req, res) {

    try {
        // console.log(req.params);
        let csvFile = await CSV.findOne({file: req.params.id});

        // console.log(csvFile);
        const results = [];
        const header =[];
        fs.createReadStream(csvFile.filePath) //seeting up the path for file upload
        .pipe(csvParser())
        .on('headers', (headers) => {
            headers.map((head) => {
                header.push(head);
            });
        })
        
        .on('data', (data) =>
        results.push(data))
        .on('end', () => {
            res.render("file_viewer", {
                title: "File Viewer",
                fileName: csvFile.fileName,
                head: header,
                data: results,
                length: results.length
            });
        });
        

    } catch (error) {
        console.log('Error in fileController/view', error);
        res.status(500).send('Internal server error');
    }
}

// EXPORTING FUNCTION To delete the file
module.exports.delete = async function(req, res) {
    try {
        // console.log(req.params);
        let isFile = await CSV.findOne({file: req.params.id});

        if(isFile){
            await CSV.deleteOne({file: req.params.id});            
            return res.redirect("/");
        }else{
            console.log("File not found");
            return res.redirect("/");
        }
    } catch (error) {
        console.log('Error in fileController/delete', error);
        return;
    }
}