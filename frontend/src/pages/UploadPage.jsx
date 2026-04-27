import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../context/StateContext';

const UploadPage = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { setResumeData } = useAppState();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleStartEngine = async () => {
    if (!file) return;
    
    console.log("FRONTEND LOG: Starting upload for file:", file.name);
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/upload-resume', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      console.log("FRONTEND LOG: Upload successful, received data:", data);
      setResumeData({
        raw_text: data.raw_text,
        skills: data.skills,
        filename: file.name
      });
      navigate('/search');
    } catch (error) {
      console.error('FRONTEND LOG: Upload failed:', error);
      alert('Failed to process resume. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="font-body-md text-on-background selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col bg-[#050505] relative overflow-hidden">
      <style>{`
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .glass-panel {
            background: rgba(15, 15, 15, 0.4);
            backdrop-filter: blur(24px);
            border: 1px solid rgba(255, 122, 0, 0.1);
            position: relative;
            overflow: hidden;
        }
        .glass-panel::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(255, 122, 0, 0.05) 0%, transparent 50%);
            pointer-events: none;
        }
        .glow-amber {
            box-shadow: 0 0 30px rgba(255, 122, 0, 0.1);
        }
        .amber-text-glow {
            text-shadow: 0 0 15px rgba(255, 122, 0, 0.4);
        }
        .circuit-line {
            position: absolute;
            background: linear-gradient(to right, transparent, rgba(255, 122, 0, 0.2), transparent);
            height: 1px;
            z-index: 0;
        }
        .ai-chip-node {
            box-shadow: 0 0 15px rgba(255, 122, 0, 0.3);
            border: 1px solid rgba(255, 122, 0, 0.4);
        }
      `}</style>

      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/10 rounded-full blur-[160px] opacity-40"></div>
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] opacity-30"></div>
      </div>

      <header className="fixed top-0 w-full z-50 bg-[#050505]/60 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-[1440px] mx-auto flex justify-between items-center h-16 px-8">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-black text-primary amber-text-glow font-headline-lg tracking-tight">JobPilot</div>
          </div>
          
        </div>
      </header>

      <main className="flex-grow pt-32 pb-xl px-gutter flex flex-col items-center relative z-10">
        <div className="w-full max-w-4xl relative">
          {/* Abstract Circuitry Decor */}
          <div className="absolute top-1/2 left-0 w-full h-[400px] -translate-y-1/2 opacity-20 pointer-events-none">
            <div className="circuit-line w-1/3 top-[20%] left-0"></div>
            <div className="circuit-line w-1/4 top-[40%] right-0"></div>
            <div className="circuit-line w-1/2 top-[60%] left-1/4"></div>
            {/* Nodes */}
            <div className="absolute top-[20%] left-[33%] w-2 h-2 rounded-full bg-primary ai-chip-node"></div>
            <div className="absolute top-[60%] left-[25%] w-2 h-2 rounded-full bg-primary ai-chip-node"></div>
            <div className="absolute top-[40%] right-[25%] w-2 h-2 rounded-full bg-primary ai-chip-node"></div>
          </div>

          {/* Header Section */}
          <div className="text-center mb-xl relative">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-3 py-1 rounded-full mb-6">
              <span className="material-symbols-outlined text-sm text-primary">auto_awesome</span>
              <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase">Powered by Neural Processing</span>
            </div>
            <h1 className="font-display-xl text-display-xl text-on-surface mb-sm tracking-tight leading-[1.05]">
              Optimize your <span className="text-primary amber-text-glow italic">Future</span>
            </h1>
            <p className="text-white/40 w-full max-w-2xl mx-auto text-base md:text-lg leading-relaxed tracking-wide font-medium mt-4">
              Upload your resume to let our AI engine parse, analyze, and match your unique profile with exclusive high-tier career opportunities.
            </p>
          </div>

          {/* Upload Portal Container */}
          <div className="relative group max-w-2xl mx-auto">
            {/* Main Upload Zone */}
            <div className="relative glass-panel rounded-2xl p-md border border-white/5 hover:border-primary/40 transition-all duration-500 cursor-pointer flex flex-col items-center justify-center min-h-[420px] text-center group glow-amber">
              <input 
                type="file" 
                className="absolute inset-0 opacity-0 cursor-pointer z-20" 
                onChange={handleFileChange} 
                accept=".pdf,.docx" 
              />
              {/* AI Chip Background Pattern */}
              <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #ff7a00 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }}></div>
              {/* Floating Tech Icons Around Center */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <span className="material-symbols-outlined absolute top-10 left-10 text-white/10 text-4xl group-hover:text-primary/20 transition-colors duration-700">work</span>
                <span className="material-symbols-outlined absolute bottom-12 right-10 text-white/10 text-3xl group-hover:text-primary/20 transition-colors duration-700">search</span>
                <span className="material-symbols-outlined absolute top-20 right-16 text-white/10 text-2xl group-hover:text-primary/20 transition-colors duration-700">psychology</span>
                <span className="material-symbols-outlined absolute bottom-20 left-16 text-white/10 text-3xl group-hover:text-primary/20 transition-colors duration-700">query_stats</span>
              </div>
              {/* Icon Cluster */}
              <div className="mb-lg relative">
                <div className={`w-28 h-28 rounded-2xl bg-gradient-to-br ${file ? 'from-green-500/20' : 'from-primary/20'} to-transparent flex items-center justify-center relative z-10 border ${file ? 'border-green-500/40' : 'border-primary/20'} group-hover:border-primary/50 transition-all duration-500`}>
                  <span className={`material-symbols-outlined text-6xl ${file ? 'text-green-500' : 'text-primary'} drop-shadow-[0_0_12px_rgba(255,122,0,0.4)]`}>
                    {file ? 'check_circle' : 'upload_file'}
                  </span>
                </div>
                {/* Decorative Ring */}
                <div className={`absolute -inset-4 border ${file ? 'border-green-500/20' : 'border-primary/10'} rounded-3xl animate-[pulse_4s_infinite] group-hover:border-primary/30`}></div>
              </div>
              <h2 className="font-headline-md text-headline-md text-white mb-xs tracking-tight">
                {file ? file.name : 'Deploy your resume'}
              </h2>
              <p className="font-body-md text-body-md text-white/30 mb-xl">
                {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Supports PDF or DOCX up to 10MB'}
              </p>
              {file && (
                <button 
                  onClick={handleStartEngine}
                  disabled={uploading}
                  className="relative z-30 bg-primary text-black font-bold text-sm px-10 py-4 rounded-xl shadow-[0_10px_30px_-5px_rgba(255,122,0,0.4)] hover:shadow-[0_15px_40px_-5px_rgba(255,122,0,0.5)] transition-all active:scale-[0.98] flex items-center gap-3 overflow-hidden group/btn disabled:opacity-50"
                >
                  <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
                  <span className={`material-symbols-outlined text-xl ${uploading ? 'animate-spin' : ''}`}>
                    {uploading ? 'refresh' : 'rocket_launch'}
                  </span>
                  <span className="tracking-widest uppercase">{uploading ? 'Processing...' : 'Start Engine'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Bottom Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md mt-xl w-full max-w-3xl mx-auto">
            {/* PDF */}
            <div className="glass-panel p-6 rounded-2xl flex items-center gap-5 group hover:bg-white/[0.04] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/30 transition-all">
                <span className="material-symbols-outlined text-primary">picture_as_pdf</span>
              </div>
              <div>
                <p className="font-label-sm text-label-sm text-white/90">PDF Format</p>
                <p className="text-[11px] text-white/30">Neural Optimized</p>
              </div>
            </div>
            {/* Word */}
            <div className="glass-panel p-6 rounded-2xl flex items-center gap-5 group hover:bg-white/[0.04] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/30 transition-all">
                <span className="material-symbols-outlined text-primary">description</span>
              </div>
              <div>
                <p className="font-label-sm text-label-sm text-white/90">Word Doc</p>
                <p className="text-[11px] text-white/30">Standard Export</p>
              </div>
            </div>
            {/* Chip/AI Feature */}
            <div className="glass-panel p-6 rounded-2xl flex items-center gap-5 group hover:bg-white/[0.04] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:border-primary/50 transition-all">
                <span className="material-symbols-outlined text-primary">memory</span>
              </div>
              <div>
                <p className="font-label-sm text-label-sm text-white/90">AI Parsing</p>
                <p className="text-[11px] text-white/30">Instant Extraction</p>
              </div>
            </div>
          </div>

          {/* Security Trust Bar */}
          <div className="mt-16 flex items-center justify-center gap-4 text-white/20 font-label-sm text-[10px] tracking-[0.25em] uppercase">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">encrypted</span>
              AES-256
            </div>
            <span className="w-1 h-1 rounded-full bg-white/10"></span>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">verified_user</span>
              GDPR READY
            </div>
            <span className="w-1 h-1 rounded-full bg-white/10"></span>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">security</span>
              SSL SECURED
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full py-12 border-t border-white/5 bg-[#050505] relative z-10 mt-auto">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start">
            <div className="text-xl font-black text-primary/80 amber-text-glow">JobPilot AI</div>
            <p className="text-xs font-['Inter'] text-white/20 mt-1 uppercase tracking-widest">Autonomous Career Intelligence</p>
          </div>
          <div className="flex gap-10">
            <a className="text-xs font-medium text-white/40 hover:text-primary transition-colors tracking-widest uppercase" href="#">Privacy</a>
            <a className="text-xs font-medium text-white/40 hover:text-primary transition-colors tracking-widest uppercase" href="#">Terms</a>
            <a className="text-xs font-medium text-white/40 hover:text-primary transition-colors tracking-widest uppercase" href="#">Support</a>
          </div>
          <div className="flex gap-6">
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 hover:border-primary/30 cursor-pointer transition-all">
              <span className="material-symbols-outlined text-white/40 text-lg">language</span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 hover:border-primary/30 cursor-pointer transition-all">
              <span className="material-symbols-outlined text-white/40 text-lg">terminal</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UploadPage;
