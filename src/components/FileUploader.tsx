
import React, { useState, useCallback } from 'react';
import { FileWithPreview } from '@/types';
import { toast } from 'sonner';
import { Upload, X } from 'lucide-react';

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
  allowedTypes?: string[];
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFilesSelected,
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB
  allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip', 'image/jpeg', 'image/png']
}) => {
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList) {
      validateAndAddFiles(Array.from(fileList));
    }
  };

  const validateAndAddFiles = (newFiles: File[]) => {
    if (selectedFiles.length + newFiles.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const validFiles: FileWithPreview[] = [];
    const errors: string[] = [];

    newFiles.forEach(file => {
      // Check file size
      if (file.size > maxSize) {
        errors.push(`${file.name}: File size exceeds ${maxSize / (1024 * 1024)}MB limit`);
        return;
      }

      // Check file type
      if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
        errors.push(`${file.name}: File type not supported`);
        return;
      }

      // Create preview for image files
      const preview = file.type.startsWith('image/') ? URL.createObjectURL(file) : '';
      validFiles.push({ file, preview });
    });

    // Show errors if any
    errors.forEach(error => toast.error(error));

    // Update state with valid files
    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
      onFilesSelected([...selectedFiles.map(f => f.file), ...validFiles.map(f => f.file)]);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files) {
      validateAndAddFiles(Array.from(e.dataTransfer.files));
    }
  }, [selectedFiles.length]);

  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles];
    
    // Revoke the object URL to avoid memory leaks
    if (newFiles[index].preview) {
      URL.revokeObjectURL(newFiles[index].preview);
    }
    
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
    onFilesSelected(newFiles.map(f => f.file));
  };

  return (
    <div className="space-y-4">
      <div 
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm font-medium text-gray-700">
          Drag & drop files here, or click to select files
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Supports PDF, DOCX, ZIP, JPG, PNG up to 5MB
        </p>
        <p className="text-xs text-gray-500">
          Maximum {maxFiles} files
        </p>
        <input
          id="file-input"
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
          accept={allowedTypes.join(',')}
        />
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Files ({selectedFiles.length}/{maxFiles})</h4>
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white border rounded-md">
                <div className="flex items-center space-x-3">
                  {file.preview ? (
                    <img src={file.preview} alt={file.file.name} className="h-12 w-12 object-cover rounded" />
                  ) : (
                    <div className="h-12 w-12 bg-gray-100 flex items-center justify-center rounded">
                      <span className="text-xs text-gray-500 uppercase">{file.file.name.split('.').pop()}</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file.file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-gray-400 hover:text-red-500 focus:outline-none"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
