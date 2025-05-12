
const bcrypt = require('bcryptjs');
const { readDB, writeDB } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const userModel = {
  // Mendapatkan semua pengguna
  getAllUsers: () => {
    const db = readDB();
    // Return pengguna tanpa password
    return db.users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  },

  // Mendapatkan pengguna berdasarkan ID
  getUserById: (userId) => {
    const db = readDB();
    const user = db.users.find(user => user.id === userId);
    
    if (!user) return null;
    
    // Return pengguna tanpa password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  // Mendapatkan pengguna berdasarkan email
  getUserByEmail: (email) => {
    const db = readDB();
    return db.users.find(user => user.email === email);
  },

  // Membuat pengguna baru
  createUser: async (userData) => {
    const db = readDB();
    
    // Cek email sudah digunakan atau belum
    if (db.users.some(user => user.email === userData.email)) {
      throw new Error('Email already in use');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // Buat pengguna baru
    const newUser = {
      id: uuidv4(),
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: userData.role || 'user',
      universitas: userData.universitas || '',
      bidang: userData.bidang || '',
      photo: userData.photo || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.users.push(newUser);
    writeDB(db);

    // Return pengguna tanpa password
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  // Update pengguna
  updateUser: async (userId, userData) => {
    const db = readDB();
    const userIndex = db.users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const currentUser = db.users[userIndex];
    
    // Update fields
    db.users[userIndex] = {
      ...currentUser,
      name: userData.name !== undefined ? userData.name : currentUser.name,
      universitas: userData.universitas !== undefined ? userData.universitas : currentUser.universitas,
      bidang: userData.bidang !== undefined ? userData.bidang : currentUser.bidang,
      photo: userData.photo !== undefined ? userData.photo : currentUser.photo,
      updatedAt: new Date().toISOString()
    };

    writeDB(db);

    // Return pengguna tanpa password
    const { password, ...userWithoutPassword } = db.users[userIndex];
    return userWithoutPassword;
  },

  // Update password pengguna
  updatePassword: async (userId, currentPassword, newPassword) => {
    const db = readDB();
    const userIndex = db.users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    // Verifikasi password lama
    const isMatch = await bcrypt.compare(currentPassword, db.users[userIndex].password);
    if (!isMatch) {
      throw new Error('Current password is incorrect');
    }

    // Hash password baru
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    db.users[userIndex].password = hashedPassword;
    db.users[userIndex].updatedAt = new Date().toISOString();

    writeDB(db);
    return true;
  },

  // Login user
  loginUser: async (email, password) => {
    const db = readDB();
    const user = db.users.find(user => user.email === email);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    // Record login
    const loginRecord = {
      id: uuidv4(),
      userId: user.id,
      loginTime: new Date().toISOString()
    };

    db.logins.push(loginRecord);
    writeDB(db);

    // Return pengguna tanpa password
    const { password: pwd, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
};

module.exports = userModel;
