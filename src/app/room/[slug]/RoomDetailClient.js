"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import "../../css/room-detail.css";

export default function RoomDetailClient({ room }) {
  const [modalImage, setModalImage] = useState(null);
  const [priceInfo, setPriceInfo] = useState({
    price: room.defaultPrice,
    isSeasonal: false,
    reason: ""
  });

  // Fetch dynamic price from inventory API upon mount
  useEffect(() => {
    async function fetchLiveRoomPrice() {
      const isLocal =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.port !== "";
      let apiBase = isLocal
        ? "http://localhost:3000"
        : "https://devang-inventory.vercel.app";

      try {
        let response;
        let data;
        try {
          response = await fetch(`${apiBase}/api/public/room-prices-today`);
          data = await response.json();
        } catch (err) {
          if (isLocal) {
            console.warn("Local inventory API unavailable, falling back to production...");
            apiBase = "https://devang-inventory.vercel.app";
            response = await fetch(`${apiBase}/api/public/room-prices-today`);
            data = await response.json();
          } else {
            throw err;
          }
        }

        if (data && data.success && data.prices) {
          const priceItem = data.prices.find(
            (p) => p.roomType === room.type && p.subtype === room.subtype
          );
          if (priceItem) {
            setPriceInfo({
              price: priceItem.price,
              isSeasonal: priceItem.isSeasonal,
              reason: priceItem.reason || ""
            });
          }
        }
      } catch (e) {
        console.error("Error fetching live room price:", e);
      }
    }
    fetchLiveRoomPrice();
  }, [room.type, room.subtype]);

  const openImageModal = (imageSrc) => {
    setModalImage(imageSrc);
    document.body.style.overflow = "hidden";
  };

  const closeImageModal = () => {
    setModalImage(null);
    document.body.style.overflow = "";
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeImageModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);


  return (
    <div className="page-room-detail">
      {/* ═══ HERO ═══ */}
      <section className="hero" style={{ backgroundImage: `linear-gradient(rgba(92, 0, 0, 0.75), rgba(42, 26, 26, 0.9)), url(${room.image})` }}>
        <div className="hero-content">
          <span className="hero-badge">
            <i className="fa-solid fa-bed"></i> Accommodations
          </span>
          <h1>{room.title}</h1>
          <p>{room.subtitle}</p>
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <i className="fas fa-chevron-right"></i>
            <Link href="/room">Rooms</Link>
            <i className="fas fa-chevron-right"></i>
            <span>{room.title}</span>
          </div>
        </div>
      </section>

      {/* ═══ GRID CONTAINER ═══ */}
      <div className="detail-container">
        <div className="detail-grid">
          {/* Left Column: Room Image */}
          <div className="main-image-wrapper" onClick={() => openImageModal(room.image)}>
            <img src={room.image} alt={room.title} />
            <span className="image-badge">{room.badge}</span>
            <span className="image-hint">
              <i className="fas fa-search-plus"></i> Click to Zoom
            </span>
          </div>

          {/* Right Column: Sticky Booking Card */}
          <div className="sidebar-side">
            <div className="booking-card">
              <div className="card-header">
                <div className="price-block">
                  <span className="live-price">
                    ₹{priceInfo.price.toLocaleString("en-IN")}
                    <small>/night</small>
                  </span>
                  {priceInfo.isSeasonal ? (
                    <span className="seasonal-tag">
                      <i className="fas fa-star"></i> Special Rate: {priceInfo.reason}
                    </span>
                  ) : (
                    <span className="tax-info">*Prices may vary during festivals</span>
                  )}
                </div>
                <span className="tax-info">+ Govt. Tax applicable on billing</span>
              </div>

              <ul className="booking-info-list">
                <li>
                  <i className="fas fa-check-circle"></i>
                  <span>900m from Dwarkadhish Temple</span>
                </li>
                <li>
                  <i className="fas fa-clock"></i>
                  <span>Check-in: 11:00 AM | Check-out: 09:00 AM</span>
                </li>
                <li>
                  <i className="fas fa-user-friends"></i>
                  <span>Double Bed for 2 guests (+1 child)</span>
                </li>
                <li>
                  <i className="fas fa-shield-alt"></i>
                  <span>Clean bathrooms & fresh linen guaranteed</span>
                </li>
                <li>
                  <i className="fas fa-wifi"></i>
                  <span>Complimentary High-speed Wi-Fi</span>
                </li>
              </ul>

              <div className="booking-actions">
                <Link href="/booking" className="btn-book-now">
                  Book Online <i className="fas fa-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Full Width Sections below the image and booking card */}
        <div className="detail-bottom-content" style={{ marginTop: "3rem" }}>
          {/* Quick Specs */}
          <div className="quick-specs">
            <div className="spec-card">
              <i className="fas fa-ruler-combined"></i>
              <h4>Room Size</h4>
              <p>{room.area}</p>
            </div>
            <div className="spec-card">
              <i className="fa-solid fa-bed"></i>
              <h4>Bed Type</h4>
              <p>{room.subtype === "AC" && room.title.includes("Suite") ? "King Bed" : "Double Bed"}</p>
            </div>
            <div className="spec-card">
              <i className="fas fa-users"></i>
              <h4>Occupancy</h4>
              <p>2 Adults + 1 Child</p>
            </div>
            <div className="spec-card">
              <i className={room.subtype === "AC" ? "fas fa-snowflake" : "fas fa-fan"}></i>
              <h4>Ventilation</h4>
              <p>{room.subtype === "AC" ? "Air Conditioned" : "Natural Air"}</p>
            </div>
          </div>

          {/* Description */}
          <div className="description-section">
            <h2>About the Room</h2>
            <p>{room.description}</p>
            <p>
              Our {room.title}s are meticulously cleaned and maintained to provide standard-setting comfort. 
              Whether you are traveling for a family pilgrimage or a scenic tour, the peaceful ambience guarantees 
              refreshing rest.
            </p>
          </div>

          {/* Amenities Grid */}
          <div className="amenities-section">
            <h2>Amenities & Inclusions</h2>
            <div className="amenities-grid">
              {room.amenities.map((amenity, idx) => (
                <div className="amenity-item" key={idx}>
                  <i className={amenity.icon}></i>
                  <span>{amenity.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Notes Section */}
          <div className="notice-box">
            <h3><i className="fas fa-info-circle"></i> Important Lodging Notes</h3>
            <p>
              <strong>Extra Mattress:</strong> Double bed is standard. If booking for 3 guests, we provide an extra mattress on the floor for <strong>₹300 per night</strong>.
            </p>
            <p>
              <strong>Check-in/out:</strong> Standard Check-in is at 11:00 AM. Check-out is at 09:00 AM to allow proper cleaning of rooms for upcoming pilgrims.
            </p>
            <p>
              <strong>Hot Water:</strong> Available in all rooms via geysers. Please wait 5 minutes after turning on the switch for optimum heating.
            </p>
          </div>
        </div>
      </div>

      {/* Image Lightbox Modal */}
      {modalImage && (
        <div 
          id="imageModal" 
          className="modal show" 
          onClick={(e) => {
            if (e.target.id === "imageModal") closeImageModal();
          }}
        >
          <span className="close" onClick={closeImageModal}>&times;</span>
          <img 
            className="modal-content" 
            src={modalImage} 
            alt="Room Zoomed" 
          />
        </div>
      )}
    </div>
  );
}
