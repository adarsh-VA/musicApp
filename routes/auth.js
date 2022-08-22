const express = require('express');
const passport = require('passport');
const router = express.Router();
const userm = require('../models/userm');

router.get('/login',(req,res)=>{
    res.render('login',{tl:'Login'});
})

router.get('/register',(req,res)=>{
    res.render('register',{tl:'Register'})
})

router.post('/register',async(req,res)=>{
    const {email,username,password} = req.body;
    const user = new userm({email,username});
    try{
        const ruser = await userm.register(user,password);
        console.log(ruser);
        req.flash('success','successfully created user');
        return res.redirect('/home');
    }
    catch(err){
        req.flash('error',err.message);
    }
    res.redirect('/user/register');
})

router.post('/login',passport.authenticate('local',{failureFlash: true, failureRedirect: '/user/login'}),(req,res)=>{
    req.flash('success','successfully logged In.');
    res.redirect('/home');
})


module.exports = router;