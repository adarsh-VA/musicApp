const express = require('express');
const router = express.Router();
const artistm = require('../models/artistm');
const songm = require('../models/songm');
const {isLoggedIn} = require('../middlewares');


// multer
const multer = require('multer');
const {storage} = require('../middlewares');
const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
          cb(null, true);
        } else {
          cb(null, false);
        }
    } 
})

router.get('/add-song',isLoggedIn,async(req,res)=>{
    const artists = await artistm.find({});
    res.render('addsong',{artists,tl:'Add Song'});
})

router.post('/add-song',upload.single('image'),async(req,res)=>{
    const {name,dor} = req.body;
    if(!req.file){
        req.flash('error','Invalid File type!!, only allowed(jpeg,jpg,png)');
        return res.redirect('/adding/add-song');
    }
    const s = new songm({name,dor,image:req.file.filename});
    s.author=String(req.user._id);
    for(let artistid of req.body.artists){
        s.artists.push(artistid);
    }
    try{
        await s.save();
    }
    catch(err){
        req.flash('error',err.message);
        return res.redirect('/adding/add-song');
    }
    for(let artistid of req.body.artists){
        const a = await artistm.findById(artistid);
        a.songs.push(s._id);
        await a.save();
    }
    req.flash('success','successfully created Song');
    res.redirect('/home');
})

router.post('/add-artist',upload.single('image'),async(req,res)=>{
    const {name,dob,bio} = req.body;
    var img ='';
    if(req.file){
        img = req.file.filename;
    }
    const a = new artistm({name,dob,bio,image:img});
    await a.save();
    req.flash('success','successfully added Artist');
    res.redirect('/adding/add-song');
})

router.post('/rating/:id/:p',isLoggedIn,async(req,res)=>{
    // song rating update
    const {id,p} = req.params;
    var r = parseInt(req.body.rating); 
    const s = await songm.findById(id);
    const oldrating = s.avgrating;
    s.ratings.push({rating:r,author:String(req.user._id)});
    s.sum=s.sum+r;
    s.avgrating = parseFloat(s.sum/s.ratings.length).toFixed(1);
    const newrating = s.avgrating;
    await s.save();

    // artist rating update
    for(let a of s.artists){    
        const artist = await artistm.findById(a._id);
        var diff = newrating-oldrating;
        artist.sum = parseFloat(artist.sum+diff).toFixed(1);
        artist.avgrating = parseFloat(artist.sum/artist.songs.length).toFixed(1);
        await artist.save();
    }
    res.redirect(`/${p}`);
})

router.patch('/reset/:sid/:rid/:rt/:p',isLoggedIn,async(req,res)=>{
    // song rating update
    const {sid,rid,rt,p} = req.params;
    const s = await songm.findById(sid);
    const oldrating = s.avgrating;
    s.ratings.pull({_id:rid});
    var l=s.ratings.length;
    if(l==0){
        l=1;
    }
    s.sum=s.sum-rt;
    s.avgrating = parseFloat(s.sum/l).toFixed(1);
    const newrating = s.avgrating;
    await s.save();

    // artist rating update
    for(let a of s.artists){    
        const artist = await artistm.findById(a._id);
        var diff = newrating-oldrating;
        artist.sum = parseFloat(artist.sum+diff).toFixed(1);
        var ll=artist.songs.length;
        if(ll==0){
            ll=1;
        }
        artist.avgrating = parseFloat(artist.sum/ll).toFixed(1);
        await artist.save();
    }
    res.redirect(`/${p}`);
})

module.exports = router;