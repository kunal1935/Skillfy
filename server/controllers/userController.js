import User from "../models/User.js";
import Stripe from "stripe";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";
export const getUserData = async (req, res) => {
  try {
    const userId = req.auth.userId;

    if (!userId) {
      return res.json({
        success: false,
        message: "User ID is missing or invalid",
      });
    }

    console.log(userId);
    const userData = await User.findById(userId).populate("enrolledCourses");

    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, userData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// User Enrolled courses with lecture link
export const userEnrolledCourses = async (req, res) => {
  try {
    const userId = req.auth.userId;

    if (!userId) {
      return res.json({
        success: false,
        message: "User ID is missing or invalid",
      });
    }

    const userData = await User.findById(userId).populate("enrolledCourses");

    res.json({ success: true, enrolledCourses: userData.enrolledCourses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Purchase Course
export const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    console.log(courseId);
    const  { origin }  = req.headers;
    const userId = req.auth.userId;
    console.log(userId);
    const userData = await User.findById(userId);
    const courseData = await Course.findById(courseId);

    if (!userData || !courseData) {
      return res.json({ success: false, message: "Data not Found" });
    }

    const purchaseData = {
      courseId: courseId,
      userId,
      amount: (
        courseData.coursePrice -
        (courseData.discount * courseData.coursePrice) / 100
      ).toFixed(2),
    };

    const newPurchase = await Purchase.create(purchaseData);
    //Stripe Gateway Initialze
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
    const currency = process.env.CURRENCY.toLowerCase();

    //Creating Line items to for Stripe
    const line_items = [
      {
        price_data: {
          currency,
          product_data: {
            name: courseData.courseTitle,
          },
          unit_amount: Math.floor(newPurchase.amount) * 100,
        },
        quantity: 1,
      },
    ];
    const session = await stripeInstance.checkout.sessions.create({
      success_url: `${origin}/loading/my-enrollment`,
      cancel_url: `${origin}/`, // Fixed template literal syntax
      line_items: line_items,
      mode: "payment",
      metadata: {
        purchaseId: newPurchase._id.toString(),
      },
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Error purchasing course:", error);
    res.json({ success: false, message: error.message });
  }
}

//Update User Course Progress
export const updateUserCourseProgress = async(req,res)=>{
  try{
    const userId = req.auth.userId;
    const{courseId,lectureId} = req.body
    const progressData = await CourseProgress.findOne({userId,courseId})

    if(progressData){
      if(progressData.lectureCompleted.includes(lectureId)){
        return res.json({success:false,message:"Lecture already completed"})
      }

      progressData.lectureCompleted.push(lectureId)
      await progressData.save()
    } else{
      await CourseProgress.create({
        userId,
        courseId,
        lectureCompleted:[lectureId]
      })
    }
    res.json({success:true,message:"Lecture progress updated"})

  }catch(error){
    res.json({ success: false, message: error.message });

  }
}

//Get User Course Progress
export const getUserCourseProgress = async(req,res)=>{
  try{
    const userId = req.auth.userId;
    const courseId = req.body
    const progressData = await CourseProgress.findone({userId,courseId})
    res.json({success:true,progressData})
} catch(error){
    res.json({ success: false, message: error.message });
  }
}
//add user ratings to course

export const addUserRatings = async(req,res)=>{
  const userId= req.auth.userId;
  const{courseId,rating}=req.body;
  if(!courseId || !userId || !rating || rating<1 || rating >5){
    return res.json({success:false,message:"Invalid data"})
  }
  
  try{

    res.json({ success: false, message: error.message });

    if(!course){
      return res.json({success:false,message:"Course not found"});
    }
    const user = await User.findById(userId);

    if(!user || !user.enrolledCourses.includes(courseId)){
      return res.json({success:false,message:"User not enrolled in this course"})
    }
    const existingRatingIndex = course.courseRatings.findIndex(r => r.userId === userId);

  if(existingRatingIndex > -1){
    course.courseRatings[existingRatingIndex].rating = rating;
  } else {
    course.courseRatings.push({userId,rating})
  }
  await course.save();
  return res.json({success:true,message:"Rating added successfully"})
  }  catch (error) {
    res.json({ success: false, message: error.message });
  }
  
}
