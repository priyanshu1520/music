const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const songSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    songName:{
        type:String,
        required:true
    }
});

const Song=mongoose.model('Song',songSchema);
module.exports=Song;