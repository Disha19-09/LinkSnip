import express from "express"
import mongoose from 'mongoose';
import cors from 'cors'
import { nanoid } from 'nanoid'
import dotenv from 'dotenv'
import connectDB from "./db.js";
import { Link } from "./models/Links.js";
import {rateLimit} from 'express-rate-limit'

dotenv.config();

const limiter = rateLimit({
    windowMs : 60*1000,
    limit : 10
})

const app = express()

app.use(express.json());
app.use(cors());

connectDB()

app.post('/shorten', limiter,  async (req, res) => {
    try {
        const { originalUrl } = req.body;
        console.log(originalUrl);
        const link = await Link.findOne({longUrl: originalUrl});
        if(link){
            const {longUrl, code} = link;
            return res.json({message: "Got it",originalUrl: longUrl ,testcode: code });
        }
        const testcode = nanoid(10);
        console.log(testcode);
        await Link.create({code: testcode, longUrl: originalUrl})
        res.json({ message: "Got it", originalUrl , testcode });
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Something Went Wrong!!"});
    }
})

app.get('/:code', async (req,res) => {
    try {
        const { code } = req.params;
        const link = await Link.findOne({ code: code});
        if(!link) return res.status(404).json({message: "Link not found"});
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