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

export interface ImageState {
  file: File | null;
  previewUrl: string | null;
  originalDimensions: { width: number; height: number } | null;
}

export interface AiMetadata {
  suggestedName?: string;
  description?: string;
  loading: boolean;
  error?: string;
}
