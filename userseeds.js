const mongoose = require('mongoose');
const db='mongodb://localhost:27017/dotify';
const userm = require('./models/userm');

mongoose.connect(db)
    .then(()=>{
        console.log('connection open');
    })
    .catch((err)=>{
        console.log('errr occured',err);
    })


async function create (){
    for(let i=1;i<=20;i++){
        var email = `user${i}@${i}`;
        var username = `user${i}`;
        var password = '123';
        const user = new userm({email,username});
        const ruser = await userm.register(user,password);
    }
    console.log('completed');
}
    
create();
