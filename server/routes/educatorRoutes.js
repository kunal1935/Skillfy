import express from 'express';
import {upRoleToEduactor} from '../controllers/educatorController.js';

const router = express.Router();

router.get('/update-role',upRoleToEduactor);

export default router;
