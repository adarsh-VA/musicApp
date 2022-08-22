const express = require('express');
const router = express.Router();
const artistm = require('../models/artistm');
const songm = require('../models/songm');
const path = require('path');
const fs = require('fs');
const {isLoggedIn} = require('../middlewares');

router.get('/home',async(req,res)=>{
    const songs = await songm.find().sort({avgrating:-1}).limit(10).populate('artists');
    const artists = await artistm.find().sort({avgrating:-1}).limit(10).populate('songs');
    res.render('home',{songs,artists,tl:'Home'});
})

router.get('/allartists',(req,res)=>{
    artistm.find().sort({name:1}).populate('songs')
    .then( (artists) =>{
        res.render('allartists',{artists,tl:'All Artists'});
    });
})

router.get('/allsongs',async(req,res)=>{
    const songs = await songm.find({}).populate('artists');
    res.render('allsongs',{songs,tl:'All Songs'});
})

router.post('/rating/:id/:p',isLoggedIn,async(req,res)=>{
    // song rating update
    const {id,p} = req.params;
    var r = parseInt(req.body.rating); 
    const s = await songm.findById(id);
    const oldrating = s.avgrating;
    s.ratings.push({rating:r});
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

router.delete('/allsongs/:id',isLoggedIn,async(req,res)=>{
    const {id} = req.params;
    const s = await songm.findById(id);
    const rating = s.avgrating;
    var filePath = path.join(__dirname.replace('routes',''),`/public/images/${s.image}`); 
    fs.unlinkSync(filePath);
    for(let a of s.artists){
        const artist = await artistm.findById(a._id);
        var avg =0;
        var l=1;
        artist.songs.pull({_id:id});
        artist.sum=parseFloat(artist.sum-rating).toFixed(1);
        if(artist.songs.length!=0){
            l=artist.songs.length;
        }
        avg=parseFloat(artist.sum/l).toFixed(1);
        artist.avgrating = avg;

        await artist.save()
    }

    await s.delete();
    await songm.findByIdAndDelete(id);
    res.redirect('/allsongs')
})

module.exports = router;