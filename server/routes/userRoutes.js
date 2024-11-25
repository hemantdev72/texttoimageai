import express from 'express';
import { login, register,userCredit } from '../controllers/userController.js';
 import { auth } from '../middleware/auth.js';
const router=express.Router();


router.post("/register",register);
router.post('/login',login);
router.get('/credit',auth,userCredit);


export default router;