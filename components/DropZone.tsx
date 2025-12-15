import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface DropZoneProps {
  onFileSelect: (file: File) => void;
}

const DropZone: React.FC<DropZoneProps> = ({ onFileSelect }) => {
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
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onFileSelect(file);
      } else {
        alert('Vui lòng chỉ tải lên file ảnh!');
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        w-full h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300
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
        className="hidden"
      />
      
      <div className={`p-4 rounded-full mb-4 ${isDragging ? 'bg-primary/20 text-primary' : 'bg-gray-100 text-gray-500'}`}>
        {isDragging ? <Upload size={32} /> : <ImageIcon size={32} />}
      </div>
      
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        {isDragging ? 'Thả ảnh vào đây' : 'Tải ảnh lên'}
      </h3>
      <p className="text-sm text-gray-500 text-center max-w-xs">
        Kéo thả hoặc nhấp để chọn ảnh. Hỗ trợ JPG, PNG, WEBP, v.v.
      </p>
    </div>
  );
};

export default DropZone;
