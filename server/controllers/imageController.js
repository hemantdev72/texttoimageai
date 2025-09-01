import User from '../models/userModel.js'
import axios from 'axios';
import FormData from 'form-data';



export const imageGenetator=async (req,res)=>{
    try{
        const {userId,prompt}=req.body;
        console.log('imageGenetator - userId:', userId);
        console.log('imageGenetator - prompt:', prompt);
        console.log('imageGenetator - req.body:', req.body);

        const user=await User.findById(userId);
        console.log('imageGenetator - Found user:', user);
        
        if(!user || !prompt){
            return res.json({
                success:false,
                message:"Missing Details"
            })
        }

        if(user.credits === 0){
            return res.json({
                success:false,
                message:"No credit Balance",
                credits:user.credits
            })
        }

        const formData=new FormData();
        formData.append("prompt",prompt)

        const {data}=await axios.post("https://clipdrop-api.co/text-to-image/v1",formData,{
            headers:{
                'x-api-key':process.env.CLIPDROP_API
            },
            responseType:'arraybuffer'
        })

        const base64Image=Buffer.from(data,'binary').toString('base64');

        const resultImage=`data:image/png;base64,${base64Image}`

        await User.findByIdAndUpdate(user._id,{credits:user.credits-1})

        res.json({
            success:true,
            message:"Image Generated",
            credits:user.credits-1,
            resultImage
        })
    } catch(error){
        res.json({
            success:false,
            message:error.message
        })
    }
}