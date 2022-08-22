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

router.get('/logout',(req,res)=>{
    req.logout((err)=>{
        if(err){
            return res.redirect('/home');
        }
        req.flash('success','See You Again, Bye!');
        res.redirect('/home');
    });
})


router.post('/register',async(req,res)=>{
    const {email,username,password} = req.body;
    const user = new userm({email,username});
    try{
        const ruser = await userm.register(user,password);
        req.login(ruser,err=>{
            req.flash('success','successfully logged in!');
            res.redirect('/home');
        })
    }
    catch(err){
        req.flash('error',err.message);
        res.redirect('/user/register');
    }
    
})

router.post('/login',passport.authenticate('local',{failureFlash: true, failureRedirect: '/user/login'}),(req,res)=>{
    req.flash('success','successfully logged In.');
    res.redirect('/home');
})


module.exports = router;