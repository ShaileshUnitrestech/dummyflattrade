const { default: axios } = require("axios");
const express = require("express");
require('dotenv').config();
const crypto = require('crypto-js');

const app = express();
const apikey = process.env.APIKEY;
const apiSecret = process.env.APISECRET;
// console.log(process.env);

app.get("/",(req,res)=>{
    res.send("hi");
})

app.get("/flattrade",(req,res)=>{

    let url = `https://auth.flattrade.in/?app_key=${apikey}`
    res.redirect(url);
})

app.get('/flattrade/callback', async (req, res) => {
    const requestCode = req.query.code;

    if (!requestCode) {
        return res.status(400).json({ message: "Request code not found in callback" });
    }

    try {
        const concatenatedValue = `${apikey}${requestCode}${apiSecret}`;
        const hashedSecret = crypto.SHA256(concatenatedValue).toString();

        const config = {
            method: 'post',
            url: 'https://authapi.flattrade.in/trade/apitoken',
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                api_key: apikey,
                request_code: requestCode,
                api_secret: hashedSecret,
            }
        };

        const response = await axios(config);
        console.log("API Response:", response.data);
        
        if (response.data.stat === 'Not_Ok') {
            return res.status(400).json({
                message: "Token retrieval failed",
                error: response.data.emsg
            });
        }

        res.json({
            status: response.status,
            token: response.data.token, 
            client: response.data.client,
            message: "Token retrieved successfully"
        });
    } catch (error) {
        console.error("Error exchanging request code for token:", error);
        res.status(500).json({ error: "Failed to retrieve token" });
    }
});


const PORT=8000
app.listen(PORT,()=>{
    console.log("connected")
})