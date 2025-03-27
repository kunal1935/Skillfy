import { clerkClient } from "@clerk/express";
import { v2 as Cloudinary } from "cloudinary";
import Course from "../models/Course.js";

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