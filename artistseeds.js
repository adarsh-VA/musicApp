const mongoose = require('mongoose');
const db='mongodb://localhost:27017/dotify';
const artistm = require('./models/artistm');

mongoose.connect(db)
    .then(()=>{
        console.log('connection open');
    })
    .catch((err)=>{
        console.log('errr occured',err);
    })

async function create (){
    for(let i=1;i<=15;i++){
        var name = `artist${i}`;
        var dob = '2022-08-01';
        var img = '';
        var bio = 'good singer';
        const a = new artistm({name,dob,bio,image:img});
        await a.save();
    }
    console.log('completed');
}

create();