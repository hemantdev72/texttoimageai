import { createContext, useEffect, useState } from "react";
import App from "../App";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AppContext=createContext();

const AppContextProvider=({children})=>{
    const [user,setUser]=useState(false);    
    const [showLogin,setShowLogin]=useState(false); 
    const [token,setToken]=useState(localStorage.getItem("token"))
    const [credit,setCredit]=useState(false);
    const backend=import.meta.env.VITE_BACKEND_URL;
    const navigate=useNavigate();

    async function getCredit(){
        try{
            const {data}=await axios.get(`https://texttoimageai-kirx.onrender.com/api/user/credit`,{
                headers:{token}
            })
            if(data.success){
                setCredit(data.credits);
                setUser(data.user);
               
            } else{
               toast.error(data.message)
            }
        } catch(error){
            console.log(error);
        }
    }

    async function generateImage(prompt){
        try{
            const {data}=await axios.post("https://texttoimageai-kirx.onrender.com/api/image/generate-image",{prompt},{
                headers:{token}
            });
            if(data.success){
                getCredit();
                return data.resultImage
            } else{
                toast.error(data.message)
                getCredit();
                if(data.credits===0){
                    navigate("/buycredits")
                }
            }
        } catch(error){
            toast.error(error.message)
        }
    }

    const logout=()=>{
        localStorage.removeItem("token");
        setToken("")
        setUser(null)
        navigate("/")
    }

    useEffect(() => {
        if(token){
            getCredit();
        }else{
            setToken(localStorage.getItem("token")); 
        }
        
        const data = localStorage.getItem("user");
        if (data) {
            try {
                setUser(JSON.parse(data));
            } catch (error) {
                console.error("Error parsing user data from localStorage:", error);
                setUser(false); 
            }
        } else {
            setUser(false); 
        }
    }, [token]); 

    
    
    const value={
        user,setUser,showLogin,setShowLogin,backend,token,setToken,credit,setCredit,generateImage,getCredit,logout
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;
