const { default: axios } = require("axios");
const express = require("express");
require('dotenv').config();

const app = express();
const apikey = process.env.APIKEY;
// console.log(apikey);

app.get("/",(req,res)=>{
    res.send("hi");
})

app.get("/flattrade",(req,res)=>{

    let url = `https://auth.flattrade.in/?app_key=${apikey}`
    res.redirect(url);
})

app.get('/flattrade/callback', (req, res) => {
    const authCode = req.query.request_code;

    if (!authCode) {
        return res.status(400).json({ message: "Auth code not found in callback" });
    }
    console.log(authCode);

    try{
        const res = axios.get(`${process.env.serverURL}?code=${authCode}`);
        console.log(res.data);
    }
    catch(e){
        console.log("error",e)
    }
});

const PORT=8000
app.listen(PORT,()=>{
    console.log("connected")
})