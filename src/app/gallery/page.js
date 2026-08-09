"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import "../css/gallery.css";

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const galleryItems = [
    // ROOMS
    {
      category: "rooms",
      src: "/Photos/gallery/super_deluxe.jpeg",
      title: "Super Deluxe Room",
      desc: "Spacious and comfortable room with modern amenities and traditional touch"
    },
    {
      category: "rooms",
      src: "/Photos/gallery/suite.jpeg",
      title: "Premium Suite",
      desc: "Luxurious suite with separate living area and enhanced comfort"
    },
    {
      category: "rooms",
      src: "/Photos/gallery/standard.jpeg",
      title: "Classic Standard",
      desc: "A comfortability with a standard rates and relaxable stay"
    },
    {
      category: "rooms",
      src: "/Photos/gallery/deluxe_ac.jpeg",
      title: "Proper Deluxe",
      desc: "More than a Standard with more relaxation and more comfortness"
    },
    {
      category: "rooms",
      src: "/Photos/gallery/seating.jpeg",
      title: "Seating Area",
      desc: "Perfect for families with children, spacious and well-appointed"
    },
    // BATHROOMS
    {
      category: "bathrooms",
      src: "/Photos/gallery/bathroom.JPG",
      title: "Spacious Bathroom",
      desc: "Clean and contemporary bathroom with all essential amenities"
    },
    // OUTDOOR
    {
      category: "outdoor location",
      src: "/Photos/gallery/balcony.JPG",
      title: "Room Balcony",
      desc: "Private balcony with city views and comfortable seating"
    },
    {
      category: "outdoor location",
      src: "/Photos/gallery/function.jpeg",
      title: "Functionable Venue",
      desc: "A hotel which gives facility of celebrating the fashionable functions."
    },
    {
      category: "outdoor location",
      src: "/Photos/gallery/reception.jpeg",
      title: "Reception Venue",
      desc: "A Hotel with Versatile Celebration Spaces."
    },
    // INTERIORS
    {
      category: "interiors",
      src: "/Photos/gallery/lobby.JPG",
      title: "Hotel Lobby",
      desc: "Welcoming lobby with traditional decor and modern comfort"
    },
    {
      category: "interiors",
      src: "/Photos/gallery/reception_area.jpeg",
      title: "Reception Area",
      desc: "24/7 reception desk with friendly and helpful staff"
    },
    {
      category: "interiors",
      src: "/Photos/gallery/conference.JPG",
      title: "Conference Area",
      desc: "Clean and spacious meeting area for taking proper decisions."
    },
    // EXTERIOR
    {
      category: "exterior",
      src: "/Photos/gallery/exterior.jpeg",
      title: "Hotel Exterior",
      desc: "Heritage-style architecture blending tradition with modernity"
    },
    {
      category: "exterior",
      src: "/Photos/gallery/garden.jpeg",
      title: "Garden Area",
      desc: "Peaceful garden space for relaxation and meditation"
    },
    {
      category: "exterior",
      src: "/Photos/gallery/parking.jpeg",
      title: "Parking Facility",
      desc: "Safe and secure parking space for our guests"
    },
    // NEAR TEMPLE
    {
      category: "near temple",
      src: "/Photos/gallery/city_view.jpg",
      title: "Dwarka Streets",
      desc: "Vibrant streets of sacred Dwarka near our hotel"
    },
    {
      category: "near temple",
      src: "/Photos/gallery/temple_nearby.jpg",
      title: "Nearby Temple",
      desc: "Close proximity to Dwarkadhish Temple and other sacred sites"
    },
    {
      category: "near temple",
      src: "/Photos/gallery/city.jpeg",
      title: "City View",
      desc: "Beautiful views of the sacred city from our hotel"
    }
  ];

  // Filter logic
  const filteredItems = activeFilter === "all" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeFilter);

  const openLightbox = (itemSrc) => {
    const idx = filteredItems.findIndex(item => item.src === itemSrc);
    if (idx !== -1) {
      setLightboxIndex(idx);
    }
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const handlePrev = () => {
    setLightboxIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
  };

  const handleNext = () => {
    setLightboxIndex(prev => (prev + 1) % filteredItems.length);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, filteredItems]);

  return (
    <div className="page-gallery">
      {/* ═══ HERO ═══ */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge"><i className="fa-solid fa-images"></i>&nbsp; Hotel Devang &middot; Dwarka</span>
          <h1>Our Gallery</h1>
          <p>Explore our beautiful accommodations and serene surroundings in sacred Dwarka</p>
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <i className="fas fa-chevron-right"></i>
            <span>Gallery</span>
          </div>
        </div>
      </section>

      {/* ═══ VISUAL TOUR ═══ */}
      <section className="gallery-section">
        <div className="gal-intro">
          <div className="container">
            <span className="gal-label">Visual Tour</span>
            <h2 className="gal-heading">Discover Hotel Devang</h2>
            <div className="gal-ornament">
              <span></span>
              <i className="fas fa-camera-retro"></i>
              <span></span>
            </div>
            <p className="gal-subtext">Browse our curated collection of high-quality images showcasing rooms, amenities, and the spiritual ambiance of our hotel in sacred Dwarka</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="container">
          <div className="gallery-filters">
            {[
              { id: "all", label: "All Photos", icon: "fas fa-th-large" },
              { id: "rooms", label: "Guest Rooms", icon: "fas fa-bed" },
              { id: "bathrooms", label: "Bathrooms", icon: "fas fa-shower" },
              { id: "outdoor location", label: "Outdoor", icon: "fas fa-sun" },
              { id: "interiors", label: "Interiors", icon: "fas fa-couch" },
              { id: "exterior", label: "Exterior", icon: "fas fa-tree" },
              { id: "near temple", label: "Near Temple", icon: "fas fa-om" }
            ].map((filter) => (
              <button 
                key={filter.id} 
                className={`filter-btn ${activeFilter === filter.id ? "active" : ""}`}
                onClick={() => {
                  setActiveFilter(filter.id);
                  setLightboxIndex(null); // Reset lightbox when filter changes
                }}
              >
                <i className={filter.icon}></i> {filter.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="gallery-grid" id="galleryGrid">
            {filteredItems.map((item, idx) => (
              <div 
                key={idx} 
                className="gallery-item show" 
                onClick={() => openLightbox(item.src)}
                style={{ cursor: "pointer" }}
              >
                <img src={item.src} alt={item.title} />
                <span className="gallery-item-chip">
                  {item.category === "outdoor location" ? "Outdoor" : item.category}
                </span>
                <div className="gallery-overlay">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ LIGHTBOX OVERLAY ═══ */}
      {lightboxIndex !== null && filteredItems[lightboxIndex] && (
        <div className="lightbox active show" style={{ display: "flex" }} onClick={(e) => {
          if (e.target.classList.contains("lightbox")) closeLightbox();
        }}>
          <div className="lightbox-content">
            <button className="lightbox-close" onClick={closeLightbox}>×</button>
            <button className="lightbox-nav lightbox-prev" onClick={handlePrev}>‹</button>
            <img id="lightboxImage" src={filteredItems[lightboxIndex].src} alt={filteredItems[lightboxIndex].title} />
            <button className="lightbox-nav lightbox-next" onClick={handleNext}>›</button>
            <div className="lightbox-info">
              <h3 id="lightboxTitle">{filteredItems[lightboxIndex].title}</h3>
              <p id="lightboxDescription">{filteredItems[lightboxIndex].desc}</p>
            </div>
          </div>
        </div>
      )}

      {/* ═══ VIDEO TOUR ═══ */}
      <section className="custom-video-section">
        <div className="video-content-wrapper">
          <div className="video-text-content">
            <h2>Experience Hotel Devang</h2>
            <p>Welcome to Hotel Devang, your spiritual sanctuary in the holy city of Dwarka. Nestled in the heart of this sacred destination, our hotel offers a perfect blend of comfort, tradition, and modern amenities.</p>
            <p>Just steps away from the revered Dwarkadhish Temple, we provide pilgrims and travelers with a peaceful retreat after their spiritual journey. Our well-appointed rooms, warm hospitality, and convenient location make us the ideal choice for your stay in Dwarka.</p>
            <p>Watch our video tour to explore our facilities, rooms, and the serene ambiance that awaits you at Hotel Devang. Discover why guests from around the world choose us for their pilgrimage and vacation needs.</p>
          </div>

          <div className="video-wrapper">
            <div className="vimeo-container">
              <video className="hotel-video" controls playsInline preload="metadata" poster="/Photos/gallery/blog.png">
                <source src="/Photos/gallery/video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
