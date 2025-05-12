
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, User } from '@/types';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

interface TaskContextType {
  tasks: Task[];
  userTasks: Task[];
  todayTasks: Task[];
  submitTask: (files: File[]) => Promise<void>;
  getTodayStats: () => { submitted: number; pending: number; total: number };
  getTasksByDate: (date: string) => Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { user } = useAuth();

  // Initialize or load tasks from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (error) {
        console.error('Failed to parse tasks:', error);
        setTasks([]);
      }
    }
  }, []);

  // Get tasks for current user
  const userTasks = user ? tasks.filter(task => task.userId === user.id) : [];

  // Get today's tasks
  const todayTasks = tasks.filter(task => {
    const today = new Date().toISOString().split('T')[0];
    return task.uploadDate.startsWith(today);
  });

  // Submit a new task
  const submitTask = async (files: File[]) => {
    if (!user) {
      toast.error("You must be logged in to submit tasks");
      return;
    }

    // For demo: Convert files to urls (in a real app, we'd upload these)
    const fileUrls = files.map(file => URL.createObjectURL(file));

    const newTask: Task = {
      id: Date.now().toString(),
      userId: user.id,
      files: fileUrls,
      uploadDate: new Date().toISOString(),
      status: 'submitted',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    toast.success('Task submitted successfully!');
    
    // In a real app, this is where we would send an email notification
    console.log('Email notification sent to user:', user.email);
  };

  // Get statistics for today's tasks
  const getTodayStats = () => {
    // Get all users
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const total = allUsers.filter((u: User) => u.role === 'user').length;
    
    // Get today's submissions
    const today = new Date().toISOString().split('T')[0];
    const todayTasks = tasks.filter(task => task.uploadDate.startsWith(today));
    
    // Count submitted tasks for unique users
    const submittedUserIds = new Set(todayTasks.map(task => task.userId));
    
    return {
      submitted: submittedUserIds.size,
      pending: total - submittedUserIds.size,
      total
    };
  };

  // Get tasks for a specific date
  const getTasksByDate = (date: string) => {
    return tasks.filter(task => task.uploadDate.startsWith(date));
  };

  return (
    <TaskContext.Provider value={{ 
      tasks, 
      userTasks, 
      todayTasks, 
      submitTask, 
      getTodayStats,
      getTasksByDate
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
