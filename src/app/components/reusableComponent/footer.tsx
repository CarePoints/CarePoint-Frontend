'use client'
import React from 'react'
import {usePathname} from 'next/navigation'

const footer = () => {
 const pathname = usePathname();
 const excludedRoutes = ['/user/Appointments/camara'];
 if(excludedRoutes.includes(pathname)){
  return null
 }



  return (
    <div>


    <div className="bg-[#0E0A3C] rounded-3xl m-3 p-6 md:p-12 lg:p-16 mt-10">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <div className="mb-8 md:mb-0">
        <h1 className="text-white text-2xl font-bold mb-4">CarePoint</h1>
        <p className="text-white text-sm font-thin">
          CarePoint is a leading digital agency dedicated to transforming the healthcare landscape through innovative and tailored solutions. Our expertise lies in merging cutting-edge technology with healthcare services to improve patient care, streamline operations, and enhance overall efficiency.
        </p>
      </div>
      
      <div className='xl:relative xl:left-32'>
        <h1 className="text-white text-2xl font-bold mb-4">Service</h1>
        <ul className="text-white text-sm font-thin">
          <li className="mb-2">Emergency Service</li>
          <li className="mb-2">Ambulance Service</li>
          <li className="mb-2">Doctor Appointment</li>
          <li className="mb-2">Chat with Doctor</li>
          <li className="mb-2">Medical Records</li>
        </ul>
      </div>
      
      <div className='xl:relative xl:left-16'>
        <h1 className="text-white text-2xl font-bold mb-4">Company</h1>
        <ul className="text-white text-sm font-thin">
          <li className="mb-2">Service</li>
          <li className="mb-2">Features</li>
          <li className="mb-2">Our Team</li>
          <li className="mb-2">Portfolio</li>
        </ul>
      </div>
      
      <div>
        <h1 className="text-white text-2xl font-bold mb-4">Contact</h1>
        <ul className="text-white text-sm font-thin">
          <li className="mb-2">akbarhaleel508@gmail.com</li>
          <li className="mb-2">8590740343</li>
          <li className="mb-2">Haleel Manzil Mancha Nedumangad</li>
        </ul>
      </div>
    </div>
  </div>
      </div>
  )
}

export default footer
