import { createContext, useEffect, useState } from "react";
import App from "../App";
import axios from 'axios';

export const AppContext=createContext();

const AppContextProvider=({children})=>{
    const [user,setUser]=useState(false);    
    const [showLogin,setShowLogin]=useState(false); 
    const [token,setToken]=useState(localStorage.getItem("token"))
    const [credit,setCredit]=useState(0);
    const backend=import.meta.env.VITE_BACKEND_URL;
    async function getCredit(){
        try{
            const {data}=await axios.get(`http://localhost:3000/user/credit`,{
                headers:{token}
            })
            console.log(data);
            
    
            if(data.success){
                setCredit(data.credits);
                setUser(data.user);
                console.log(data);
            } else{
    
            }
        } catch(error){
            console.log(error);
        }
    }

    useEffect(() => {
        setToken(localStorage.getItem("token")); // Retrieve token
        const data = localStorage.getItem("user"); // Retrieve user
        if (data) {
            try {
                setUser(JSON.parse(data)); // Parse and set user if data exists
            } catch (error) {
                console.error("Error parsing user data from localStorage:", error);
                setUser(false); // Reset to false if parsing fails
            }
        } else {
            setUser(false); // Reset to false if no user is stored
        }
    }, [user]); // Run only once on mount

    
    
    const value={
        user,setUser,showLogin,setShowLogin,backend,token,setToken,credit,setCredit
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;