import React from 'react'
import { assets } from '../assets/assets'
import { motion } from 'motion/react'

function Descripion() {
  return (
    <motion.div
    initial={{opacity:0.2,y:100}}
    transition={{duration:1}}
    whileInView={{opacity:1,y:0}}
    viewport={{once:true}}
    className='flex flex-col items-center justify-center my-20'>
    <h1 className='text-3xl sm:text-4xl mb-2 font-semibold'>Create AI Images</h1>
    <p className='text-lg mb-8 text-gray-600'>Turn your imagination into visuals</p>
    
    <div className='flex flex-col md:flex-row items-center gap-4 md:gap-10'>
        <img src={assets.sample_img_1} className='w-80 xl:w-96' alt="" />
        <div>
            <h2 className='text-3xl font-medium max-w-lg mb-4'>Introduction the AI-Powered Text to Image Generator</h2>
            <p className='text-gray-600 mb-4'>Easily bring your ideas to life with our free AI image generator. Whether you need stunning visuals or unique imagery, our tool transform your text to images with just a few clicks. Imagine it, describe it, and watch it come to life instantly.</p>
            <p className='text-gray-600'>Simply type in a text prompt, and our cutting-edge AI will generate high quality images in seconds. From product visuals to character designs and portraits, even concepts that dont yet exist can be visualized effortlessly. Powered by advanced AI technology, the creative possibilities are limitless.</p>
        </div>
    </div>
    </motion.div>
  )
}

export default Descripion