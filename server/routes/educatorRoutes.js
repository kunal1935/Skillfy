import express from 'express';
import { addCourse,getEducatorCourses,updateRoletoEducator, getEducatorDashboardData, getEnrolledStudentsData,  } from '../controllers/educatorController.js';
import { protectEducator } from '../middlewares/authMiddleware.js';
import upload from '../configs/multer.js';

const educatorRouter = express.Router()

//add rducator Role
educatorRouter.get('/update-role',updateRoletoEducator)
educatorRouter.post('/add-course',upload.single('image'),protectEducator,addCourse)
educatorRouter.get('/courses',protectEducator,getEducatorCourses )
educatorRouter.get('/dashboard',protectEducator, getEducatorDashboardData);
educatorRouter.get('/enrolled-students',protectEducator, getEnrolledStudentsData);
export default educatorRouter;