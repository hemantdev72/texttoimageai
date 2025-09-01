import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import userRoute from  './routes/userRoutes.js';
import imageRoute from './routes/imageRoute.js'
import { dbConnnect } from './config/dbConnect.js';

const app=express();

const PORT=process.env.PORT || 3000

app.use(express.json());
app.use(cors());
dbConnnect();

app.use("/api/user",userRoute);
app.use("/api/image",imageRoute);

app.get('/',(req,res)=>{
    res.send("api working")
})

// Test endpoint to check JWT_SECRET
app.get('/test-jwt',(req,res)=>{
    if(process.env.JWT_SECRET) {
        res.json({
            success: true,
            message: "JWT_SECRET is configured",
            secretLength: process.env.JWT_SECRET.length
        })
    } else {
        res.json({
            success: false,
            message: "JWT_SECRET is not configured"
        })
    }
})

app.listen(PORT,()=>{
    console.log("server is running",PORT)
})