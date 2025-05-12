
const userModel = require('../models/userModel');
const { createToken } = require('../config/auth');
const path = require('path');
const fs = require('fs');

// Controller untuk autentikasi
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await userModel.loginUser(email, password);
    const token = createToken(user);

    res.json({
      user,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ message: error.message || 'Invalid credentials' });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, universitas, bidang } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const user = await userModel.createUser({
      name,
      email,
      password,
      universitas,
      bidang
    });

    const token = createToken(user);

    res.status(201).json({
      user,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ message: error.message || 'Registration failed' });
  }
};

exports.getProfile = (req, res) => {
  try {
    const userId = req.user.id;
    const user = userModel.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Failed to get profile' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, universitas, bidang } = req.body;
    
    // Handle photo if uploaded
    let photo = undefined;
    if (req.file) {
      photo = req.file.filename;
      
      // Remove old photo if exists
      const currentUser = userModel.getUserById(userId);
      if (currentUser && currentUser.photo) {
        const oldPhotoPath = path.join(__dirname, '../uploads', currentUser.photo);
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath);
        }
      }
    }

    const updatedUser = await userModel.updateUser(userId, {
      name,
      universitas,
      bidang,
      photo
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: error.message || 'Failed to update profile' });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    await userModel.updatePassword(userId, currentPassword, newPassword);
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(400).json({ message: error.message || 'Failed to update password' });
  }
};
