
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import Layout from '@/components/layout/Layout';
import { useTasks } from '@/contexts/TaskContext';
import { Task } from '@/types';
import { Calendar } from '@/components/ui/calendar';
import { FileCheck } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const TaskHistory: React.FC = () => {
  const { userTasks } = useTasks();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  
  // Group tasks by date
  const tasksByDate = userTasks.reduce((acc: Record<string, Task[]>, task) => {
    const date = task.uploadDate.split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(task);
    return acc;
  }, {});
  
  // Create date highlighting function for calendar
  const dateHasTask = (date: Date): boolean => {
    const dateStr = date.toISOString().split('T')[0];
    return !!tasksByDate[dateStr];
  };
  
  // Get tasks for selected date
  const selectedDateStr = selectedDate ? selectedDate.toISOString().split('T')[0] : '';
  const tasksForSelectedDate = selectedDateStr ? tasksByDate[selectedDateStr] || [] : [];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Task Submission History</h1>
          <p className="text-gray-600 mt-2">
            View your past task submissions by date
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Select Date</CardTitle>
              <CardDescription>Dates with submissions are highlighted</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                modifiers={{ hasTask: dateHasTask }}
                modifiersClassNames={{
                  hasTask: "bg-primary-100 font-bold text-primary-700"
                }}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>
                {selectedDate ? `Tasks for ${selectedDate.toLocaleDateString()}` : 'Tasks'}
              </CardTitle>
              <CardDescription>
                {tasksForSelectedDate.length > 0 
                  ? `${tasksForSelectedDate.length} submission(s) found`
                  : 'No tasks found for selected date'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tasksForSelectedDate.length > 0 ? (
                <div className="space-y-4">
                  {tasksForSelectedDate.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => setViewingTask(task)}>
                      <div className="flex items-center">
                        <FileCheck className="h-5 w-5 text-primary-500 mr-3" />
                        <div>
                          <p className="font-medium">
                            {new Date(task.uploadDate).toLocaleTimeString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            {task.files.length} file(s) submitted
                          </p>
                        </div>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Complete
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileCheck className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-700">No submissions found</h3>
                  <p className="text-gray-500 mt-1">
                    You haven't submitted any tasks on the selected date
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <Dialog open={!!viewingTask} onOpenChange={(open) => !open && setViewingTask(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Task Details</DialogTitle>
              <DialogDescription>
                Submitted on {viewingTask && new Date(viewingTask.uploadDate).toLocaleString()}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              <h4 className="font-medium">Files Submitted</h4>
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

export default TaskHistory;
