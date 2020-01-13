var express = require('express');
var router = express.Router();
const fs = require('fs');
const userController = require('../controllers/userController');
const multer = require('multer');
const fileStorage = multer.diskStorage({
  destination: async function (req, file, cb) {
    // console.log(file);


    cb(null, 'data/' + req.params.userId + '/' + file.fieldname);
  }, filename: (req, file, cb) => {
    let ext = file.mimetype.split('/')[1];
    // console.log('thiru');
    // console.log(file);

    cb(null, file.originalname);
  }
});

let uploads = multer({ storage: fileStorage }).fields([{ name: 'addressProof' }, { name: 'adhaar' }, { name: 'educationalProof' }, { name: 'images' }, { name: 'income' }]);


router.get('/login', userController.loginPage);

router.post('/login', userController.postLogin);
router.get('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect('/');
  })
});

router.post('/data/:userId', userController.postData);
router.get('/fileupload/:userId', (req, res, next) => {
  res.render('fileUpload/fileUpload', {
    user: {
      userId: req.params.userId
    }
  });
});
router.post('/fileupload/:userId', uploads, userController.postFile);


module.exports = router;
