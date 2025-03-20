import React from 'react';
import { assets } from '../../assets/assets';

const Footer = () => {
  return (
    <footer className='flex-col bg-blue-400 md:px-36 text-left w-full mt-10 h-full'>
      <div className='flex flex-col md:flex-row items-start px-8 md:px-0 justify-center gap-10 md:gap-32 py-10 border-b border-white/30'>
        <div className='flex flex-col md:items-start items-center w-full'>
          <img className='h-20' src='/src/assets/Skillfy_logo-removebg-preview.png' alt="logo" />
          <p className='mt-6 text-center md:text-left text-sm text-white/80'>
            Skillfy is a platform designed to help people develop their skills and build their careers. We provide a variety of resources, courses, and opportunities to help you grow professionally and achieve your goals.
          </p>
        </div>
        <div className='flex flex-col md:items-start items-center w-full'>
          <h4 className='font-semibold text-white'>Company</h4>
          <ul className='flex md:flex-col w-full justify-between text-sm text-white/80 md:space-y-2'>
            <li><a href='#'>Home</a></li>
            <li><a href='#'>About us</a></li>
            <li><a href='#'>Contact us</a></li>
            <li><a href='#'>Privacy policy</a></li>
          </ul>
        </div>
        <div className='hidden md:flex flex-col items-start w-full'>
          <h3 className='font-semibold text-white mb-5'>Subscribe to our newsletter</h3>
          <p className='text-sm text-white/80'>The latest news, articles, and resources, sent to your inbox weekly.</p>
          <div className='flex items-center gap-2 pt-4'>
            <input type='text' placeholder='Enter your email' className='border border-gray-800 bg-blue-400 text-gray-500 placeholder-gray-800 outline-none w-64 h-9 rounded px-2 text-sm' />
            <button className='bg-blue-600 w-24 h-9 text-white rounded'>Subscribe</button>
          </div>
        </div>
      </div>
      <p className='py-4 text-center text-xs md:text-sm text-white/60'>
        &copy; 2022 Skillfy. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;

