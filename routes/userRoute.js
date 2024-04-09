// Importing Packages
const express = require('express');
const router = express.Router();
const user = express()
const path = require('path')
const multer = require('multer');
const cookieParser = require('cookie-parser')


const bodyParser = require('body-parser')
user.use(cookieParser())

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
const adminController = require('../controllers/admin_controller');
const fileController = require('../controllers/file_controller');
const login_sign = require('../controllers/login_sign')
const adminQuestion= require('../controllers/adminQuestion_controller')

// const userController = require('../controllers/userController')  ///<<<<<<<<<<<<<<<<---------------TO BE TAKEN CARE OF

var upload = multer({ storage: storage })

// Making Routes
router.get('/', login_sign.login)

router.get('/login', login_sign.login)
router.post('/login', login_sign.submit_login);

router.get('/signup', login_sign.sign)
router.post('/signup', login_sign.submit_sign);

router.get('/admin', adminController.admin)

router.post('/upload', upload.single('file') ,fileController.upload);
router.get('/view/:id', fileController.view);
router.get('/delete/:id', fileController.delete);

router.get('/questionLanding', (req, res) =>{
    res.render('questionLanding', {title: "question_Landing"})
})

router.get('/admin', (req, res) =>{
    res.render('admin')
})

router.post('/physics', adminQuestion.physics)
router.post('/chemistry', adminQuestion.chemistry)
router.post('/maths', adminQuestion.maths)
router.post('/adminQuesSub', adminQuestion.adminQuesSub)

module.exports = router;

