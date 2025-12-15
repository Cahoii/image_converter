import React, { useState, useEffect } from 'react';
import DropZone from './components/DropZone';
import ConverterControls from './components/ConverterControls';
import { ImageFormat, ImageItem } from './types';
import { convertImage, getExtensionFromMime, getImageDimensions } from './utils/imageUtils';
import { analyzeImage } from './services/geminiService';
import { FileImage, X, Check, AlertCircle, Wand2, Loader2, Sparkles, Trash2 } from 'lucide-react';

const App: React.FC = () => {
  // State
  const [items, setItems] = useState<ImageItem[]>([]);
  const [targetFormat, setTargetFormat] = useState<ImageFormat>(ImageFormat.JPEG);
  const [quality, setQuality] = useState<number>(0.9);
  
  // Global Status State
  const [isConverting, setIsConverting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      items.forEach(item => URL.revokeObjectURL(item.previewUrl));
    };
  }, []); // Run once on unmount (or when items changed if we wanted to be granular, but batch cleanup is fine here)

  const handleFilesSelect = async (files: File[]) => {
    const newItems: ImageItem[] = files.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      previewUrl: URL.createObjectURL(file),
      aiData: { loading: false },
      status: 'idle'
    }));

    setItems(prev => [...prev, ...newItems]);

    // Async fetch dimensions for new items
    newItems.forEach(async (item) => {
      try {
        const dims = await getImageDimensions(item.file);
        setItems(currentItems => 
          currentItems.map(i => i.id === item.id ? { ...i, dimensions: dims } : i)
        );
      } catch (e) {
        console.error("Could not get dimensions for", item.file.name);
      }
    });

    // Auto-switch format suggestion if the first file matches target (UX enhancement)
    if (files.length > 0 && files[0].type === targetFormat) {
       // Only switch if user hasn't manually set it? For now, keep simple or remove auto-switch.
       // Let's stick to default JPEG unless user changes.
    }
  };

  const handleRemoveItem = (id: string) => {
    setItems(prev => {
        const itemToRemove = prev.find(i => i.id === id);
        if (itemToRemove) URL.revokeObjectURL(itemToRemove.previewUrl);
        return prev.filter(i => i.id !== id);
    });
  };

  const handleClearAll = () => {
    items.forEach(item => URL.revokeObjectURL(item.previewUrl));
    setItems([]);
  };

  const handleAiAnalyzeAll = async () => {
    if (items.length === 0) return;
    setIsAnalyzing(true);

    // Set loading state for all eligible items
    setItems(prev => prev.map(item => 
        item.aiData.suggestedName ? item : { ...item, aiData: { ...item.aiData, loading: true, error: undefined } }
    ));

    // Process in parallel
    const promises = items.map(async (item) => {
        // Skip if already has result
        if (item.aiData.suggestedName) return;

        try {
            const result = await analyzeImage(item.file);
            setItems(current => current.map(i => 
                i.id === item.id 
                ? { ...i, aiData: { loading: false, suggestedName: result.suggestedName, description: result.description } } 
                : i
            ));
        } catch (error) {
            let errorMsg = "Lỗi AI";
            if (error instanceof Error) errorMsg = error.message;
            setItems(current => current.map(i => 
                i.id === item.id 
                ? { ...i, aiData: { loading: false, error: errorMsg } } 
                : i
            ));
        }
    });

    await Promise.all(promises);
    setIsAnalyzing(false);
  };

  const handleConvertAll = async () => {
    if (items.length === 0) return;
    setIsConverting(true);

    for (const item of items) {
        // Update item status
        setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: 'converting' } : i));

        try {
            // 1. Convert
            const blob = await convertImage(item.file, targetFormat, quality);
            
            // 2. Name
            let filename = item.file.name.substring(0, item.file.name.lastIndexOf('.'));
            if (item.aiData.suggestedName) {
                filename = item.aiData.suggestedName;
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

            // Success state
            setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: 'success' } : i));
            
            // Small delay to prevent browser from blocking multiple downloads
            await new Promise(resolve => setTimeout(resolve, 500));

        } catch (error) {
            console.error(error);
            setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: 'error' } : i));
        }
    }
    
    setIsConverting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="mb-10 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm mb-4">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white mr-3">
               <Wand2 size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">AI Image Converter</h1>
          </div>
          <p className="text-gray-600 max-w-lg mx-auto">
            Chuyển đổi hàng loạt ảnh nhanh chóng. Tích hợp AI để tối ưu tên file và tạo mô tả tự động.
          </p>
        </header>

        {/* Main Content */}
        {items.length === 0 ? (
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-xl border border-white/50 backdrop-blur-sm">
            <DropZone onFilesSelect={handleFilesSelect} />
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
               {[
                 { title: 'Xử lý hàng loạt', desc: 'Tải lên nhiều ảnh và chuyển đổi cùng lúc.' },
                 { title: 'Tốc độ cực nhanh', desc: 'Xử lý trực tiếp trên trình duyệt.' },
                 { title: 'Hỗ trợ Gemini', desc: 'Phân tích nội dung hàng loạt ảnh.' }
               ].map((item, i) => (
                 <div key={i} className="p-4 bg-gray-50 rounded-xl text-center">
                    <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                 </div>
               ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left Column: Image List */}
            <div className="lg:col-span-2 space-y-4">
               {/* Add More Dropzone */}
               <div className="bg-white rounded-2xl p-4 shadow-sm border border-dashed border-gray-300 hover:border-primary transition-colors">
                  <DropZone onFilesSelect={handleFilesSelect} />
               </div>

               {/* Items List */}
               {items.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex gap-4 transition-all hover:shadow-md relative overflow-hidden">
                    {/* Status Bar */}
                    {item.status === 'success' && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-green-500"></div>}
                    {item.status === 'error' && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500"></div>}
                    {item.status === 'converting' && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500 animate-pulse"></div>}

                    {/* Preview Image */}
                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden relative border border-gray-200">
                        <img 
                           src={item.previewUrl} 
                           alt={item.file.name}
                           className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-gray-800 truncate pr-2 max-w-[200px] sm:max-w-xs" title={item.file.name}>
                                    {item.file.name}
                                </h3>
                                <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                                    <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-medium">
                                        {item.file.type.split('/')[1].toUpperCase()}
                                    </span>
                                    <span>{(item.file.size / 1024 / 1024).toFixed(2)} MB</span>
                                    {item.dimensions && (
                                        <span>• {item.dimensions.width} x {item.dimensions.height}</span>
                                    )}
                                </p>
                            </div>
                            <button 
                                onClick={() => handleRemoveItem(item.id)}
                                className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* AI Results Section */}
                        {(item.aiData.loading || item.aiData.suggestedName || item.aiData.error) && (
                            <div className="mt-3 p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                                {item.aiData.loading ? (
                                    <div className="flex items-center gap-2 text-primary text-xs font-medium">
                                        <Loader2 size={12} className="animate-spin" />
                                        Đang phân tích AI...
                                    </div>
                                ) : item.aiData.error ? (
                                    <div className="flex items-center gap-2 text-red-600 text-xs">
                                        <AlertCircle size={12} />
                                        {item.aiData.error}
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-1.5">
                                            <Sparkles size={12} className="text-purple-600" />
                                            <span className="text-xs font-bold text-gray-700">Tên mới:</span>
                                            <code className="text-xs bg-white px-1.5 py-0.5 rounded border border-gray-200 text-primary font-mono">
                                                {item.aiData.suggestedName}.{getExtensionFromMime(targetFormat)}
                                            </code>
                                        </div>
                                        {item.aiData.description && (
                                            <p className="text-xs text-gray-600 line-clamp-1 pl-4.5 border-l-2 border-purple-200 ml-1">
                                                {item.aiData.description}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Conversion Status */}
                        {item.status !== 'idle' && (
                             <div className="mt-2 flex items-center gap-2">
                                {item.status === 'converting' && <span className="text-xs text-blue-600 flex items-center gap-1"><Loader2 size={12} className="animate-spin"/> Đang xử lý...</span>}
                                {item.status === 'success' && <span className="text-xs text-green-600 flex items-center gap-1"><Check size={12}/> Đã tải xuống</span>}
                                {item.status === 'error' && <span className="text-xs text-red-600">Lỗi chuyển đổi</span>}
                             </div>
                        )}
                    </div>
                  </div>
               ))}
            </div>

            {/* Right Column: Controls (Sticky) */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <ConverterControls
                  format={targetFormat}
                  quality={quality}
                  isConverting={isConverting}
                  isAnalyzing={isAnalyzing}
                  count={items.length}
                  onFormatChange={setTargetFormat}
                  onQualityChange={setQuality}
                  onConvertAll={handleConvertAll}
                  onAiAnalyzeAll={handleAiAnalyzeAll}
                  onClearAll={handleClearAll}
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
