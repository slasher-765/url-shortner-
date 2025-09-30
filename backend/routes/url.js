const express=require('express');
// const {generatenewshorturl,/*originalurl*/}=require('../controllers/url')
const router=express.Router();
const { nanoid } = require('nanoid');
const URL = require('../models/url');

router.post("/dash",async(req,res)=>{
    const body=req.body;
    if(!body){return res.status(400).json({msg:"url is required"})}
    const shortid=nanoid(8) // create a random 8digits short id
    
    await URL.create({
        Shortid:shortid,
        redirecturl:body.url,
        visithistory:[]   // empty array initially coz its a new id so no history as of now
    });
    const allurls=await URL.find({}); // fetch all urls from the database
    return res.render("home",{
        id:shortid,
        urls:allurls,  // id variable par hamne shortid ko store kiya hai and passed it to home.ejs
    })
    

});
// router
//     .route('/:shortid')
//     .get(originalurl) // req.params.id will give me the url '.id' coz after : 'id' is used




// connection between index.js,routes/url.js and controllers/url.js
// index.js -> urlRouter.js -> urlController.js
// matlab you define import the routers in index.js from routes/url.js and the functions
// inside this file are defined in controllers/url.js

// so the flow is like this
// index.js -> urlRouter.js -> urlController.js

module.exports = router;