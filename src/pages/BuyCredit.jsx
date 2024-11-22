import React, { useContext } from 'react'
import { plans,assets } from '../assets/assets.js'
import {AppContext} from '../context/AppContex'

const BuyCredits = () => {
  const {user} =useContext(AppContext)

  return (
    <div className='min-h-[80vh] pt-10 mb-10 text-center'>
      <button className='py-2 px-10 border border-gray-400 rounded-full mb-6'>Our Plans</button>
      <h1 className='text-center text-3xl font-medium mb-6 sm:mb-10'>Choose the plan</h1>

      <div className='flex flex-wrap justify-center gap-6 text-left'>
        {plans.map((item,index)=>(
          <div key={index} className='bg-white drop-shadow-sm border rounded-lg py-12 px-8 text-gray-600 hover:scale-105 transition-all duration-500'>
            <img src={assets.logo_icon} width={40} alt="" />
            <p className='font-semibold mt-3 mb-1'>{item.id}</p>
            <p className='text-sm'>{item.desc}</p>
            <p className='mt-6'><span className='font-medium text-3xl'>${item.price}</span>/ {item.credits} credits</p>
            <button className='w-full bg-gray-800 text-white py-2.5 rounded-md text-sm min-w-52 mt-8 '>{user? "Purchase":"Get Started"}</button>
            </div>
        ))}
      </div>
    </div>
  )
}

export default BuyCredits