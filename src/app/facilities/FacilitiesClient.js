"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import "../css/facilities.css";
import { facilitiesData } from "../../data/facilitiesData";

export default function Facilities() {
  const [lightboxImg, setLightboxImg] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const [imgTransitioning, setImgTransitioning] = useState(false);

  // Group halls and grounds dynamically from centralized facilitiesData
  const eventHalls = Object.keys(facilitiesData)
    .filter((key) => facilitiesData[key].category.includes("Hall"))
    .map((key) => ({ slug: key, ...facilitiesData[key] }));

  const weddingGrounds = Object.keys(facilitiesData)
    .filter((key) => facilitiesData[key].category.includes("Lawn"))
    .map((key) => ({ slug: key, ...facilitiesData[key] }));

  // Collect all photos for lightbox navigation
  const allPhotos = [];
  eventHalls.forEach((hall) => allPhotos.push(...hall.photos));
  weddingGrounds.forEach((ground) => allPhotos.push(...ground.photos));

  const openLightbox = (photoSrc) => {
    const idx = allPhotos.indexOf(photoSrc);
    setLightboxIndex(idx !== -1 ? idx : 0);
    setLightboxImg(photoSrc);
    setIsClosing(false);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setIsClosing(true);
    setTimeout(() => {
      setLightboxImg(null);
      setIsClosing(false);
      setImgTransitioning(false);
      document.body.style.overflow = "";
    }, 260);
  };

  const handlePrev = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setImgTransitioning(true);
    setTimeout(() => {
      const nextIdx = (lightboxIndex - 1 + allPhotos.length) % allPhotos.length;
      setLightboxIndex(nextIdx);
      setLightboxImg(allPhotos[nextIdx]);
      setImgTransitioning(false);
    }, 100);
  };

  const handleNext = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setImgTransitioning(true);
    setTimeout(() => {
      const nextIdx = (lightboxIndex + 1) % allPhotos.length;
      setLightboxIndex(nextIdx);
      setLightboxImg(allPhotos[nextIdx]);
      setImgTransitioning(false);
    }, 100);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxImg) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxImg, lightboxIndex, isClosing]);

  return (
    <div className="page-facilities">
      {/* ═══ HERO ═══ */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">
            <i className="fa-solid fa-bell-concierge"></i> Amenities &amp; Spaces
          </span>
          <h1>Our Facilities</h1>
          <p>Complete event solutions for all your special occasions in the sacred city of Dwarka</p>
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <i className="fas fa-chevron-right"></i>
            <span>Facilities</span>
          </div>
        </div>
      </section>

      {/* ═══ INTRO ═══ */}
      <section className="fac-intro">
        <div className="fac-intro-inner">
          <div className="fac-intro-label">Our Spaces</div>
          <h2 className="fac-intro-heading">Comprehensive Event Facilities</h2>
          <p className="fac-intro-text">
            At Hotel Devang, we provide exceptional venues and services for all your celebration needs. From intimate
            family gatherings to grand wedding ceremonies, our facilities are designed to make your special moments truly
            memorable in the divine atmosphere of Dwarka.
          </p>
          <div className="fac-intro-stats">
            <div className="fac-stat">
              <span className="fac-stat-num">3</span>
              <span className="fac-stat-label">Event Halls</span>
            </div>
            <div className="fac-stat-divider"></div>
            <div className="fac-stat">
              <span className="fac-stat-num">3</span>
              <span className="fac-stat-label">Wedding Grounds</span>
            </div>
            <div className="fac-stat-divider"></div>
            <div className="fac-stat">
              <span className="fac-stat-num">8+</span>
              <span className="fac-stat-label">Event Types</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ EVENT HALLS ═══ */}
      <section className="fac-halls">
        <div className="fac-section-tag">01 — Event Halls</div>
        <div className="fac-halls-header">
          <h2>Indoor Event Halls</h2>
          <p>Three stunning venues for every kind of indoor celebration</p>
        </div>
        <div className="fac-halls-cards">
          {eventHalls.map((hall, idx) => (
            <div key={idx} className="fac-hall-card">
              <div className="fac-hall-card-header">
                <span className="fac-hall-card-num">{hall.num}</span>
                <div className="fac-hall-card-title-wrap">
                  <div className="fac-hall-card-title-row">
                    <h3 className="fac-hall-card-title">{hall.title}</h3>
                    {hall.ac ? (
                      <span className="fac-hall-badge ac">
                        <i className="fas fa-snowflake"></i> AC
                      </span>
                    ) : (
                      <span className="fac-hall-badge nonac">
                        <i className="fas fa-wind"></i> Non-AC
                      </span>
                    )}
                  </div>
                  <p className="fac-hall-card-sub">{hall.sub}</p>
                </div>
              </div>
              <div className="fac-hall-card-body">
                <div className="fac-hall-card-desc">
                  <p>{hall.desc}</p>
                  <ul className="fac-hall-card-feats">
                    {hall.features.slice(0, 4).map((feat, fIdx) => (
                      <li key={fIdx}>
                        <i className="fas fa-check"></i> {feat}
                      </li>
                    ))}
                  </ul>
                  <div style={{ marginTop: "1.2rem" }}>
                    <Link href={`/facilities/${hall.slug}`} className="fac-details-btn">
                      View Details &amp; Capacity <i className="fas fa-arrow-right"></i>
                    </Link>
                  </div>
                </div>
                <div className="fac-hall-card-photos">
                  {hall.photos.map((photo, pIdx) => (
                    <div
                      key={pIdx}
                      className="fac-photo-box"
                      onClick={() => openLightbox(photo)}
                      style={{ cursor: "zoom-in" }}
                    >
                      <img src={photo} alt={hall.title} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ FUNCTIONS WE HOST ═══ */}
      <section className="fac-functions">
        <div className="fac-section-tag light">02 — Functions We Host</div>
        <div className="container">
          <div className="fac-functions-header">
            <h2>Every Celebration, Beautifully Hosted</h2>
            <p>Celebrate every special moment with our comprehensive event services</p>
          </div>
          <div className="fac-func-grid">
            {[
              { icon: "fa-solid fa-flag", title: "Dhwaja Ceremony", desc: "Sacred flag hoisting ceremonies" },
              { icon: "fa-solid fa-ring", title: "Marriage Functions", desc: "Complete wedding celebrations" },
              { icon: "fa-solid fa-champagne-glasses", title: "Reception Parties", desc: "Elegant reception ceremonies" },
              { icon: "fas fa-birthday-cake", title: "Birthday Celebrations", desc: "Joyful birthday parties" },
              { icon: "fa-brands fa-meetup", title: "Conference Meetings", desc: "Professional business meetings" },
              { icon: "fa-solid fa-heart", title: "Anniversary Celebrations", desc: "Memorable anniversary events" },
              { icon: "fa-solid fa-hands-praying", title: "Religious Poojas", desc: "All types of spiritual ceremonies" },
              { icon: "fa-solid fa-star", title: "Special Occasions", desc: "Any celebration you wish to host" },
            ].map((func, idx) => (
              <div key={idx} className="fac-func-card">
                <div className="fac-func-icon">
                  <i className={func.icon}></i>
                </div>
                <h3>{func.title}</h3>
                <p>{func.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WEDDING GROUNDS ═══ */}
      <section className="fac-grounds">
        <div className="fac-section-tag">03 — Wedding Grounds</div>
        <div className="fac-grounds-header">
          <h2>Outdoor Wedding Grounds</h2>
          <p>Three expansive outdoor venues perfect for grand wedding celebrations</p>
        </div>
        <div className="fac-grounds-cards">
          {weddingGrounds.map((ground, idx) => (
            <div key={idx} className="fac-ground-card">
              <div className="fac-ground-card-header">
                <span className="fac-ground-card-num">{ground.num}</span>
                <div className="fac-ground-card-title-wrap">
                  <h3 className="fac-ground-card-title">{ground.title}</h3>
                  <p className="fac-ground-card-sub">{ground.sub}</p>
                </div>
              </div>
              <div className="fac-ground-card-body">
                <div className="fac-ground-card-desc">
                  <p>{ground.desc}</p>
                  <ul className="fac-ground-card-feats">
                    {ground.features.slice(0, 4).map((feat, fIdx) => (
                      <li key={fIdx}>
                        <i className="fas fa-check"></i> {feat}
                      </li>
                    ))}
                  </ul>
                  <div style={{ marginTop: "1.2rem" }}>
                    <Link href={`/facilities/${ground.slug}`} className="fac-details-btn">
                      View Details &amp; Capacity <i className="fas fa-arrow-right"></i>
                    </Link>
                  </div>
                </div>
                <div className="fac-ground-card-photos">
                  {ground.photos.map((photo, pIdx) => (
                    <div
                      key={pIdx}
                      className="fac-photo-box"
                      onClick={() => openLightbox(photo)}
                      style={{ cursor: "zoom-in" }}
                    >
                      <img src={photo} alt={ground.title} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ CTA SECTION ═══ */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Book Your Event?</h2>
            <p>Let us help you create unforgettable memories in the sacred city of Dwarka</p>
            <a href="tel:+919824402132" className="cta-button">
              <i className="fa fa-phone" aria-hidden="true"></i> Call Now
            </a>
            <a href="mailto:info@hoteldevang.com" className="cta-button">
              <i className="fa fa-envelope" aria-hidden="true"></i> Email Us
            </a>
          </div>
        </div>
      </section>

      {/* ═══ MOTION LIGHTBOX OVERLAY ═══ */}
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
          <div
            className={`lightbox-img-wrap ${imgTransitioning ? "transitioning" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <img key={lightboxImg} id="lightboxImg" src={lightboxImg} alt="Facilities Zoom" />
            <div className="lightbox-footer">
              <span className="lightbox-counter" id="lightboxCounter">
                {lightboxIndex + 1} / {allPhotos.length}
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
