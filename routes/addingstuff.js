const express = require('express');
const router = express.Router();
const artistm = require('../models/artistm');
const songm = require('../models/songm');
const {isLoggedIn} = require('../middlewares');


// multer
const multer = require('multer');
const {storage} = require('../middlewares');
const upload = multer({ storage: storage })

router.get('/add-song',isLoggedIn,async(req,res)=>{
    const artists = await artistm.find({});
    res.render('addsong',{artists,tl:'Add Song'});
})

router.post('/add-song',upload.single('image'),async(req,res)=>{
    const {name,dor} = req.body;
    const s = new songm({name,dor,image:req.file.filename});
    s.author=String(req.user._id);
    for(let artistid of req.body.artists){
        s.artists.push(artistid);
    }
    await s.save();
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
        artist.save();
    }
    res.redirect(`/${p}`);
})

router.patch('/reset/:sid/:rid/:rt/:p',isLoggedIn,async(req,res)=>{
    // song rating update
    const {sid,rid,rt,p} = req.params;
    const s = await songm.findById(sid);
    const oldrating = s.avgrating;
    s.ratings.pull({_id:rid});
    s.sum=s.sum-rt;
    s.avgrating = parseFloat(s.sum/s.ratings.length).toFixed(1);
    const newrating = s.avgrating;
    await s.save();

    // artist rating update
    for(let a of s.artists){    
        const artist = await artistm.findById(a._id);
        var diff = newrating-oldrating;
        artist.sum = parseFloat(artist.sum+diff).toFixed(1);
        artist.avgrating = parseFloat(artist.sum/artist.songs.length).toFixed(1);
        artist.save();
    }
    res.redirect(`/${p}`);
})

module.exports = router;