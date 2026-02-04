import express from 'express';
import { signin, signup,forgotPassword,resetPassword, dashboard, changePassword, updateUser, refresh, logout } from '../controllers/userController.js';
import { authenticate } from '../middlewares/userMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin',signin)
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/dashboard',authenticate,dashboard)
router.post('/dashboard/change-password',authenticate,changePassword)
router.post('/edit-profile',authenticate,updateUser)
router.post('/refresh',refresh)
router.post('/logout',authenticate,logout)
export default router