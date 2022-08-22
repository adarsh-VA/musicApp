// Packages and variables
const express = require('express');
const app = express();
const path = require('path');
const ejsmate = require('ejs-mate');
const mongoose = require('mongoose');
const mtov= require('method-override');
const session = require('express-session');
const port = process.env.PORT || 3000;
const db='mongodb://localhost:27017/dotify';
const passport = require('passport');
const plocal = require('passport-local'); 
const userm = require('./models/userm');
const adding = require('./routes/addingstuff');
const display = require('./routes/display');
const auth = require('./routes/auth');
const flash = require('connect-flash');

// Express constraints
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'/views'));
app.engine('ejs',ejsmate);
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));
app.use(mtov('_method'));

// session config
const sconfig= {
    secret : 'secretkey123',
    resave : false,
    saveUninitialized : true, 
}
app.use(session(sconfig));
app.use(flash());

// passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new plocal(userm.authenticate()));
passport.serializeUser(userm.serializeUser());
passport.deserializeUser(userm.deserializeUser());

// MongoDB connection
mongoose.connect(db)
    .then(()=>{
        console.log('connection open');
    })
    .catch((err)=>{
        console.log('errr occured',err);
    })

// middleware
app.use((req,res,next)=>{
    res.locals.currentuser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// creation route or adding route
app.use('/adding',adding);

// display routes
app.use('/',display);

// user routes
app.use('/user',auth);

app.all('*',(req,res)=>{
    res.render('error',{tl:"Error"});
})

app.listen(port,(e)=>{
    console.log('server started');
    if (e){
        console.log('error',e);
    }
})