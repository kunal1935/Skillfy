import React, { useState } from 'react';
import Sidebar from '../../Components/educator/Sidebar';
import Navbar from '../../Components/educator/Navbar';
import Footer from '../../Components/educator/Footer'; // Ensure Footer is correctly imported
import Dashboard from './Dashboard';
import { MyCourses } from './MyCourses';
import StudentsEnrolled from './StudentsEnrolled';
import AddCourse from './AddCourse';

const Educator = () => {
  const [currentView, setCurrentView] = useState('Dashboard'); const renderContent = () => {
    switch (currentView) {
      case 'Add Course':
        return <div><AddCourse/></div>;
      case 'My Courses':
        return <div><MyCourses/></div>;
      case 'Students Enrolled':
        return <div><StudentsEnrolled/></div>;
      default:
        return <div><Dashboard/></div>;
    }
  };

  return (
    <div className='text-default min-h-screen bg-white'>
      <Navbar />
      <div className='flex'>
        <Sidebar setCurrentView={setCurrentView} currentView={currentView} />
        <div className='flex-1 p-4'>
          {renderContent()}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Educator;

