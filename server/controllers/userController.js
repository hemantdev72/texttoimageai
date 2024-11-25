import User from "../models/userModel.js";
import jwt  from 'jsonwebtoken';
import bcrypt from 'bcrypt'

export const register=async (req,res)=>{
   try{
    const {name,email,password}=req.body;

    if(!email || !name || !password){
        return res.status(400).json({
            success:false,
            message:"All fields are required"
        })
    }

    const isUser=await User.findOne({email});
    if(email){
        return res.status(400).json({
            success:false,
            message:"user already exists"
        })
    }

    const hashedPassword=await bcrypt.hash(password,10);

    const userData={
        name,email,password:hashedPassword
    }

    const newUser=new User(userData);
    
    const user=await newUser.save();

    const token=jwt.sign({id:user._id},process.env.JWT_SECRET);

    res.status(200).json({
        success:true,
        token,
       user: {name:user.name,credits:user.credits},
        message:"User created successfully"
    })

   } catch(error){  
    console.log(error)
        res.json(400).json({
            success:false,
            message:error.message
        })
   }

}

export const login=async (req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"all fields are required"
            })
        }

        const user=await User.findOne({email});
        if(!user){
            return res.status(200).json({
                success:false,
                message:"User not found"
            })
        }

        const compare=await bcrypt.compare(password,user.password);
        if(!compare){
            return res.status(200).json({
                message:"wrong credentials",
                success:false
            })
        }

        const token=jwt.sign({id:user._id},process.env.JWT_SECRET);

        res.status(200).json({
            success:true,
            message:"Login successfully",
            token,
            user:{name:user.name,credits:user.credits}
        })
    } catch(error){
        return res.status(400).json({
            success:false,
            message:error.message
        })
    }
}



export const userCredit=async (req,res)=>{
    const {userId}=req.body;
    try{
        const user=await User.findById(userId);

        return res.status(200).json({
            success:true,
            user:{name:user.name},
            credits:user.credits
        })
    }catch(error){
        return res.status(400).json({
            success:false,
            message:error.message
        })
    }

}