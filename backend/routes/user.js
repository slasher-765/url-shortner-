const express=require('express');
// const {handleusersignup,handleuserlogin}=require('../controllers/user');
const router=express.Router();

const { findOne } = require('../models/url');
const User=require('../models/user');
const {v4:uuidv4}=require('uuid');
const jwt = require('jsonwebtoken');

router.post("/signup",async (req, res) => { //signup route
    try {
        const { name, email, password } = req.body;

        // check if user already exists
        const existinguser = await User.findOne({ email });
        if (existinguser) {
            return res.render("signup", {
                error: "user already exists with this email"
            });
        }

        // create new user
        const user = new User({
            name,
            email,
            password,
        });
        await user.save();

        // generate jwt token and send it to the user
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        // If the request expects HTML (browser form submission), redirect to login page
        const acceptsHtml = req.accepts(['html', 'json']) === 'html';
        if (acceptsHtml) {
            return res.redirect('/login');
        }

        // Otherwise, respond with JSON (API client)
        return res.status(201).json({
            message: "user created successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            }
        });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});


router.post("/login",async(req,res)=>{       // this is login route
    const {email,password}=req.body;
    const user = await User.findOne({email,password});
    if(!user){
        res.render("login",{
            error:'invalid username or password'
        })
        return; // stop further execution when login fails
    }
    // session management using cookies/uuid
    const uniqueid=uuidv4(); // generate a unique id for the session
    res.cookie("sessionid",uniqueid,{
        httpOnly:true, // cookie cannot be accessed by client side scripts
        maxAge:24*60*60*1000, // cookie will expire in 24 hours
    });
    // After successful login redirect to /dash which renders home.ejs
    res.redirect("/dash");
}
);

module.exports=router;