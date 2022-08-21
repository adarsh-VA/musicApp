const mongoose = require('mongoose');

const songschema = new mongoose.Schema({
    name:String,
    dor:Date,
    image:String,
    artists:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'artists'
    }],
    avgrating:{
        type:Number,
        default:0
    },
    sum:{
        type:Number,
        default:0
    },
    ratings:[{
        rating:{
            type:Number,
            min:0
        },
        author:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'users'
        }
    }]
})

module.exports = mongoose.model('songs',songschema);