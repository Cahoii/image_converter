export enum ImageFormat {
  PNG = 'image/png',
  JPEG = 'image/jpeg',
  WEBP = 'image/webp'
}

export interface ConvertedImage {
  originalName: string;
  newName: string;
  blob: Blob;
  url: string;
  format: ImageFormat;
}

export interface AiMetadata {
  suggestedName?: string;
  description?: string;
  loading: boolean;
  error?: string;
}

export interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
  dimensions?: { width: number; height: number };
  aiData: AiMetadata;
  status: 'idle' | 'converting' | 'success' | 'error';
}
