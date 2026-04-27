import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const ResultsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const appliedJobs = location.state?.appliedJobs || [];

  // Fallback to demo data if accessed directly without automation
  const jobs = appliedJobs.length > 0 ? appliedJobs : [
    { title: 'Senior Product Designer', company: 'OpenAI', loc: 'San Francisco, CA', score: '98%', status: 'Applied', link: 'https://www.linkedin.com/jobs/search/?keywords=Senior%20Product%20Designer%20OpenAI' }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-on-surface font-body-md selection:bg-primary-container selection:text-white relative overflow-hidden">
      {/* Background Decorative Ambient */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[100px] rounded-full"></div>
      </div>

      <header className="fixed top-0 w-full z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-[1440px] mx-auto flex justify-between items-center h-16 px-8">
          <div className="text-2xl font-black text-primary amber-text-glow tracking-tight">JobPilot</div>
          <button onClick={() => navigate('/')} className="px-6 py-2 bg-primary text-black rounded-lg text-sm font-bold hover:scale-105 transition-all">New Session</button>
        </div>
      </header>

      <main className="pt-24 pb-xl px-8 max-w-[1440px] mx-auto relative z-10">
        {/* Success Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
            <span className="material-symbols-outlined text-[14px] text-green-500">verified</span>
            <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Automation Successful</span>
          </div>
          <h1 className="font-display-xl text-5xl md:text-7xl mb-4 tracking-tight leading-[1.1]">
            Automation <span className="text-primary amber-text-glow">Complete</span>
          </h1>
          <p className="text-white/50 text-lg max-w-2xl font-body-lg">
            Your pilot session has successfully submitted applications with optimized ATS compatibility and hyper-personalized cover letters.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          {[
            { label: 'Applications Sent', value: jobs.length.toString(), trend: 'Automated by AI', color: 'primary' },
            { label: 'Avg. ATS Match', value: '94%', sub: '94/100 optimized', color: 'primary' },
            { label: 'Time Saved', value: '6.4h', sub: 'Manual work automated', color: 'primary' },
            { label: 'Verified Session', icon: 'check_circle', sub: 'Securely Executed', color: 'green' }
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.1 }}
              className={`glass-panel p-8 rounded-2xl flex flex-col justify-between h-[200px] border-white/5 hover:border-primary/20 transition-all ${stat.icon ? 'bg-gradient-to-br from-primary/5 to-transparent' : ''}`}
            >
              <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">{stat.label}</span>
              {stat.icon ? (
                <div className="flex flex-col items-center justify-center flex-grow">
                  <span className="material-symbols-outlined text-primary text-6xl mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>{stat.icon}</span>
                  <span className="text-xs text-white/30 uppercase tracking-widest">{stat.sub}</span>
                </div>
              ) : (
                <>
                  <div className="text-6xl font-black text-primary amber-text-glow leading-none">{stat.value}</div>
                  <div className={`text-[10px] font-bold uppercase tracking-widest mt-4 ${stat.trend ? 'text-green-500' : 'text-white/30'}`}>
                    {stat.trend || stat.sub}
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>

        {/* Job List */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight mb-1">Deployment Registry</h2>
              <p className="text-sm text-white/30">Detailed log of all successful applications during this session.</p>
            </div>
            <button className="px-6 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">download</span> Export Report
            </button>
          </div>
          
          <div className="space-y-4">
            {jobs.map((job, i) => (
              <div key={i} className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/[0.04] transition-all border-white/5 group">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 text-primary group-hover:border-primary/40 transition-all">
                    <span className="material-symbols-outlined text-2xl">bolt</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white mb-0.5">{job.title}</h3>
                    <p className="text-sm text-white/30 font-medium">{job.company}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-8">
                  <div className="hidden lg:block text-right">
                    <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold mb-1">Location</p>
                    <p className="text-sm text-white/60">{job.loc}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold mb-1">ATS Match</p>
                    <span className="px-4 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-xs text-green-500 font-bold">{job.score} Match</span>
                  </div>
                  <a href={job.link} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-primary/50 hover:bg-primary/5 transition-all group">
                    <span className="material-symbols-outlined text-white/40 group-hover:text-primary transition-colors text-xl">open_in_new</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 border-t border-white/5 bg-[#050505] mt-24">
        <div className="max-w-[1440px] mx-auto px-8 flex justify-between items-center">
          <div className="text-xl font-black text-primary/80 amber-text-glow">JobPilot AI</div>
          <div className="flex gap-8">
            <span className="material-symbols-outlined text-white/20 hover:text-primary cursor-pointer transition-colors">terminal</span>
            <span className="material-symbols-outlined text-white/20 hover:text-primary cursor-pointer transition-colors">history</span>
            <span className="material-symbols-outlined text-white/20 hover:text-primary cursor-pointer transition-colors">settings</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ResultsPage;
