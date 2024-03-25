var mongoose = require('mongoose');

var studentSchema = new mongoose.Schema({
    file: {
        type: String
    },
    insti: {
        type: String
    },
    year: {
        type: String
    },
    div: {
        type: String
    },
    stud_data: [{
        rollNo: {
            type: Number
        },
        fname: {
            type: String
        },
        mname: {
            type: String
        },
        lname: {
            type: String
        },
        email: {
            type: String
        },
        phno: {
            type: Number
        },
        password: {
            type: String
        }
    }]
});

module.exports = mongoose.model("stud_info", studentSchema);
