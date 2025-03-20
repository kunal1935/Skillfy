import React, { useContext } from 'react'
import { assets } from '../../assets/assets.js'
import { AppContext } from '../../context/AppContext'
import { Link } from 'react-router-dom'

 export const CourseCard = ({course}) => {
  const{currency,calculateRating}=useContext(AppContext)

  return (
    <Link to={'/courses/'+ course._id} onClick={()=> scrollTo(0,0,)} 
    className='border border-amber-500/30 pb-6 overflow-hidden rounded-lg'>
      <img className='w-full'  src={course.courseThumbnail} alt="" />
      <div className='p-3 text-left'>
        <h5 className=' font-semibold text-sm'>{course.courseTitle}</h5>
        <p className='text-gray-500'>{course.educator.name}</p>
        <div className='flex items-center space-x-2  '>
          <p>
            {calculateRating(course)}
          </p>
          <div className='flex'>
            {[...Array(5)].map((_,i)=>(<img key= {i} src={i< Math.floor(calculateRating(course)) ? assets.star:assets.star_blank}  alt=''
            className='w-3.5 h-3.5'/>
            ))}
          </div>
          <p className='text-gray-500'>
            {course.courseRatings.length}
          </p>
        </div>
        <p className='text-base font-semibold text-gray-800'>{currency}
          {(course.coursePrice-course.discount * course.coursePrice/100).toFixed(2)}
        </p>
      </div>
    </Link>
  )
}

