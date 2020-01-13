const User = require('../models/User');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid');
const UserData = require('../models/UserData');
const Document = require('../models/Document');
const fs = require('fs');
const { SENDGRID_API_KEY } = require('../bin/config');
// console.log(SENDGRID_API_KEY);
const transport = nodemailer.createTransport(nodemailerSendgrid({
  apiKey: SENDGRID_API_KEY
}));

//error handling testing
module.exports.verifyUser = (req, res, next) => {
  let username = req.body.name;
  let email = req.body.email;
  let password = req.body.password.toString();
  let confirmPassword = req.body.confirmPassword.toString();
  let role = req.body.role;
  let token;
  // console.log(typeof username);
  if ((password !== confirmPassword) || (username === '' || email === '' || password === '')) {
    console.log('Invalid Input');

    return res.status(422).redirect('/signup');
    //add a flash message also
  }
  crypto.randomBytes(6, (err, buffer) => {
    if (err) {
      return res.redirect('/signup');
    }
    token = buffer.toString('hex');
    // if ((password !== confirmPassword) && (username || email || password)) {
    //   console.log('Invalid Input');

    //   return res.status(422).redirect('/signup');
    //   //add a flash message also
    // } else {

    // console.log('thiru');
    console.log(token);
    transport.sendMail({
      from: 'beacon@siesgst.ac.in',
      to: email,
      subject: 'Verify Email',
      html: `
              <h1>Thanks for Registering</h1>
              <h3>Your Verification Code is ${token}</h3>
              `
    });
    // console.log('hello toki');
    // console.log(req.session);


    // };
  });

  bcrypt.hash(password, 12).then((hashedPassword) => {
    password = hashedPassword;
    // console.log(hashedPassword);
    req.session.token = token;
    // console.log(req.session);

    // req.session.token = token;
    // console.log(req.session);
    res.render('otp/otp', {
      user: {
        name: username,
        email: email,
        password: password,
        role: role
      }
    });
  }).catch(err => {
    console.log(err);
  });

}


//error handling has to be done
module.exports.newUser = (req, res, next) => {
  if (req.body.verifyToken !== req.session.token) {
    return res.redirect('/signup');
  }
  req.session.token = null;
  let username = req.body.name;
  let email = req.body.email;
  let password = req.body.password;
  let role = req.body.role;
  // console.log(req.session);
  let user = new User({
    name: username,
    email: email,
    password: password,
    role: role
    // tokenVerify: token,
    // tokenVerifyExpiration: Date.now() + 3600000
  });
  user.save().then((result) => {
    if (!result) {
      return res.render('signup/signup', {
        name: username,
        email: email,
        password: password
      });
    } else {

      return res.redirect('/user/login');


    }
  }).catch((err) => {
    console.log(err);
  });
}

//LoginPage
module.exports.loginPage = (req, res, next) => {
  // console.log(req.body.email);
  res.render('login/login', {
    email: req.body.email
  });
}

module.exports.postLogin = (req, res, next) => {
  // console.log(req.session);
  let email = req.body.email;
  let password = req.body.password;
  // console.log(password + "Paasoem");
  if (!email && !password) {
    // console.log(password);
    // console.log("Thiru");
    // console.log(email, password);
    return res.render('login/login', {
      email: req.body.email
    });
  }
  console.log(email);
  // console.log(email);
  User.findOne({ email: email }).exec((err, user) => {

    // console.log('thiru' + err);
    // console.log(user);
    console.log('pass', password);
    console.log('confir', user);

    bcrypt.compare(password, user.password).then(async (doMatch) => {
      // console.log(doMatch);
      // console.log(user.password);
      // console.log(password);
      if (doMatch) {
        req.session.isLoggedIn = true;
        if (user.role === 'student') {
          res.render('form/beaconForm', {
            user: {
              userId: user._id,
              name: user.name,
              email: user.email
            }
          });
        } else if (user.role === 'faculty') {
          res.render('facultyProfile', {
            user: {
              userId: user._id,
              name: user.name,
              email: user.email
            }
          })
        }
        else {
          return res.redirect('/user/login');
        }
      }
    })
  });
}

//Validating data remains 
module.exports.postData = async (req, res, next) => {
  // console.log(req.body);
  await fs.exists('data/' + req.params.userId + '/', async function (boolean) {

    if (boolean) {
      console.log("Exists");
    } else {
      await createUserDirectory(req);
    }

  })

  if (req.session.isLoggedIn) {
    let data = new UserData({
      userId: req.params.userId,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      dob: req.body.dob,
      educationalQualification: req.body.educationalQualification,
      religionOrCaste: req.body.religion,
      presentAdd: req.body.presentAdd,
      permanentAdd: req.body.permanentAdd,
      residence: req.body.residencetype,
      working: req.body.working,
      contact1: req.body.contact1,
      contact2: req.body.contact2,
      coursePref: req.body.coursePref
    });
    data.save().then(user => {
      console.log(user);
    }).catch(err => {
      return next(err);
    })

  } else {
    await res.redirect('/user/login');
  }
  await res.render('fileUpload/fileUpload', {
    user: {
      userId: req.params.userId
    }
  });
}
//========================================
function createUserDirectory(req) {
  fs.mkdirSync("data/" + req.params.userId + "/");
  fs.mkdirSync("data/" + req.params.userId + "/images");


  fs.mkdirSync("data/" + req.params.userId + "/adhaar");


  fs.mkdirSync("data/" + req.params.userId + "/income");


  fs.mkdirSync("data/" + req.params.userId + "/addressProof");


  fs.mkdirSync("data/" + req.params.userId + "/educationalProof");

}
//====================================================================================
module.exports.postFile = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    res.redirect('/');
  }
  if (!req.files.images || !req.files.images || !req.files.income || !req.files.adhaar || !req.files.educationalProof || !req.files.addressProof) {
    return res.redirect(`/user/fileupload/${req.params.userId}`)
  }
  // console.log(req.files.images[0].path);
  // console.log(req.files.income[0].path);
  // console.log(req.files.adhaar[0].path);
  // console.log(req.files.educationalProof[0].path);
  // console.log(req.files.addressProof[0].path);
  let newDocument = new Document({
    userId: req.params.userId,
    imagePath: req.files.images[0].path,
    incomePath: req.files.income[0].path,
    adhaarPath: req.files.adhaar[0].path,
    educationalProofPath: req.files.educationalProof[0].path,
    addressProofPath: req.files.addressProof[0].path
  });
  newDocument.save().then(user => {
    // console.log(user);
    // return res.redirect(`/user/fileupload/${req.params.userId}`);
    return res.redirect(`/`);
  }).catch(err => {
    return next(err);
  });
  console.log(req.files);
};