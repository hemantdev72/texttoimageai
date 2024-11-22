import React from 'react'
import { assets } from '../assets/assets'

const Login = () => {
  return (
    <div className='absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'>
        <form action="" className='relative bg-white p-10 rounded-xl text-slate-500'>
            <h1 className='text-center text-2xl text-neutral-700 font-medium'>Sign up</h1>
            <p className='text-sm'>Welcome back! please sign in to continue</p>

            <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-5'>
                {/* <img src={assets.profile_icon} alt="" width={25} /> */}
                <input type="text" placeholder='Full Name' name="" id="" required className='outline-none text-sm ml-2'/>
            </div>

            <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
                {/* <img src={assets.email_icon} alt="" width={15} /> */}
                <input type="text" placeholder='Email id' name="" id="" required className='outline-none text-sm ml-2'/>
            </div>

            <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
                {/* <img src={assets.lock_icon} alt="" width={10} /> */}
                <input type="text" placeholder='Password' name="" id="" required className='outline-none text-sm '/>
            </div>

            <p className='text-sm text-blue-600 my-4 cursor-pointer'>Forgot password?</p>

            <button className='bg-blue-600 w-full text-white py-2 rounded-full'>Create Account</button>

            <p className='mt-5 text-center'>Don't have an account? <span className='text-blue-600 cursor-pointer'>Sign up</span></p>

            <p className='mt-5 text-center'>Already have an account? <span className='text-blue-600 cursor-pointer'>Login</span></p>

            <img src={assets.cross_icon} alt=""  className="absolute top-5 right-5 cursor-pointer" />

        </form>
    </div>
  )
}

export default Login