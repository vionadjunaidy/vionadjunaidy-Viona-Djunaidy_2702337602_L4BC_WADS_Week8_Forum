import express from 'express';
import auth from '../middleware/auth.js';
import multer from 'multer';
import {
  loginUser as login,
  createUser as signup,
  logoutUser,
  getUserProfile as profile,
  updateUserProfile as updateProfile,
  uploadProfilePicture
} from '../controllers/userController.js';

const router = express.Router();


// Configure multer for handling file uploads
const upload = multer({
  limits: {
    fileSize: 1000000 // 1MB limit
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload an image file (jpg, jpeg, or png)'));
    }
    cb(undefined, true);
  }
});

// Auth routes
router.post('/login', login);
router.post('/signup', signup);

// Protected routes
router.post('/logout', auth, logoutUser);
router.get('/profile', auth, profile);
router.patch('/profile', auth, updateProfile);
router.post('/profile/upload', auth, upload.single('profilePicture'), uploadProfilePicture);

export default router;