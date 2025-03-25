import express from 'express';
import {upRoleToEduactor} from '../controllers/educatorController.js';

const eduactorrouter = express.Router();

router.get('/update-role',upRoleToEduactor);

export default eduactorrouter;
