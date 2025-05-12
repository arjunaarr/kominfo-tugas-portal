
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Layout from '@/components/layout/Layout';
import { useTasks } from '@/contexts/TaskContext';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Task, User } from '@/types';
import { Search, Download, FileCheck, X } from 'lucide-react';
import { toast } from 'sonner';

const AdminReports: React.FC = () => {
  const { tasks, getTasksByDate } = useTasks();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  
  // Load users
  useEffect(() => {
    const loadedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(loadedUsers.filter((user: User) => user.role === 'user'));
  }, []);
  
  // Get tasks for selected date
  const selectedDateStr = selectedDate.toISOString().split('T')[0];
  const tasksForDate = getTasksByDate(selectedDateStr);
  
  // Create map of user IDs to tasks
  const userTaskMap = new Map<string, Task>();
  tasksForDate.forEach(task => {
    userTaskMap.set(task.userId, task);
  });
  
  // Filter users by search query
  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.universitas.toLowerCase().includes(searchLower) ||
      user.bidang.toLowerCase().includes(searchLower)
    );
  });
  
  // Export to Excel (simulation)
  const handleExport = () => {
    toast.success(`Report for ${selectedDate.toLocaleDateString()} exported to Excel`);
    console.log("Export data:", {
      date: selectedDateStr,
      users: filteredUsers.map(user => ({
        name: user.name,
        email: user.email,
        universitas: user.universitas,
        bidang: user.bidang,
        status: userTaskMap.has(user.id) ? 'Submitted' : 'Not Submitted',
        uploadTime: userTaskMap.get(user.id)?.uploadDate || '-',
        fileCount: userTaskMap.get(user.id)?.files.length || 0
      }))
    });
  };
  
  const viewUserTask = (user: User) => {
    const task = userTaskMap.get(user.id);
    setViewingUser(user);
    setViewingTask(task || null);
  };
  
  // Group tasks by date for calendar
  const tasksByDate = tasks.reduce((acc: Record<string, number>, task) => {
    const date = task.uploadDate.split('T')[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});
  
  // Create date highlighting function for calendar
  const dateHasTask = (date: Date): boolean => {
    const dateStr = date.toISOString().split('T')[0];
    return !!tasksByDate[dateStr];
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Submission Reports</h1>
            <p className="text-gray-600 mt-2">
              View and export task submission reports by date
            </p>
          </div>
          
          <Button 
            onClick={handleExport}
            className="bg-primary-600 hover:bg-primary-700 mt-4 sm:mt-0"
          >
            Export to Excel
            <Download className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card className="p-4">
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Select Date</h3>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  modifiers={{ hasTask: dateHasTask }}
                  modifiersClassNames={{
                    hasTask: "bg-primary-100 font-bold text-primary-700"
                  }}
                  className="rounded-md border"
                />
                
                <div className="pt-4 border-t">
                  <h3 className="font-medium text-lg mb-2">Report Details</h3>
                  <dl className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Selected date:</dt>
                      <dd>{selectedDate.toLocaleDateString()}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Total users:</dt>
                      <dd>{users.length}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Submissions:</dt>
                      <dd>{tasksForDate.length}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Missing:</dt>
                      <dd>{users.length - tasksForDate.length}</dd>
                    </div>
                  </dl>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -mt-2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>
          
          <div className="lg:col-span-3">
            <Card>
              <div className="p-2">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>University</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => {
                        const hasSubmitted = userTaskMap.has(user.id);
                        return (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium flex items-center">
                              <div className="w-8 h-8 rounded-full bg-gray-100 mr-2 flex items-center justify-center overflow-hidden">
                                {user.photo ? (
                                  <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-sm font-medium">{user.name.charAt(0)}</span>
                                )}
                              </div>
                              <span>{user.name}</span>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell className="max-w-[150px] truncate" title={user.universitas}>
                              {user.universitas}
                            </TableCell>
                            <TableCell className="max-w-[150px] truncate" title={user.bidang}>
                              {user.bidang}
                            </TableCell>
                            <TableCell>
                              {hasSubmitted ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <FileCheck className="mr-1 h-3 w-3" />
                                  Submitted
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  <X className="mr-1 h-3 w-3" />
                                  Not Submitted
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => viewUserTask(user)}
                                disabled={!hasSubmitted}
                                title={hasSubmitted ? 'View Submission' : 'No submission available'}
                              >
                                View Files
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      
                      {filteredUsers.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            No results found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </Card>
          </div>
        </div>
        
        <Dialog open={!!viewingTask} onOpenChange={(open) => !open && setViewingTask(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {viewingUser?.name}'s Submission
              </DialogTitle>
              <DialogDescription>
                Submitted on {viewingTask && new Date(viewingTask.uploadDate).toLocaleString()}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Email:</span>
                  <p>{viewingUser?.email}</p>
                </div>
                <div>
                  <span className="text-gray-500">University:</span>
                  <p>{viewingUser?.universitas}</p>
                </div>
                <div>
                  <span className="text-gray-500">Department:</span>
                  <p>{viewingUser?.bidang}</p>
                </div>
                <div>
                  <span className="text-gray-500">Files Submitted:</span>
                  <p>{viewingTask?.files.length} file(s)</p>
                </div>
              </div>
              
              <h4 className="font-medium mt-4">Files</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {viewingTask?.files.map((fileUrl, index) => {
                  const isImage = fileUrl.match(/\.(jpeg|jpg|gif|png)$/);
                  
                  return (
                    <div key={index} className="border rounded-md overflow-hidden">
                      {isImage ? (
                        <img 
                          src={fileUrl} 
                          alt={`File ${index + 1}`} 
                          className="w-full h-32 object-cover"
                        />
                      ) : (
                        <div className="h-32 flex items-center justify-center bg-gray-50">
                          <div className="text-center">
                            <p className="text-xs uppercase text-gray-500 font-medium">
                              {fileUrl.split('/').pop()?.split('.').pop() || 'File'}
                            </p>
                            <p className="text-sm font-medium mt-1">File {index + 1}</p>
                          </div>
                        </div>
                      )}
                      <div className="p-2 bg-white border-t">
                        <a 
                          href={fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-sm text-primary-600 hover:underline"
                        >
                          View File {index + 1}
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default AdminReports;
