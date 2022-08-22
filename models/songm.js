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
    author:{
        type: String,
        default:''
    },
    ratings:[{
        rating:{
            type:Number,
            min:0
        },
        author:String
    }]
})

module.exports = mongoose.model('songs',songschema);