export enum PlatformId {
  BILIBILI = 'bilibili',
  XIAOHONGSHU = 'xiaohongshu',
  DOUYIN = 'douyin',
  KUAISHOU = 'kuaishou',
}

export enum ProcessingStatus {
  IDLE = 'IDLE',
  ANALYZING_VIDEO = 'ANALYZING_VIDEO',
  GENERATING = 'GENERATING',
  READY = 'READY',
  PUBLISHING = 'PUBLISHING',
  PUBLISHED = 'PUBLISHED',
  ERROR = 'ERROR',
}

export interface GeneratedMetadata {
  title: string;
  description: string;
  tags: string[];
}

export interface PlatformState {
  id: PlatformId;
  name: string;
  color: string;
  bgColor: string;
  status: ProcessingStatus;
  data: GeneratedMetadata;
  error?: string;
}

export interface VideoInputContext {
  text: string;
  videoFile: File | null;
  videoBase64: string | null;
  videoMimeType: string | null;
}