import express from "express"
import mongoose from 'mongoose';
import cors from 'cors'
import { nanoid } from 'nanoid'
import dotenv from 'dotenv'
import connectDB from "./db.js";
import connectRedis, {client} from "./redisClient.js";
import { Link } from "./models/Links.js";
import {rateLimit} from 'express-rate-limit'
import  isURL  from "validator/lib/isURL.js";
import { LINK_EXPIRY_SECONDS } from "./constants.js";

dotenv.config();

const limiter = rateLimit({
    windowMs : 60*1000,
    limit : 10,
    statusCode : 429,
    message :{
        message: "Too many requests!! Please try again later."
    }
})

const app = express()

app.use(express.json());
app.use(cors());

connectDB()
connectRedis()

app.post('/shorten', limiter,  async (req, res) => {
    try {
        const { originalUrl } = req.body;
        if (!originalUrl || typeof originalUrl !== 'string') {
            return res.status(400).json({message: "originalUrl is required"});
        }
        if(!isURL(originalUrl)) return res.status(400).json({message: "Bad Request!!"})
        console.log(originalUrl);
        const link = await Link.findOne({longUrl: originalUrl});
        if(link){
            const {longUrl, code} = link;
            return res.json({message: "Got it",originalUrl: longUrl ,testcode: code });
        }
        const shortcode = nanoid(10);
        console.log(shortcode);
        await Link.create({code: shortcode, longUrl: originalUrl})
        res.json({ message: "Got it", originalUrl , shortcode });
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Something Went Wrong!!"});
    }
})

app.get('/:code', async (req,res) => {
    try {
        const { code } = req.params;
        const red = await client.get(code);
        if(red){
            console.log("CACHE HIT: Found in Redis! Skipping MongoDB.");
            res.redirect(red);
            return;
        }
        console.log("CACHE MISS: Querying MongoDB...");
        const link = await Link.findOne({ code: code});
        if(!link) return res.status(404).json({message: "Link not found"});
        await client.set(code , link.longUrl, { EX : LINK_EXPIRY_SECONDS });
        res.redirect(link.longUrl);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Something Went Wrong!!"});
    }
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on PORT : ${PORT}`);
})