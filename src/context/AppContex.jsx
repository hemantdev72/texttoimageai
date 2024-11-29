import { createContext, useEffect, useState } from "react";
import App from "../App";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export const AppContext=createContext();

const AppContextProvider=({children})=>{
    const [user,setUser]=useState(false);    
    const [showLogin,setShowLogin]=useState(false); 
    const [token,setToken]=useState(localStorage.getItem("token"))
    const [credit,setCredit]=useState(0);
    const backend=import.meta.env.VITE_BACKEND_URL;
    const navigate=useNavigate();

    async function getCredit(){
        try{
            const {data}=await axios.get(`http://localhost:3000/api/user/credit`,{
                headers:{token}
            })
            console.log(data);
            if(data.success){
                setCredit(data.credits);
                localStorage.setItem("user",JSON.stringify(data.user));
            } else{
                console.log("error while fetching credits")
            }
        } catch(error){
            console.log(error);
        }
    }

    async function generateImage(prompt){
        try{
            const {data}=await axios.post("http://localhost:3000/api/image/generate-image",{prompt},{
                headers:{token}
            });
            console.log(data);

            if(data.success){
                getCredit();
                return data.resultImage
            } else{
                getCredit();
                if(data.creditBalance===0){
                    navigate("/buycredits")
                }
            }
        } catch(error){
            console.log(error)
        }
    }

    useEffect(() => {
        getCredit();
        setToken(localStorage.getItem("token")); 
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
        user,setUser,showLogin,setShowLogin,backend,token,setToken,credit,setCredit,generateImage,getCredit
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;