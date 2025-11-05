'use client';

import { useState, useCallback } from 'react';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  X,
  Download
} from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'completed' | 'error';
  progress: number;
  recordCount?: number;
}

export function DataUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  };

  const handleFiles = (fileList: File[]) => {
    const newFiles: UploadedFile[] = fileList.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading',
      progress: 0
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach(file => {
      simulateUpload(file.id);
    });
  };

  const simulateUpload = (fileId: string) => {
    const interval = setInterval(() => {
      setFiles(prev => prev.map(file => {
        if (file.id === fileId) {
          const newProgress = Math.min(file.progress + Math.random() * 30, 100);
          
          if (newProgress >= 100) {
            clearInterval(interval);
            return {
              ...file,
              progress: 100,
              status: 'completed',
              recordCount: Math.floor(Math.random() * 5000) + 500
            };
          }
          
          return { ...file, progress: newProgress };
        }
        return file;
      }));
    }, 500);
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const downloadTemplate = () => {
    // In a real app, this would download a CSV template
    const csvContent = `Date,Customer Name,Customer Email,Customer Phone,Amount,Product,Category
2024-01-15,John Smith,john@company.com,+1-555-0123,1250.00,Premium Package,Software
2024-01-16,Sarah Johnson,sarah@business.com,+1-555-0456,850.00,Basic Plan,Subscription
2024-01-17,Mike Davis,mike@startup.io,+1-555-0789,2100.00,Enterprise,Software`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'smb-data-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Data Upload</h2>
        <p className="text-sm text-gray-600">
          Upload your business data to start generating insights and leads
        </p>
      </div>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragOver 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Drop your files here
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          or click to browse your computer
        </p>
        
        <input
          type="file"
          multiple
          accept=".csv,.xlsx,.xls"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="flex items-center justify-center space-x-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Choose Files
          </button>
          <button
            onClick={downloadTemplate}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download Template</span>
          </button>
        </div>
        
        <p className="text-xs text-gray-500 mt-4">
          Supports CSV, Excel files up to 50MB
        </p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Uploaded Files</h3>
          <div className="space-y-3">
            {files.map((file) => (
              <div key={file.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                <FileText className="w-8 h-8 text-blue-600 flex-shrink-0" />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <button
                      onClick={() => removeFile(file.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{formatFileSize(file.size)}</span>
                    {file.recordCount && (
                      <span>{file.recordCount.toLocaleString()} records</span>
                    )}
                  </div>
                  
                  {/* Progress Bar */}
                  {file.status === 'uploading' && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Uploading...</span>
                        <span>{Math.round(file.progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${file.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Status Icon */}
                <div className="flex-shrink-0">
                  {file.status === 'completed' && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                  {file.status === 'error' && (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Data Requirements */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Data Requirements</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Sales Data:</strong> Date, Amount, Customer Name (Email/Phone optional)</li>
          <li>• <strong>Customer Data:</strong> Names, Contact info, Purchase history</li>
          <li>• <strong>Invoice Data:</strong> Issue dates, Due dates, Payment status</li>
          <li>• <strong>Product Data:</strong> Product names, Categories, Sales amounts</li>
        </ul>
      </div>
    </div>
  );
}