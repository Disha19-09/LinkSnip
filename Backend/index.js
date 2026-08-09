import express from "express"
import mongoose from 'mongoose';
import { nanoid } from 'nanoid'
import dotenv from 'dotenv'
import connectDB from "./db.js";
import { Link } from "./models/Links.js";
dotenv.config();

const app = express()

app.use(express.json());

connectDB()

app.post('/shorten',  async (req, res) => {
    const { originalUrl } = req.body;
    console.log(originalUrl);
    const testcode = nanoid(10);
    console.log(testcode);
    await Link.create({code: testcode, longUrl: originalUrl})
    res.json({ message: "Got it", originalUrl , testcode });
})

app.get('/:code', async (req,res) => {
    const { code } = req.params;
    const link = await Link.findOne({ code: code});
    if(!link) return res.status(404).json({message: "Link not found"});
    res.redirect(link.longUrl);
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on PORT : ${PORT}`);
    
})