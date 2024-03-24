// Importing Packages
const express = require('express');
const router = express.Router();
const user = express()
const path = require('path')
const multer = require('multer');

const bodyParser = require('body-parser')

user.use(bodyParser.urlencoded({ extended: true }))
user.use(express.static(path.resolve(__dirname, 'public')))

var storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, 'public/uploads/files')
    },
    filename: (req, file, cb) =>{
        cb(null, file.originalname)
    }
})

// Importing Controllers
const homeController = require('../controllers/home_controller');
const fileController = require('../controllers/file_controller');

// const userController = require('../controllers/userController')  ///<<<<<<<<<<<<<<<<---------------TO BE TAKEN CARE OF

var upload = multer({ storage: storage })

// Making Routes
router.get('/', homeController.home);
router.post('/upload', upload.single('file') ,fileController.upload);
router.get('/view/:id', fileController.view);
router.get('/delete/:id', fileController.delete);

module.exports = router;

