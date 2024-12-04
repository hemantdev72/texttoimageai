import jwt from 'jsonwebtoken';

export const auth=(req,res,next)=>{
    const {token}=req.headers;

    if(!token){
        return res.status(400).json({
            success:false,
            message:"User not authorized"
        })
    }
    try{
        
    
        const decode=jwt.verify(token,process.env.JWT_SECRET);
    
        if(decode.id){
            req.body.userId=decode.id;
        } else{
            return res.json({
                success:false,
                message:"not authorized login again"
            })
        }
    
        next();
    } catch(error){
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}