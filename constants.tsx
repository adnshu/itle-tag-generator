import React from 'react';
import { PlatformId, PlatformState, ProcessingStatus } from './types';

// Simple SVG Icons for platforms
export const Icons = {
  Bilibili: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.758v6.844c-.054 1.51-.578 2.769-1.574 3.773-.995 1.004-2.249 1.524-3.758 1.56H5.356c-1.51-.054-2.769-.578-3.773-1.574-.999-1.004-1.51-2.249-1.56-3.758V9.985c.054-1.51.578-2.769 1.574-3.773.995-1.004 2.249-1.524 3.758-1.56h.854l-1.9-3.32a.5.5 0 0 1 .868-.496l2.176 3.805h9.314l2.176-3.805a.5.5 0 0 1 .868.496l-1.9 3.321zM6.5 12a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
    </svg>
  ),
  Xiaohongshu: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10zm-6.5-3.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0zm-7 0a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0zm9 5a4.5 4.5 0 0 1-9 0h9z" />
    </svg>
  ),
  Douyin: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M16.5 2h-3v10.5a3 3 0 1 1-3-3v-3a6 6 0 1 0 6 6V5a6 6 0 0 0 4.5 1.5V3.5A6 6 0 0 1 16.5 2z" />
    </svg>
  ),
  Kuaishou: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
    </svg>
  ),
  Upload: (props: React.SVGProps<SVGSVGElement>) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
    </svg>
  ),
  Sparkles: (props: React.SVGProps<SVGSVGElement>) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
    </svg>
  ),
  Check: (props: React.SVGProps<SVGSVGElement>) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  )
};

export const INITIAL_PLATFORMS: PlatformState[] = [
  {
    id: PlatformId.BILIBILI,
    name: 'Bilibili',
    color: 'text-pink-400',
    bgColor: 'bg-pink-400/10 border-pink-400/20',
    status: ProcessingStatus.IDLE,
    data: { title: '', description: '', tags: [] },
  },
  {
    id: PlatformId.XIAOHONGSHU,
    name: 'Xiaohongshu',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10 border-red-500/20',
    status: ProcessingStatus.IDLE,
    data: { title: '', description: '', tags: [] },
  },
  {
    id: PlatformId.DOUYIN,
    name: 'Douyin',
    color: 'text-white',
    bgColor: 'bg-white/10 border-white/20',
    status: ProcessingStatus.IDLE,
    data: { title: '', description: '', tags: [] },
  },
  {
    id: PlatformId.KUAISHOU,
    name: 'Kuaishou',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10 border-orange-500/20',
    status: ProcessingStatus.IDLE,
    data: { title: '', description: '', tags: [] },
  },
];
