import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import userRoute from  './routes/userRoutes.js';
import { dbConnnect } from './config/dbConnect.js';

const app=express();

const PORT=process.env.PORT || 3000

app.use(express.json());
app.use(cors());
dbConnnect();

app.use("/api/user",userRoute);

app.get('/',(req,res)=>{
    res.send("api working")
})

app.listen(PORT,()=>{
    console.log("server is running",PORT)
})