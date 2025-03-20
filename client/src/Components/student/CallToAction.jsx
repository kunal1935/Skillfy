import React from 'react'
import { assets } from '../../assets/assets'

 export const CallToAction = () => {
  return (
    <div className='flex flex-col items-center gap-4 pt-10 pb-24 px-8 md:px-0'>
      <h5 className='text-xl md:text-3xl text-gray-800 font-semibold'>Learn anything,anytime,anywhere</h5>
      <p className='text-gray-500 sm:text-sm'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iste consequatur officia ex? Consectetur in tenetur sit esse voluptatem, praesentium numquam modi a quis eos error?
      </p>
      <div className='flex items-center font-medium gap-6 mt-4' >
        <button className='px-10 py-3 rounded-md text-white bg-blue-600'>Get started</button>
        <button className='flex items-center gap-2'>Learn more <img src={assets.arrow_icon} alt="arrow_icon" /></button>
      </div>
    </div>
  )
}

