
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/slices/userSlice';

export const useAuthSync = () => {
  const dispatch = useDispatch();
  const token = useSelector(state => state.user.token);

  useEffect(() => {
    if (!token) {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');

      if (storedUser && storedToken) {
       
        const user = JSON.parse(storedUser);
        dispatch({
          type: 'user/login/fulfilled',
          payload: {
            user,
            token: storedToken,
          }
        });
      }
    }
  }, [dispatch, token]);
};
