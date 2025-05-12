
const { readDB, writeDB } = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const taskModel = {
  // Mendapatkan semua tugas
  getAllTasks: () => {
    const db = readDB();
    return db.tasks;
  },

  // Mendapatkan tugas berdasarkan ID
  getTaskById: (taskId) => {
    const db = readDB();
    return db.tasks.find(task => task.id === taskId);
  },

  // Mendapatkan tugas berdasarkan ID pengguna
  getTasksByUserId: (userId) => {
    const db = readDB();
    return db.tasks.filter(task => task.userId === userId);
  },

  // Membuat tugas baru
  createTask: (userId, fileNames) => {
    const db = readDB();
    
    const newTask = {
      id: uuidv4(),
      userId: userId,
      files: fileNames,
      uploadDate: new Date().toISOString(),
      status: 'submitted',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.tasks.push(newTask);
    writeDB(db);
    return newTask;
  },

  // Update status tugas
  updateTaskStatus: (taskId, status) => {
    const db = readDB();
    const taskIndex = db.tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }

    db.tasks[taskIndex].status = status;
    db.tasks[taskIndex].updatedAt = new Date().toISOString();

    writeDB(db);
    return db.tasks[taskIndex];
  },

  // Hapus tugas
  deleteTask: (taskId) => {
    const db = readDB();
    const taskIndex = db.tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }

    // Hapus file terkait
    const task = db.tasks[taskIndex];
    task.files.forEach(fileName => {
      const filePath = path.join(__dirname, '../uploads', fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    // Hapus tugas dari database
    db.tasks.splice(taskIndex, 1);
    writeDB(db);
    return true;
  }
};

module.exports = taskModel;
