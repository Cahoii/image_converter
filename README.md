# 🎨 AI Image Converter

Ứng dụng chuyển đổi ảnh thông minh sử dụng AI để tối ưu hóa tên file và mô tả ảnh. Được xây dựng với React, TypeScript, và Google Gemini AI.

## ✨ Tính năng

- **Chuyển đổi định dạng ảnh**: Hỗ trợ chuyển đổi giữa JPEG, PNG, và WEBP
- **Điều chỉnh chất lượng**: Tùy chỉnh chất lượng ảnh xuất ra (10% - 100%)
- **Phân tích ảnh bằng AI**: Sử dụng Google Gemini để tự động tạo:
  - Tên file SEO-friendly
  - Mô tả chi tiết nội dung ảnh bằng tiếng Việt
- **Kéo thả file**: Giao diện drag & drop thân thiện
- **Xem trước ảnh**: Xem trước ảnh trước khi chuyển đổi
- **Responsive**: Giao diện tương thích mọi thiết bị

## 🚀 Cài đặt

### Yêu cầu

- Node.js (phiên bản 16 trở lên)
- npm hoặc yarn
- Google Gemini API Key

### Các bước cài đặt

1. Clone repository:

```bash
git clone <repository-url>
cd chuyển-đổi-ảnh-ai---ai-image-converter
```

2. Cài đặt dependencies:

```bash
npm install
```

3. Cấu hình API Key:

Tạo file `.env` trong thư mục gốc và thêm Gemini API key:

```env
API_KEY=your_gemini_api_key_here
```

Lấy API key miễn phí tại: [Google AI Studio](https://aistudio.google.com/app/apikey)

4. Chạy ứng dụng:

```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:5173`

## 📦 Build Production

```bash
npm run build
npm run preview
```

## 🛠️ Công nghệ sử dụng

- **React 19** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool & Dev Server
- **Google Gemini AI** - Phân tích ảnh thông minh
- **Lucide React** - Icon Library
- **HTML Canvas API** - Xử lý và chuyển đổi ảnh

## 📁 Cấu trúc dự án

```
├── components/
│   ├── ConverterControls.tsx    # Điều khiển chuyển đổi
│   └── DropZone.tsx              # Khu vực kéo thả file
├── services/
│   └── geminiService.ts          # Tích hợp Gemini AI
├── utils/
│   └── imageUtils.ts             # Xử lý ảnh
├── App.tsx                       # Component chính
├── types.ts                      # TypeScript definitions
└── index.tsx                     # Entry point
```

## 🎯 Cách sử dụng

1. **Tải ảnh lên**: Kéo thả hoặc click để chọn ảnh
2. **Chọn định dạng**: Chọn định dạng đầu ra (JPEG, PNG, WEBP)
3. **Điều chỉnh chất lượng**: Tuỳ chỉnh chất lượng ảnh bằng thanh trượt
4. **Phân tích AI** (tùy chọn): Click "Phân tích AI" để tự động tạo tên file và mô tả
5. **Chuyển đổi**: Click "Chuyển đổi & Tải về" để tải ảnh đã chuyển đổi

## 🔑 API Key

Ứng dụng sử dụng Google Gemini 2.5 Flash model để phân tích ảnh. API key cần được cấu hình trong biến môi trường `API_KEY`.

**Lưu ý bảo mật**:

- Không commit file `.env` vào git
- Thêm `.env` vào `.gitignore`
- Sử dụng biến môi trường phía server cho production

## 📝 License

MIT

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Vui lòng tạo issue hoặc pull request.

## 📧 Liên hệ

Nếu có câu hỏi hoặc góp ý, vui lòng tạo issue trên GitHub.

---

Made with ❤️ using React, TypeScript & AI
