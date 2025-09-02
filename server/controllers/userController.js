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
    if(isUser){
        return res.status(409).json({
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
       user: {name:user.name, credits:user.credits},
        message:"User created successfully"
    })

   } catch(error){  
    console.log(error)
        res.status(400).json({
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
            return res.status(401).json({
                success:false,
                message:"User not found"
            })
        }

        const compare=await bcrypt.compare(password,user.password);
        if(!compare){
            return res.status(401).json({
                message:"wrong credentials",
                success:false
            })
        }

        const token=jwt.sign({id:user._id},process.env.JWT_SECRET);

        res.status(200).json({
            success:true,
            message:"Login successfully",
            token,
            user:{name:user.name, credits:user.credits}
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
    console.log('=== USER CREDIT DEBUG ===');
    console.log('userCredit - userId:', userId);
    console.log('userCredit - req.body:', req.body);
    console.log('userCredit - req.headers:', JSON.stringify(req.headers, null, 2));
    
    if(!userId) {
        console.log('userCredit - No userId found in req.body');
        return res.status(400).json({
            success: false,
            message: "User ID not found"
        });
    }
    
    try{
        const user=await User.findById(userId);
        console.log('userCredit - Found user:', user);

        if(!user) {
            console.log('userCredit - User not found in database');
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success:true,
            user:{name:user.name},
            credits:user.credits
        })
    }catch(error){
        console.log('userCredit - Error:', error);
        return res.status(400).json({
            success:false,
            message:error.message
        })
    }

}

let razorpayInstance;
try {
    razorpayInstance = new razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_SECRET
    });
    if (!razorpayInstance) {
        console.error('Failed to initialize Razorpay instance');
    }
} catch (error) {
    console.error('Error initializing Razorpay:', error);
}

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

    const order = await razorpayInstance.orders.create(options);
console.log("🧾 Razorpay order created:", order);
return res.json({ success: true, order });


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

        await Transaction.findByIdAndUpdate(transactionData._id,{payment:true})
        res.json({
            success:true,
            message:"Credit Added",
            credits: creditBalance
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
