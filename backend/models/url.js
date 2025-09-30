const mongoose=require('mongoose');

const urlSchema= new mongoose.Schema({ // this schema is treated as an array of objects
    Shortid:{   // the url created by this project
        type: String,
        required:true,
        unique:true,
    },
    redirecturl:{  // url given by the user
        type:String,
        required:false,
    },
    visithistory:[{timestamp:{type:Number}}]  // array of objects

})

const URL=mongoose.model('url',urlSchema); //'urls' named collection will be formed in the database extra s will be added automatically
module.exports=URL;