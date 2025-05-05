import User from '../models/User.js';
import cloudinary from '../utils/cloudinary.js';
import jwt from 'jsonwebtoken';
import * as process from 'process';
import bcrypt from 'bcrypt';

// Create a new user (Signup)
const createUser = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ 
      where: { email }
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password before creating user
    const hashedPassword = await bcrypt.hash(password, 8);

    // Create new user
    const newUser = await User.create({ 
      email, 
      password: hashedPassword, 
      firstName, 
      lastName,
      tokens: []
    });

    // Generate token
    const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET);
    
    // Update tokens
    await User.update(
      { tokens: [{ token }] },
      { where: { _id: newUser._id } }
    );

    res.status(201).json({
      user: {
        _id: newUser._id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName
      },
      token,
      message: `Welcome ${newUser.firstName}! Your account has been created successfully.`
    });
  } catch (error) {
    console.error("Error during user creation:", error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check password using bcrypt directly since we're using a custom model
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate token
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        
        // Update tokens array
        const updatedTokens = [...(user.tokens || []), { token }];
        await User.update(
            { tokens: updatedTokens },
            { where: { _id: user._id } }
        );

        // Send response with welcome message and include profilePicture
        res.json({
            user: {
                _id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                profilePicture: user.profilePicture // Include the profile picture URL
            },
            token,
            message: `Welcome back, ${user.firstName}! You have successfully logged in.`
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};

// Logout user
const logoutUser = async (req, res) => {
  try {
    const updatedTokens = (req.user.tokens || []).filter(t => t.token !== req.token);
    await User.update(
      { tokens: updatedTokens },
      { where: { _id: req.user._id } }
    );
    
    res.json({ 
      message: `Goodbye, ${req.user.firstName}! You have been successfully logged out.` 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      select: '-password -tokens' // Exclude sensitive data
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { _id: req.user._id },
      select: '-password -tokens'
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  const { firstName, lastName } = req.body;

  try {
    const updatedUser = await User.update(
      { firstName, lastName },
      { where: { _id: req.user._id } }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get the updated user to include all necessary fields
    const user = await User.findOne({ where: { _id: req.user._id } });

    res.json({
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: user.profilePicture
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

// Upload profile picture
const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Convert the file buffer to base64
    const fileStr = req.file.buffer.toString('base64');
    const fileType = req.file.mimetype;
    const dataUri = `data:${fileType};base64,${fileStr}`;

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(dataUri, {
      folder: 'profile_pictures',
    });

    // Update user's profile picture URL in database
    const updated = await User.update(
      { profilePicture: uploadResponse.secure_url },
      { where: { _id: req.user._id } }
    );

    if (!updated) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile picture uploaded successfully',
      profilePicture: uploadResponse.secure_url
    });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ message: 'Error uploading profile picture' });
  }
};

export {
  createUser,
  loginUser,
  logoutUser,
  getUsers,
  getUserProfile,
  updateUserProfile,
  uploadProfilePicture
};
