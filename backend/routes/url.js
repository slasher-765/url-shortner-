const express=require('express');
const {generatenewshorturl,/*originalurl*/}=require('../controllers/url')
const router=express.Router();

router.post("/",generatenewshorturl);
// router
//     .route('/:shortid')
//     .get(originalurl) // req.params.id will give me the url '.id' coz after : 'id' is used


module.exports=router;