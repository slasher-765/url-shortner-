// const express= require("express");
// const router = express.Router();

// router.get("/",async (req,res)=>{
//     const allurls=await URL.find({});
//     return res.render("home",{
//         urls:allurls,
//     })
// })
// module.exports = router;

// saare  static pages will be rendered by this ststic url  router

const express = require("express");
const router = express.Router();
const URL = require("../models/url"); 

router.get("/", (req, res) => {
  return res.render("landing"); // ✅ Render landing page
});

router.get("/dash", async (req, res) => {
  try {
    const allurls = await URL.find({}); // ✅ all documents from MongoDB
    return res.render("home", {
      urls: allurls, // ✅ passing to home EJS as 'urls'
    });
  } catch (err) {
    console.error("Error fetching URLs:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/signup",(req,res)=>{
  return res.render("signup"); // ✅ Render signup page
})

router.get("/login",(req,res)=>{
  return res.render("login"); // ✅ Render login page
})
module.exports = router;