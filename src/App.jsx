import { useSelector, useDispatch } from 'react-redux'
import './App.css'
import {Routes,Route} from 'react-router-dom';
import Result from './pages/Result';
import Home from './pages/Home';
import BuyCredit from './pages/BuyCredit';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './components/Login';
import PrivateRoute from './pages/PrivateRoute';
import NotFound from './pages/NotFound';
import { useEffect } from 'react';
import { getCredit } from './redux/slices/creditSlice';
import { useAuthSync } from './hook/useAuthSync';



function App() {
   useAuthSync();
  const showLogin = useSelector(state => state.user.showLogin);
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);
  const token = useSelector(state => state.user.token);
  const dispatch = useDispatch();

  
  useEffect(() => {
    if (isAuthenticated && token) {
      console.log('App - Dispatching getCredit');
      // Fetch user credit
      dispatch(getCredit());
    } else {
      console.log('App - Not authenticated or no token');
    }
  }, [isAuthenticated, token, dispatch]);

  return (
    <>
      <div className='bg-gradient-to-b from-teal-50 to-orange-50 px-4 sm:px-10 md:px-14 lg:px-28 min-h-screen'>
        <Navbar  />
        {showLogin && <Login />}
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/result'  element={
                            <PrivateRoute>
                                <Result />
                            </PrivateRoute>
                        }  />
          <Route path='/buycredits' element={<BuyCredit />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>

    </>
  )
}

export default App
