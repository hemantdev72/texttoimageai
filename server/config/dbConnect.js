import mongoose from 'mongoose';

export const dbConnnect=async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        // console.log(process.env.MONGO_URL);
        console.log("db connect");
    } catch(error){
        console.log(error.message,"db connection failed")
        // console.log(process.env.MONGO_URL);
    }
}