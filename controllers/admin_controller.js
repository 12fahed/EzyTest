// IMPORTING PACKAGE/MODELS
const File = require("../models/csv");

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