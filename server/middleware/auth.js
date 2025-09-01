import jwt from 'jsonwebtoken';

export const auth=(req,res,next)=>{
    // Check for token in both Authorization header and token header
    let token = req.headers.token || req.headers.authorization;
    
    // Remove 'Bearer ' prefix if present
    if (token && token.startsWith('Bearer ')) {
        token = token.substring(7);
    }

    console.log('=== AUTH MIDDLEWARE DEBUG ===');
    console.log('Auth middleware - All Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Auth middleware - Token:', token);
    console.log('Auth middleware - JWT_SECRET exists:', !!process.env.JWT_SECRET);
    console.log('Auth middleware - JWT_SECRET length:', process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 'undefined');

    if(!token){
        console.log('Auth middleware - No token found');
        return res.status(400).json({
            success:false,
            message:"User not authorized"
        })
    }
    try{
        
    
        const decode=jwt.verify(token,process.env.JWT_SECRET);
        console.log('Auth middleware - Decoded token:', decode);
        console.log('Auth middleware - Decoded token ID:', decode.id);
    
        if(decode.id){
            req.body.userId=decode.id;
            console.log('Auth middleware - Success, userId set to:', req.body.userId);
            next();
        } else{
            console.log('Auth middleware - No ID in decoded token');
            return res.json({
                success:false,
                message:"not authorized login again"
            })
        }
    
    } catch(error){
        console.log('Auth middleware - JWT Verification Error:', error.message);
        console.log('Auth middleware - Error stack:', error.stack);
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}