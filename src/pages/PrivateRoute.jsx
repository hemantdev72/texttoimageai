import { Navigate } from "react-router-dom"; 
import { useContext } from "react";
import { AppContext } from '../context/AppContex'

const PrivateRoute = ({ children }) => {
    const { user,showLogin,setShowLogin } = useContext(AppContext); 

  
    if (!user) {
        setShowLogin(true);
    }

    return children;
};


export default PrivateRoute;