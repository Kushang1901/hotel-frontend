"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import "../css/room.css";
import { roomsData } from "../../data/roomsData";

const tabIcons = {
  "standard-ac": "fas fa-snowflake",
  "standard-non-ac": "fas fa-fan",
  "deluxe-ac": "fas fa-snowflake",
  "deluxe-non-ac": "fas fa-fan",
  "super-deluxe-ac": "fas fa-star",
  "super-deluxe-non-ac": "fas fa-star",
  "suite-ac": "fas fa-crown",
};

export default function Rooms() {
  const [modalImage, setModalImage] = useState(null);
  const [prices, setPrices] = useState({
    "standard-ac": { price: 1500, isSeasonal: false, reason: "" },
    "standard-non-ac": { price: 1200, isSeasonal: false, reason: "" },
    "deluxe-ac": { price: 1700, isSeasonal: false, reason: "" },
    "deluxe-non-ac": { price: 1400, isSeasonal: false, reason: "" },
    "super-deluxe-ac": { price: 1900, isSeasonal: false, reason: "" },
    "super-deluxe-non-ac": { price: 1600, isSeasonal: false, reason: "" },
    "suite-ac": { price: 3000, isSeasonal: false, reason: "" },
  });

  const roomCategoryKeys = {
    "standard-ac": { type: "Standard", subtype: "AC" },
    "standard-non-ac": { type: "Standard", subtype: "Non-AC" },
    "deluxe-ac": { type: "Deluxe", subtype: "AC" },
    "deluxe-non-ac": { type: "Deluxe", subtype: "Non-AC" },
    "super-deluxe-ac": { type: "Super Deluxe", subtype: "AC" },
    "super-deluxe-non-ac": { type: "Super Deluxe", subtype: "Non-AC" },
    "suite-ac": { type: "Suite", subtype: "AC" },
  };

  useEffect(() => {
    async function fetchPrices() {
      const isLocal =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.port !== "";
      let apiBase = isLocal
        ? "http://localhost:3000"
        : "https://devang-inventory.vercel.app";
      try {
        let response, data;
        try {
          response = await fetch(`${apiBase}/api/public/room-prices-today`);
          data = await response.json();
        } catch (err) {
          if (isLocal) {
            apiBase = "https://devang-inventory.vercel.app";
            response = await fetch(`${apiBase}/api/public/room-prices-today`);
            data = await response.json();
          } else throw err;
        }
        if (data?.success && data.prices) {
          const updated = { ...prices };
          Object.keys(roomCategoryKeys).forEach((key) => {
            const rule = roomCategoryKeys[key];
            const item = data.prices.find(
              (p) => p.roomType === rule.type && p.subtype === rule.subtype
            );
            if (item)
              updated[key] = {
                price: item.price,
                isSeasonal: item.isSeasonal,
                reason: item.reason || "",
              };
          });
          setPrices(updated);
        }
      } catch (e) {
        console.error("Error fetching room prices:", e);
      }
    }
    fetchPrices();
  }, []);

  const openModal = (src) => {
    setModalImage(src);
    document.body.style.overflow = "hidden";
  };
  const closeModal = () => {
    setModalImage(null);
    document.body.style.overflow = "";
  };

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && closeModal();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const roomKeys = Object.keys(roomsData);

  return (
    <div className="page-room">
      {/* ═══ HERO ═══ */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">
            <i className="fa-solid fa-bed"></i> Accommodations
          </span>
          <h1>Rooms &amp; Rates</h1>
          <p>
            Choose from our 7 categories of comfortable accommodations, all
            featuring double beds for your perfect stay in sacred Dwarka
          </p>
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <i className="fas fa-chevron-right"></i>
            <span>Rooms</span>
          </div>
        </div>
      </section>

      {/* ═══ ROOM SHOWCASE ═══ */}
      <section className="room-showcase-section">
        <div className="showcase-header">
          <h2>Accommodation Options</h2>
          <p>
            All rooms include comfortable double beds. Extra mattress available
            at ₹300/night for additional guests.
          </p>
        </div>

        <div className="showcase-list">
          {roomKeys.map((key, idx) => {
            const r = roomsData[key];
            const p = prices[key];
            const isReversed = idx % 2 !== 0;

            return (
              <div
                className={`showcase-row ${isReversed ? "reversed" : ""}`}
                key={key}
                id={`room-${key}`}
              >
                {/* Image Panel */}
                <div
                  className="showcase-img-panel"
                  onClick={() => openModal(r.image)}
                >
                  <img src={r.image} alt={r.title} />
                  <div className="showcase-img-overlay">
                    <i className="fas fa-search-plus"></i>
                    <span>View Photo</span>
                  </div>
                  <div className="showcase-badge">{r.badge}</div>
                  <div className="showcase-area-tag">
                    <i className="fas fa-ruler-combined"></i> {r.area}
                  </div>
                </div>

                {/* Info Panel */}
                <div className="showcase-info-panel">
                  {/* Room number */}
                  <div className="showcase-room-num">
                    0{idx + 1}
                  </div>

                  <div className="showcase-category">
                    <i className={tabIcons[key]}></i>{" "}
                    {r.subtype === "AC" ? "Air Conditioned" : "Natural Ventilation"}
                  </div>

                  <h2 className="showcase-title">{r.title}</h2>
                  <p className="showcase-subtitle">{r.subtitle}</p>
                  <p className="showcase-desc">{r.description}</p>

                  {/* Amenities pills */}
                  <div className="showcase-amenities">
                    {r.amenities.slice(0, 5).map((am, i) => (
                      <span className="amenity-pill" key={i}>
                        <i className={am.icon}></i> {am.name}
                      </span>
                    ))}
                    {r.amenities.length > 5 && (
                      <span className="amenity-pill more-pill">
                        +{r.amenities.length - 5} more on details
                      </span>
                    )}
                  </div>

                  {/* Price & CTA */}
                  <div className="showcase-footer">
                    <div className="showcase-price-block">
                      <span className="showcase-price">
                        ₹{p.price.toLocaleString("en-IN")}
                        <small>/night</small>
                      </span>
                      {p.isSeasonal ? (
                        <span className="showcase-seasonal">
                          <i className="fas fa-fire"></i> {p.reason}
                        </span>
                      ) : (
                        <span className="showcase-tax">
                          + Govt. tax · Prices vary by season
                        </span>
                      )}
                    </div>
                    <div className="showcase-cta">
                      <Link href={`/room/${key}`} className="cta-details">
                        <i className="fas fa-eye"></i> View Details
                      </Link>
                      <Link href="/booking" className="cta-book">
                        Book Now <i className="fas fa-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══ NOTICE ═══ */}
      <section className="important-notice">
        <div className="container">
          <div className="notice-content">
            <h3>Important Information</h3>
            <p>
              All our rooms are furnished with comfortable{" "}
              <span className="highlight-text">double beds</span>. For groups of
              more than 2 persons, extra mattresses are available at{" "}
              <span className="highlight-text">₹300 per night</span>.
            </p>
            <p>
              Room rates are subject to applicable government taxes. Prices may
              vary during peak seasons and festivals. Please contact us for the
              latest rates.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ CONTACT CTA ═══ */}
      <section className="contact-cta">
        <div className="container">
          <h3>Ready to Book Your Stay?</h3>
          <p>
            Contact us directly for reservations, special requests, or any
            queries about our rooms.
          </p>
          <div className="contact-info">
            <div className="contact-item">
              <i className="fas fa-phone"></i>
              <span>
                Call Us:{" "}
                <a href="tel:+919824402132">+91 98244 02132</a>
              </span>
            </div>
            <div className="contact-item">
              <i className="fab fa-whatsapp"></i>
              <span>
                WhatsApp:{" "}
                <a
                  href="https://wa.me/919824402132"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  +91 98244 02132
                </a>
              </span>
            </div>
            <div className="contact-item">
              <i className="fas fa-envelope"></i>
              <span>
                Email:{" "}
                <a href="mailto:info@hoteldevang.com">info@hoteldevang.com</a>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ IMAGE MODAL ═══ */}
      {modalImage && (
        <div
          id="imageModal"
          className="modal show"
          style={{ display: "flex" }}
          onClick={(e) => {
            if (e.target.id === "imageModal") closeModal();
          }}
        >
          <span className="close" onClick={closeModal}>&times;</span>
          <img className="modal-content" id="modalImg" src={modalImage} alt="Room" />
        </div>
      )}
    </div>
  );
}
