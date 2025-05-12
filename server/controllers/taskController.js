
const taskModel = require('../models/taskModel');
const userModel = require('../models/userModel');
const path = require('path');
const fs = require('fs');

// Controller untuk tugas
exports.getAllTasks = (req, res) => {
  try {
    // Admin bisa melihat semua tugas, user hanya bisa melihat tugasnya sendiri
    let tasks;
    
    if (req.user.role === 'admin') {
      tasks = taskModel.getAllTasks();
      
      // Tambahkan info user pada setiap tugas
      tasks = tasks.map(task => {
        const user = userModel.getUserById(task.userId);
        return {
          ...task,
          user: user ? { 
            id: user.id, 
            name: user.name, 
            email: user.email,
            universitas: user.universitas,
            bidang: user.bidang
          } : null
        };
      });
    } else {
      tasks = taskModel.getTasksByUserId(req.user.id);
    }
    
    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Failed to get tasks' });
  }
};

exports.uploadTask = (req, res) => {
  try {
    // Cek jika ada file yang diupload
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    // Dapatkan nama file yang diupload
    const fileNames = req.files.map(file => file.filename);
    
    // Simpan tugas ke database
    const task = taskModel.createTask(req.user.id, fileNames);
    
    res.status(201).json(task);
  } catch (error) {
    console.error('Upload task error:', error);
    res.status(500).json({ message: 'Failed to upload task' });
  }
};

exports.updateTaskStatus = (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;
    
    // Hanya admin yang bisa mengubah status tugas
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can update task status' });
    }

    if (!status || !['submitted', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updatedTask = taskModel.updateTaskStatus(taskId, status);
    res.json(updatedTask);
  } catch (error) {
    console.error('Update task status error:', error);
    res.status(500).json({ message: error.message || 'Failed to update task status' });
  }
};

exports.deleteTask = (req, res) => {
  try {
    const { taskId } = req.params;
    const task = taskModel.getTaskById(taskId);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Admin bisa menghapus tugas apa saja, user hanya bisa menghapus tugasnya sendiri
    if (req.user.role !== 'admin' && task.userId !== req.user.id) {
      return res.status(403).json({ message: 'Permission denied' });
    }

    taskModel.deleteTask(taskId);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: error.message || 'Failed to delete task' });
  }
};

// Menangani download file
exports.downloadFile = (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../uploads', filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.download(filePath);
  } catch (error) {
    console.error('Download file error:', error);
    res.status(500).json({ message: 'Failed to download file' });
  }
};
