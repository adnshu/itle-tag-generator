import React, { useState, useRef, useCallback } from 'react';
import { INITIAL_PLATFORMS, Icons } from './constants';
import { PlatformState, ProcessingStatus, VideoInputContext, GeneratedMetadata } from './types';
import PlatformCard from './components/PlatformCard';
import { generatePlatformMetadata, analyzeVideoContext } from './services/geminiService';

function App() {
  const [platforms, setPlatforms] = useState<PlatformState[]>(INITIAL_PLATFORMS);
  const [inputText, setInputText] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Ref for file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Removed 50MB limit check
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
      // Reset statuses
      setPlatforms(prev => prev.map(p => ({ ...p, status: ProcessingStatus.IDLE })));
    }
  };

  const fileToGenerativePart = async (file: File): Promise<{ data: string; mimeType: string }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Data = reader.result as string;
            const base64Content = base64Data.split(',')[1];
            resolve({
                data: base64Content,
                mimeType: file.type,
            });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
  };

  const handleGenerate = async () => {
    if (!inputText && !videoFile) {
      alert("Please enter text or upload a video.");
      return;
    }

    setIsProcessing(true);

    try {
        let context = inputText;

        // Step 1: Video Analysis (if video present)
        if (videoFile) {
            setPlatforms(prev => prev.map(p => ({ ...p, status: ProcessingStatus.ANALYZING_VIDEO })));
            const { data, mimeType } = await fileToGenerativePart(videoFile);
            
            // Analyze video first to get a rich description
            const videoAnalysis = await analyzeVideoContext(data, mimeType);
            context = `User Notes: ${inputText}\n\nVideo Visual Analysis: ${videoAnalysis}`;
        }

        // Step 2: Generate for each platform
        const platformPromises = platforms.map(async (platform) => {
            setPlatforms(prev => prev.map(p => 
                p.id === platform.id ? { ...p, status: ProcessingStatus.GENERATING } : p
            ));

            try {
                const metadata = await generatePlatformMetadata(platform.id, context);
                
                setPlatforms(prev => prev.map(p => 
                    p.id === platform.id ? { ...p, status: ProcessingStatus.READY, data: metadata } : p
                ));
            } catch (error) {
                setPlatforms(prev => prev.map(p => 
                    p.id === platform.id ? { ...p, status: ProcessingStatus.ERROR } : p
                ));
            }
        });

        await Promise.all(platformPromises);

    } catch (error) {
        console.error("Global generation error", error);
        alert("An error occurred during generation. Please check your API key or connection.");
    } finally {
        setIsProcessing(false);
    }
  };

  const handleUpdatePlatformData = (id: string, data: Partial<GeneratedMetadata>) => {
    setPlatforms(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, data: { ...p.data, ...data } };
      }
      return p;
    }));
  };

  const handlePublishAll = async () => {
    const readyPlatforms = platforms.filter(p => p.status === ProcessingStatus.READY);
    if (readyPlatforms.length === 0) return;

    if (!window.confirm(`Ready to publish to ${readyPlatforms.length} platforms? This will simulate the upload process.`)) {
        return;
    }

    // Simulate publishing
    for (const platform of readyPlatforms) {
        setPlatforms(prev => prev.map(p => 
            p.id === platform.id ? { ...p, status: ProcessingStatus.PUBLISHING } : p
        ));
        
        // Fake network delay for demo
        await new Promise(r => setTimeout(r, 1500 + Math.random() * 2000));

        setPlatforms(prev => prev.map(p => 
            p.id === platform.id ? { ...p, status: ProcessingStatus.PUBLISHED } : p
        ));
    }

    alert("All videos published successfully!");
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 flex flex-col font-sans">
      {/* Navbar */}
      <header className="border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-neutral-800 p-2 rounded-lg border border-neutral-700">
                <Icons.Upload className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              UniPublish AI
            </h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-neutral-400">
            <span className="hidden md:inline font-medium">Chrome Extension Mode</span>
            <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-white">
              <span className="font-bold text-xs">USR</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[1600px] mx-auto px-6 py-8 w-full flex flex-col xl:flex-row gap-8">
        
        {/* Left Column: Input */}
        <div className="w-full xl:w-[400px] shrink-0 flex flex-col gap-6">
            
            {/* Input Card */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Icons.Sparkles className="w-5 h-5 text-emerald-500"/>
                    Source Material
                </h2>

                {/* File Upload Area */}
                <div 
                    className="border-2 border-dashed border-neutral-700 rounded-xl p-8 mb-6 hover:bg-neutral-800 hover:border-emerald-500/50 transition-all cursor-pointer group text-center relative overflow-hidden"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="video/*" 
                        onChange={handleFileChange}
                    />
                    
                    {videoPreview ? (
                        <div className="relative">
                            <video src={videoPreview} className="w-full rounded-lg shadow-lg max-h-48 object-cover bg-black" controls />
                            <div className="mt-3 text-xs text-emerald-400 flex items-center justify-center gap-1 font-mono uppercase tracking-wide">
                                <Icons.Check className="w-3 h-3"/> Video Loaded
                            </div>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setVideoFile(null);
                                    setVideoPreview(null);
                                }}
                                className="absolute -top-2 -right-2 bg-neutral-700 hover:bg-red-500 text-white rounded-full p-1.5 transition-colors shadow-lg border border-neutral-600"
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-neutral-500 group-hover:text-neutral-300">
                             <Icons.Upload className="w-10 h-10 mb-2 opacity-50 group-hover:scale-110 transition-transform" />
                             <span className="font-semibold text-neutral-300">Click to upload video</span>
                             <span className="text-xs font-mono">Any size supported</span>
                        </div>
                    )}
                </div>

                {/* Text Input */}
                <div className="space-y-2">
                    <label className="text-xs uppercase font-bold text-neutral-500 tracking-wider">Context & Instructions</label>
                    <textarea 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Add context, specifics about the video, or styling instructions..."
                        className="w-full h-40 bg-black/40 border border-neutral-700 rounded-xl p-4 text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none placeholder-neutral-600 text-neutral-200"
                    />
                </div>

                {/* Generate Button */}
                <button 
                    onClick={handleGenerate}
                    disabled={isProcessing || (!videoFile && !inputText)}
                    className="w-full mt-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                    {isProcessing ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Processing...</span>
                        </>
                    ) : (
                        <>
                            <Icons.Sparkles className="w-5 h-5" />
                            <span>Generate Metadata</span>
                        </>
                    )}
                </button>
            </div>
        </div>

        {/* Right Column: Platform Results */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                    Preview & Edit
                    <span className="text-xs font-mono text-neutral-400 bg-neutral-900 px-2 py-1 rounded border border-neutral-800">
                        {platforms.filter(p => p.status === ProcessingStatus.READY).length} / {platforms.length} Ready
                    </span>
                </h2>
                
                <button 
                    onClick={handlePublishAll}
                    disabled={platforms.filter(p => p.status === ProcessingStatus.READY).length === 0}
                    className="bg-white hover:bg-neutral-200 text-black font-bold py-2 px-5 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 text-sm"
                >
                    <span>Publish All</span>
                    <Icons.Upload className="w-4 h-4" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
                {platforms.map(platform => (
                    <PlatformCard 
                        key={platform.id} 
                        platform={platform} 
                        onUpdate={handleUpdatePlatformData}
                    />
                ))}
            </div>
        </div>

      </main>
    </div>
  );
}

export default App;