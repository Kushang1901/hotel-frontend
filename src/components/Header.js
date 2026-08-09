"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    let lastScrollTop = 0;
    
    const handleScroll = () => {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop || 0;
      
      if (currentScroll > 60) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      if (!isMenuOpen) {
        if (currentScroll > lastScrollTop && currentScroll > 120) {
          setIsHeaderVisible(false);
        } else {
          setIsHeaderVisible(true);
        }
      } else {
        setIsHeaderVisible(true);
      }

      lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMenuOpen]);

  const toggleMenu = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
      const savedY = parseInt(document.body.getAttribute("data-scroll-y") || "0", 10);
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.classList.remove("menu-open");
      window.scrollTo(0, savedY);
    } else {
      const currentY = window.scrollY || 0;
      document.body.setAttribute("data-scroll-y", String(currentY));
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${currentY}px`;
      document.body.style.width = "100%";
      document.body.classList.add("menu-open");
      setIsMenuOpen(true);
    }
  };

  useEffect(() => {
    // Reset body lock on navigation change
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    document.body.classList.remove("menu-open");
    setIsMenuOpen(false);
  }, [pathname]);

  const tickerText = "Jay Dwarkadhish | Welcome to Hotel Devang digital World | जय द्वारकाधीश | होटल देवांग के डिजिटल वर्ल्ड में आपका स्वागत है | જય દ્વારકાધીશ | હોટેલ દેવાંગ ના ડિજિટલ વર્લ્ડ માં આપણું સ્વાગત છે | ";

  return (
    <>
      {/* ═══ MOBILE FULL-SCREEN OVERLAY NAV ═══ */}
      <div 
        className={`mobile-overlay ${isMenuOpen ? "active" : ""}`} 
        id="mobileOverlay"
        style={{
          display: isMenuOpen ? "flex" : "none",
          visibility: isMenuOpen ? "visible" : "hidden",
          pointerEvents: isMenuOpen ? "all" : "none"
        }}
        onClick={(e) => {
          if (e.target.id === "mobileOverlay") {
            toggleMenu();
          }
        }}
      >
        <button 
          className={`overlay-close ${isMenuOpen ? "open" : ""}`} 
          id="overlayClose" 
          onClick={toggleMenu} 
          aria-label="Close Menu"
        >
          <span></span>
          <span></span>
        </button>
        <div className="overlay-content">
          <div className="overlay-logo">
            <img src="/Photos/index/logo.png" alt="Hotel Devang Logo" />
            <span className="overlay-logo-name">Hotel Devang</span>
          </div>
          <div className="overlay-rule"></div>
          <ul className="overlay-links">
            <li><Link href="/" className={pathname === "/" ? "active" : ""} onClick={toggleMenu}>Home</Link></li>
            <li><Link href="/about_us" className={pathname === "/about_us" ? "active" : ""} onClick={toggleMenu}>About Us</Link></li>
            <li><Link href="/room" className={pathname === "/room" ? "active" : ""} onClick={toggleMenu}>Rooms</Link></li>
            <li><Link href="/gallery" className={pathname === "/gallery" ? "active" : ""} onClick={toggleMenu}>Gallery</Link></li>
            <li><Link href="/facilities" className={pathname === "/facilities" ? "active" : ""} onClick={toggleMenu}>Facilities</Link></li>
            <li><Link href="/booking" className={pathname === "/booking" ? "active" : ""} onClick={toggleMenu}>Booking</Link></li>
            <li><Link href="/dwarka_attractions" className={pathname === "/dwarka_attractions" ? "active" : ""} onClick={toggleMenu}>Nearby Attractions</Link></li>
            <li><Link href="/policies" className={pathname === "/policies" ? "active" : ""} onClick={toggleMenu}>Policies</Link></li>
            <li><Link href="/contact" className={pathname === "/contact" ? "active" : ""} onClick={toggleMenu}>Contact Us</Link></li>
          </ul>
          <Link href="/booking" className="overlay-book-cta" onClick={toggleMenu}>Reserve Your Stay</Link>
        </div>
      </div>

      {/* ═══ MAIN HEADER — SPLIT CENTER LOGO ═══ */}
      <header 
        id="mainHeader" 
        className={isScrolled ? "scrolled" : ""}
        style={{
          top: isHeaderVisible ? "0px" : "-120px"
        }}
      >
        {/* Ticker bar directly inside Header */}
        <div id="headerTicker" className="ticker-wrap">
          <div className="ticker-content">
            <span>{tickerText}</span>
            <span>{tickerText}</span>
          </div>
        </div>

        <nav className="split-nav">
          {/* Left links: Home · About · Rooms · Gallery */}
          <ul className="nav-left">
            <li><Link href="/" className={pathname === "/" ? "active" : ""}>Home</Link></li>
            <li><Link href="/about_us" className={pathname === "/about_us" ? "active" : ""}>About</Link></li>
            <li><Link href="/room" className={pathname === "/room" ? "active" : ""}>Rooms</Link></li>
            <li><Link href="/gallery" className={pathname === "/gallery" ? "active" : ""}>Gallery</Link></li>
          </ul>

          {/* Center logo */}
          <div className="nav-center-logo">
            <Link href="/">
              <div className="logo-img-wrap">
                <img src="/Photos/index/logo.png" alt="Hotel Devang" />
              </div>
              <div className="logo-text-wrap">
                <span className="logo-ornament">✦</span>
                <span className="logo-name">Hotel Devang</span>
                <span className="logo-ornament">✦</span>
              </div>
            </Link>
          </div>

          {/* Right links: Facilities · Booking · Attractions · Contact */}
          <ul className="nav-right">
            <li><Link href="/facilities" className={pathname === "/facilities" ? "active" : ""}>Facilities</Link></li>
            <li><Link href="/booking" className={pathname === "/booking" ? "active" : ""}>Booking</Link></li>
            <li><Link href="/dwarka_attractions" className={pathname === "/dwarka_attractions" ? "active" : ""}>Attractions</Link></li>
            <li><Link href="/contact" className={pathname === "/contact" ? "active" : ""}>Contact</Link></li>
          </ul>

          {/* Mobile hamburger (visible on ≤1024px) */}
          <button 
            className={`menu-toggle ${isMenuOpen ? "open" : ""}`} 
            id="menuToggle" 
            onClick={toggleMenu} 
            aria-label="Open Navigation"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </nav>
      </header>
    </>
  );
}
