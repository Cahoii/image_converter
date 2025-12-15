import React, { useState, useEffect, useRef } from 'react';
import DropZone from './components/DropZone';
import ConverterControls from './components/ConverterControls';
import { ImageFormat, AiMetadata } from './types';
import { convertImage, getExtensionFromMime } from './utils/imageUtils';
import { analyzeImage } from './services/geminiService';
import { FileImage, X, Check, AlertCircle, Wand2 } from 'lucide-react';

const App: React.FC = () => {
  // State
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState<ImageFormat>(ImageFormat.JPEG);
  const [quality, setQuality] = useState<number>(0.9);
  
  // Status State
  const [isConverting, setIsConverting] = useState(false);
  const [aiData, setAiData] = useState<AiMetadata>({ loading: false });
  
  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileSelect = (selectedFile: File) => {
    // Reset state for new file
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setAiData({ loading: false }); // Reset AI data
    
    // Auto-select a different format if uploaded is the same as default
    if (selectedFile.type === ImageFormat.JPEG) setTargetFormat(ImageFormat.PNG);
    else setTargetFormat(ImageFormat.JPEG);
  };

  const handleClear = () => {
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setAiData({ loading: false });
  };

  const handleAiAnalyze = async () => {
    if (!file) return;

    setAiData({ ...aiData, loading: true, error: undefined });
    try {
      const result = await analyzeImage(file);
      setAiData({
        loading: false,
        suggestedName: result.suggestedName,
        description: result.description
      });
    } catch (error) {
        let errorMsg = "Lỗi kết nối AI";
        if (error instanceof Error) errorMsg = error.message;
        setAiData({ loading: false, error: errorMsg });
    }
  };

  const handleConvert = async () => {
    if (!file) return;
    setIsConverting(true);

    try {
      // 1. Convert Image
      const blob = await convertImage(file, targetFormat, quality);
      
      // 2. Determine Filename
      let filename = file.name.substring(0, file.name.lastIndexOf('.'));
      if (aiData.suggestedName) {
        filename = aiData.suggestedName;
      }
      const extension = getExtensionFromMime(targetFormat);
      const fullFilename = `${filename}.${extension}`;

      // 3. Download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fullFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      alert('Có lỗi xảy ra khi chuyển đổi ảnh.');
      console.error(error);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <header className="mb-10 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm mb-4">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white mr-3">
               <Wand2 size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">AI Image Converter</h1>
          </div>
          <p className="text-gray-600 max-w-lg mx-auto">
            Chuyển đổi định dạng ảnh nhanh chóng, riêng tư ngay trên trình duyệt. Tích hợp AI để tối ưu tên file và tạo mô tả.
          </p>
        </header>

        {/* Main Content */}
        {!file ? (
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-xl border border-white/50 backdrop-blur-sm">
            <DropZone onFileSelect={handleFileSelect} />
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
               {[
                 { title: 'Riêng tư tuyệt đối', desc: 'Xử lý trực tiếp trên trình duyệt, không gửi ảnh đi đâu (trừ khi dùng AI).' },
                 { title: 'Tốc độ cực nhanh', desc: 'Không cần chờ upload/download server.' },
                 { title: 'Hỗ trợ Gemini', desc: 'Sử dụng Google Gemini 2.5 Flash để phân tích nội dung.' }
               ].map((item, i) => (
                 <div key={i} className="p-4 bg-gray-50 rounded-xl text-center">
                    <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                 </div>
               ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Image Preview */}
            <div className="lg:col-span-2 space-y-6">
              
              <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 relative group">
                <div className="absolute top-4 right-4 z-10">
                   <button 
                     onClick={handleClear}
                     className="bg-black/50 hover:bg-red-500 text-white p-2 rounded-full backdrop-blur-md transition-all"
                     title="Xóa ảnh"
                   >
                     <X size={20} />
                   </button>
                </div>

                <div className="p-1 bg-gray-100 aspect-video flex items-center justify-center relative bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                   {previewUrl && (
                     <img 
                       src={previewUrl} 
                       alt="Preview" 
                       className="max-h-full max-w-full object-contain shadow-sm rounded-lg" 
                     />
                   )}
                </div>

                <div className="p-5 border-t border-gray-100 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-50 text-primary rounded-lg">
                        <FileImage size={24} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 truncate max-w-[200px]">{file.name}</p>
                        <p className="text-sm text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type.split('/')[1].toUpperCase()}
                        </p>
                      </div>
                   </div>
                </div>
              </div>

              {/* AI Analysis Result Panel */}
              {(aiData.suggestedName || aiData.description || aiData.error) && (
                <div className={`rounded-2xl p-5 border ${aiData.error ? 'bg-red-50 border-red-200' : 'bg-white border-green-200 shadow-sm'}`}>
                  {aiData.error ? (
                    <div className="flex items-start gap-3 text-red-700">
                      <AlertCircle className="mt-0.5 flex-shrink-0" size={20} />
                      <div>
                        <h4 className="font-semibold">Lỗi AI</h4>
                        <p className="text-sm">{aiData.error}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-green-700 mb-2">
                        <Check size={20} className="p-0.5 bg-green-200 rounded-full" />
                        <h3 className="font-bold">Kết quả phân tích AI</h3>
                      </div>
                      
                      <div className="grid gap-4 md:grid-cols-2">
                         <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Tên file đề xuất</span>
                            <code className="text-primary font-mono font-medium block break-all">
                              {aiData.suggestedName}.{getExtensionFromMime(targetFormat)}
                            </code>
                         </div>
                         <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Mô tả nội dung</span>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {aiData.description}
                            </p>
                         </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Controls */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <ConverterControls
                  format={targetFormat}
                  quality={quality}
                  isConverting={isConverting}
                  aiMetadataLoading={aiData.loading}
                  onFormatChange={setTargetFormat}
                  onQualityChange={setQuality}
                  onConvert={handleConvert}
                  onAiAnalyze={handleAiAnalyze}
                  hasAiResult={!!aiData.suggestedName}
                />
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default App;
