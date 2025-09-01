import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser, setShowLogin } from '../redux/slices/userSlice';
import { getCredit } from '../redux/slices/creditSlice';
import { toast } from 'react-toastify';

const Login = () => {
    const [state, setState] = useState('Login');
    const dispatch = useDispatch();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const loading = useSelector(state => state.user.loading);

    useEffect(()=>{
        document.body.style.overflow="hidden";

        return ()=>{
            document.body.style.overflow="unset";
        }

    },[])

    async function handleSubmit(e){
        e.preventDefault();

        try{
            if(state === "Login"){
                const resultAction = await dispatch(loginUser({email, password}));
                
                if(!resultAction.error){
                    dispatch(setShowLogin(false));
                    dispatch(getCredit());
                } else {
                    toast.error(resultAction.payload);
                }
            } else {
                const resultAction = await dispatch(registerUser({name, email, password}));
            
                if(!resultAction.error){
                    // After successful registration, automatically log in
                    const loginAction = await dispatch(loginUser({email, password}));
                    if(!loginAction.error){
                        dispatch(setShowLogin(false));
                        dispatch(getCredit());
                    }
                } else {
                    toast.error(resultAction.payload);
                }
            }
        } catch(error){
            toast.error(error.message);
        }
    }

    

    return (
    <div className='absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center' >
        <form onSubmit={handleSubmit} action="" className='relative bg-white p-10 rounded-xl text-slate-500'>
            <h1 className='text-center text-2xl text-neutral-700 font-medium'>{state}</h1>
            <p className='text-sm'>Welcome back! please sign in to continue</p>

            {state!=="Login" && <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-5'>
                {/* <img src={assets.profile_icon} alt="" width={25} /> */}
                <input onChange={(e)=>setName(e.target.value)} value={name} type="text" placeholder='Full Name' name="" id="" required className='outline-none text-sm ml-2'/>
            </div>}

            <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
                {/* <img src={assets.email_icon} alt="" width={15} /> */}
                <input onChange={(e)=>setEmail(e.target.value)} value={email} type="text" placeholder='Email id' name="" id="" required className='outline-none text-sm ml-2'/>
            </div>

            <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
                {/* <img src={assets.lock_icon} alt="" width={10} /> */}
                <input onChange={(e)=>setPassword(e.target.value)} value={password} type="text" placeholder='Password' name="" id="" required className='outline-none text-sm '/>
            </div>

            <p className='text-sm text-blue-600 my-4 cursor-pointer'>Forgot password?</p>

            <button 
                className='bg-blue-600 w-full text-white py-2 rounded-full disabled:opacity-70 disabled:cursor-not-allowed' 
                disabled={loading}
            >
                {loading ? 'Loading...' : state}
            </button>

                {state==="Login" ? 
            <p className='mt-5 text-center'>Don't have an account? <span className='text-blue-600 cursor-pointer' onClick={()=>{setState("Sign up")}}>Sign up</span></p> :

            <p className='mt-5 text-center'>Already have an account? <span className='text-blue-600 cursor-pointer' onClick={()=>{setState("Login")}}>Login</span></p>}

            <img src={assets.cross_icon} alt=""  className="absolute top-5 right-5 cursor-pointer" onClick={()=>{dispatch(setShowLogin(false))}} />

        </form>
    </div>
  )
}

export default Login
