import { Navigate } from "react-router-dom"; 
import { useSelector, useDispatch } from "react-redux";
import { setShowLogin } from '../redux/slices/userSlice';

const PrivateRoute = ({ children }) => {
    const user = useSelector(state => state.user.user);
    const dispatch = useDispatch();
  
    if (!user) {
        dispatch(setShowLogin(true));
    }

    return children;
};


export default PrivateRoute;