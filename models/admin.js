const mongoose = require("mongoose")

mongoose.connect("mongodb+srv://fahed12:12fahed@mpr.zgz8a91.mongodb.net/Institute")
.then(()=>{
    console.log("Admin DB Connected");
})
.catch(()=>{
    console.log("Admin DB Failed To Connect");
})


const LogInScheama = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    phno: {
        type: Number,
        required: true
    },
    fname: {
        type: String,
        required: true
    },
    mname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    insti: {
        type: String,
        required: true
    },
    instiKey: {
        type: String
    }
})

const collection = new mongoose.model("admin_Info", LogInScheama)

module.exports = collection

