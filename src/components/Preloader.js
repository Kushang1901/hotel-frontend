"use client";

import React, { useState, useEffect } from "react";

export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    // Hide preloader shortly after component mounts (DOM loaded)
    const fadeTimeout = setTimeout(() => {
      setOpacity(0);
      const hideTimeout = setTimeout(() => {
        setVisible(false);
      }, 500); // match transition duration
      return () => clearTimeout(hideTimeout);
    }, 300); // Reduced artificial delay from 800ms to 300ms for faster page transition

    // Failsafe auto-hide at 2.5s
    const failsafeTimeout = setTimeout(() => {
      setOpacity(0);
      setTimeout(() => {
        setVisible(false);
      }, 500);
    }, 2500);

    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(failsafeTimeout);
    };
  }, []);

  if (!visible) return null;

  return (
    <div 
      id="preloader" 
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100%",
        width: "100%",
        background: "#ffffff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 99999, // Ensure it sits above all elements
        opacity: opacity,
        transition: "opacity 0.5s ease"
      }}
    >
      <div style={{ position: "relative", width: "180px", height: "180px", display: "flex", justifyContent: "center", alignItems: "center" }}>
        {/* Golden spinning ring */}
        <div className="preloader-spinner"></div>
        {/* Static Logo in center (89KB instead of 5.5MB) */}
        <img 
          src="/Photos/index/logo.png" 
          alt="Hotel Devang" 
          style={{ 
            width: "120px", 
            height: "120px", 
            objectFit: "contain",
            animation: "pulse-logo 2s infinite ease-in-out"
          }} 
        />
      </div>
      
      {/* Inline styles for pure-CSS animations */}
      <style>{`
        .preloader-spinner {
          position: absolute;
          width: 160px;
          height: 160px;
          border: 3px solid rgba(202, 160, 53, 0.1);
          border-top: 3px solid #caa035; /* Gold brand color */
          border-radius: 50%;
          animation: spin-preloader 1.2s linear infinite;
        }
        @keyframes spin-preloader {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse-logo {
          0%, 100% { transform: scale(1); opacity: 0.95; }
          50% { transform: scale(1.04); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

