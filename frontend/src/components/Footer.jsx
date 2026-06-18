import React from 'react'
import { assets } from '../assets/assets'

function Footer() {
  return (
    <div className="max-w-[1300px] mx-auto px-5 md:px-10">
      
      {/* Main Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-20 my-20 items-start">

        {/* Left Section */}
        <div className="space-y-5">
          <img className="w-40" src={assets.logo} alt="logo" />
          <p className="text-gray-600 leading-6 text-sm md:max-w-[80%]">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s.
          </p>
        </div>

        {/* Center Section */}
        <div className="space-y-4 mt-3 ml-15">
          <h3 className="font-semibold text-gray-800">COMPANY</h3>
          <ul className="space-y-3 text-gray-600 text-sm">
            <li>Home</li>
            <li>About us</li>
            <li>Contact us</li>
            <li>Privacy policy</li>
          </ul>
        </div>

        {/* Right Section */}
        <div className="space-y-4 mt-3 ">
          <h3 className="font-semibold text-gray-800">GET IN TOUCH</h3>
          <ul className="space-y-3 text-gray-600 text-sm">
            <li>+1-212-456-7890</li>
            <li>greatstackdev@gmail.com</li>
          </ul>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-200 pt-5 pb-10 text-center text-sm text-gray-500">
        <p>Copyright © 2024 GreatStack - All Rights Reserved.</p>
      </div>

    </div>
  )
}

export default Footer
