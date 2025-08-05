// const express= require("express");
// const router = express.Router();

// router.get("/",async (req,res)=>{
//     const allurls=await URL.find({});
//     return res.render("home",{
//         urls:allurls,
//     })
// })
// module.exports = router;



const express = require("express");
const router = express.Router();
const URL = require("../models/url"); // Make sure path is correct

router.get("/", async (req, res) => {
  try {
    const allurls = await URL.find({}); // ✅ all documents from MongoDB
    return res.render("home", {
      urls: allurls, // ✅ passing to EJS as 'urls'
    });
  } catch (err) {
    console.error("Error fetching URLs:", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;