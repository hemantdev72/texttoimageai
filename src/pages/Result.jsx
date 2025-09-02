import React, { useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { generateImage, resetImage } from '../redux/slices/imageSlice';
import { getCredit } from '../redux/slices/creditSlice';
import { toast } from 'react-toastify';

const Result = () => {
  const [image, setImage] = useState(assets.sample_img_1);
  const dispatch = useDispatch();
  const { loading, generatedImage, isImageLoaded } = useSelector(state => state.image);
  const [input, setInput] = useState("");
  const { credit } = useSelector(state => state.credit);
  const { user } = useSelector(state => state.user);

  useEffect(() => {
    if (user) {
      dispatch(getCredit());
    }
  }, [dispatch, user]);

 async function handleSubmit(e){
  e.preventDefault();

  if(input){
    const resultAction = await dispatch(generateImage(input));
    
    if(!resultAction.error){
      setImage(resultAction.payload);
    // update credit after image generated
      dispatch(getCredit());
    } else {
      toast.error(resultAction.payload || 'Failed to generate image');
      // if credit is low show balance
      dispatch(getCredit());
    }
  }
 }

  return (
    <motion.form
    initial={{opacity:0.2,y:100}}
    transition={{duration:1}}
    whileInView={{opacity:1,y:0}}
    viewport={{once:true}}
    action="" className='flex flex-col min-h-[90vh] justify-center items-center gap-4'>
    
    
    
    <div>
      <div className='relative'>
        <img src={image} className="max-w-sm rounded" alt="" />
        <span className={`absolute bottom-0 left-0 h-1 bg-blue-500 ${loading ? "w-full transition-all duration-[10s]" :"w-0"}`}></span>
      </div>
      <p className={`${!loading ? "hidden" :""}`}>Loading...</p>
    </div>
    
    {!isImageLoaded ? <div className=' flex w-full max-w-xl bg-neutral-500 text-white text-sm p-0.5 rounded-full'>
      <input type="text" placeholder='Describe what you want to generate' className='placeholder-color flex-1 bg-transparent outline-none ml-8 max-sm:w-20' onChange={(e)=>setInput(e.target.value)}/>
      <button 
        className='bg-zinc-900 px-10 sm:px-16 py-3 rounded-full' 
        onClick={(e)=>handleSubmit(e)} 
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate'}
      </button>
    </div> : <div className='flex gap-2 flex-wrap justify-center text-white text-sm p-0.5 mt-10 rounded-full'>
      <p className='bg-transparent border border-zinc-900 text-black px-9 py-3 rounded-full cursor-pointer' onClick={()=>{dispatch(resetImage())}}>Generate Button</p>
      <a href={image} className='bg-zinc-900 px-10 py-3 rounded-full cursor-pointer' download>Download</a>
    </div>}

    
    </motion.form>
  )
}

export default Result