"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import "../css/room.css";

export default function Rooms() {
  const [activeTab, setActiveTab] = useState("standard-ac");
  const [modalImage, setModalImage] = useState(null);
  const [prices, setPrices] = useState({
    "standard-ac": { price: 1500, isSeasonal: false, reason: "" },
    "standard-non-ac": { price: 1200, isSeasonal: false, reason: "" },
    "deluxe-ac": { price: 1700, isSeasonal: false, reason: "" },
    "deluxe-non-ac": { price: 1400, isSeasonal: false, reason: "" },
    "super-deluxe-ac": { price: 1900, isSeasonal: false, reason: "" },
    "super-deluxe-non-ac": { price: 1600, isSeasonal: false, reason: "" },
    "suite-ac": { price: 3000, isSeasonal: false, reason: "" }
  });

  const roomCategoryKeys = {
    "standard-ac": { type: "Standard", subtype: "AC" },
    "standard-non-ac": { type: "Standard", subtype: "Non-AC" },
    "deluxe-ac": { type: "Deluxe", subtype: "AC" },
    "deluxe-non-ac": { type: "Deluxe", subtype: "Non-AC" },
    "super-deluxe-ac": { type: "Super Deluxe", subtype: "AC" },
    "super-deluxe-non-ac": { type: "Super Deluxe", subtype: "Non-AC" },
    "suite-ac": { type: "Suite", subtype: "AC" }
  };

  useEffect(() => {
    async function fetchAndApplyRoomPrices() {
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
          const updatedPrices = { ...prices };
          Object.keys(roomCategoryKeys).forEach((key) => {
            const rule = roomCategoryKeys[key];
            const priceItem = data.prices.find(
              (p) => p.roomType === rule.type && p.subtype === rule.subtype
            );
            if (priceItem) {
              updatedPrices[key] = {
                price: priceItem.price,
                isSeasonal: priceItem.isSeasonal,
                reason: priceItem.reason || ""
              };
            }
          });
          setPrices(updatedPrices);
        }
      } catch (e) {
        console.error("Error fetching room prices:", e);
      }
    }
    fetchAndApplyRoomPrices();
  }, []);

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

  const renderTaxAndSeasonalInfo = (key) => {
    const info = prices[key];
    if (info.isSeasonal) {
      return (
        <span className="panel-tax">
          + Govt. Tax &nbsp;|&nbsp;{" "}
          <span style={{ color: "#ca982d", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "4px" }}>
            <i className="fas fa-star" style={{ fontSize: "0.75rem" }}></i> Special Rate: {info.reason}
          </span>
        </span>
      );
    }
    return <span className="panel-tax">+ Govt. Tax &nbsp;|&nbsp; <em>*Prices may vary by season</em></span>;
  };

  return (
    <div className="page-room">
      {/* ═══ HERO ═══ */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge"><i className="fa-solid fa-bed"></i> Accommodations</span>
          <h1>Rooms & Rates</h1>
          <p>Choose from our 7 categories of comfortable accommodations, all featuring double beds for your perfect stay in sacred Dwarka</p>
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <i className="fas fa-chevron-right"></i>
            <span>Rooms</span>
          </div>
        </div>
      </section>

      <section className="room-categories">
        <div className="container">
          <div className="section-header">
            <h2>Accommodation Options</h2>
            <p>All rooms feature comfortable double beds. For groups of more than 2 persons, we provide extra mattresses to ensure everyone has a comfortable stay.</p>
            <p><u>Important</u>: Extra charges may apply as per Government rules.</p>
          </div>

          {/* Room Type Tab Navigation */}
          <div className="room-tabs-wrapper">
            <div className="room-tabs">
              {[
                { id: "standard-ac", label: "Standard AC", icon: "fas fa-snowflake" },
                { id: "standard-non-ac", label: "Standard Non-AC", icon: "fas fa-fan" },
                { id: "deluxe-ac", label: "Deluxe AC", icon: "fas fa-snowflake" },
                { id: "deluxe-non-ac", label: "Deluxe Non-AC", icon: "fas fa-fan" },
                { id: "super-deluxe-ac", label: "Super Deluxe AC", icon: "fas fa-star" },
                { id: "super-deluxe-non-ac", label: "Super Deluxe Non-AC", icon: "fas fa-star" },
                { id: "suite-ac", label: "Suite AC", icon: "fas fa-crown" }
              ].map((tab) => (
                <button 
                  key={tab.id} 
                  className={`room-tab ${activeTab === tab.id ? "active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="tab-icon"><i className={tab.icon}></i></span>
                  <span className="tab-label">{tab.label}</span>
                  <span className="tab-price">₹{prices[tab.id].price.toLocaleString("en-IN")}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Room Showcase Panel */}
          <div className="room-showcase">
            {/* Standard AC */}
            {activeTab === "standard-ac" && (
              <div className="room-panel active" id="panel-standard-ac">
                <div className="panel-image-side">
                  <div 
                    className="panel-room-image standard-ac room-image"
                    onClick={() => openImageModal("/Photos/Rooms/standard_ac.jpeg")}
                    style={{ cursor: "pointer", backgroundImage: "url(/Photos/Rooms/standard_ac.jpeg)" }}
                  />
                  <div className="panel-badge">Most Popular</div>
                  <div className="panel-area-tag"><i className="fas fa-ruler-combined"></i> 100 sq.ft</div>
                </div>
                <div className="panel-info-side">
                  <div className="panel-header">
                    <h3 className="panel-title">Standard AC Room</h3>
                    <p className="panel-subtitle">Comfortable &amp; Air-Conditioned</p>
                  </div>
                  <p className="panel-description">Perfect for families and couples seeking comfort with modern amenities. These well-appointed rooms offer a peaceful retreat after a day of temple visits and spiritual activities.</p>
                  <div className="panel-amenities">
                    <h4>Room Amenities</h4>
                    <div className="panel-amenities-grid">
                      <div className="panel-amenity"><i className="fas fa-snowflake"></i><span>Air Conditioning</span></div>
                      <div className="panel-amenity"><i className="fa-solid fa-bed"></i><span>Double Bed</span></div>
                      <div className="panel-amenity"><i className="fa-solid fa-tv"></i><span>Television</span></div>
                      <div className="panel-amenity"><i className="fa-solid fa-shower"></i><span>Private Bathroom</span></div>
                      <div className="panel-amenity"><i className="fas fa-bath"></i><span>Fresh Towels</span></div>
                      <div className="panel-amenity"><i className="fas fa-chair"></i><span>Seating Area</span></div>
                      <div className="panel-amenity"><i className="fa fa-coffee"></i><span>Tea/Coffee Service</span></div>
                    </div>
                  </div>
                  <div className="panel-footer">
                    <div className="panel-pricing">
                      <span className="panel-price">₹{prices["standard-ac"].price.toLocaleString("en-IN")}<small>/night</small></span>
                      {renderTaxAndSeasonalInfo("standard-ac")}
                    </div>
                    <Link href="/booking" className="book-btn">Book Now <i className="fas fa-arrow-right"></i></Link>
                  </div>
                </div>
              </div>
            )}

            {/* Standard Non-AC */}
            {activeTab === "standard-non-ac" && (
              <div className="room-panel active" id="panel-standard-non-ac">
                <div className="panel-image-side">
                  <div 
                    className="panel-room-image standard-non-ac room-image"
                    onClick={() => openImageModal("/Photos/Rooms/standard_nonac.jpeg")}
                    style={{ cursor: "pointer", backgroundImage: "url(/Photos/Rooms/standard_nonac.jpeg)" }}
                  />
                  <div className="panel-badge">Budget Friendly</div>
                  <div className="panel-area-tag"><i className="fas fa-ruler-combined"></i> 100 sq.ft</div>
                </div>
                <div className="panel-info-side">
                  <div className="panel-header">
                    <h3 className="panel-title">Standard Non-AC Room</h3>
                    <p className="panel-subtitle">Comfortable &amp; Economical</p>
                  </div>
                  <p className="panel-description">Ideal for pilgrims looking for clean, comfortable accommodation at affordable rates. These rooms provide all essential amenities for a pleasant stay.</p>
                  <div className="panel-amenities">
                    <h4>Room Amenities</h4>
                    <div className="panel-amenities-grid">
                      <div className="panel-amenity"><i className="fas fa-fan"></i><span>Natural Ventilation</span></div>
                      <div className="panel-amenity"><i className="fa-solid fa-bed"></i><span>Double Bed</span></div>
                      <div className="panel-amenity"><i className="fa-solid fa-tv"></i><span>Television</span></div>
                      <div className="panel-amenity"><i className="fa-solid fa-shower"></i><span>Private Bathroom</span></div>
                      <div className="panel-amenity"><i className="fas fa-bath"></i><span>Fresh Towels</span></div>
                      <div className="panel-amenity"><i className="fas fa-chair"></i><span>Seating Area</span></div>
                      <div className="panel-amenity"><i className="fa fa-coffee"></i><span>Tea/Coffee Service</span></div>
                    </div>
                  </div>
                  <div className="panel-footer">
                    <div className="panel-pricing">
                      <span className="panel-price">₹{prices["standard-non-ac"].price.toLocaleString("en-IN")}<small>/night</small></span>
                      {renderTaxAndSeasonalInfo("standard-non-ac")}
                    </div>
                    <Link href="/booking" className="book-btn">Book Now <i className="fas fa-arrow-right"></i></Link>
                  </div>
                </div>
              </div>
            )}

            {/* Deluxe AC */}
            {activeTab === "deluxe-ac" && (
              <div className="room-panel active" id="panel-deluxe-ac">
                <div className="panel-image-side">
                  <div 
                    className="panel-room-image deluxe-ac room-image"
                    onClick={() => openImageModal("/Photos/Rooms/deluxe_ac.jpeg")}
                    style={{ cursor: "pointer", backgroundImage: "url(/Photos/Rooms/deluxe_ac.jpeg)" }}
                  />
                  <div className="panel-badge">Enhanced Comfort</div>
                  <div className="panel-area-tag"><i className="fas fa-ruler-combined"></i> 168 sq.ft</div>
                </div>
                <div className="panel-info-side">
                  <div className="panel-header">
                    <h3 className="panel-title">Deluxe AC Room</h3>
                    <p className="panel-subtitle">Spacious &amp; Premium</p>
                  </div>
                  <p className="panel-description">Enhanced comfort with additional space and upgraded amenities. Perfect for families who desire extra comfort during their spiritual journey in Dwarka.</p>
                  <div className="panel-amenities">
                    <h4>Room Amenities</h4>
                    <div className="panel-amenities-grid">
                      <div className="panel-amenity"><i className="fas fa-snowflake"></i><span>Air Conditioning</span></div>
                      <div className="panel-amenity"><i className="fa-solid fa-bed"></i><span>Best Double Bed</span></div>
                      <div className="panel-amenity"><i className="fa-solid fa-tv"></i><span>LCD Television</span></div>
                      <div className="panel-amenity"><i className="fa-solid fa-shower"></i><span>Clean Bathroom</span></div>
                      <div className="panel-amenity"><i className="fa fa-coffee"></i><span>Tea/Coffee Service</span></div>
                      <div className="panel-amenity"><i className="fas fa-chair"></i><span>Accommodable Furniture</span></div>
                    </div>
                  </div>
                  <div className="panel-footer">
                    <div className="panel-pricing">
                      <span className="panel-price">₹{prices["deluxe-ac"].price.toLocaleString("en-IN")}<small>/night</small></span>
                      {renderTaxAndSeasonalInfo("deluxe-ac")}
                    </div>
                    <Link href="/booking" className="book-btn">Book Now <i className="fas fa-arrow-right"></i></Link>
                  </div>
                </div>
              </div>
            )}

            {/* Deluxe Non-AC */}
            {activeTab === "deluxe-non-ac" && (
              <div className="room-panel active" id="panel-deluxe-non-ac">
                <div className="panel-image-side">
                  <div 
                    className="panel-room-image deluxe-non-ac room-image"
                    onClick={() => openImageModal("/Photos/Rooms/deluxe_nonac.jpeg")}
                    style={{ cursor: "pointer", backgroundImage: "url(/Photos/Rooms/deluxe_nonac.jpeg)" }}
                  />
                  <div className="panel-badge">Spacious</div>
                  <div className="panel-area-tag"><i className="fas fa-ruler-combined"></i> 168 sq.ft</div>
                </div>
                <div className="panel-info-side">
                  <div className="panel-header">
                    <h3 className="panel-title">Deluxe Non-AC Room</h3>
                    <p className="panel-subtitle">Spacious &amp; Well-Ventilated</p>
                  </div>
                  <p className="panel-description">Larger rooms with enhanced amenities and natural ventilation. Great for guests who prefer natural air circulation while enjoying premium comfort.</p>
                  <div className="panel-amenities">
                    <h4>Room Amenities</h4>
                    <div className="panel-amenities-grid">
                      <div className="panel-amenity"><i className="fas fa-fan"></i><span>Excellent Ventilation</span></div>
                      <div className="panel-amenity"><i className="fa-solid fa-bed"></i><span>Premium Double Bed</span></div>
                      <div className="panel-amenity"><i className="fa-solid fa-tv"></i><span>LCD Television</span></div>
                      <div className="panel-amenity"><i className="fa-solid fa-shower"></i><span>Modern Bathroom</span></div>
                      <div className="panel-amenity"><i className="fa fa-coffee"></i><span>Tea/Coffee Maker</span></div>
                      <div className="panel-amenity"><i className="fas fa-chair"></i><span>Premium Furniture</span></div>
                    </div>
                  </div>
                  <div className="panel-footer">
                    <div className="panel-pricing">
                      <span className="panel-price">₹{prices["deluxe-non-ac"].price.toLocaleString("en-IN")}<small>/night</small></span>
                      {renderTaxAndSeasonalInfo("deluxe-non-ac")}
                    </div>
                    <Link href="/booking" className="book-btn">Book Now <i className="fas fa-arrow-right"></i></Link>
                  </div>
                </div>
              </div>
            )}

            {/* Super Deluxe AC */}
            {activeTab === "super-deluxe-ac" && (
              <div className="room-panel active" id="panel-super-deluxe-ac">
                <div className="panel-image-side">
                  <div 
                    className="panel-room-image super-deluxe-ac room-image"
                    onClick={() => openImageModal("/Photos/Rooms/super_deluxe_ac.jpeg")}
                    style={{ cursor: "pointer", backgroundImage: "url(/Photos/Rooms/super_deluxe_ac.jpeg)" }}
                  />
                  <div className="panel-badge">Luxury</div>
                  <div className="panel-area-tag"><i className="fas fa-ruler-combined"></i> 220 sq.ft</div>
                </div>
                <div className="panel-info-side">
                  <div className="panel-header">
                    <h3 className="panel-title">Super Deluxe AC Room</h3>
                    <p className="panel-subtitle">Luxury &amp; Elegance</p>
                  </div>
                  <p className="panel-description">Experience luxury accommodation with premium amenities and elegant interiors. Perfect for guests seeking the finest comfort during their stay in sacred Dwarka.</p>
                  <div className="panel-amenities">
                    <h4>Room Amenities</h4>
                    <div className="panel-amenities-grid">
                      <div className="panel-amenity"><i className="fas fa-snowflake"></i><span>Premium AC</span></div>
                      <div className="panel-amenity"><i className="fa-solid fa-bed"></i><span>Luxury Double Bed</span></div>
                      <div className="panel-amenity"><i className="fa-solid fa-tv"></i><span>LCD Television</span></div>
                      <div className="panel-amenity"><i className="fa-solid fa-shower"></i><span>Best Bathroom</span></div>
                      <div className="panel-amenity"><i className="fa fa-coffee"></i><span>Tea/Coffee Service</span></div>
                      <div className="panel-amenity"><i className="fas fa-chair"></i><span>Best Furniture</span></div>
                    </div>
                  </div>
                  <div className="panel-footer">
                    <div className="panel-pricing">
                      <span className="panel-price">₹{prices["super-deluxe-ac"].price.toLocaleString("en-IN")}<small>/night</small></span>
                      {renderTaxAndSeasonalInfo("super-deluxe-ac")}
                    </div>
                    <Link href="/booking" className="book-btn">Book Now <i className="fas fa-arrow-right"></i></Link>
                  </div>
                </div>
              </div>
            )}

            {/* Super Deluxe Non-AC */}
            {activeTab === "super-deluxe-non-ac" && (
              <div className="room-panel active" id="panel-super-deluxe-non-ac">
                <div className="panel-image-side">
                  <div 
                    className="panel-room-image super-deluxe-non-ac room-image"
                    onClick={() => openImageModal("/Photos/Rooms/super_deluxe_nonac.jpeg")}
                    style={{ cursor: "pointer", backgroundImage: "url(/Photos/Rooms/super_deluxe_nonac.jpeg)" }}
                  />
                  <div className="panel-badge">Premium</div>
                  <div className="panel-area-tag"><i className="fas fa-ruler-combined"></i> 220 sq.ft</div>
                </div>
                <div className="panel-info-side">
                  <div className="panel-header">
                    <h3 className="panel-title">Super Deluxe Non-AC Room</h3>
                    <p className="panel-subtitle">Premium Comfort with Natural Air</p>
                  </div>
                  <p className="panel-description">Luxury accommodation with excellent natural ventilation and premium amenities. Ideal for guests who appreciate comfort while staying connected to nature.</p>
                  <div className="panel-amenities">
                    <h4>Room Amenities</h4>
                    <div className="panel-amenities-grid">
                      <div className="panel-amenity"><i className="fas fa-fan"></i><span>Superior Ventilation</span></div>
                      <div className="panel-amenity"><i className="fa-solid fa-bed"></i><span>Luxury Double Bed</span></div>
                      <div className="panel-amenity"><i className="fa-solid fa-tv"></i><span>LCD Television</span></div>
                      <div className="panel-amenity"><i className="fa-solid fa-shower"></i><span>Private Bathroom</span></div>
                      <div className="panel-amenity"><i className="fas fa-chair"></i><span>Luxury Furniture</span></div>
                      <div className="panel-amenity"><i className="fa fa-coffee"></i><span>Tea/Coffee Service</span></div>
                    </div>
                  </div>
                  <div className="panel-footer">
                    <div className="panel-pricing">
                      <span className="panel-price">₹{prices["super-deluxe-non-ac"].price.toLocaleString("en-IN")}<small>/night</small></span>
                      {renderTaxAndSeasonalInfo("super-deluxe-non-ac")}
                    </div>
                    <Link href="/booking" className="book-btn">Book Now <i className="fas fa-arrow-right"></i></Link>
                  </div>
                </div>
              </div>
            )}

            {/* Suite AC */}
            {activeTab === "suite-ac" && (
              <div className="room-panel active" id="panel-suite-ac">
                <div className="panel-image-side">
                  <div 
                    className="panel-room-image suite-ac room-image"
                    onClick={() => openImageModal("/Photos/Rooms/suite.jpeg")}
                    style={{ cursor: "pointer", backgroundImage: "url(/Photos/Rooms/suite.jpeg)" }}
                  />
                  <div className="panel-badge">Ultimate Luxury</div>
                  <div className="panel-area-tag"><i className="fas fa-ruler-combined"></i> 420 sq.ft</div>
                </div>
                <div className="panel-info-side">
                  <div className="panel-header">
                    <h3 className="panel-title">Suite AC Room</h3>
                    <p className="panel-subtitle">Spacious Suite with Separate Living Area</p>
                  </div>
                  <p className="panel-description">Our most luxurious accommodation featuring a separate living area, bedroom, and premium amenities. Perfect for extended stays, VIP guests, and families seeking the ultimate comfort experience in Dwarka.</p>
                  <div className="panel-amenities">
                    <h4>Suite Amenities</h4>
                    <div className="panel-amenities-grid">
                      <div className="panel-amenity"><i className="fas fa-snowflake"></i><span>Multi-Zone AC</span></div>
                      <div className="panel-amenity"><i className="fa-solid fa-bed"></i><span>King Size Bed</span></div>
                      <div className="panel-amenity"><i className="fa-solid fa-couch"></i><span>Separate Living Room</span></div>
                      <div className="panel-amenity"><i className="fa-solid fa-tv"></i><span>Multiple LCD Television</span></div>
                      <div className="panel-amenity"><i className="fa-solid fa-shower"></i><span>Premium Bathroom</span></div>
                      <div className="panel-amenity"><i className="fa-solid fa-house"></i><span>Mini Refrigerator</span></div>
                      <div className="panel-amenity"><i className="fa fa-coffee"></i><span>Premium Tea/Coffee</span></div>
                      <div className="panel-amenity"><i className="fas fa-chair"></i><span>Joint Study Space</span></div>
                      <div className="panel-amenity"><i className="fa-solid fa-water"></i><span>Sea View</span></div>
                    </div>
                  </div>
                  <div className="panel-footer">
                    <div className="panel-pricing">
                      <span className="panel-price">₹{prices["suite-ac"].price.toLocaleString("en-IN")}<small>/night</small></span>
                      {renderTaxAndSeasonalInfo("suite-ac")}
                    </div>
                    <Link href="/booking" className="book-btn">Book Now <i className="fas fa-arrow-right"></i></Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="important-notice">
        <div className="container">
          <div className="notice-content">
            <h3>Important Information</h3>
            <p>All our rooms are furnished with comfortable <span className="highlight-text">double beds</span>. For groups of more than 2 persons, extra mattresses are available at <span className="highlight-text">₹300 per night</span>.</p>
            <p>Room rates are subject to applicable government taxes. Prices may vary during peak seasons and festivals. Please contact us for the latest rates.</p>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="contact-cta">
        <div className="container">
          <h3>Ready to Book Your Stay?</h3>
          <p>Contact us directly for reservations, special requests, or any queries about our rooms.</p>
          <div className="contact-info">
            <div className="contact-item">
              <i className="fas fa-phone"></i>
              <span>Call Us: <a href="tel:+919824402132">+91 98244 02132</a></span>
            </div>
            <div className="contact-item">
              <i className="fab fa-whatsapp"></i>
              <span>WhatsApp: <a href="https://wa.me/919824402132" target="_blank" rel="noopener noreferrer">+91 98244 02132</a></span>
            </div>
            <div className="contact-item">
              <i className="fas fa-envelope"></i>
              <span>Email: <a href="mailto:info@hoteldevang.com">info@hoteldevang.com</a></span>
            </div>
          </div>
        </div>
      </section>

      {/* Image Modal Component */}
      {modalImage && (
        <div 
          id="imageModal" 
          className="modal show" 
          style={{ display: "flex" }}
          onClick={(e) => {
            if (e.target.id === "imageModal") closeImageModal();
          }}
        >
          <span className="close" onClick={closeImageModal}>&times;</span>
          <img 
            className="modal-content" 
            id="modalImg" 
            src={modalImage} 
            alt="Room Zoom" 
          />
        </div>
      )}
    </div>
  );
}
