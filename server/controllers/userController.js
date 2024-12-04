import User from "../models/userModel.js";
import jwt  from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import razorpay from 'razorpay';
import Transaction from "../models/transaction.js";

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
       user: {name:user.name},
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
            user:{name:user.name}
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

const razorpayInstance=new razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_SECRET
})

export const razorpayPayment=async (req,res)=>{
    let {userId,plan}=req.body;

    try{
        let user=await User.findById(userId);

    if(!user || !plan){
        return res.json({success:false,
            message:"Missing details"
        })
    }

    let amount,date,credits;

    date=Date.now();

    switch(plan){
        case 'Basic':
            plan="Basic"
            credits=100
            amount=10
            break;
        case 'Advanced':
            plan="Advanced"
            credits=500
            amount=50
            break;
        case 'Business':
                plan="Business"
                credits=5000
                amount=250
                break;

        default :
        return res.json({success:false,message:'Plan not found'})
    }

    let transactionData={
        userId,
        plan,
        amount,
        credits,
        date
    }

    let newTransaction=await Transaction.create(transactionData);
    
    let options={
        amount:amount*100,
        currency:'INR',
        receipt:newTransaction._id,
    }

    await razorpayInstance.orders.create(options,(error,order)=>{
        if(error){
            return res.json({success:false,message:error})
        }

        return res.json({success:true,order})
    })

    } catch(error){
        return res.json({success:false,message:error.message})
    }
}

export const verifyRazorpay=async (req,res)=>{
    try{
        const {razorpay_order_id}=req.body;

    const orderinfo=await razorpayInstance.orders.fetch(razorpay_order_id);

    if(orderinfo.status==='paid'){
        const transactionData=await Transaction.findById(orderinfo.receipt);
        if(transactionData.payment){
            return res.json({
                success:false,
                message:'Payment Failed'
            })
        } 

        const userData=await User.findById(transactionData.userId);

        let creditBalance=userData.credits + transactionData.credits;
        await User.findByIdAndUpdate(userData._id,{credits:creditBalance})

        await Transaction.findByIdAndUpdate(transactionData._id,{credits:creditBalance})
        res.json({
            success:true,
            message:"Credit Added"
        })
    } else{
        return res.json({
            success:false,
            message:"Payment Failed"
        })
    }
    } catch(error){
        return res.json({
            success:false,
            message:error.message
        })
    }
}