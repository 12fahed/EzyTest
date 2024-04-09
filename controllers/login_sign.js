const File = require("../models/csv");
const express = require('express')
const bcryptjs = require("bcryptjs")
const admin = require("../models/admin")
const stud = require("../models/user")
const cookieParser = require('cookie-parser')

const app = express()
app.use(cookieParser())

app.use(express.urlencoded({extended: false}))

async function hashing(password){
    const res = await bcryptjs.hash(password, 10)
    return res
}

async function unHashing(userPass, hashing){
    const res = await bcryptjs.compare(userPass, hashing)
    return res
}

function create_random_string(string_length){
    var random_String ="";
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz'
    for(var i =0; i< string_length; i++){
        random_String += characters.charAt(Math.floor(Math.random() *characters.length))
    }
    return random_String
}

module.exports.login = async function(req, res) {
    try {
        return res.render('login', {
            title: "Login"
        });
    } catch (error) {
        console.log('Error in loginController/login', error);
        return;
    }
}

module.exports.submit_login= async function(req, res) {

    try {

        if (req.body.dropdown === "Admin") {
            const check = await admin.findOne({ email: req.body.email });
            const passCheck = await unHashing(req.body.password, check.password);

            if (check && passCheck) {
                res.cookie('admin', check.fname)
                res.cookie('instiKey', check.instiKey)
                let file = await File.find({admin: check.fname});
                // return res.render('admin', { files: file, title: "Admin", adminName: check.fname, instiKey: check.instiKey});
                return res.render('adminLanding', {title: "adminLanding"})
                // res.send(req.cookies)
            } else {
                res.send("Wrong Password");
            }

        } else if (req.body.dropdown === "Student") {
        
            const check = await stud.findOne({ instiKey: req.body.instikey });

            if(!check){
                res.send("Institute Doesnt Exits")
            }

            var emailFound = false
            for(let student of check.stud_data){
                if(student.email === req.body.email){
                    
                    var emailFound = true
                    var passCheck = await unHashing(req.body.password, student.password);
                    if(passCheck){
                        res.cookie('studName', student.fname)
                        res.cookie('div', check.div)
                        res.cookie('instiKey', check.instiKey)
                        res.cookie('rollNo', student.rollNo)
                        res.render('studentLanding', {title: "student_landing"})
                    }else{
                        res.send("Wrong Password");
                    }

                    break;
                }
            }

            if(!emailFound){
                res.send("Student Doesnot Exits")
            }

        }
        
        else {
            res.send("Invalid User");
        }

    }catch (error) {
        console.log('Error in adminController/admin', error);
        return;
    }
}

module.exports.sign = async function(req, res) {
    try {
        return res.render('sign', {
            title: "Sign"
        });
    } catch (error) {
        console.log('Error in login_sign Controller/sign', error);
        return;
    }
}

module.exports.submit_sign = async function(req, res) {
    try {
        
        const existingUser = await admin.findOne({ email: req.body.email });
        
        if (existingUser) {
            return res.send("User Already Exists");
        }

        const pass = req.body.password
        const confirm = req.body.confirm

        if(pass===confirm){

            var instiKey = create_random_string(10);

            const fname =  req.body.fname
            const email = req.body.email
            const insti = req.body.insti
            
            const data = {
                email: req.body.email,
                password: await hashing(req.body.password),
                role: "Admin",
                fname: req.body.fname,
                mname: req.body.mname,
                lname: req.body.lname,
                insti: req.body.insti,
                phno: req.body.phno,
                instiKey: instiKey
            }
        
            await admin.insertMany([data])

            //NODEMAILER START
            var html=`Hello ${fname}, You are receiving this email as an acknowledgement that you have created an Institute Account with name ${insti}, your key is ${instiKey}`

            var nodemailer = require('nodemailer');

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

            let file = await File.find({});
            return res.render('admin', { files: file, title: "Admin"});
        }
        else{
            res.send("Mistach Password")
        }

    } catch (error) {
        console.log('Error in login_sign Controller/sign', error);
        return;
    }
}