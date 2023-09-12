const express=require('express');
const router=express.Router();
const passport=require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User=require('../models/User');


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async function(accessToken, refreshToken, profile, done) {
      const newUser={
        googleId:profile.id,
        displayName: profile.displayName,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        profileImage:profile.photos[0].value
      }
      try {
        let user=await User.findOne({ googleId:profile.id});
        //if there is an existing user to login
        if(user){
          done(null,user);
                }
        //if there is not then we can create it and log in
        else{
          user=await User.create(newUser);
          done(null,user);
        }
      } 
      catch (error) {
        console.log(error);
      }




  }
));


//google login route
router.get('/auth/google',
  passport.authenticate('google', { scope: ['email','profile'] }));


//retrive the user data
router.get('/google/callback', 
  passport.authenticate('google', 
  { 
    failureRedirect: '/login-failure',
    successRedirect: '/dashboard' 


})
 );


 // route is something goes wrong
router.get('/login-failure',(req,res)=>{
    res.status(401).render('401');
})

//destroyuser sessio when the user logs out
router.get('/logout',(req,res)=>{
  req.session.destroy(error=>{
    if(error){
      console.log(error);
      res.send('erroe logging out');
    }
    else{
      res.redirect('/');
    }
  })
})





//persist user data after successful authentication
passport.serializeUser(function(user, done){
  done(null, user.id);
} );


//retrieve user data from session
passport.deserializeUser(async function(id, done) {
  try {
    const user = await User.findById(id).exec();
    done(null, user);
  } catch (err) {
    console.error(err);
    done(err, null);
  }
});




module.exports= router;