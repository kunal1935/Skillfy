import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {AppContext} from "../../context/AppContext.jsx";
import Loading from "../../Components/student/Loading";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import Footer from "../../Components/student/Footer.jsx";
import YouTube from "react-youtube";
import { toast } from "react-toastify";
import axios from "axios";

const CourseDetails = () => {
  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  
  const [playerData, setPlayerData] = useState(null);

  const {
    allCourses,
    calculateRating,
    calculateNoOfLecture,
    calculateCourseDuration,
    calculateChapterTime,
    currency,backendUrl,userData,getToken
  } = useContext(AppContext);

  const fetchCourseData = async () => {
      try{
    const{data} = await axios.get(backendUrl  +'/api/course/'+ id)
    if(data.success){
      setCourseData(data.courseData)
    }else{
      toast.error(data.message)
    }
      } catch(error) {
        toast.error(error.message)
  
    }
  }

  const enrollCourse = async ()=>{
    try{
      if(!userData){
        return toast.warn('Login to Enroll')
      }
       if(isAlreadyEnrolled){
        return toast.warn('Already Enrolled')
       }
       const token = await getToken();
       const {data} = await axios.post('http://localhost:7474/api/user/purchase',
        {courseId: courseData._id},{headers :{Authorization: `Bearer ${token}`}})
        if(data.success){
          const{session_url} = data
          window.location.replace(session_url)
        }else{
          toast.error(data.message)
        }

    }catch(error){
      toast.error(error.message)
    }
  }
  
  useEffect(() => {
    fetchCourseData();
  }, [])

  

  useEffect(() => {
    console.log('userData',userData)
      console.log('courseData',courseData)
    if(userData && courseData){
      const isEnrolled = userData.enrolledCourses.some((course) => course._id === courseData._id);
      setIsAlreadyEnrolled(isEnrolled);
    }
  }, [userData,courseData]);

  const toggleSection = (index) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const extractVideoId = (url) => {
    const urlParts = url.split("?v=");
    return urlParts.length > 1 ? urlParts[1] : url.split("/").pop();
  };

  return courseData ? (
    <>
      <div className="flex flex-col gap-10 relative md:px-36 px-8 md:pt-30 pt-20 min-h-230">
        <div className="absolute top-0 left-0 w-full h-section-height bg-gradient-to-b from-cyan-100/70 pl-20 pt-30">
          <div className="flex flex-col md:flex-row gap-10">
            {/* Left column */}
            <div className="flex-1 max-w-xl z-10 text-gray-500">
              <h3 className="md:text-course-details-heading-large text-course-details-heading-small text-gray-800 font-bold text-3xl">
                {courseData.courseTitle}
              </h3>
              <p
                className="pt-4 md:text-base text-xs"
                dangerouslySetInnerHTML={{
                  __html: courseData.courseDescription.slice(0, 200),
                }}
              ></p>

              {/* Review and rating */}
              <div className="flex items-center space-x-2 pt-3 pb-1 text-sm">
                <p>{calculateRating(courseData)}</p>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <img
                      key={i}
                      src={
                        i < Math.floor(calculateRating(courseData))
                          ? assets.star
                          : assets.star_blank
                      }
                      alt=""
                      className="w-3.5 h-3.5"
                    />
                  ))}
                </div>
                <p className="text-gray-500">
                  {courseData.courseRatings.length}
                </p>
              </div>
              <p className="text-sm">
                Course by{" "}
                <span className="text-blue-600 underline">
                  {courseData.educator && typeof courseData.educator === "object" 
                    ? courseData.educator.name 
                    : courseData.educator || "Unknown Educator"}
                </span>
              </p>
              <div className="pt-8 text-gray-800">
                <h4 className="text-xl font-semibold">Course Structure</h4>
                <div className="pt-5">
                  {courseData.courseContent &&
                    courseData.courseContent.map((chapter, index) => (
                      <div
                        key={index}
                        className="border border-gray-300 bg-white mb-2 rounded"
                      >
                        <div
                          className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
                          onClick={() => toggleSection(index)}
                        >
                          <div className="flex items-center gap-2">
                            <img
                              className={`transform transition-transform ${
                                openSections[index] ? "rotate-180" : ""
                              }`}
                              src={assets.down_arrow_icon}
                              alt="icon"
                            />
                            <p className="font-medium md:text-base text-sm">
                              {chapter.chapterTitle}
                            </p>
                          </div>
                          <p className="text-sm md:text-default">
                            {chapter.chapterContent.length} lectures -{" "}
                            {calculateChapterTime(chapter)}
                          </p>
                        </div>
                        <div
                          className={`overflow-hidden transition-all duration-300 ${
                            openSections[index] ? "max-h-96" : "max-h-0"
                          }`}
                        >
                          <ul className="list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300">
                            {chapter.chapterContent.map((lecture, i) => (
                              <li key={i} className="flex items-start gap-2 py-1">
                                <img
                                  src={assets.play_icon}
                                  alt="Play icon"
                                  className="w-4 h-4 mt-1"
                                />
                                <div className="flex items-center justify-between w-full text-gray-800 text-xs md:text-default">
                                  <p>{lecture.lectureTitle}</p>
                                  <div className="flex gap-2">
                                    {lecture.isPreviewFree && (
                                      <p
                                        onClick={() =>
                                          setPlayerData({
                                            videoId: extractVideoId(lecture.lectureUrl),
                                          })
                                        }
                                        className="text-blue-500 cursor-pointer"
                                      >
                                        Preview
                                      </p>
                                    )}
                                    <p>
                                      {humanizeDuration(
                                        lecture.lectureDuration * 60 * 1000,
                                        { units: ["h", "m"] }
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              <div className="py-5 text-sm md:text-default">
                <h3 className="text-sm font-semibold text-gray-800">
                  Course Description
                </h3>
                <p
                  className="pt-2 text-xs"
                  dangerouslySetInnerHTML={{
                    __html: courseData.courseDescription,
                  }}
                ></p>
              </div>
            </div>
            {/* Right column */}
            <div className=" flex flex-col max-w-course-card z-10 shadow-custom-card rounded-t md:rounded-none overflow-hidden bg-white min-w-[300px] sm:min-w-[420px] h-200">
              {playerData ? (
                <YouTube
                  videoId={playerData.videoId}
                  opts={{
                    playerVars: {
                      autoplay: 1,
                    },
                  }}
                  iframeClassName="w-full aspect-video"
                />
              ) : (
                <img src={courseData.courseThumbnail} alt="" />
              )}

              <div className="p-5">
                <div className="flex items-center gap-2">
                  <img
                    className="w-3.5"
                    src={assets.time_left_clock_icon}
                    alt="time"
                  />

                  <p className="text-red-500">
                    <span className="font-medium">5 days</span> left at this
                    price !
                  </p>
                </div>
                <div className="flex gap-3 items-center pt-2">
                  <p className="text-gray-800 md:text-4xl text-2xl font-semibold">
                    {currency}
                    {(
                      courseData.coursePrice -
                      courseData.discount -
                      courseData.coursePrice / 100
                    ).toFixed(2)}
                  </p>
                  <p className="md:text-lg text-gray-500 line line-through">
                    {currency}
                    {courseData.coursePrice}
                  </p>
                  <p className="md:text-lg text-gray-500">
                    {courseData.discount}% off
                  </p>
                </div>
                <div className="flex items-center text-sm md:text-default gap-4 pt-2 md:pt-4 text-gray-500">
                  <div className="flex items-center gap-1">
                    <img src={assets.star} alt="star icon" />
                    <p>{calculateRating(courseData)}</p>
                  </div>
                  <div className="h-4 w-px bg-gray-500/40"></div>
                  <div className="flex items-center gap-1">
                    <img src={assets.time_clock_icon} alt="clock icon" />
                    <p>{calculateCourseDuration(courseData)}</p>
                  </div>
                  <div className="h-4 w-px bg-gray-500/40"></div>
                  <div className="flex items-center gap-1">
                    <img src={assets.lesson_icon} alt="clock icon" />
                    <p>{calculateNoOfLecture(courseData)} lessons</p>
                  </div>
                </div>
                <button onClick={enrollCourse} className="md:mt-6 mt-4 w-full py-3 rounded bg-blue-600 text-white font-medium">
                  {isAlreadyEnrolled ? "Already Enrolled" : "Enroll Now"}
                </button>
                <div className="pt-6">
                  <p className="md:text-xl text-lg font-medium text-gray-800">
                    What's in the course?
                  </p>
                  <ul className="ml-4 pt-2 text-sm md:text-default list-disc text-gray-500">
                    <li>Lifetime access with free updates.</li>
                    <li>Step by step, hands-on project guidance</li>
                    <li>Downloadable resources and source code</li>
                    <li>Quizzes to test your knowledge</li>
                    <li>Certificate of completion</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  ) : (
    <Loading />
  );
};

export default CourseDetails;
