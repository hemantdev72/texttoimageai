import express from 'express';
import {imageGenetator} from '../controllers/imageController.js'
import { auth } from '../middleware/auth.js';

const router=express.Router();

router.post('/generate-image',auth,imageGenetator);

export default router