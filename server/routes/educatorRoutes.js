import express from 'express';
import { addCourse,updateRoletoEducator } from '../controllers/educatorController.js';
import { protectEducator } from '../middlewares/authMiddleware.js';
import upload from '../configs/multer.js';

const educatorRouter = express.Router()

//add rducator Role
educatorRouter.get('/update-role',updateRoletoEducator)
educatorRouter.post('/add-course',upload.single('image'),protectEducator,addCourse)

export default educatorRouter;