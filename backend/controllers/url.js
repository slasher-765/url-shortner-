const {nanoid}=require('nanoid');
const URL=require('../models/url');

async function generatenewshorturl(req,res){
    const body=req.body;
    if(!body){return res.status(400).json({msg:"url is required"})}
    const shortid=nanoid(8) // create a random 8digits short id
    
    await URL.create({
        Shortid:shortid,
        redirecturl:body.url,
        visithistory:[]   // empty array initially coz its a new id so no history as of now
    });
    return res.render("home",{
        id:shortid,
    })
    return res.json({id:shortid});

}

// async function originalurl(req,res){  // this will direct to original url and update history by 1
//     const id1=req.params.shortid;
//     const entry=await URL.findOneAndUpdate({id1,},{$push:{visithistory:{timestamps:Date.now(),},},})
//     res.redirect(entry.redirecturl)
// };

module.exports={
    generatenewshorturl,
    // originalurl,
};