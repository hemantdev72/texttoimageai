import React from 'react'
import Header from '../components/Header'
import Steps from '../components/Steps'
import Descripion from '../components/Descripion'
import Testimonials from '../components/Testimonials'
import GenerateBtn from '../components/GenerateBtn'

const Home = () => {
  return (
    <div>
      <Header />
      <Steps />
      <Descripion />
      <Testimonials />
      <GenerateBtn />
    </div>
  )
}

export default Home