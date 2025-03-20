import React from 'react';
import { Hero } from '../../Components/student/Hero';
import { Companies } from '../../Components/student/Companies';
import { CourseSection } from '../../Components/student/CourseSection';
import { TestimonialSection } from '../../Components/student/TestimonialSection';
import { CallToAction } from '../../Components/student/CallToAction';
import Footer from '../../Components/student/Footer';


const Home = () => {
  return (
    <div className='flex flex-col items-center space-y-7 text-center'>
      <Hero />
      <Companies />
      <CourseSection />
      <TestimonialSection />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Home;