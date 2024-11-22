import { useState } from 'react'
import './App.css'
import {Routes,Route} from 'react-router-dom';
import Result from './pages/Result';
import Home from './pages/Home';
import BuyCredit from './pages/BuyCredit';
import Navbar from './components/Navbar';



function App() {

  return (
    <>
      <div className='bg-gradient-to-b from-teal-50 to-orange-50 px-4 sm:px-10 md:px-14 lg:px-28 min-h-screen'>
        <Navbar  />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/result' element={<Result />} />
          <Route path='/buycredits' element={<BuyCredit />} />
        </Routes>
      </div>

    </>
  )
}

export default App
