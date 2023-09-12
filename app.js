require('dotenv').config();
const express=require('express');
const expressLayouts = require('express-ejs-layouts');//help us create layouts
const methodOverride = require('method-override');
const connectDB= require('./server/config/db');
const session=require('express-session');//to help the user to stay connected after they logged in
const passport=require('passport');
const MongoStore=require('connect-mongo');


const app=express(); 
const port=5000 || process.env.port;//if 5000 is an env tehn using the process .enev.port is usfull


app.use(session({
    secret: 'Keyboard Cat',
    resave: false,
    saveUninitialized: true,
    store:MongoStore.create({
        mongoUrl:process.env.MONGODB_URI
    }),
    cookie: { maxAge: new Date ( Date.now() +  (604800000  ) ) } //this number approaches to 7 days i milli seconds
    //the dates sessio formula is Date.now() - 30(whole days in month) * 24(hours)* 60(minutes) *60(seconds) *1000(milliSeconds)
})); 



app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));

//connect to database of mangoose
connectDB();
//static files
app.use(express.static('public'));//helps to import images in the ejs
//templating engine
app.use(expressLayouts);

app.set('layout','./layouts/main');
app.set('view engine', 'ejs');

//routes
app.use('/',require('./server/routes/index'));
app.use('/',require('./server/routes/dashboard'));
app.use('/',require('./server/routes/auth'));


//handle 404
app.get('*',function(req,res){
    //res.sendStatus(404);
    res.status(404).render('404');
})
app.listen(port,()=>{
    console.log(`app listnening to port ${port}`);
})