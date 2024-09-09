const express = require("express");
require('dotenv').config();

const app = express();
const apikey = process.env.APIKEY;

app.get("/",(req,res)=>{
    res.send("hi");
})

app.get("/flattrade",(req,res)=>{

    let url = `https://auth.flattrade.in/?app_key=${apikey}`
    res.redirect(url);
})



const PORT=8000
app.listen(PORT,()=>{
    console.log("connected")
})