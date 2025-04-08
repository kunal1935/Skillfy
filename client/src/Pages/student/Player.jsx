import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useParams } from "react-router-dom";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import YouTube from 'react-youtube';
import Footer from "../../Components/student/Footer"; // Ensure this is the default export
import { Rating } from "../../Components/student/Rating";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../../Components/student/Loading";

const Player = () => {
  const { enrolledCourses, calculateChapterTime,backendUrl,getToken,userData,fetchUserEnrolledCourses} = useContext(AppContext);
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [playerData, setPlayerData] = useState(null);
  
  const [videoError, setVideoError] = useState(false);
  const [progressData,setProgressData] = useState(null);
  const [initialRating,setInitialRating] = useState(null);
  
  const getCourseData = () => {
    enrolledCourses.map((course)=>{

      if(course._id === courseId){
        setCourseData(course);
        course.courseRatings.map((item)=>{
            setInitialRating(item.rating)
        })
      }
    })
  };

  const toggleSection = (index) => {
    setOpenSections((prev) => (
      { ...prev, [index]: !prev[index] }
    ));
  };

  useEffect(() => {
    if(enrolledCourses.length > 0){
      getCourseData();
    }
    getCourseData();
  }, [enrolledCourses, courseId]);
  
  const markLectureAsCompleted = async (lectureId)=>{
    console.log("Marking lecture as completed:", lectureId); // Debugging

    const userId = userData._id;
    try{
      const token = await getToken()
      const {data} =await axios.post(backendUrl +'/api/user/update-course-progress',{courseId,lectureId, userId},{headers :{Authorization:`Bearer $ {token}`}})
    if(data.success){
      toast.success(data.message)
      getCourseProgress()
    }else{
      toast.error(data.message)
    }
    } catch(error){
      toast.error(error.message)

    }
  }
  const getCourseProgress = async ()=>{

    try{
      const token =await getToken()
      const{data} = await axios.post(backendUrl + '/api/user/get-course-progress',{courseId}, {headers:{Authorization:`Bearer ${token}`}})
      if (data.success){
        console.log("Fetched progress data:", data.progressData); // Debugging
        setProgressData(data.progressData)
      }else{
        toast.error(data.message)
      }
    } catch(error){
      toast.error(error.message)
    }
  }

  const handleRate = async (Ratings)=>{
    try{
      const token = await getToken()
      const {data} = await axios.post(backendUrl + '/api/user/add-user-ratings',{courseId, rating},
      {headers:{Authorization:`Bearer ${token}`}})
    if(data.success){
      toast.success(data.message)
      fetchUserEnrolledCourses()
    }else{
      toast.error(data.message)
    }
    }catch(error){
      toast.error(error.message)
    }
  }
  useEffect(()=>{
  getCourseProgress()
  },[])
  const extractVideoId = (url) => {
    const urlParts = url.split('?v=');
    return urlParts.length > 1 ? urlParts[1] : url.split('/').pop();
  };

  const handleVideoError = () => {
    setVideoError(true);
  };

  return  courseData ? (
    <>
      <div className="p-4 sm:p-10 flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36">
        {/* Left column */}
        <div className="text-gray-800">
          <h3 className="text-xl font-semibold">Course Structure</h3>
          <div className="pt-5">
            {courseData && courseData.courseContent.map((chapter, index) => (
              <div key={index} className="border border-gray-300 bg-white mb-2 rounded">
                <div className="flex items-center justify-between px-4 py-3 cursor-pointer select-none" onClick={() => toggleSection(index)}>
                  <div className="flex items-center gap-2">
                    <img className={`transform transition-transform ${openSections[index] ? "rotate-180" : ""}`} src={assets.down_arrow_icon} alt="icon" />
                    <p className="font-medium md:text-base text-sm">{chapter.chapterTitle}</p>
                  </div>
                  <p className="text-sm md:text-default">
                    {chapter.chapterContent.length} lectures - {calculateChapterTime(chapter)}
                  </p>
                </div>
                <div className={`overflow-hidden transition-all duration-300 ${openSections[index] ? "max-h-96" : "max-h-0"}`}>
                  <ul className="list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300">
                    {chapter.chapterContent.map((lecture, i) => (
                      <li key={i} className="flex items-start gap-2 py-1">
                        <img
                          src={
                            progressData && progressData.lecturCompleted && progressData.lecturCompleted.includes(String(lecture.lectureId)) // Ensure type consistency
                              ? assets.blue_tick_icon
                              : assets.play_icon
                          }
                          alt="Play icon"
                          className="w-4 h-4 mt-1"
                        />
                        <div className="flex items-center justify-between w-full text-gray-800 text-xs md:text-default">
                          <p>{lecture.lectureTitle}</p>
                          <div className="flex gap-2">
                            {lecture.lectureUrl && (
                              <p onClick={() => { setPlayerData({ videoId: extractVideoId(lecture.lectureUrl), chapter: index + 1, lecture: i + 1, lectureTitle: lecture.lectureTitle, lectureId: lecture.lectureId }); setVideoError(false); }} className="text-blue-500 cursor-pointer">
                                Watch
                              </p>
                            )}
                            <p>{humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ["h", "m"] })}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        <div className="flex items-center gap-2 py-3 mt-10">
        <h3 className="text-sm font-semibold text-gray-800 ">
          Rate this course :
         </h3>
         <Rating initialRating={initialRating} onRate={handleRate} />
        </div>

        </div>

        {/* Right column */}
        <div className="md:mt-10">
          {playerData ? (
            <div>
               <YouTube videoId={playerData.videoId} opts={{ playerVars: { autoplay: 1 } }} iframeClassName="w-full aspect-video" onError={handleVideoError} />
              {videoError && <div className="text-red-500 text-center mt-2">This video is unavailable</div>}
              <div className="flex justify-between items-center mt-1">
                <p>{playerData.chapter}.{playerData.lecture} {playerData.lectureTitle}</p>
                <button
                  onClick={() => {
                    if (!(progressData && progressData.lecturCompleted && progressData.lecturCompleted.includes(String(playerData.lectureId)))) {
                      markLectureAsCompleted(playerData.lectureId);
                    }
                  }}
                  className={`text-blue-500 ${progressData && progressData.lecturCompleted && progressData.lecturCompleted.includes(String(playerData.lectureId)) ? "cursor-default" : ""}`}
                  disabled={progressData && progressData.lecturCompleted && progressData.lecturCompleted.includes(String(playerData.lectureId))}
                >
                  {progressData && progressData.lectureCompleted && progressData.lectureCompleted.includes(String(playerData.lectureId))
                    ? "Completed"
                    : "Mark as completed"}
                </button>
              </div>
            </div>
          ) : 
            <img className="h-60"  src={courseData ? courseData.courseThumbnail : ""} alt="" />
          }
        </div>
      </div>
      <Footer />
    </>
  ) : (<Loading/>)
};

export default Player;
