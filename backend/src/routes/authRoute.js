import express from 'express';
import {signIn, signOut, refreshToken } from '../controllers/authController.js';

const router = express.Router();

// Define the signin route
router.post('/signin', signIn);
// Define the signout route 
router.post('/signout', signOut);
// Refresh token route
router.post('/refresh', refreshToken);


export default router;