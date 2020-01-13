var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');

router.get('/', (req, res, next) => {
  res.render('index');
})
router.get('/signup', (req, res, next) => {
  res.render('signup/signup', {
    name: '',
    email: '',
    password: '',
    role: ''
  });
});

router.post('/verify', userController.verifyUser);

router.post('/signup', userController.newUser);



module.exports = router;

/* GET home page. */
// router.get('/user', function (req, res, next) {
//   // loggedIn = req.isLoggedIn;
//   let loggedIn = req.get('Cookie').split(';')[2].trim().split('=')[1] === 'true';
//   console.log('0thiru');
//   console.log(loggedIn);
//   res.render('index', {
//     title: 'Express',
//     loggedIn: loggedIn
//   });
// // });
// router.get('/', function (req, res, next) {
//   loggedIn = req.session.isLoggedIn;
//   // console.log(req.get('Cookie'));
//   // let loggedIn = req.get('Cookie').split(';')[2].trim().split('=')[1] === 'true';
//   // console.log('hello ' + loggedIn);
//   console.log(req.session);
//   // transport.sendMail({
//   //   from: 'ThiruIalamIBM@nodeAPP.com',
//   //   to: 'thirumalai.yadav17@siesgst.ac.in',
//   //   subject: 'hello world',
//   //   html: '<h1>Hello world!</h1>'
//   // });
//   res.render('index', {
//     title: 'Express',
//     // loggedIn: loggedIn
//   });
// });

// router.post('/', function (req, res, next) {
//   // req.isLoggedIn = true;
//   // console.log("Posted");
//   // res.setHeader('Set-Cookie', 'isLoggedIn=false')
//   req.session.isLoggedIn = true;
//   res.redirect('/');
// });

// const transport = nodemailer.createTransport(nodemailerSendgrid({
//   apiKey: 'S'
// }));
