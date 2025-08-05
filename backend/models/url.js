const mongoose=require('mongoose');

const urlSchema= new mongoose.Schema({
    Shortid:{   // the url created by this project
        type: String,
        required:true,
        unique:true,
    },
    redirecturl:{  // url given by the user
        type:String,
        required:true,
    },
    visithistory:[{timestamp:{type:Number}}]  // array of objects

})

const URL=mongoose.model('url',urlSchema); //'url' named collection will be formed in the database
module.exports=URL;