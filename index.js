// Packages and variables
const express = require('express');
const app = express();
const path = require('path');
const ejsmate = require('ejs-mate');
const mongoose = require('mongoose');
const artistm = require('./models/artistm');
const songm = require('./models/songm');
const multer = require('multer');
const mtov= require('method-override');
const fs = require('fs');



const port = process.env.PORT || 3000;
const db='mongodb://localhost:27017/dotify';

// multer Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'/public/images'))
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)+file.originalname;
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
  
const upload = multer({ storage: storage })


// Express constraints
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'/views'));
app.engine('ejs',ejsmate);
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));
app.use(mtov('_method'));

// MongoDB connection
mongoose.connect(db)
    .then(()=>{
        console.log('connection open');
    })
    .catch((err)=>{
        console.log('errr occured',err);
    })

app.get('/home',async(req,res)=>{
    const songs = await songm.find().sort({avgrating:-1}).limit(10).populate('artists');
    const artists = await artistm.find().sort({avgrating:-1}).limit(10).populate('songs');
    res.render('home',{songs,artists});
})

app.get('/login',(req,res)=>{
    res.render('login');
})

app.get('/register',(req,res)=>{
    res.render('register')
})

app.get('/add-song',async(req,res)=>{
    const artists = await artistm.find({});
    res.render('addsong',{artists});
})

app.get('/allartists',(req,res)=>{
    artistm.find().sort({name:1}).populate('songs')
    .then( (artists) =>{
        res.render('allartists',{artists});
    });
})

app.get('/allsongs',async(req,res)=>{
    const songs = await songm.find({}).populate('artists');
    res.render('allsongs',{songs});
})

app.post('/add-song',upload.single('image'),async(req,res)=>{
    const {name,dor} = req.body;
    const s = new songm({name,dor,image:req.file.filename});
    for(let artistid of req.body.artists){
        s.artists.push(artistid);
    }
    await s.save();
    for(let artistid of req.body.artists){
        const a = await artistm.findById(artistid);
        a.songs.push(s._id);
        await a.save();
    }
    res.redirect('/home');
})

app.post('/add-artist',upload.single('image'),async(req,res)=>{
    const {name,dob,bio} = req.body;
    const a = new artistm({name,dob,bio,image:req.file.filename});
    await a.save();
    res.redirect('/add-song');
})

app.post('/rating/:id/:p',async(req,res)=>{
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

app.delete('/allsongs/:id',async(req,res)=>{
    const {id} = req.params;
    const s = await songm.findById(id);
    const rating = s.avgrating;
    var filePath = path.join(__dirname,`/public/images/${s.image}`); 
    fs.unlinkSync(filePath);
    for(let a of s.artists){
        const artist = await artistm.findById(a._id);
        var avg =0;
        var l=1;
        artist.songs.pop({_id:id});
        artist.sum=parseFloat(artist.sum-rating).toFixed(1);
        if(artist.songs.length!=0){
            l=artist.songs.length;
        }
        avg=parseFloat(artist.sum/l).toFixed(1);
        artist.avgrating = avg;

        await artist.save()
    }

    await s.delete();
    // await songm.findByIdAndDelete(id);
    res.redirect('/allsongs')
})

app.listen(port,(e)=>{
    console.log('server started');
    if (e){
        console.log('error',e);
    }
})