"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import "../../css/facility-detail.css";

export default function FacilityDetailClient({ facility, slug }) {
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [lightboxImg, setLightboxImg] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const [imgTransitioning, setImgTransitioning] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    guests: "",
    eventType: "Wedding Reception",
    notes: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [apiBase, setApiBase] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const isLocal =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.port !== "";
    setApiBase(isLocal ? "http://localhost:3000" : "https://devang-inventory.vercel.app");
  }, []);

  // Collect all photos of this venue
  const photos = facility.photos || [];

  const openLightbox = (photoSrc) => {
    const idx = photos.indexOf(photoSrc);
    setLightboxIndex(idx !== -1 ? idx : 0);
    setLightboxImg(photoSrc);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setIsClosing(true);
    setTimeout(() => {
      setLightboxImg(null);
      setIsClosing(false);
      document.body.style.overflow = "";
    }, 260);
  };

  const handlePrev = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setImgTransitioning(true);
    setTimeout(() => {
      const nextIdx = (lightboxIndex - 1 + photos.length) % photos.length;
      setLightboxIndex(nextIdx);
      setLightboxImg(photos[nextIdx]);
      setImgTransitioning(false);
    }, 100);
  };

  const handleNext = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setImgTransitioning(true);
    setTimeout(() => {
      const nextIdx = (lightboxIndex + 1) % photos.length;
      setLightboxIndex(nextIdx);
      setLightboxImg(photos[nextIdx]);
      setImgTransitioning(false);
    }, 100);
  };

  const inlinePrev = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setActiveImgIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const inlineNext = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setActiveImgIndex((prev) => (prev + 1) % photos.length);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxImg) {
        // Handle inline slide keys if lightbox is closed
        if (e.key === "ArrowLeft") inlinePrev();
        if (e.key === "ArrowRight") inlineNext();
        return;
      }
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxImg, lightboxIndex, isClosing, activeImgIndex]);

  // Form Submission Handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.date || !formData.guests) {
      alert("Please fill in all mandatory fields.");
      return;
    }
    
    setIsSubmitting(true);

    try {
      const response = await fetch(`${apiBase}/api/public/submit-inquiry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          facilityName: facility.title
        })
      });
      const data = await response.json();
      if (data && data.success) {
        setIsSubmitted(true);
      } else {
        alert(data.error || "Failed to submit inquiry. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting inquiry:", err);
      alert("Unable to connect to reservations server. Please check your internet connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-facility-detail">
      {/* ═══ HERO ═══ */}
      <section className="hero" style={{ backgroundImage: `linear-gradient(rgba(92, 0, 0, 0.75), rgba(42, 26, 26, 0.9)), url(${facility.image})` }}>
        <div className="hero-content">
          <span className="hero-badge">
            <i className="fa-solid fa-bell-concierge"></i> Event Space
          </span>
          <h1>{facility.title}</h1>
          <p>{facility.sub}</p>
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <i className="fas fa-chevron-right"></i>
            <Link href="/facilities">Facilities</Link>
            <i className="fas fa-chevron-right"></i>
            <span>{facility.title}</span>
          </div>
        </div>
      </section>

      {/* ═══ GRID CONTAINER ═══ */}
      <div className="detail-container">
        <div className="detail-grid">
          {/* Left Column: Image Gallery Panel */}
          <div className="gallery-side">
            <div className="main-image-wrapper">
              <img src={photos[activeImgIndex]} alt={`${facility.title} view ${activeImgIndex + 1}`} className="slide-image" />
              <span className="image-badge">{facility.badge}</span>
              
              {/* Slide Navigation Overlay */}
              {photos.length > 1 && (
                <>
                  <button type="button" className="inline-slide-btn prev" onClick={inlinePrev} aria-label="Previous Slide">
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button type="button" className="inline-slide-btn next" onClick={inlineNext} aria-label="Next Slide">
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </>
              )}

              <button type="button" className="image-zoom-trigger" onClick={() => openLightbox(photos[activeImgIndex])}>
                <i className="fas fa-search-plus"></i> Zoom Photo
              </button>
            </div>

            {/* Thumbnail Row */}
            {photos.length > 1 && (
              <div className="gallery-thumbnails">
                {photos.map((photo, index) => (
                  <div 
                    key={index} 
                    className={`thumb-box ${index === activeImgIndex ? "active" : ""}`}
                    onClick={() => setActiveImgIndex(index)}
                  >
                    <img src={photo} alt={`${facility.title} view ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Inquiry Form Card */}
          <div className="form-side">
            <div className="inquiry-card">
              {isSubmitted ? (
                <div className="success-message">
                  <i className="fas fa-check-circle"></i>
                  <h3>Inquiry Submitted!</h3>
                  <p>Thank you! Your event space quote request has been successfully sent to the Hotel Devang team.</p>
                  <p>We have notified our reservations manager via Telegram. We will verify availability for <strong>{formData.date}</strong> and contact you at <strong>{formData.phone}</strong> shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="inquiry-form">
                  <h3>Get Event Quote</h3>
                  <p className="form-intro">Submit this form to verify availability and receive custom packages.</p>
                  
                  <div className="form-group">
                    <label htmlFor="name">Your Name *</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                      placeholder="e.g. Ramesh Patel" 
                      required 
                    />
                  </div>

                  <div className="form-group-row">
                    <div className="form-group">
                      <label htmlFor="phone">Mobile Number *</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleInputChange} 
                        placeholder="10-digit mobile" 
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleInputChange} 
                        placeholder="Optional" 
                      />
                    </div>
                  </div>

                  <div className="form-group-row">
                    <div className="form-group">
                      <label htmlFor="date">Event Date *</label>
                      <input 
                        type="date" 
                        id="date" 
                        name="date" 
                        value={formData.date} 
                        onChange={handleInputChange} 
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="guests">Est. Guests *</label>
                      <input 
                        type="number" 
                        id="guests" 
                        name="guests" 
                        value={formData.guests} 
                        onChange={handleInputChange} 
                        placeholder="Total headcount" 
                        required 
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="eventType">Event Type</label>
                    <select 
                      id="eventType" 
                      name="eventType" 
                      value={formData.eventType} 
                      onChange={handleInputChange}
                    >
                      <option value="Wedding Reception">Wedding Reception</option>
                      <option value="Marriage Rituals">Marriage Rituals</option>
                      <option value="Dhwaja Ceremony">Dhwaja Ceremony</option>
                      <option value="Thread Ceremony">Thread Ceremony</option>
                      <option value="Spiritual Pooja / Katha">Spiritual Pooja / Katha</option>
                      <option value="Corporate Conference">Corporate Conference</option>
                      <option value="Birthday Celebration">Birthday Celebration</option>
                      <option value="Other Function">Other Function</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="notes">Special Requirements / Catering Details</label>
                    <textarea 
                      id="notes" 
                      name="notes" 
                      value={formData.notes} 
                      onChange={handleInputChange} 
                      placeholder="Mention custom stages, catering preferences, or decoration requests..." 
                      rows="3"
                    ></textarea>
                  </div>

                  <button type="submit" className="btn-submit-inquiry" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>Sending Inquiry...</>
                    ) : (
                      <>Request Pricing <i className="fas fa-arrow-right"></i></>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Full Width Sections below the image and booking card */}
        <div className="detail-bottom-content">
          {/* Quick Specs */}
          <div className="quick-specs">
            <div className="spec-card">
              <i className="fas fa-ruler-combined"></i>
              <h4>Total Area</h4>
              <p>{facility.area}</p>
            </div>
            <div className="spec-card">
              <i className="fas fa-chair"></i>
              <h4>Seating Capacity</h4>
              <p>{facility.seating}</p>
            </div>
            <div className="spec-card">
              <i className="fas fa-users"></i>
              <h4>Floating Capacity</h4>
              <p>{facility.floating}</p>
            </div>
            <div className="spec-card">
              <i className={facility.ac ? "fas fa-snowflake" : "fas fa-fan"}></i>
              <h4>Ventilation Type</h4>
              <p>{facility.ac ? "Air Conditioned" : "Natural Ventilation"}</p>
            </div>
          </div>

          {/* Description */}
          <div className="description-section">
            <h2>About the Space</h2>
            <p>{facility.desc}</p>
            <p>
              Hotel Devang is one of Dwarka's premier event hosts. Our {facility.category.toLowerCase()}s 
              are kept in immaculate condition, ensuring a magnificent presentation for your family 
              or community event. From decoration setups to vendor coordination, our spaces are design-ready.
            </p>
          </div>

          {/* Features Grid */}
          <div className="features-section">
            <h2>Venue Inclusions & Features</h2>
            <div className="features-grid">
              {facility.features.map((feat, idx) => (
                <div className="feature-item" key={idx}>
                  <i className="fas fa-check-circle"></i>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Notes Section */}
          <div className="notice-box">
            <h3><i className="fas fa-info-circle"></i> Catering & Decoration Guidelines</h3>
            <p>
              <strong>Catering Options:</strong> Guests are free to bring external catering vendors. We provide a dedicated kitchen support space with washing facilities. Only pure vegetarian catering is allowed.
            </p>
            <p>
              <strong>Decoration:</strong> External decorators are permitted subject to approval. Basic lighting and stage structures are provided as standard additions.
            </p>
            <p>
              <strong>Booking & Advance:</strong> A 50% advance is required to lock event dates. Cancellations or changes to dates must be requested at least 15 days in advance of the booking date.
            </p>
          </div>
        </div>
      </div>

      {/* Image Lightbox Modal */}
      {lightboxImg && (
        <div 
          className={`lightbox-overlay ${isClosing ? "closing" : "show"}`} 
          id="lightboxOverlay" 
          onClick={(e) => {
            if (e.target.id === "lightboxOverlay" || e.target.classList.contains("lightbox-backdrop")) {
              closeLightbox();
            }
          }}
        >
          <div className="lightbox-backdrop" onClick={closeLightbox}></div>
          <button id="lightboxClose" className="lightbox-close-btn" onClick={closeLightbox} aria-label="Close Lightbox">
            &times;
          </button>
          <button className="lightbox-prev" onClick={handlePrev} aria-label="Previous Image">
            &#10094;
          </button>
          <div className={`lightbox-img-wrap ${imgTransitioning ? "transitioning" : ""}`} onClick={(e) => e.stopPropagation()}>
            <img key={lightboxImg} id="lightboxImg" src={lightboxImg} alt="Facilities Zoom" />
            <div className="lightbox-footer">
              <span className="lightbox-counter" id="lightboxCounter">
                {lightboxIndex + 1} / {photos.length}
              </span>
            </div>
          </div>
          <button className="lightbox-next" onClick={handleNext} aria-label="Next Image">
            &#10095;
          </button>
        </div>
      )}
    </div>
  );
}
