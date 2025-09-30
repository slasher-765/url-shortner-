require('dotenv').config(); 
const express = require('express');
const app=express();
const PORT = process.env.PORT || 3000;  // if PORT is not defined in .env file, it will take 3000 as default
const URL=require('./models/url');
const mongoose = require('mongoose');


const path=require("path");
app.set("view engine","ejs");
app.set('views',path.resolve('./views')); // sari ejs files yahan hain


// ---------------------- ROUTES IMPORTS ----------------------
const urlRouter=require('./routes/url')    // ye ek post router hai iska kaam user create karna hai ye tabhi khulega jab user create it wont be accessed manually
const staticrouter=require('./routes/staticrouter');
const userrouter=require('./routes/user');


// ---------------------- DATABASE CONNECTION ----------------------
async function connectmongodb() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to the MongoDB database successfully");
    } catch (err) {
        console.error("❌ Error connecting to the database:", err);
    }
}

connectmongodb();



// ---------------------- MIDDLEWARES ----------------------
app.use(express.json());                        // Parse JSON bodies (req.body)
app.use(express.urlencoded({ extended: false })); // Parse form-urlencoded data
app.use('/favicon.ico', (req, res) => res.status(204).end()); // Ignore favicon requests



// ---------------------- ROUTES ---------------------- // enter url starting from 'https://'
// Debug: ensure imported routers are functions/objects
// console.log('DEBUG: urlRouter type=', typeof urlRouter);
// console.log('DEBUG: staticrouter type=', typeof staticrouter);
// console.log('DEBUG: userrouter type=', typeof userrouter);
// if (!urlRouter || (typeof urlRouter !== 'function' && typeof urlRouter !== 'object')) {
//   console.error('ERROR: urlRouter is not a valid router');
// }
// if (!staticrouter || (typeof staticrouter !== 'function' && typeof staticrouter !== 'object')) {
//   console.error('ERROR: staticrouter is not a valid router');
// }
// if (!userrouter || (typeof userrouter !== 'function' && typeof userrouter !== 'object')) {
//   console.error('ERROR: userrouter is not a valid router');
// }

app.use("/home",urlRouter);  // this means ki agr koi bhi request /url par aye toh go to
                            // toh urlRouter.js file in routes folder aur vahan par
                            // jitne bhi routes hain unke aage /url laga do this is what

                            // this means for eg-> agr koi requests /url/abc123 par aye toh it will go to
                            // urlRouter.js file and then it will check for /abc123 route aur phir jo
                            // lika hoga /abc123 route par vo chalega

app.use("/",staticrouter);  // this means ki agr koi bhi request / par aaye toh go to staticrouter.js file
                            // in routes folder aur vahan par jitne bhi routes hain unke aage / laga do(prefix mein)
                            // this is what this line means

app.use("/user",userrouter);      


app.get("/test",async (req,res)=>{
  const allurls=await URL.find({});
  return res.render("home",{
    urls:allurls,
  }); // we can send as many variables inside here ab meri home file par 
})                              //    allurls in the name of variable 'urls' present hain

app.get("/allids", async (req, res) => {
  try {
    const allUrls = await URL.find({}); // Get all documents ie get all the urls

    // Extract only Shortid and redirecturl
    const result = allUrls.map((doc) => ({
      Shortid: doc.Shortid,
      redirecturl: doc.redirecturl,
    }));

    res.json({ urls: result });
  } catch (err) {
    console.error("Error fetching URLs:", err);
    res.status(500).json({ error: "Failed to fetch URLs" });
  }
});

app.get("/:shortid", async (req, res) => {
    const id1 = req.params.shortid;
  
    try {
      const entry = await URL.findOneAndUpdate(
        { Shortid: id1 },
        {
          $push: {
            visithistory: { timestamps: Date.now() }
          }
        },
        { new: true }
      );
  
      if (!entry) {
        return res.status(404).send("Short URL not found");
      }
  
      let redirectTo = entry.redirecturl;
      console.log("Redirecting to:", redirectTo);
      res.redirect(redirectTo);

    } catch (error) {
      console.error("Error during redirect:", error);
      res.status(500).send("Internal Server Error");
    }
  });

app.listen(PORT,()=>{
    console.log(`The server is running on: ${PORT} port`)
});