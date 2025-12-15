import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Files } from 'lucide-react';

interface DropZoneProps {
  onFilesSelect: (files: File[]) => void;
}

const DropZone: React.FC<DropZoneProps> = ({ onFilesSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const validFiles: File[] = [];
      Array.from(e.dataTransfer.files).forEach(file => {
        if (file.type.startsWith('image/')) {
          validFiles.push(file);
        }
      });
      
      if (validFiles.length > 0) {
        onFilesSelect(validFiles);
      } else {
        alert('Vui lòng chỉ tải lên file ảnh!');
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      onFilesSelect(filesArray);
    }
    // Reset input value to allow selecting the same files again if needed
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        w-full h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group
        ${isDragging 
          ? 'border-primary bg-primary/10 scale-105 shadow-xl' 
          : 'border-gray-300 hover:border-primary hover:bg-gray-50 bg-white shadow-sm'
        }
      `}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInput}
        accept="image/*"
        multiple // Enable multiple files
        className="hidden"
      />
      
      <div className={`p-4 rounded-full mb-4 transition-colors ${isDragging ? 'bg-primary/20 text-primary' : 'bg-gray-100 text-gray-500 group-hover:bg-primary/10 group-hover:text-primary'}`}>
        {isDragging ? <Files size={32} /> : <Upload size={32} />}
      </div>
      
      <h3 className="text-lg font-semibold text-gray-700 mb-2 group-hover:text-primary transition-colors">
        {isDragging ? 'Thả ảnh vào đây' : 'Tải ảnh lên (Nhiều ảnh)'}
      </h3>
      <p className="text-sm text-gray-500 text-center max-w-xs px-4">
        Kéo thả hoặc nhấp để chọn một hoặc nhiều ảnh. Hỗ trợ JPG, PNG, WEBP.
      </p>
    </div>
  );
};

export default DropZone;
