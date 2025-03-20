import './App.css'
import { Routes, Route, useMatch } from 'react-router-dom'
import Home from './Pages/student/Home.jsx'
import CourseList from './Pages/student/CourseList.jsx'
import CourseDetails from './Pages/student/CourseDetails.jsx'
import MyEnrollments from './Pages/student/MyEnrollments'
import Player from './Pages/student/Player.jsx'
import Loading from './Components/student/Loading.jsx'
import Educator from './Pages/educator/Educator.jsx'
import Dashboard from './Pages/educator/Dashboard.jsx'
import AddCourse from './Pages/educator/AddCourse.jsx'
import {MyCourses} from './Pages/educator/MyCourses.jsx'
import StudentsEnrolled from './Pages/educator/StudentsEnrolled.jsx'
import Navbar from './Components/student/Navbar.jsx' 
import { use } from 'react'
import "quill/dist/quill.snow.css";


function App() {
  const isEducatorRoute = useMatch('/educator')
  return ( 
    <div className='text default min-h-screen bg-white'>
      {!isEducatorRoute && <Navbar/> }
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses-list" element={<CourseList />} />
          <Route path="/courses-list/:input" element={<CourseList />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/my-enrollments" element={<MyEnrollments />} />
          <Route path="/player/:courseId" element={<Player/>} />
          <Route path="/loading" element={<Loading />} />
          <Route path="/educator" element={<Educator />} />
          <Route path="/educator/dashboard" element={<Dashboard />} /> 
          <Route path="/educator/add-course" element={<AddCourse />} />
          <Route path="/educator/my-course" element={<MyCourses />} />
          <Route path="/educator/student-enrolled" element={<StudentsEnrolled/>} />
        </Routes>
    </div>
  )
}

export default App
