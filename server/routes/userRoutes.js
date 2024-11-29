import express from 'express';
import { login, register,userCredit } from '../controllers/userController.js';
 import { auth } from '../middleware/auth.js';
 import { razorpayPayment ,verifyRazorpay} from '../controllers/userController.js';
const router=express.Router();


router.post("/register",register);
router.post('/login',login);
router.get('/credit',auth,userCredit);
router.post('/razor-pay',auth,razorpayPayment);
router.post('/verify-pay',verifyRazorpay);


export default router;