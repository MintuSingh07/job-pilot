import React, { createContext, useContext, useState } from 'react';

const StateContext = createContext();

export const StateProvider = ({ children }) => {
  const [linkedinData, setLinkedinData] = useState({ email: '', password: '' });
  const [resumeData, setResumeData] = useState({ raw_text: '', skills: '', filename: '' });
  const [session, setSession] = useState({ id: null, status: 'idle' });

  return (
    <StateContext.Provider value={{ 
      linkedinData, setLinkedinData, 
      resumeData, setResumeData,
      session, setSession 
    }}>
      {children}
    </StateContext.Provider>
  );
};

export const useAppState = () => useContext(StateContext);
