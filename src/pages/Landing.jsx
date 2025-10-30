import React from 'react'
import Header from '../components/sections/Header'
import Hero from '../components/sections/Hero'
import Banner from '../components/sections/Banner'
import Slider from '../components/sections/Slider'
import Gettingstarted from '../components/sections/Getting-started'
import YourPhysicalCard from '../components/sections/Your-physical-card'
import Features from '../components/sections/Features'
import CustomTemplate from '../components/sections/Custom-template'
import Footer from '../components/sections/Footer'

function Landing() {
  return (
    <div className='overflow-x-hidden'>
      <Header />
      <Hero />
      <Banner />
      <Slider />
      <Gettingstarted />
      <img src="/banner-2.png" alt="getting-started" className='w-full h-full object-cover' />
      <YourPhysicalCard />
      <img src="/profile-profession.png" alt="profile-acc-to-profession" className='w-full md:min-h-screen object-cover' />
      <Features />
      <CustomTemplate />
      <Footer />
    </div>
  )
}

export default Landing