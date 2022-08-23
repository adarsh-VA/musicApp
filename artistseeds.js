const mongoose = require('mongoose');
const db='mongodb://localhost:27017/dotify';
const artistm = require('./models/artistm');

const artists = ['Justin Bieber','Taylor Swift','Ed Sheeran','Ariana Grande','Bruno Mars','The Weeknd','Selena Gomez','Shawn Mendes','Eminem','Nick Jonas','Charlie Puth','Zayn','Jennifer Lopez','Khalid','Billie Eilish'];

const imgs = ['justin.png','Taylor-Swift.jpg','edsheeran.jpg','ariana.jpg','bruno-mars.jpg','weekend.jpg','selena.jpg','shawn.jpg','eminem.jpg','nick.jpg','charlie.jpg','zayn.jpg','jennifer.jpg','khalid.jpg','billie.jpg'];

mongoose.connect(db)
    .then(()=>{
        console.log('connection open');
    })
    .catch((err)=>{
        console.log('errr occured',err);
    })

async function create (){
    for(let i=0;i<15;i++){
        var name = artists[i];
        var dob = '2022-08-01';
        var img = imgs[i];
        var bio = 'good singer';
        const a = new artistm({name,dob,bio,image:img});
        await a.save();
    }
    console.log('completed');
}

create();