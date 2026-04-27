import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppState } from '../context/StateContext';

const LinkedInConnectPage = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setLinkedinData } = useAppState();

  const handleConnect = (e) => {
    e.preventDefault();
    console.log("FRONTEND LOG: Connecting LinkedIn with email:", email);
    setLoading(true);
    // Save to global state
    setLinkedinData({ email, password });
    // Simulate connection
    setTimeout(() => {
      setLoading(false);
      navigate('/upload');
    }, 1500);
  };

  return (
    <div className="bg-[#050505] text-on-surface font-body-md selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col relative overflow-hidden">
      <style>{`
        .glass-panel {
            background: rgba(10, 10, 10, 0.6);
            backdrop-filter: blur(24px);
            border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .glow-orange {
            box-shadow: 0 0 20px rgba(255, 122, 0, 0.2);
        }
        .glow-border:focus-within {
            box-shadow: 0 0 12px rgba(255, 122, 0, 0.3);
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .amber-text-glow {
            text-shadow: 0 0 15px rgba(255, 122, 0, 0.4);
        }
      `}</style>

      {/* Top Navigation */}
      <header className="bg-[#050505]/80 backdrop-blur-xl fixed top-0 w-full z-50 border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
        <div className="flex justify-between items-center h-16 px-8 max-w-[1440px] mx-auto">
          <div className="flex items-center gap-8">
            <span 
              className="text-2xl font-black text-[#ff7a00] drop-shadow-[0_0_8px_rgba(255,122,0,0.5)] font-['Inter'] tracking-tight cursor-pointer" 
              onClick={() => navigate('/')}
            >
              JobPilot
            </span>
            <nav className="hidden md:flex gap-6">
              <a className="text-white/60 hover:text-white transition-colors font-['Inter'] text-sm" href="#">Dashboard</a>
              <a className="text-white/60 hover:text-white transition-colors font-['Inter'] text-sm" href="#">Automation</a>
              <a className="text-white/60 hover:text-white transition-colors font-['Inter'] text-sm" href="#">Talent</a>
              <a className="text-white/60 hover:text-white transition-colors font-['Inter'] text-sm" href="#">Analytics</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="material-symbols-outlined text-white/60 hover:bg-white/5 p-2 rounded-md transition-all active:scale-95 duration-200">notifications</button>
            <button className="material-symbols-outlined text-white/60 hover:bg-white/5 p-2 rounded-md transition-all active:scale-95 duration-200">settings</button>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10">
              <img alt="User profile avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_0QG3BtX9c4suVfxl0i24Q8gwy46r9TYBQzLCltRlHBQJHkemntwBGxfNNMgEb4Os2hqDEynajj7yytxhZmk6rnA5GgAIxAfQ1JH30_nuVfvfuVCL_8OAMV-mSKMv0SqKlbkENut8mGMgFAr7czbHg9YYUJICcMgDxXD23qqQYOe9TNrEPSdCGM3IkYQF7IUtIusJjkOAR9F_JX1jHnqS8JKE7kngwzkZ7LFjsvWuBlo0pmehBcO7FO2I57Oyp_H3kv3rVI7WSFk"/>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-24 pb-xl px-gutter flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-container/5 blur-[120px] rounded-full -z-10"></div>
        
        {/* Connection Card Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-[480px] w-full relative z-10"
        >
          <div className="glass-panel p-xl rounded-xl glow-orange flex flex-col items-center">
            {/* Security Header */}
            <div className="mb-lg flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-[#0077B5]/10 border border-[#0077B5]/30 rounded-full flex items-center justify-center mb-md relative">
                <svg className="relative w-12 h-12 text-[#0077B5] fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
                </svg>
                <div className="absolute inset-0 bg-[#0077B5]/20 blur-xl rounded-full -z-10"></div>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs amber-text-glow">Connect LinkedIn</h1>
              <p className="font-body-md text-on-surface-variant max-w-[320px]">Establish a high-fidelity bridge to your professional network with military-grade encryption.</p>
            </div>

            {/* Form Section */}
            <form className="w-full space-y-md" onSubmit={handleConnect}>
              <div className="space-y-xs">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block ml-xs">Enter LinkedIn Email</label>
                <div className="relative group glow-border">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary transition-colors">mail</span>
                  <input 
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg py-4 pl-12 pr-4 text-on-surface placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-all font-body-md" 
                    placeholder="example@email.com" 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-xs">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block ml-xs">Enter LinkedIn Password</label>
                <div className="relative group glow-border">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary transition-colors">key</span>
                  <input 
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg py-4 pl-12 pr-4 text-on-surface placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-all font-body-md" 
                    placeholder="Your LinkedIn Password" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button 
                disabled={loading}
                className="w-full bg-primary text-black font-bold py-4 rounded-lg shadow-[0_4px_12px_rgba(255,122,0,0.3)] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group" 
                type="submit"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">refresh</span>
                    <span>Authorizing...</span>
                  </>
                ) : (
                  <>
                    <span>Authorize Integration</span>
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </>
                )}
              </button>
            </form>

            {/* Secure Environment Section */}
            <div className="mt-xl w-full pt-lg border-t border-white/5">
              <div className="flex items-center justify-center gap-2 mb-md">
                <span className="material-symbols-outlined text-primary text-sm">verified_user</span>
                <span className="font-label-sm text-label-sm text-white/40 uppercase tracking-widest">Secure Compute Environment</span>
              </div>
              <div className="grid grid-cols-2 gap-sm">
                <div className="bg-white/5 border border-white/10 rounded-md p-3 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_#ff7a00]"></div>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-[10px] text-white/60">ENCRYPTION</span>
                    <span className="font-label-sm text-on-surface text-[11px]">AES-256 BIT</span>
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-md p-3 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_#ff7a00]"></div>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-[10px] text-white/60">COMPLIANCE</span>
                    <span className="font-label-sm text-on-surface text-[11px]">SOC2 TYPE II</span>
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-md p-3 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_#ff7a00]"></div>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-[10px] text-white/60">NETWORK</span>
                    <span className="font-label-sm text-on-surface text-[11px]">PRIVATE VPC</span>
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-md p-3 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_#ff7a00]"></div>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-[10px] text-white/60">PRIVACY</span>
                    <span className="font-label-sm text-on-surface text-[11px]">GDPR READY</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Assistance Link */}
            <p className="mt-lg font-label-sm text-label-sm text-white/40">
              Trouble connecting? <a className="text-primary hover:underline transition-all" href="#">Consult Security Docs</a>
            </p>
          </div>

          {/* Trust Footer */}
          <div className="mt-md flex items-center justify-center gap-4 text-white/20">
            <span className="material-symbols-outlined text-lg">shield</span>
            <span className="font-label-sm text-[11px]">JobPilot AI never stores your LinkedIn credentials. All sessions are ephemeral.</span>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-[#050505] w-full py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="text-lg font-bold text-[#ff7a00]">JobPilot</span>
            <span className="text-sm font-['Inter'] text-white/40">© 2024 JobPilot AI. Automated Excellence.</span>
          </div>
          <div className="flex gap-8">
            <a className="text-white/40 hover:text-[#ff7a00] text-sm font-['Inter'] transition-colors" href="#">Privacy Policy</a>
            <a className="text-white/40 hover:text-[#ff7a00] text-sm font-['Inter'] transition-colors" href="#">Terms of Service</a>
            <a className="text-white/40 hover:text-[#ff7a00] text-sm font-['Inter'] transition-colors" href="#">API Documentation</a>
            <a className="text-white/40 hover:text-[#ff7a00] text-sm font-['Inter'] transition-colors" href="#">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LinkedInConnectPage;
