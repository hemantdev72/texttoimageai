import React, { useContext } from 'react'
import { plans,assets } from '../assets/assets.js'
import {AppContext} from '../context/AppContex'
import { motion } from 'motion/react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const BuyCredits = () => {
  const {user,setShowLogin,token,getCredit} =useContext(AppContext)
  const navigate=useNavigate();

  async function initPay(order){
    const options={
      key:import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount:order.amount,
      currency:order.currency,
      name:'Credit Payment',
      description:"Credit Payment",
      order_id:order.id,
      receipt:order.receipt,
      handler:async(response)=>{
        try{
          const {data}=await axios.post("https://texttoimageai-kirx.onrender.com/api/user/verify-pay",response,{headers:{token}})
          if(data.success){
            getCredit();
            navigate("/")
            toast.success("Credits Added")
          }
        } catch(error){ 
          toast.error(error.message)
          return res,json({success:false,message:error.message})
        }
      },
      
    }

    let rzp=new window.Razorpay(options);
    rzp.open();
  }

  async function razorpayPayment(plan){
    try{
      if(!user){
        setShowLogin(true);
      }

      let {data}=await axios.post("http://localhost:3000/api/user/razor-pay",{plan},{
        headers:{token}
      })
    
      if(data.success){
        initPay(data.order)
      }


    } catch(error){
      toast.error(error.message)
      
      
    }
  }

  return (
    <motion.div
    initial={{opacity:0.2,y:100}}
    transition={{duration:1}}
    whileInView={{opacity:1,y:0}}
    viewport={{once:true}}
     className='min-h-[80vh] pt-10 mb-10 text-center'>
      <button className='py-2 px-10 border border-gray-400 rounded-full mb-6'>Our Plans</button>
      <h1 className='text-center text-3xl font-medium mb-6 sm:mb-10'>Choose the plan</h1>

      <div className='flex flex-wrap justify-center gap-6 text-left'>
        {plans.map((item,index)=>(
          <div key={index} className='bg-white drop-shadow-sm border rounded-lg py-12 px-8 text-gray-600 hover:scale-105 transition-all duration-500'>
            <img src={assets.logo_icon} width={40} alt="" />
            <p className='font-semibold mt-3 mb-1'>{item.id}</p>
            <p className='text-sm'>{item.desc}</p>
            <p className='mt-6'><span className='font-medium text-3xl'>${item.price}</span>/ {item.credits} credits</p>
            <button onClick={()=>{razorpayPayment(item.id)}} className='w-full bg-gray-800 text-white py-2.5 rounded-md text-sm min-w-52 mt-8 '>{user? "Purchase":"Get Started"}</button>
            </div>
        ))}
      </div>
    </motion.div>
  )
}

export default BuyCredits
