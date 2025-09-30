const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
},{timestamps:true});


const User =mongoose.model("user",userSchema); //'users'  will be the name of collection in database extra s will be added automatically in the end
module.exports = User; // exporting the model to use it in other files  