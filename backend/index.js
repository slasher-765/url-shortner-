require('dotenv').config(); 
const express = require('express');
const app=express();
const PORT = process.env.PORT || 3000;
const urlRouter=require('./routes/url')
const staticrouter=require('./routes/staticrouter'); // importing static router web pages
const URL=require('./models/url');

const path=require("path");
app.set("view engine","ejs");
app.set('views',path.resolve('./views')); // sari ejs files yahan hain


// ---------------------- DATABASE CONNECTION ----------------------
const { connectmongodb } = require('./connection'); 
connectmongodb(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ Connected to the MongoDB database successfully");
    })
    .catch((err) => {
        console.error("❌ Error connecting to the database:", err);
    });



// ---------------------- MIDDLEWARES ----------------------
app.use(express.json());                        // Parse JSON bodies (req.body)
app.use(express.urlencoded({ extended: false })); // Parse form-urlencoded data
app.use('/favicon.ico', (req, res) => res.status(204).end()); // Ignore favicon requests



// ---------------------- ROUTES ----------------------
app.use("/url",urlRouter);  // enter url starting from 'https://'
app.use("/",staticrouter);

app.get("/test",async (req,res)=>{
  const allurls=await URL.find({});
  return res.render("home",{
    urls:allurls,
  }); // we can send as many variables inside here ab meri home file par 
})                              //    allurls in the name of variable 'urls' present hain

app.get("/allids", async (req, res) => {
  try {
    const allUrls = await URL.find({}); // Get all documents ie get all the urls

    // Extract only Shortid and redirecturl if needed
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