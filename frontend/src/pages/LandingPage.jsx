import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="bg-neutral-950 font-body-md text-on-surface antialiased overflow-x-hidden min-h-screen">
      <style>{`
        .glass-panel {
          background: rgba(10, 10, 10, 0.6);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .glow-orange {
          box-shadow: 0 0 20px rgba(255, 122, 0, 0.15);
        }
        .ai-pulse {
          box-shadow: 0 0 40px rgba(255, 122, 0, 0.3);
        }
      `}</style>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-neutral-950/80 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="flex justify-between items-center px-6 py-3 max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-8">
            <span className="text-xl font-black text-orange-500 drop-shadow-[0_0_10px_rgba(255,122,0,0.5)] font-inter antialiased tracking-tight">JobPilot</span>

          </div>
          <div className="flex items-center gap-4">
            <button className="hidden lg:flex items-center gap-2 bg-primary-container text-on-primary-fixed px-4 py-2 rounded-lg font-bold hover:scale-105 transition-transform active:scale-95 text-label-sm">
              Go Premium
            </button>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-neutral-400 hover:text-orange-500 cursor-pointer p-2 rounded-md hover:bg-white/5 transition-all">notifications</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-xl px-margin overflow-hidden">
        {/* Background Lighting */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500/10 rounded-full blur-[120px]"></div>
        </div>

        {/* Central Connectivity Visualization */}
        <div className="relative z-10 w-full max-w-5xl aspect-video md:aspect-[21/9] flex items-center justify-center mb-12">
          {/* Central Processor Core */}
          <div className="relative w-24 h-24 md:w-32 md:h-32 glass-panel rounded-full flex items-center justify-center ai-pulse border-orange-500/40 border-2">
            <div className="absolute inset-0 bg-orange-500/10 rounded-full animate-pulse"></div>
            <span className="material-symbols-outlined text-orange-500 text-4xl md:text-5xl" style={{ fontVariationSettings: '"FILL" 1' }}>memory</span>
          </div>

          {/* Job Node (Left) */}
          <div className="absolute left-0 lg:left-12 top-1/4 flex flex-col items-center gap-2">
            <div className="w-12 h-12 md:w-16 md:h-16 glass-panel rounded-xl flex items-center justify-center glow-orange">
              <span className="material-symbols-outlined text-neutral-200" style={{ fontVariationSettings: '"FILL" 1' }}>work</span>
            </div>
            <span className="font-label-sm text-neutral-400 uppercase tracking-widest text-[10px]">Briefcase</span>
          </div>
          <div className="absolute left-1/4 top-[45%] h-[1px] w-1/4 bg-gradient-to-r from-transparent via-orange-500/50 to-orange-500/20 hidden lg:block"></div>

          {/* Search Node (Left Bottom) */}
          <div className="absolute left-4 md:left-24 bottom-1/4 flex flex-col items-center gap-2">
            <div className="w-12 h-12 md:w-16 md:h-16 glass-panel rounded-xl flex items-center justify-center glow-orange">
              <span className="material-symbols-outlined text-neutral-200">manage_search</span>
            </div>
            <span className="font-label-sm text-neutral-400 uppercase tracking-widest text-[10px]">Search</span>
          </div>

          {/* AI Thought Node (Right) */}
          <div className="absolute right-0 lg:right-12 top-1/4 flex flex-col items-center gap-2">
            <div className="w-12 h-12 md:w-16 md:h-16 glass-panel rounded-xl flex items-center justify-center glow-orange border-orange-500/20">
              <span className="material-symbols-outlined text-neutral-200" style={{ fontVariationSettings: '"FILL" 1' }}>psychology</span>
            </div>
            <span className="font-label-sm text-neutral-400 uppercase tracking-widest text-[10px]">Inference</span>
          </div>
          <div className="absolute right-1/4 top-[45%] h-[1px] w-1/4 bg-gradient-to-l from-transparent via-orange-500/50 to-orange-500/20 hidden lg:block"></div>

          {/* LinkedIn Node (Right Bottom) */}
          <div className="absolute right-4 md:right-24 bottom-1/4 flex flex-col items-center gap-2">
            <div className="w-12 h-12 md:w-16 md:h-16 glass-panel rounded-xl flex items-center justify-center glow-orange">
              <span className="material-symbols-outlined text-neutral-200">hub</span>
            </div>
            <span className="font-label-sm text-neutral-400 uppercase tracking-widest text-[10px]">LinkedIn</span>
          </div>

          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" preserveAspectRatio="none">
            <path d="M 150 150 Q 400 250 512 300" fill="none" stroke="url(#amber-grad)" strokeWidth="1"></path>
            <path d="M 150 450 Q 350 400 512 300" fill="none" stroke="url(#amber-grad)" strokeWidth="1"></path>
            <path d="M 850 150 Q 600 250 512 300" fill="none" stroke="url(#amber-grad)" strokeWidth="1"></path>
            <path d="M 850 450 Q 650 400 512 300" fill="none" stroke="url(#amber-grad)" strokeWidth="1"></path>
            <defs>
              <linearGradient id="amber-grad" x1="0%" x2="100%" y1="0%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#ff7a00', stopOpacity: 0 }}></stop>
                <stop offset="50%" style={{ stopColor: '#ff7a00', stopOpacity: 1 }}></stop>
                <stop offset="100%" style={{ stopColor: '#ff7a00', stopOpacity: 0 }}></stop>
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-20 text-center max-w-4xl mx-auto space-y-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 mb-4">
            <span className="material-symbols-outlined text-[14px] text-orange-500">bolt</span>
            <span className="font-label-sm text-orange-500 uppercase tracking-wider">Next-Gen Job Intelligence</span>
          </div>
          <h1 className="font-display-xl text-on-surface tracking-tight text-4xl md:text-6xl lg:text-7xl">
            Automation at the <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-600 to-orange-400">Edge</span>
          </h1>
          <p className="font-body-lg text-neutral-400 max-w-2xl mx-auto text-base md:text-xl">
            Deploy local AI models that hyper-personalize your job search. JobPilot connects directly to LinkedIn, Glassdoor, and niche boards to secure your next role while you sleep.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-md pt-base">
            <Link to="/connect" className="w-full sm:w-auto px-xl py-md bg-primary-container text-on-primary-fixed rounded-xl font-bold text-body-md hover:shadow-[0_0_30px_rgba(255,122,0,0.4)] transition-all active:scale-95 text-center">
              Start Automating
            </Link>
            <button className="w-full sm:w-auto px-xl py-md glass-panel text-on-surface rounded-xl font-medium text-body-md hover:bg-white/5 transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">play_circle</span>
              Watch Demo
            </button>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="w-full max-w-7xl mt-xl grid grid-cols-1 md:grid-cols-3 gap-gutter">
          <div className="glass-panel p-md rounded-xl space-y-sm">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-orange-500">rocket_launch</span>
            </div>
            <h3 className="font-headline-md text-on-surface text-lg">Instant Applications</h3>
            <p className="text-neutral-500 text-body-md">Apply to 100+ vetted roles per day with AI-generated custom cover letters.</p>
          </div>
          <div className="glass-panel p-md rounded-xl space-y-sm border-orange-500/20">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-orange-500">query_stats</span>
            </div>
            <h3 className="font-headline-md text-on-surface text-lg">Predictive Analytics</h3>
            <p className="text-neutral-500 text-body-md">Identify hiring trends before they're public. Stay ahead of the competition.</p>
          </div>
          <div className="glass-panel p-md rounded-xl space-y-sm">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-orange-500">lock</span>
            </div>
            <h3 className="font-headline-md text-on-surface text-lg">Privacy First</h3>
            <p className="text-neutral-500 text-body-md">Your data stays on your local machine. No scraping of your personal history.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 bg-neutral-950 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 px-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="font-bold text-neutral-200 text-xl font-inter">JobPilot AI</span>
            <span className="text-xs font-inter text-neutral-500 opacity-80 hover:opacity-100">© 2024 JobPilot AI. High-performance automation.</span>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <a className="text-neutral-500 hover:text-orange-400 text-xs font-inter transition-colors" href="#">Privacy Policy</a>
            <a className="text-neutral-500 hover:text-orange-400 text-xs font-inter transition-colors" href="#">Terms of Service</a>
            <a className="text-neutral-500 hover:text-orange-400 text-xs font-inter transition-colors" href="#">API Docs</a>
            <a className="text-neutral-500 hover:text-orange-400 text-xs font-inter transition-colors" href="#">Support</a>
          </div>
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-neutral-500 hover:text-orange-500 cursor-pointer transition-all">share</span>
            <span className="material-symbols-outlined text-neutral-500 hover:text-orange-500 cursor-pointer transition-all">terminal</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
