const express = require("express");
const routes = express.Router();
const { createUser } = require('../Controllers/user');
const bcrypt = require('bcryptjs');
const { db, Users,Posts } = require('../db');
const { createPost, showAllPosts}=require('../controllers/post');
const passport = require("passport");
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

routes.use(cookieParser('secret'));
routes.use(session({
  secret: 'secret',
  resave: true,
  maxAge: 3600000,
  saveUninitialized: true,
}))



routes.use(passport.initialize());
routes.use(passport.session());
routes.use(flash());


routes.use(function (req, res, next) {
  res.locals.success_message = req.flash('success_message');
  res.locals.error_message = req.flash('error_message');
  res.locals.error = req.flash('error');
  next();
})



const checkAuthenticated=function(req,res,next){

  if(req.isAuthenticated()){
    res.set('Cache-Control','no-cache,private,no-store,must-revalidate,post-check=0,pre-check=0')
    return next();
  }
  else{
    res.redirect('/login');
  }
}




//Authentication stategy

let localStrategy = require('passport-local').Strategy;


passport.use(new localStrategy({ usernameField: 'username' }, async (username, password, done) => {
  const userfind = await Users.findOne({
    where: {
      username: username
    }
  })

  if (!userfind) {
    return done(null, false, { message: "User Not Exist" });
  }

  const validpass = await bcrypt.compare(password, userfind.password);

  if (!validpass) {
    return done(null, false, { message: "Passwod not matched" });
  }

  if (validpass) {
    return done(null, userfind);
  }

}
))
//end of Authentication

passport.serializeUser(function (user, cb) {
  cb(null, user.id);
})

passport.deserializeUser(function (id, done) {
  Users.findOne({
    // Using sequelize model functoin
    where: {
      id: id,
    },
  }).then(function (user) {
    if (user == null) {
      done(new Error('Wrong user id.'));
    }

    done(null, user); // Standerd deserailize callback
  });

});



//routing

routes.get('/', (req, res) => {
  res.render("signup");
})

routes.post('/register', async (req, res) => {
  let { username, password, email, cpassword } = req.body;
  let err;
  if (!username || !password || !email || !cpassword) {

    err = "fill all the fields";
    res.render('signup', {
      'err': err
    })
  }

  if (password != cpassword) {
    err = "Pssword Don't Match."
    res.render('signup', {
      "err": err,
      "email": email,
      "username": username


    })
  }

  if (typeof err == 'undefined') {
    try {
      const userad = await createUser(username, password, email);
      if (userad) {

        req.flash('success_message', "Register Succesfully..Login To Continue..")
        res.redirect('/login');
      }
    } catch (err) {
      res.render('signup', { "err": err });
    }


  }



})









routes.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    failureRedirect: '/login',
    successRedirect: '/success',
    failureFlash: true

  })(req, res, next);
})



routes.get('/login', (req, res) => {
  res.render('login');
})
routes.get('/register', (req, res) => {
  res.render('signup');
})
routes.get('/success', checkAuthenticated,(req, res) => {

  res.render('success', { 'user': req.user.username });

})

routes.get('/logout', (req, res) => {

  req.logout();
  res.redirect('/login');

});

routes.post('/addmsg',checkAuthenticated,async(req,res)=>{
try{
  console.log(req.user.id);
  const post =await createPost(req.user.id,req.body.notes);
 
  const userpost=await showAllPosts(req.user.id);

 let arr=[];
 let i=0;
for(let b of userpost){
  arr[i]=b. _previousDataValues.notes;
i++;
}

res.render('success',{'user': req.user.username,'userposts':arr});

}
catch(err){
  console.log(err);
}

})
      
   module.exports = routes;

