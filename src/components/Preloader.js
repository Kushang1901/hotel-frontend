"use client";

import React, { useState, useEffect } from "react";

export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    // Hide preloader after component mounts (DOM loaded equivalent)
    const fadeTimeout = setTimeout(() => {
      setOpacity(0);
      const hideTimeout = setTimeout(() => {
        setVisible(false);
      }, 500); // match transition duration
      return () => clearTimeout(hideTimeout);
    }, 800); // Give it a slight delay for smooth visual transition

    // Failsafe auto-hide at 3.5s
    const failsafeTimeout = setTimeout(() => {
      setOpacity(0);
      setTimeout(() => {
        setVisible(false);
      }, 500);
    }, 3500);

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
        opacity: opacity,
        transition: "opacity 0.5s ease"
      }}
    >
      <img src="/Photos/index/loader.gif" alt="Loading..." />
    </div>
  );
}
