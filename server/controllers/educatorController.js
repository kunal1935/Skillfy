import { clerkClient } from "@clerk/express";
import { v2 as Cloudinary } from "cloudinary";
import Course from "../models/Course.js";
import { Purchase } from "../models/Purchase.js";

export const updateRoletoEducator = async (req, res) => {
    try {
        const userId = req.auth.userId;
        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: 'educator',
            }
        });

        res.json({ success: true, message: "You can publish a course now" });
    } catch (error) {
        res.json({ success: false, error });
    }
};

// Add New Courses
export const addCourse = async (req, res) => {
    try {
        let { courseData } = req.body; // Use 'let' to allow reassignment if parsing is needed
        console.log(courseData);

        if (!courseData) {
            return res.json({ success: false, message: "Course data not attached" });
        }

        // Parse courseData if it is a string
        if (typeof courseData === "string") {
            courseData = JSON.parse(courseData);
        }

        const imageFile = req.file;
        const educatorId = req.auth.userId;

        if (!imageFile) {
            return res.json({ success: false, message: "Thumbnail not attached" });
        }

        // Add educator ID to course data
        courseData.educator = educatorId;

        // Upload the image to Cloudinary
        const imageUpload = await Cloudinary.uploader.upload(imageFile.path);
        courseData.courseThumbnail = imageUpload.secure_url;

        // Create and save the course
        const newCourse = await Course.create(courseData);

        res.json({ success: true, message: "Course added successfully", data: newCourse });
    } catch (error) {
        console.error("Error adding course:", error);
        res.json({ success: false, message: error.message });
    }
};
//Get Educator Courses 
export const getEducatorCourses = async (req, res) => {
    try{

        const educator = req.auth.userId;
        const courses = await Course.find({educator});
        res.json({success:true,courses})
    } catch (error) {
        res.json({success:false, message:error.message})

    }
}

//Get Educator DashBoard Data

export const getEducatorDashboardData = async (req, res) => {
    try{
        const educator =req.auth.userId;
        const courses = await Course.find({educator});
        const totalCourses = courses.length;

        const courseIds = courses.map(course => course._id);

        //Calculate total earnings from purchases
        const purchase =await Purchase .find({
            courseId:{$in:courseIds},
            status:'completed'
        })

        const totalEarnings = purchase.reduce((sum,purchase)=> sum + purchase.amount,0)
        //collect unique enrolled student IDs with Their course titles 
        const enrolledStudentsData =[];
        for(const course of courses){
            const students =await User.find({
                _id:{$in: course.enrolledStudents}
            },'name imageUrl');

            student.forEach(student =>{
                enrolledStudentsData.push({
                    courseTitle:course.courseTitle ,
                    student
                })
            })
        }

        res.json({success:true,dashboardData :{
            totalEarnings,
            enrolledStudentsData,totalCourses
        }})

    } catch (error) {
        res.json({success:false, message:error.message});

    }
}
//Get Enrolled Students Data with purchase data
export const getEnrolledStudentsData  = async (req, res) => {
    try{
        const educator = req.auth.userId;
        const courses = await Course.find({educator});
        const courseIds = courses.map(course => course._id);

        const purchase = await Purchase.find({
            courseId:{$in:courseIds},
            status:'completed'
        }).populate('userId','name imageUrl').populate('courseId','courseTitle');

        const enrolledStudents= purchase.map(purchase => ({
            student:purchase.userId,
            courseTitle:purchase.courseId.courseTitle,
            purchaseDate:purchase.createdAt
        }));
        res.json({success:true,enrolledStudents})

    }catch(error){
        res.json({success:false, message:error.message})
    }

}