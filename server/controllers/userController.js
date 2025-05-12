
const userModel = require('../models/userModel');

exports.getAllUsers = (req, res) => {
  try {
    // Hanya admin yang bisa melihat semua pengguna
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin privileges required' });
    }
    
    const users = userModel.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Failed to get users' });
  }
};

exports.getUserById = (req, res) => {
  try {
    const { userId } = req.params;
    
    // Admin bisa melihat data semua pengguna, user hanya bisa melihat datanya sendiri
    if (req.user.role !== 'admin' && req.user.id !== userId) {
      return res.status(403).json({ message: 'Permission denied' });
    }
    
    const user = userModel.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Failed to get user' });
  }
};
