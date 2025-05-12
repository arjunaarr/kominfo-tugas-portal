
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, CheckCircle, Upload, Clock, FileCheck } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useTasks } from '@/contexts/TaskContext';

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userTasks } = useTasks();
  
  // Get today's date in ISO format (YYYY-MM-DD)
  const today = new Date().toISOString().split('T')[0];
  
  // Check if user has submitted a task today
  const submittedToday = userTasks.some(task => task.uploadDate.startsWith(today));
  
  // Group tasks by date for analytics
  const tasksByDate = userTasks.reduce((acc: Record<string, number>, task) => {
    const date = task.uploadDate.split('T')[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});
  
  // Get total tasks submitted
  const totalTasks = userTasks.length;
  
  // Get submission streak (consecutive days)
  const calculateStreak = () => {
    if (userTasks.length === 0) return 0;
    
    // Sort tasks by date
    const dates = [...new Set(userTasks.map(task => task.uploadDate.split('T')[0]))].sort();
    
    if (dates.length === 0) return 0;
    
    // Check if today's task is submitted
    const todayIndex = dates.indexOf(today);
    if (todayIndex === -1) return 0;
    
    let streak = 1;
    for (let i = dates.length - 1; i > 0; i--) {
      const currentDate = new Date(dates[i]);
      const prevDate = new Date(dates[i - 1]);
      
      // Calculate difference in days
      const diffTime = currentDate.getTime() - prevDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      
      if (diffDays === 1) streak++;
      else break;
    }
    
    return streak;
  };
  
  const streak = calculateStreak();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
            <p className="text-gray-600 mt-2">
              {submittedToday ? 'You\'ve submitted your task today.' : 'You haven\'t submitted any task today.'}
            </p>
          </div>
          
          <Button 
            onClick={() => navigate('/upload')}
            className="bg-primary-600 hover:bg-primary-700 mt-4 sm:mt-0"
          >
            {submittedToday ? 'Update Today\'s Task' : 'Upload Today\'s Task'}
            <Upload className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Today's Status</CardTitle>
              <CardDescription>Daily task submission</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                {submittedToday ? (
                  <>
                    <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
                    <div>
                      <p className="font-medium text-green-600">Task Submitted</p>
                      <p className="text-sm text-gray-500">Great job!</p>
                    </div>
                  </>
                ) : (
                  <>
                    <Clock className="h-8 w-8 text-yellow-500 mr-3" />
                    <div>
                      <p className="font-medium text-yellow-600">Pending Submission</p>
                      <p className="text-sm text-gray-500">Don't forget to submit today's task</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Submission Streak</CardTitle>
              <CardDescription>Consecutive days with submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-4xl font-bold text-primary-600">{streak}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {streak > 1 ? 'days in a row' : 'day streak'}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Submissions</CardTitle>
              <CardDescription>Overall progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-4xl font-bold text-primary-600">{totalTasks}</p>
                <p className="text-sm text-gray-500 mt-1">tasks submitted</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {userTasks.length > 0 ? (
                <div className="space-y-4">
                  {userTasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="flex items-center justify-between border-b pb-3">
                      <div className="flex items-center">
                        <FileCheck className="h-5 w-5 text-primary-500 mr-3" />
                        <div>
                          <p className="font-medium">{new Date(task.uploadDate).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-500">{task.files.length} file(s) submitted</p>
                        </div>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Complete
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No submission activity yet</p>
                  <Button 
                    onClick={() => navigate('/upload')} 
                    variant="outline" 
                    className="mt-4"
                  >
                    Upload Your First Task
                  </Button>
                </div>
              )}
              
              {userTasks.length > 0 && (
                <Button 
                  variant="ghost" 
                  className="w-full mt-4 flex items-center justify-center"
                  onClick={() => navigate('/history')}
                >
                  View All Activity
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Department Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Your University</h4>
                  <p className="font-medium">{user?.universitas}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Department</h4>
                  <p className="font-medium">{user?.bidang}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Contact Email</h4>
                  <p className="font-medium">{user?.email}</p>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Need Help?</h4>
                  <p className="text-sm text-gray-500 mb-4">
                    If you have any questions about your tasks or internship requirements, please contact your department supervisor.
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/profile')}
                  >
                    Update Your Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default UserDashboard;
