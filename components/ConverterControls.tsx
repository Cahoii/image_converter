import React from 'react';
import { ImageFormat } from '../types';
import { Settings, Sparkles, Download, Loader2, Trash2 } from 'lucide-react';

interface ConverterControlsProps {
  format: ImageFormat;
  quality: number;
  isConverting: boolean;
  isAnalyzing: boolean;
  count: number;
  onFormatChange: (format: ImageFormat) => void;
  onQualityChange: (quality: number) => void;
  onConvertAll: () => void;
  onAiAnalyzeAll: () => void;
  onClearAll: () => void;
}

const ConverterControls: React.FC<ConverterControlsProps> = ({
  format,
  quality,
  isConverting,
  isAnalyzing,
  count,
  onFormatChange,
  onQualityChange,
  onConvertAll,
  onAiAnalyzeAll,
  onClearAll
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-6 text-gray-800">
        <div className="flex items-center gap-2">
            <Settings size={20} className="text-primary" />
            <h2 className="text-xl font-bold">Cấu hình</h2>
        </div>
        <span className="text-xs font-semibold bg-gray-100 px-2 py-1 rounded-md text-gray-600">
            {count} ảnh
        </span>
      </div>

      <div className="space-y-6">
        {/* Format Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Định dạng đích</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'JPG', value: ImageFormat.JPEG },
              { label: 'PNG', value: ImageFormat.PNG },
              { label: 'WEBP', value: ImageFormat.WEBP }
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => onFormatChange(opt.value)}
                className={`
                  py-2 px-3 rounded-lg text-sm font-medium transition-all
                  ${format === opt.value 
                    ? 'bg-primary text-white shadow-md ring-2 ring-primary ring-offset-1' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quality Slider (Only for JPEG/WEBP) */}
        {format !== ImageFormat.PNG && (
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Chất lượng</label>
              <span className="text-sm text-primary font-bold">{Math.round(quality * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={quality}
              onChange={(e) => onQualityChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
        )}

        {/* AI Action */}
        <div className="pt-2 border-t border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tính năng AI (Gemini)</label>
            <button
                onClick={onAiAnalyzeAll}
                disabled={isAnalyzing || isConverting || count === 0}
                className={`
                    w-full py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all
                    bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 shadow-md hover:shadow-lg
                    disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none
                `}
            >
                {isAnalyzing ? (
                    <>
                        <Loader2 className="animate-spin" size={16} />
                        Đang phân tích...
                    </>
                ) : (
                    <>
                        <Sparkles size={16} />
                        Phân tích tất cả ({count})
                    </>
                )}
            </button>
            <p className="text-xs text-gray-500 mt-2">
                Tự động đặt tên file chuẩn SEO và tạo mô tả cho toàn bộ danh sách.
            </p>
        </div>

        {/* Convert Action */}
        <button
          onClick={onConvertAll}
          disabled={isConverting || isAnalyzing || count === 0}
          className="w-full py-3.5 px-4 bg-gray-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isConverting ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <Download size={20} />
          )}
          {isConverting ? 'Đang xử lý...' : 'Chuyển đổi & Tải xuống tất cả'}
        </button>
        
        {/* Clear Action */}
        <button
            onClick={onClearAll}
            disabled={isConverting || count === 0}
            className="w-full py-2 px-4 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors"
        >
            <Trash2 size={16} />
            Xóa tất cả
        </button>
      </div>
    </div>
  );
};

export default ConverterControls;
