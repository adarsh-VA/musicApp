const mongoose = require('mongoose');

const artistschema = new mongoose.Schema({
    name:String,
    dob:Date,
    image:String,
    bio:String,
    avgrating:{
        type:Number,
        default:0
    },
    sum:{
        type:Number,
        default:0
    },
    songs:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'songs'
    }]
})

module.exports = mongoose.model('artists',artistschema);