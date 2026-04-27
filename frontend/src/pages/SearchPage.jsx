import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { io } from 'socket.io-client';
import { useAppState } from '../context/StateContext';

const SearchPage = () => {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ scanned: 0, shortlisted: 0, tailored: 0, applied: 0 });
  const [appliedJobs, setAppliedJobs] = useState([]);
  const navigate = useNavigate();
  const { linkedinData, resumeData } = useAppState();
  const socketRef = useRef(null);
  const appliedJobsRef = useRef([]);

  useEffect(() => {
    // Redirect if no credentials or resume
    if (!linkedinData.email || (!resumeData.raw_text && !resumeData.filename)) {
      console.warn("Missing data, but continuing for demonstration");
    }

    // Connect to Socket.io
    socketRef.current = io('http://localhost:8000');

    socketRef.current.on('log', (data) => {
      console.log("FRONTEND LOG: Socket received log data:", data);
      setLogs(prev => {
        const newLog = {
          time: new Date().toLocaleTimeString().split(' ')[0],
          status: data.level,
          text: data.message,
          color: data.message.includes('✨') ? 'text-amber-400' : 
                 data.message.includes('✅') ? 'text-green-500' : 
                 data.level === 'ERROR' ? 'text-red-500' : 'text-white/60'
        };
        return [...prev.slice(-11), newLog];
      });

      // Update stats based on log messages (mock simulation matching backend emit)
      if (data.message.includes('Analyzing')) setStats(s => ({ ...s, scanned: s.scanned + 1 }));
      if (data.message.includes('Gemini Match Score')) setStats(s => ({ ...s, shortlisted: s.shortlisted + 1 }));
      if (data.message.includes('Tailoring')) setStats(s => ({ ...s, tailored: s.tailored + 1 }));
      if (data.message.includes('Submitting Application')) setStats(s => ({ ...s, applied: s.applied + 1 }));
      if (data.message.includes('complete')) {
        setTimeout(() => navigate('/results', { state: { appliedJobs: appliedJobsRef.current } }), 2000);
      }
    });

    socketRef.current.on('job_applied', (jobData) => {
      setAppliedJobs(prev => {
        const newJobs = [...prev, jobData];
        appliedJobsRef.current = newJobs;
        return newJobs;
      });
    });

    // Start automation
    const startAutomation = async () => {
      console.log("FRONTEND LOG: Starting automation API call...");
      const formData = new FormData();
      formData.append('email', linkedinData.email || 'demo@example.com');
      formData.append('password', linkedinData.password || 'demo');
      formData.append('resume_text', resumeData.raw_text || 'Demo Resume Text');
      formData.append('skills', resumeData.skills || 'React, Python');

      try {
        await fetch('http://localhost:8000/start-automation', {
          method: 'POST',
          body: formData,
        });
      } catch (error) {
        console.error('Failed to start automation:', error);
      }
    };

    startAutomation();

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [linkedinData, resumeData, navigate]);

  return (
    <div className="bg-[#050505] text-on-surface font-body-md min-h-screen selection:bg-primary-container relative overflow-hidden">
      <style>{`
        .grid-overlay {
          background-image: 
            linear-gradient(to right, rgba(255,122,0,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,122,0,0.05) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .scan-line {
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #ff7a00, transparent);
          position: absolute;
          top: 0;
          left: 0;
          animation: scan 4s linear infinite;
          opacity: 0.3;
        }
        @keyframes scan {
          from { top: 0; }
          to { top: 100%; }
        }
      `}</style>

      {/* Background Decor */}
      <div className="absolute inset-0 grid-overlay z-0">
        <div className="scan-line"></div>
      </div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[180px] pointer-events-none"></div>

      <header className="fixed top-0 w-full z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/10">
        <nav className="flex justify-between items-center h-16 px-8 max-w-[1440px] mx-auto">
          <div className="text-2xl font-black text-primary amber-text-glow tracking-tight">JobPilot</div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Active session</span>
            </div>
          </div>
        </nav>
      </header>

      <main className="relative pt-24 pb-xl px-8 max-w-6xl mx-auto z-10">
        <section className="flex flex-col items-center pt-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 py-1.5 px-4 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-md flex items-center gap-3"
          >
            <span className="material-symbols-outlined text-primary text-sm">memory</span>
            <span className="text-primary font-bold text-[10px] uppercase tracking-[0.25em]">Neural Engine Running</span>
          </motion.div>
          
          <h1 className="text-center font-display-xl text-5xl md:text-7xl text-white mb-12 tracking-tight">
            Inference in <span className="text-primary amber-text-glow italic">Progress</span>
          </h1>

          {/* Stats Bento Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-12">
            {[
              { label: 'Roles Scanned', value: stats.scanned, icon: 'manage_search' },
              { label: 'Shortlisted', value: stats.shortlisted, icon: 'fact_check' },
              { label: 'AI Tailored', value: stats.tailored, icon: 'edit_document' },
              { label: 'Applied', value: stats.applied, icon: 'rocket_launch' }
            ].map((stat, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: i * 0.1 }}
                className="glass-panel p-6 rounded-2xl border-white/5 hover:border-primary/30 transition-all group overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-full translate-x-4 -translate-y-4 group-hover:scale-150 transition-transform"></div>
                <div className="flex items-center gap-3 mb-3 relative">
                  <span className="material-symbols-outlined text-primary/60 text-xl">{stat.icon}</span>
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{stat.label}</span>
                </div>
                <div className="text-4xl font-black text-white relative leading-none">{stat.value}</div>
              </motion.div>
            ))}
          </div>

          {/* Main Console */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.4 }}
            className="w-full glass-panel rounded-2xl overflow-hidden shadow-2xl border-white/10"
          >
            <div className="bg-white/[0.03] px-6 py-3.5 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                </div>
                <span className="ml-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Engine Console</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-bold text-primary animate-pulse">EXECUTING_AGENTS</span>
                <span className="text-[10px] font-bold text-white/20 tracking-tighter">NODE_01</span>
              </div>
            </div>
            <div className="p-8 font-mono text-sm bg-black/40 min-h-[400px] flex flex-col justify-end">
              <div className="space-y-3">
                {logs.map((log, i) => (
                  <div key={i} className="flex gap-4 items-start opacity-0 animate-[fade-in_0.3s_forwards]">
                    <span className="text-white/10 shrink-0 font-bold">{log.time}</span>
                    <span className={`${log.color} shrink-0 font-bold min-w-[50px]`}>{log.status}</span>
                    <span className="text-white/70 leading-relaxed">{log.text}</span>
                  </div>
                ))}
                <div className="flex gap-4 items-center">
                  <span className="text-white/10 shrink-0 font-bold">{new Date().toLocaleTimeString().split(' ')[0]}</span>
                  <span className="text-primary font-bold shrink-0 min-w-[50px] animate-pulse">CORE</span>
                  <span className="text-white/90">Calculating next optimal target...</span>
                  <motion.span 
                    animate={{ opacity: [0, 1, 0] }} 
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="inline-block w-2.5 h-5 bg-primary/80 align-middle ml-1"
                  />
                </div>
              </div>
            </div>
          </motion.div>
          
          <div className="mt-12 text-center">
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">Status: autonomous_mode_v2.4.1</p>
          </div>
        </section>
      </main>

      <style>{`
        @keyframes fade-in {
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default SearchPage;
