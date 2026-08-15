"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [expandedSubmenu, setExpandedSubmenu] = useState(null);
  const pathname = usePathname();

  const toggleSubmenu = (e, menuName) => {
    e.stopPropagation();
    setExpandedSubmenu(prev => prev === menuName ? null : menuName);
  };

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
            <li>
              <div className="mobile-nav-expand-group">
                <Link href="/room" className={pathname === "/room" ? "active" : ""} onClick={toggleMenu}>Rooms</Link>
                <button type="button" className="mobile-expand-btn" onClick={(e) => toggleSubmenu(e, 'rooms')} aria-label="Expand Rooms Submenu">
                  <i className={`fas ${expandedSubmenu === 'rooms' ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                </button>
              </div>
              <ul className={`mobile-submenu ${expandedSubmenu === 'rooms' ? 'expanded' : ''}`}>
                <li><Link href="/room/standard-ac" onClick={toggleMenu}>Standard AC</Link></li>
                <li><Link href="/room/standard-non-ac" onClick={toggleMenu}>Standard Non-AC</Link></li>
                <li><Link href="/room/deluxe-ac" onClick={toggleMenu}>Deluxe AC</Link></li>
                <li><Link href="/room/deluxe-non-ac" onClick={toggleMenu}>Deluxe Non-AC</Link></li>
                <li><Link href="/room/super-deluxe-ac" onClick={toggleMenu}>Super Deluxe AC</Link></li>
                <li><Link href="/room/super-deluxe-non-ac" onClick={toggleMenu}>Super Deluxe Non-AC</Link></li>
                <li><Link href="/room/suite-ac" onClick={toggleMenu}>Luxury Suite AC</Link></li>
              </ul>
            </li>
            <li><Link href="/gallery" className={pathname === "/gallery" ? "active" : ""} onClick={toggleMenu}>Gallery</Link></li>
            <li>
              <div className="mobile-nav-expand-group">
                <Link href="/facilities" className={pathname === "/facilities" ? "active" : ""} onClick={toggleMenu}>Facilities</Link>
                <button type="button" className="mobile-expand-btn" onClick={(e) => toggleSubmenu(e, 'facilities')} aria-label="Expand Facilities Submenu">
                  <i className={`fas ${expandedSubmenu === 'facilities' ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                </button>
              </div>
              <ul className={`mobile-submenu ${expandedSubmenu === 'facilities' ? 'expanded' : ''}`}>
                <li><Link href="/facilities/premium-ac-hall" onClick={toggleMenu}>Premium AC Hall</Link></li>
                <li><Link href="/facilities/traditional-hall-1" onClick={toggleMenu}>Traditional Hall 1</Link></li>
                <li><Link href="/facilities/traditional-hall-2" onClick={toggleMenu}>Traditional Hall 2</Link></li>
                <li><Link href="/facilities/ground-1" onClick={toggleMenu}>Ground — 1 Lawn</Link></li>
                <li><Link href="/facilities/ground-2" onClick={toggleMenu}>Ground — 2 Garden</Link></li>
                <li><Link href="/facilities/huge-event-venue" onClick={toggleMenu}>Huge Event Venue</Link></li>
              </ul>
            </li>
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
            <li className="has-mega-menu">
              <Link href="/room" className={pathname.startsWith("/room") ? "active" : ""}>
                Rooms <i className="fas fa-chevron-down nav-chevron"></i>
              </Link>
              <div className="mega-menu-dropdown">
                <div className="mega-menu-inner">
                  {/* Left Side: Room Categories Grid (2 Columns) */}
                  <div className="mega-menu-left">
                    <h4 className="mega-menu-title">Room Categories</h4>
                    <div className="mega-menu-grid">
                      <Link href="/room/standard-ac" className="mega-menu-item">
                        <div className="mega-item-icon"><i className="fas fa-snowflake"></i></div>
                        <div className="mega-item-text">
                          <h5>Standard AC Room <i className="fas fa-arrow-right"></i></h5>
                          <p>Comfortable budget stay with air conditioning near the temple.</p>
                        </div>
                      </Link>
                      <Link href="/room/standard-non-ac" className="mega-menu-item">
                        <div className="mega-item-icon"><i className="fas fa-fan"></i></div>
                        <div className="mega-item-text">
                          <h5>Standard Non-AC Room <i className="fas fa-arrow-right"></i></h5>
                          <p>Simple budget room with natural ventilation for traditional stays.</p>
                        </div>
                      </Link>
                      <Link href="/room/deluxe-ac" className="mega-menu-item">
                        <div className="mega-item-icon"><i className="fas fa-snowflake"></i></div>
                        <div className="mega-item-text">
                          <h5>Deluxe AC Room <i className="fas fa-arrow-right"></i></h5>
                          <p>Elegant spaces equipped with double beds & premium features.</p>
                        </div>
                      </Link>
                      <Link href="/room/deluxe-non-ac" className="mega-menu-item">
                        <div className="mega-item-icon"><i className="fas fa-fan"></i></div>
                        <div className="mega-item-text">
                          <h5>Deluxe Non-AC Room <i className="fas fa-arrow-right"></i></h5>
                          <p>Generous spaces with natural cooling options for family groups.</p>
                        </div>
                      </Link>
                      <Link href="/room/super-deluxe-ac" className="mega-menu-item">
                        <div className="mega-item-icon"><i className="fas fa-star"></i></div>
                        <div className="mega-item-text">
                          <h5>Super Deluxe AC Room <i className="fas fa-arrow-right"></i></h5>
                          <p>High-comfort family suites with premium interior styling.</p>
                        </div>
                      </Link>
                      <Link href="/room/super-deluxe-non-ac" className="mega-menu-item">
                        <div className="mega-item-icon"><i className="fas fa-star"></i></div>
                        <div className="mega-item-text">
                          <h5>Super Deluxe Non-AC <i className="fas fa-arrow-right"></i></h5>
                          <p>Traditional large spaces for big groups visiting sacred Dwarka.</p>
                        </div>
                      </Link>
                      <Link href="/room/suite-ac" className="mega-menu-item" style={{ gridColumn: "span 2" }}>
                        <div className="mega-item-icon"><i className="fas fa-crown"></i></div>
                        <div className="mega-item-text">
                          <h5>Luxury Suite AC Room <i className="fas fa-arrow-right"></i></h5>
                          <p>Our flagship luxury suite featuring maximum room size and premium lounge areas.</p>
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* Right Side: Quick Action Panel */}
                  <div className="mega-menu-right">
                    <h4 className="mega-menu-title">Quick Booking Access</h4>
                    <div className="mega-hub-cards">
                      <Link href="/booking" className="mega-hub-card">
                        <h5>Reserve Stay Online <i className="fas fa-arrow-right"></i></h5>
                        <p>Check live calendar availability and book your rooms instantly with immediate confirmation.</p>
                      </Link>
                      <Link href="/room" className="mega-hub-card">
                        <h5>Compare Rooms Grid <i className="fas fa-arrow-right"></i></h5>
                        <p>View all 7 categories side-by-side with complete dynamic pricing and space specifications.</p>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </li>
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
            <li className="has-mega-menu">
              <Link href="/facilities" className={pathname.startsWith("/facilities") ? "active" : ""}>
                Facilities <i className="fas fa-chevron-down nav-chevron"></i>
              </Link>
              <div className="mega-menu-dropdown">
                <div className="mega-menu-inner">
                  {/* Left Side: Venues Grid (2 Columns) */}
                  <div className="mega-menu-left">
                    <h4 className="mega-menu-title">Our Event Venues</h4>
                    <div className="mega-menu-grid">
                      <Link href="/facilities/premium-ac-hall" className="mega-menu-item">
                        <div className="mega-item-icon"><i className="fas fa-snowflake"></i></div>
                        <div className="mega-item-text">
                          <h5>Premium AC Hall <i className="fas fa-arrow-right"></i></h5>
                          <p>4,500 sq.ft fully climate-controlled indoor venue for up to 450 guests.</p>
                        </div>
                      </Link>
                      <Link href="/facilities/traditional-hall-1" className="mega-menu-item">
                        <div className="mega-item-icon"><i className="fas fa-wind"></i></div>
                        <div className="mega-item-text">
                          <h5>Traditional Hall 1 <i className="fas fa-arrow-right"></i></h5>
                          <p>Spacious naturally-ventilated venue ideal for standard pooja rituals.</p>
                        </div>
                      </Link>
                      <Link href="/facilities/traditional-hall-2" className="mega-menu-item">
                        <div className="mega-item-icon"><i className="fas fa-wind"></i></div>
                        <div className="mega-item-text">
                          <h5>Traditional Hall 2 <i className="fas fa-arrow-right"></i></h5>
                          <p>Multi-purpose indoor space for family events and large group meals.</p>
                        </div>
                      </Link>
                      <Link href="/facilities/ground-1" className="mega-menu-item">
                        <div className="mega-item-icon"><i className="fas fa-tree"></i></div>
                        <div className="mega-item-text">
                          <h5>Ground — 1 Lawn <i className="fas fa-arrow-right"></i></h5>
                          <p>15,000 sq.ft grand outdoor wedding ground for up to 1,200 attendees.</p>
                        </div>
                      </Link>
                      <Link href="/facilities/ground-2" className="mega-menu-item">
                        <div className="mega-item-icon"><i className="fas fa-leaf"></i></div>
                        <div className="mega-item-text">
                          <h5>Ground — 2 Garden <i className="fas fa-arrow-right"></i></h5>
                          <p>Intimate beautifully landscaped garden lawn for romantic ceremonies.</p>
                        </div>
                      </Link>
                      <Link href="/facilities/huge-event-venue" className="mega-menu-item">
                        <div className="mega-item-icon"><i className="fas fa-circle-nodes"></i></div>
                        <div className="mega-item-text">
                          <h5>Huge Event Ground <i className="fas fa-arrow-right"></i></h5>
                          <p>20,000 sq.ft mega open ground suitable for high-attendance weddings.</p>
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* Right Side: Event Booking Hub */}
                  <div className="mega-menu-right">
                    <h4 className="mega-menu-title">Interactive Event Hub</h4>
                    <div className="mega-hub-cards">
                      <Link href="/facilities" className="mega-hub-card">
                        <h5>Explore Venues Overview <i className="fas fa-arrow-right"></i></h5>
                        <p>View photo galleries, features list, and customer testimonials for all spaces.</p>
                      </Link>
                      <Link href="/contact" className="mega-hub-card">
                        <h5>Get Event Custom Quote <i className="fas fa-arrow-right"></i></h5>
                        <p>Connect with our expert team to check dates availability and get pricing lists.</p>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </li>
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
