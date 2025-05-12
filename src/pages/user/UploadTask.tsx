
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Layout from '@/components/layout/Layout';
import { useTasks } from '@/contexts/TaskContext';
import { toast } from 'sonner';
import FileUploader from '@/components/FileUploader';

const UploadTask: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { submitTask } = useTasks();
  const navigate = useNavigate();
  
  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (files.length === 0) {
      toast.error('Please select at least one file to upload');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await submitTask(files);
      toast.success('Task submitted successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Task submission failed:', error);
      toast.error('Failed to submit task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Upload Task</h1>
          <p className="text-gray-600 mt-2">
            Upload your daily assignments here. Supported file types: PDF, DOCX, ZIP, JPG, PNG.
          </p>
        </div>
        
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Task Files</h3>
              <p className="text-sm text-gray-500">
                You can upload up to 5 files (max 5MB each). Drag and drop files or click to browse.
              </p>
              
              <FileUploader 
                onFilesSelected={handleFilesSelected} 
                maxFiles={5}
                maxSize={5 * 1024 * 1024} // 5MB
                allowedTypes={[
                  'application/pdf', 
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
                  'application/zip', 
                  'image/jpeg', 
                  'image/png'
                ]}
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/dashboard')}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-primary-600 hover:bg-primary-700"
                disabled={isSubmitting || files.length === 0}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Task'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default UploadTask;
