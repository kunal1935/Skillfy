import express from 'express';
import {upRoleToEduactor} from '../controllers/educatorController.js';

const router = express.Router();

educatorRouter.get('/update-role',upRoleToEduactor);

export default educatorRouter;
