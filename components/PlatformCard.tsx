import React from 'react';
import { PlatformState, ProcessingStatus, GeneratedMetadata } from '../types';
import { Icons } from '../constants';

interface PlatformCardProps {
  platform: PlatformState;
  onUpdate: (id: string, data: Partial<GeneratedMetadata>) => void;
}

const PlatformCard: React.FC<PlatformCardProps> = ({ platform, onUpdate }) => {
  const Icon = Icons[platform.name as keyof typeof Icons] || Icons.Sparkles;

  const isLoading = platform.status === ProcessingStatus.GENERATING || platform.status === ProcessingStatus.ANALYZING_VIDEO;
  const isReady = platform.status === ProcessingStatus.READY || platform.status === ProcessingStatus.PUBLISHING || platform.status === ProcessingStatus.PUBLISHED;
  const isPublishing = platform.status === ProcessingStatus.PUBLISHING;
  const isPublished = platform.status === ProcessingStatus.PUBLISHED;

  // Use platform brand color only for the icon and small accents, keep main UI neutral
  const borderColor = isPublished ? 'border-emerald-900' : 'border-neutral-800';
  const bgColor = isPublished ? 'bg-emerald-950/10' : 'bg-neutral-900';

  return (
    <div className={`relative flex flex-col rounded-2xl border ${borderColor} ${bgColor} p-5 transition-all duration-300 shadow-xl`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${platform.color} bg-neutral-950 border border-neutral-800`}>
            <Icon className="w-6 h-6" />
          </div>
          <h3 className={`font-bold text-lg text-white`}>{platform.name}</h3>
        </div>
        
        {/* Status Badge */}
        <div className="text-xs font-bold uppercase tracking-wider">
          {isPublishing && <span className="text-emerald-500 animate-pulse">Publishing...</span>}
          {isPublished && <span className="text-emerald-500 flex items-center gap-1"><Icons.Check className="w-4 h-4"/> Published</span>}
          {platform.status === ProcessingStatus.ERROR && <span className="text-red-500">Error</span>}
          {isLoading && <span className="text-amber-500 animate-pulse">Generating...</span>}
          {platform.status === ProcessingStatus.IDLE && <span className="text-neutral-600">Pending</span>}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 space-y-4 relative">
        {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-neutral-900/80 backdrop-blur-sm rounded-xl border border-neutral-800">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                    <span className="text-sm font-medium text-neutral-400">AI is crafting content...</span>
                </div>
            </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs text-neutral-500 font-bold uppercase tracking-wider ml-1">Title</label>
          <input
            type="text"
            className="w-full bg-black/40 border border-neutral-700 rounded-lg px-4 py-3 text-sm text-neutral-100 placeholder-neutral-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            placeholder="Title will appear here..."
            value={platform.data.title}
            onChange={(e) => onUpdate(platform.id, { title: e.target.value })}
            disabled={!isReady}
          />
        </div>

        <div className="space-y-1.5">
           <label className="text-xs text-neutral-500 font-bold uppercase tracking-wider ml-1">Description</label>
          <textarea
            className="w-full h-64 bg-black/40 border border-neutral-700 rounded-lg px-4 py-3 text-sm text-neutral-100 placeholder-neutral-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent leading-relaxed"
            placeholder="Detailed description will appear here..."
            value={platform.data.description}
            onChange={(e) => onUpdate(platform.id, { description: e.target.value })}
            disabled={!isReady}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-neutral-500 font-bold uppercase tracking-wider ml-1">Tags</label>
          <div className="flex flex-wrap gap-2 min-h-[52px] p-3 bg-black/40 border border-neutral-700 rounded-lg items-start content-start">
             {platform.data.tags.length === 0 && <span className="text-neutral-700 text-sm italic">#tags will appear here</span>}
             {platform.data.tags.map((tag, idx) => (
               <span key={idx} className="bg-neutral-800 border border-neutral-700 px-2.5 py-1 rounded text-xs text-neutral-300 flex items-center gap-1.5 group cursor-pointer hover:bg-neutral-700 hover:border-neutral-600 transition-all">
                  #{tag}
                  <button 
                    onClick={() => {
                        const newTags = platform.data.tags.filter((_, i) => i !== idx);
                        onUpdate(platform.id, { tags: newTags });
                    }}
                    className="hover:text-red-400 text-neutral-500 transition-colors"
                  >
                    ×
                  </button>
               </span>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformCard;