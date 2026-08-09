"use client";

import React, { useState, useEffect } from "react";

export default function BackToTop() {
  const [showButton, setShowButton] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // 1. Back to Top visibility
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }

      // 2. Scroll Progress calculation
      const scrollTop = document.documentElement.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      
      if (height > 0) {
        const progress = (scrollTop / height) * 100;
        setScrollProgress(progress);
      } else {
        setScrollProgress(0);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Scroll Progress Bar */}
      <div 
        id="scroll-progress" 
        style={{ 
          width: `${scrollProgress}%`,
          position: "fixed",
          top: 0,
          left: 0,
          height: "3px",
          backgroundColor: "#caa035", // gold
          zIndex: 9999,
          transition: "width 0.1s ease"
        }} 
      />

      {/* Back to Top Button */}
      <a
        href="#home"
        id="backToTop"
        className={`back-to-top ${showButton ? "show" : ""}`}
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        <i className="fa-solid fa-chevron-up"></i>
      </a>
    </>
  );
}
