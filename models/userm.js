const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

const userschema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    }
});

userschema.plugin(plm);

module.exports = mongoose.model('users',userschema);