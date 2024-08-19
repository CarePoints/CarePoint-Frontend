// AosInit.tsx
'use client'
import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AosInit = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Customize AOS settings here
    });
  }, []);
  
  return null; // This component does not render any DOM elements
};

export default AosInit;
