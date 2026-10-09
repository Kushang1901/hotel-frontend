"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { testimonials } from "@/data/testimonials";
import "./css/index.css";

export default function Home() {
  // === SLIDESHOW STATE ===
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoReady, setVideoReady] = useState({});
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const particlesCanvasRef = useRef(null);

  const slides = [
    { 
      src: "/Photos/index/counter-shot.mp4", 
      poster: "/Photos/index/Hero1.jpeg", 
      title: "Grand Reception & Welcome", 
      type: "video" 
    },
    { 
      src: "/Photos/index/sofa-shot.mp4", 
      poster: "/Photos/index/Hero2.jpeg", 
      title: "Executive Guest Lounge", 
      type: "video" 
    },
    { 
      src: "/Photos/index/entrance-shot2.mp4", 
      poster: "/Photos/index/Hero3.jpeg", 
      title: "Sacred Temple Gateway", 
      type: "video" 
    },
    { 
      src: "/Photos/index/Hotel_flow.mp4", 
      poster: "/Photos/index/Hero4.jpeg", 
      title: "Hotel Devang Dwarka", 
      type: "video" 
    }
  ];
  const slideDuration = 8000;
  const slideTimerRef = useRef(null);
  const linerRef = useRef(null);

  // Parallax subtle 3D hover tracking
  const handleHeroMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 14;
    setParallax({ x, y });
  };

  const handleHeroMouseLeave = () => {
    setParallax({ x: 0, y: 0 });
  };

  // Golden Sacred Ambient Particles Canvas
  useEffect(() => {
    const canvas = particlesCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId;
    let width = (canvas.width = canvas.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.offsetHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.offsetHeight || window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const particleCount = 30;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.8,
      speedY: Math.random() * 0.4 + 0.15,
      drift: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.2,
      baseAlpha: Math.random() * 0.5 + 0.2,
      freq: Math.random() * 0.02 + 0.01,
      color: Math.random() > 0.4 ? "#ffd700" : "#caa035"
    }));

    let t = 0;
    const render = () => {
      t += 1;
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.y -= p.speedY;
        p.x += Math.sin(t * p.freq) * 0.35 + p.drift;
        p.alpha = p.baseAlpha + Math.sin(t * p.freq * 2) * 0.15;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0.1, Math.min(0.85, p.alpha));
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#ffd700";
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  const startSlideshow = () => {
    stopSlideshow();
    slideTimerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, slideDuration);
    
    if (linerRef.current) {
      linerRef.current.style.animation = "none";
      void linerRef.current.offsetWidth; // Trigger reflow
      linerRef.current.style.animation = `linerProgress ${slideDuration}ms linear forwards`;
    }
  };

  const stopSlideshow = () => {
    if (slideTimerRef.current) {
      clearInterval(slideTimerRef.current);
      slideTimerRef.current = null;
    }
  };

  useEffect(() => {
    if (isPlaying) {
      startSlideshow();
    } else {
      stopSlideshow();
      if (linerRef.current) {
        linerRef.current.style.animation = "none";
      }
    }
    return () => stopSlideshow();
  }, [currentSlide, isPlaying]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // === TESTIMONIALS SLIDER STATE ===
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [isTestimonialPaused, setIsTestimonialPaused] = useState(false);
  const [expandedTestimonials, setExpandedTestimonials] = useState({});
  const visibleCards = 3;
  const testimonialTimerRef = useRef(null);

  // Auto-scroll testimonials
  useEffect(() => {
    const isAnyExpanded = Object.values(expandedTestimonials).some(val => val === true);
    
    if (!isTestimonialPaused && !isAnyExpanded) {
      testimonialTimerRef.current = setInterval(() => {
        setTestimonialIndex((prev) => {
          if (prev < testimonials.length - visibleCards) {
            return prev + 1;
          }
          return 0;
        });
      }, 2000);
    }
    
    return () => {
      if (testimonialTimerRef.current) {
        clearInterval(testimonialTimerRef.current);
      }
    };
  }, [isTestimonialPaused, expandedTestimonials]);

  const handlePrevTestimonial = () => {
    setTestimonialIndex((prev) => {
      if (prev > 0) return prev - 1;
      return testimonials.length - visibleCards;
    });
  };

  const handleNextTestimonial = () => {
    setTestimonialIndex((prev) => {
      if (prev < testimonials.length - visibleCards) return prev + 1;
      return 0;
    });
  };

  const toggleExpandTestimonial = (idx) => {
    setExpandedTestimonials((prev) => {
      const nextState = { ...prev, [idx]: !prev[idx] };
      // Pause slideshow if any card is expanded, otherwise resume
      const anyExpanded = Object.values(nextState).some(val => val === true);
      setIsTestimonialPaused(anyExpanded);
      return nextState;
    });
  };

  // Visibility observer for videos
  const videoRefs = useRef([]);
  useEffect(() => {
    if (typeof window !== "undefined" && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const video = entry.target;
            if (entry.isIntersecting) {
              // For slideshow videos, only play if it's the active slide
              const idx = videoRefs.current.indexOf(video);
              if (idx === -1 || idx === currentSlide) {
                video.play().catch(() => {});
              }
            } else {
              video.pause();
            }
          });
        },
        { threshold: 0.5 }
      );
      
      videoRefs.current.forEach((v) => {
        if (v) observer.observe(v);
      });
      
      return () => {
        videoRefs.current.forEach((v) => {
          if (v) observer.unobserve(v);
        });
      };
    }
  }, [currentSlide]);

  // Handle slideshow video playback on state change
  useEffect(() => {
    slides.forEach((_, idx) => {
      const video = videoRefs.current[idx];
      if (video) {
        if (idx === currentSlide && isPlaying) {
          const promise = video.play();
          if (promise !== undefined) {
            promise
              .then(() => {
                setVideoReady((prev) => ({ ...prev, [idx]: true }));
              })
              .catch(() => {});
          }
        } else {
          video.pause();
          try {
            video.currentTime = 0;
          } catch (e) {}
        }
      }
    });
  }, [currentSlide, isPlaying]);

  return (
    <div className="page-index">
      {/* ═══ HERO SECTION ═══ */}
      <section 
        className="hero" 
        id="home"
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
      >
        <div 
          className="slideshow-container"
          style={{
            transform: `translate3d(${parallax.x}px, ${parallax.y}px, 0) scale(1.04)`
          }}
        >
          {slides.map((slide, idx) => {
            const isActive = idx === currentSlide;
            const isNext = idx === (currentSlide + 1) % slides.length;
            return (
              <div 
                key={idx} 
                className={`slide ${isActive ? "active" : ""}`}
                aria-hidden={!isActive}
              >
                {/* Instant Cinematic Poster Image (0ms latency, Ken Burns animation) */}
                <img 
                  src={slide.poster} 
                  alt={slide.title} 
                  className="slide-poster"
                  loading={idx === 0 ? "eager" : "lazy"}
                />

                {/* Seamless Video Layer (crossfades smoothly once buffer is ready) */}
                <video 
                  ref={(el) => (videoRefs.current[idx] = el)}
                  autoPlay={isActive} 
                  muted 
                  loop 
                  playsInline 
                  preload={isActive || isNext ? "auto" : "metadata"}
                  onPlaying={() => setVideoReady((prev) => ({ ...prev, [idx]: true }))}
                  onLoadedData={() => setVideoReady((prev) => ({ ...prev, [idx]: true }))}
                  className={`slide-video ${videoReady[idx] && isActive ? "is-playing" : ""}`}
                >
                  <source src={slide.src} type="video/mp4" />
                </video>
              </div>
            );
          })}

          {/* Golden Ambient Particles Canvas */}
          <canvas ref={particlesCanvasRef} className="hero-particles" />

          <div ref={linerRef} className="slide-liner"></div>
        </div>

        <div className="hero-content">
          <div className="hero-location-badge">
            <span className="badge-sparkle">✦</span> {slides[currentSlide].title}
          </div>
          <h1>Welcome to Family Friendly <span className="hotel-name">Hotel-Devang</span></h1>
          <p>Experience divine hospitality in the sacred city Dwarka . Your spiritual journey begins with our warm welcome and comfortable stay.</p>
          <Link href="/room" className="cta-button ocean-btn">
            <span>Book Your Stay</span>
            <svg className="wave wave1" viewBox="0 0 2880 320" preserveAspectRatio="none">
              <path d="M 0,200 C 360,120 360,280 720,200 C 1080,120 1080,280 1440,200 C 1800,120 1800,280 2160,200 C 2520,120 2520,280 2880,200 V 320 H 0 Z"></path>
            </svg>
            <svg className="wave wave2" viewBox="0 0 2880 320" preserveAspectRatio="none">
              <path d="M 0,200 C 360,260 360,140 720,200 C 1080,260 1080,140 1440,200 C 1800,260 1800,140 2160,200 C 2520,260 2520,140 2880,200 V 320 H 0 Z"></path>
            </svg>
          </Link>
        </div>

        <div className="slideshow-controls">
          <button id="prevSlide" className="slide-btn" onClick={handlePrevSlide} aria-label="Previous slide">&#9664;</button>
          <button id="playPauseSlide" className="slide-btn" onClick={handlePlayPause} aria-label="Play or pause">
            {isPlaying ? "❚❚" : "▶"}
          </button>
          <button id="nextSlide" className="slide-btn" onClick={handleNextSlide} aria-label="Next slide">&#9654;</button>
        </div>
      </section>

      {/* ═══ STATS SECTION ═══ */}
      <section className="room-stats">
        <div className="container">
          <div className="stats-container">
            <div className="stat-item">
              <span className="stat-number">43</span>
              <span className="stat-label">Comfortable Rooms</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Service Available</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">4.2★</span>
              <span className="stat-label">Guest Experience</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ABOUT SECTION ═══ */}
      <section className="about" id="about">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>About Our Hotel</h2>
              <p>
                Nestled in the heart of sacred Dwarka, our heritage type hotel offers a perfect blend of traditional hospitality and modern comfort. Located in Gujarat's spiritual capital, we provide an authentic experience for pilgrims and travelers alike.
              </p>
              <p>
                With 43 well-appointed rooms, we ensure every guest enjoys a peaceful and memorable stay while exploring the divine city of Lord Krishna. Our strategic location makes it easy to visit all major temples and attractions in Dwarka.
              </p>
              <p>
                From families on pilgrimage to solo travelers seeking spiritual solace, we welcome everyone with open arms and genuine care that reflects the true spirit of Gujarat's hospitality.
              </p>
            </div>

            <div className="about-video" style={{
              borderRadius: "20px",
              overflow: "hidden",
              padding: "6px",
              background: "linear-gradient(135deg, #caa035, #880000)",
              boxShadow: "0 25px 45px rgba(0,0,0,0.15)"
            }}>
              <video 
                ref={(el) => (videoRefs.current[slides.length] = el)}
                width="100%" 
                autoPlay 
                muted 
                loop 
                playsInline 
                preload="auto" 
                style={{ borderRadius: "14px" }}
              >
                <source src="/Photos/index/title_video.mp4" type="video/mp4" />
              </video>
            </div>
          </div>

          <div className="about-btn-wrapper">
            <Link href="/blog" className="read-more-btn">Read More</Link>
          </div>
        </div>
      </section>

      {/* ═══ HIGHLIGHTS / WHY CHOOSE US ═══ */}
      <section className="highlights" id="amenities">
        <div className="container">
          <h2>Why Choose Hotel Devang?</h2>
          <div className="highlights-grid">
            <div className="highlight-card">
              <span className="highlight-icon"><i className="fa-solid fa-hotel"></i></span>
              <h3>Sacred Location</h3>
              <p>Strategically located in Dwarka, Gujarat - 361335, just minutes away from the famous Dwarkadhish Temple and other significant religious sites.</p>
            </div>
            <div className="highlight-card">
              <span className="highlight-icon"><i className="fa-solid fa-bed"></i></span>
              <h3>Comfortable Accommodation</h3>
              <p>43 well-furnished rooms with modern amenities, ensuring a comfortable stay for all our guests during their spiritual journey.</p>
            </div>
            <div className="highlight-card">
              <span className="highlight-icon"><i className="fa-solid fa-hands-praying"></i></span>
              <h3>Warm Hospitality</h3>
              <p>Experience authentic Gujarati hospitality with our caring staff who understand the needs of pilgrims and travelers.</p>
            </div>
            <div className="highlight-card">
              <span className="highlight-icon"><i className="fa-solid fa-plate-wheat"></i></span>
              <h3>Pure Vegetarian breakfast</h3>
              <p>Savor delicious, pure vegetarian meals prepared with love, respecting the spiritual significance of this holy city.</p>
            </div>
            <div className="highlight-card">
              <span className="highlight-icon"><i className="fa-solid fa-peace"></i></span>
              <h3>Peaceful Ambience</h3>
              <p>Enjoy a serene atmosphere perfect for meditation, prayer, and spiritual reflection in the divine city of Dwarka.</p>
            </div>
            <div className="highlight-card">
              <span className="highlight-icon"><i className="fa fa-inr" aria-hidden="true"></i></span>
              <h3>Affordable Rates</h3>
              <p>Quality accommodation at reasonable prices, making your pilgrimage comfortable without straining your budget.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS SLIDER SECTION ═══ */}
      <section className="google-testimonials">
        <div className="container">
          <h2 className="testimonial-heading">Discover Why Guests Love Staying Here</h2>
          <div className="testimonial-wrapper">
            <button className="testimonial-btn prev-btn" onClick={handlePrevTestimonial}>&#10094;</button>

            <div className="testimonial-slider" style={{ overflow: "hidden" }}>
              <div 
                className="testimonial-track"
                style={{
                  display: "flex",
                  transition: "transform 0.5s ease",
                  transform: `translateX(-${testimonialIndex * (100 / visibleCards)}%)`
                }}
              >
                {testimonials.map((item, idx) => {
                  const isExpanded = !!expandedTestimonials[idx];
                  const shouldShowReadMore = item.text.length > 150;
                  
                  return (
                    <div 
                      key={idx} 
                      className={`testimonial-item ${idx >= testimonialIndex && idx < testimonialIndex + visibleCards ? "active" : ""}`}
                      style={{ flex: `0 0 ${100 / visibleCards}%`, padding: "0 10px", boxSizing: "border-box" }}
                    >
                      <div className={`testimonial-card ${isExpanded ? "expanded" : ""}`}>
                        <img src="/Photos/index/comma.svg" className="quote-icon" alt="Quote" />
                        <p style={{ maxHeight: isExpanded ? "none" : "110px", overflow: "hidden" }}>
                          {item.text}
                        </p>
                        {shouldShowReadMore && (
                          <span 
                            className="auto-read-more"
                            onClick={() => toggleExpandTestimonial(idx)}
                            style={{ cursor: "pointer", color: "#caa035", fontWeight: "600", display: "block", marginTop: "5px" }}
                          >
                            {isExpanded ? "Read Less" : "Read More"}
                          </span>
                        )}
                        <div className="testimonial-footer">
                          <div>
                            <h4>{item.author}</h4>
                            <div className="stars">{item.stars}</div>
                          </div>
                          <img src="/Photos/index/google.svg" className="google-logo" alt="Google" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button className="testimonial-btn next-btn" onClick={handleNextTestimonial}>&#10095;</button>
          </div>
        </div>
      </section>
    </div>
  );
}
