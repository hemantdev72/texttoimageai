import React from 'react'
import { assets } from '../assets/assets'
import { motion } from 'motion/react'

const GenerateBtn = () => {
  return (
    <motion.div
    initial={{opacity:0.2,y:100}}
    transition={{duration:1}}
    whileInView={{opacity:1,y:0}}
    viewport={{once:true}}
    className='flex flex-col items-center justify-center  py-5'>
    <h1 className='text-3xl sm:text-4xl mb-2 font-semibold'>See the magic. Try now</h1>
    <button className='sm:text-lg text-white bg-black w-auto mt-8 px-12 py-2.5 flex items-center gap-2 rounded-full'>
            Generate Image
            <img className='h-6' src={assets.star_group} alt="" />
        </button>
    </motion.div>
  )
}

export default GenerateBtn