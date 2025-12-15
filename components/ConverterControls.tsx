import React from 'react';
import { ImageFormat } from '../types';
import { Settings, Sparkles, Download, Loader2 } from 'lucide-react';

interface ConverterControlsProps {
  format: ImageFormat;
  quality: number;
  isConverting: boolean;
  aiMetadataLoading: boolean;
  onFormatChange: (format: ImageFormat) => void;
  onQualityChange: (quality: number) => void;
  onConvert: () => void;
  onAiAnalyze: () => void;
  hasAiResult: boolean;
}

const ConverterControls: React.FC<ConverterControlsProps> = ({
  format,
  quality,
  isConverting,
  aiMetadataLoading,
  onFormatChange,
  onQualityChange,
  onConvert,
  onAiAnalyze,
  hasAiResult
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <div className="flex items-center gap-2 mb-6 text-gray-800">
        <Settings size={20} className="text-primary" />
        <h2 className="text-xl font-bold">Cấu hình</h2>
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
                onClick={onAiAnalyze}
                disabled={aiMetadataLoading || hasAiResult}
                className={`
                    w-full py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all
                    ${hasAiResult 
                        ? 'bg-green-100 text-green-700 cursor-default' 
                        : 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 shadow-md hover:shadow-lg'
                    }
                    disabled:opacity-70 disabled:cursor-not-allowed
                `}
            >
                {aiMetadataLoading ? (
                    <>
                        <Loader2 className="animate-spin" size={16} />
                        Đang phân tích...
                    </>
                ) : hasAiResult ? (
                    <>
                        <Sparkles size={16} />
                        Đã phân tích xong
                    </>
                ) : (
                    <>
                        <Sparkles size={16} />
                        Tự động đặt tên & Mô tả
                    </>
                )}
            </button>
            <p className="text-xs text-gray-500 mt-2">
                Sử dụng AI để nhận diện nội dung ảnh và đề xuất tên file chuẩn SEO.
            </p>
        </div>

        {/* Convert Action */}
        <button
          onClick={onConvert}
          disabled={isConverting}
          className="w-full py-3.5 px-4 bg-gray-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isConverting ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <Download size={20} />
          )}
          {isConverting ? 'Đang xử lý...' : 'Chuyển đổi & Tải xuống'}
        </button>
      </div>
    </div>
  );
};

export default ConverterControls;
