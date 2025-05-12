
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useTasks } from '@/contexts/TaskContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Users, CheckCircle, Clock } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { tasks, getTodayStats } = useTasks();
  const navigate = useNavigate();
  
  const stats = getTodayStats();
  
  // Get login stats
  const getLoginStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const loginRecords = JSON.parse(localStorage.getItem('logins') || '[]');
    
    const todaysLogins = loginRecords.filter(
      (login: any) => login.loginTime.startsWith(today)
    );
    
    // Get unique users who logged in today
    const uniqueUserIds = new Set(todaysLogins.map((login: any) => login.userId));
    
    return {
      count: todaysLogins.length,
      uniqueUsers: uniqueUserIds.size
    };
  };
  
  const loginStats = getLoginStats();
  
  // Group tasks by date for chart
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();
  
  const tasksByDate = tasks.reduce((acc: Record<string, number>, task) => {
    const date = task.uploadDate.split('T')[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});
  
  const chartData = last7Days.map(date => ({
    date: date,
    count: tasksByDate[date] || 0,
    displayDate: new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  }));

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Monitor submission progress and system activity
            </p>
          </div>
          
          <Button 
            onClick={() => navigate('/admin/reports')}
            className="bg-primary-600 hover:bg-primary-700 mt-4 sm:mt-0"
          >
            View Reports
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Users</CardTitle>
              <CardDescription>Registered interns in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-8 w-8 text-primary-500 mr-3" />
                <div>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-sm text-gray-500">registered users</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Today's Submissions</CardTitle>
              <CardDescription>Task submission rate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{stats.submitted}</p>
                    <p className="text-sm text-gray-500">submitted today</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-yellow-500 mr-3" />
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
                    <p className="text-sm text-gray-500">pending</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-primary-600 h-2.5 rounded-full" 
                  style={{ width: `${stats.total > 0 ? (stats.submitted / stats.total * 100) : 0}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                {stats.total > 0 
                  ? `${Math.round(stats.submitted / stats.total * 100)}% completion rate`
                  : '0% completion rate'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Today's Logins</CardTitle>
              <CardDescription>System activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div>
                  <p className="text-3xl font-bold text-gray-900">{loginStats.count}</p>
                  <p className="text-sm text-gray-500">logins today</p>
                </div>
                <div className="ml-auto px-3 py-1 bg-blue-50 rounded text-blue-700 text-sm font-medium">
                  {loginStats.uniqueUsers} unique users
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Submission Activity</CardTitle>
              <CardDescription>Tasks submitted over the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                  >
                    <XAxis 
                      dataKey="displayDate" 
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: '#E5E7EB' }}
                      tickLine={false}
                    />
                    <YAxis 
                      allowDecimals={false}
                      axisLine={{ stroke: '#E5E7EB' }}
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      formatter={(value: any) => [`${value} tasks`, 'Submissions']}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Bar 
                      dataKey="count" 
                      name="Submissions" 
                      fill="#3366FF" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest task submissions</CardDescription>
            </CardHeader>
            <CardContent>
              {tasks.length > 0 ? (
                <div className="space-y-4">
                  {tasks.slice(0, 5).map((task) => {
                    const user = JSON.parse(localStorage.getItem('users') || '[]')
                      .find((u: any) => u.id === task.userId);
                    
                    return (
                      <div key={task.id} className="flex items-center justify-between border-b pb-3">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                            {user?.name?.charAt(0) || '?'}
                          </div>
                          <div className="ml-3">
                            <p className="font-medium">{user?.name || 'Unknown User'}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(task.uploadDate).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {task.files.length} file(s)
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">No recent activity</p>
                </div>
              )}
              
              {tasks.length > 0 && (
                <Button 
                  variant="ghost" 
                  className="w-full mt-4 flex items-center justify-center"
                  onClick={() => navigate('/admin/reports')}
                >
                  View All Activity
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
